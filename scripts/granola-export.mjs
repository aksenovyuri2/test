#!/usr/bin/env node
// Экспорт всех заметок из Granola через официальный Public API.
//
// Использование:
//   GRANOLA_API_TOKEN=grn_xxx node scripts/granola-export.mjs [опции]
//
// Опции:
//   --out <dir>        Каталог для выгрузки (по умолчанию ./granola-export)
//   --limit <n>        Размер страницы при листинге (по умолчанию 100)
//   --no-transcripts   Не тянуть транскрипты (быстрее, меньше запросов)
//   --no-markdown      Не генерировать .md-файлы (только notes.json)
//   --token <grn_...>  Токен явным аргументом (лучше использовать env-переменную)
//
// Документация API: https://docs.granola.ai/  (base: https://public-api.granola.ai/v1)

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = "https://public-api.granola.ai/v1";

function parseArgs(argv) {
  const opts = {
    out: "granola-export",
    limit: 100,
    transcripts: true,
    markdown: true,
    token: process.env.GRANOLA_API_TOKEN || "",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") opts.out = argv[++i];
    else if (a === "--limit") opts.limit = Number(argv[++i]) || 100;
    else if (a === "--no-transcripts") opts.transcripts = false;
    else if (a === "--no-markdown") opts.markdown = false;
    else if (a === "--token") opts.token = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: GRANOLA_API_TOKEN=grn_xxx node scripts/granola-export.mjs [--out dir] [--limit n] [--no-transcripts] [--no-markdown]",
      );
      process.exit(0);
    } else {
      console.error(`Неизвестная опция: ${a}`);
      process.exit(2);
    }
  }
  return opts;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// GET с обработкой 429 (Retry-After) и сетевых сбоев (до 5 попыток с бэкоффом).
async function apiGet(path, token) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  let lastErr;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after")) || 2 ** attempt;
        console.warn(`  429 rate limited, жду ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }
      if (res.status === 401) {
        throw new Error("401 Unauthorized — токен неверный или просрочен.");
      }
      if (res.status === 403) {
        throw new Error(
          "403 Forbidden — у токена нет нужного scope, либо хост заблокирован сетью.",
        );
      }
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} для ${url}: ${body.slice(0, 300)}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      // Не ретраим явные ошибки авторизации/доступа.
      if (/^(401|403)/.test(err.message)) throw err;
      const wait = 2 ** attempt;
      console.warn(`  Запрос упал (${err.message}), повтор через ${wait}s...`);
      await sleep(wait * 1000);
    }
  }
  throw lastErr;
}

// Достаём массив заметок и курсор из ответа, не завязываясь жёстко на имена полей.
function extractList(payload) {
  const notes =
    payload.notes || payload.data || payload.documents || payload.items || [];
  const hasMore =
    payload.hasMore ?? payload.has_more ?? payload.hasNextPage ?? false;
  const cursor =
    payload.cursor ?? payload.next_cursor ?? payload.nextCursor ?? null;
  return { notes, hasMore, cursor };
}

function pick(obj, keys) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return undefined;
}

function slugify(s) {
  return String(s || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "untitled";
}

function transcriptToText(transcript) {
  if (!transcript) return "";
  if (typeof transcript === "string") return transcript;
  if (Array.isArray(transcript)) {
    return transcript
      .map((u) => {
        const who = pick(u, ["speaker", "source", "role"]) || "";
        const text = pick(u, ["text", "transcript", "content", "value"]) || "";
        return who ? `**${who}:** ${text}` : text;
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return JSON.stringify(transcript, null, 2);
}

function noteToMarkdown(note) {
  const id = pick(note, ["id", "note_id", "document_id"]);
  const title = pick(note, ["title", "name"]) || "Без названия";
  const created = pick(note, ["created_at", "createdAt", "created"]) || "";
  const updated = pick(note, ["updated_at", "updatedAt"]) || "";
  const content =
    pick(note, [
      "content_markdown",
      "markdown",
      "content",
      "notes_markdown",
      "summary",
      "ai_summary",
      "body",
    ]) || "";
  const transcript = transcriptToText(pick(note, ["transcript", "transcript_text"]));

  const lines = [
    `# ${title}`,
    "",
    `- **id:** ${id || ""}`,
    created ? `- **created:** ${created}` : "",
    updated ? `- **updated:** ${updated}` : "",
    "",
    "## Заметка",
    "",
    typeof content === "string" ? content : JSON.stringify(content, null, 2),
  ];
  if (transcript) {
    lines.push("", "## Транскрипт", "", transcript);
  }
  return lines.filter((l) => l !== "").join("\n") + "\n";
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!opts.token) {
    console.error(
      "Не задан токен. Укажите переменную окружения GRANOLA_API_TOKEN или флаг --token.",
    );
    process.exit(1);
  }

  await mkdir(opts.out, { recursive: true });

  // 1) Листинг всех заметок (курсорная пагинация).
  console.log("Листинг заметок...");
  const summaries = [];
  let cursor = null;
  let page = 0;
  do {
    page++;
    const qs = new URLSearchParams({ limit: String(opts.limit) });
    if (cursor) qs.set("cursor", cursor);
    const payload = await apiGet(`/notes?${qs}`, opts.token);
    const { notes, hasMore, cursor: next } = extractList(payload);

    if (page === 1 && notes.length === 0) {
      console.log(
        "Ответ получен, но заметок нет. Сырые ключи ответа:",
        Object.keys(payload),
      );
    }
    summaries.push(...notes);
    console.log(`  Страница ${page}: +${notes.length} (всего ${summaries.length})`);
    cursor = hasMore ? next : null;
  } while (cursor);

  console.log(`Найдено заметок: ${summaries.length}`);

  // 2) Полные данные + транскрипт по каждой заметке.
  const full = [];
  for (let i = 0; i < summaries.length; i++) {
    const s = summaries[i];
    const id = pick(s, ["id", "note_id", "document_id"]);
    if (!id) {
      full.push(s);
      continue;
    }
    if (opts.transcripts) {
      const q = "?include=transcript";
      try {
        const detail = await apiGet(`/notes/${id}${q}`, opts.token);
        full.push(detail.note || detail.data || detail);
      } catch (err) {
        console.warn(`  Заметка ${id}: деталь не получена (${err.message}), беру из листинга`);
        full.push(s);
      }
      await sleep(150); // мягкий троттлинг
    } else {
      full.push(s);
    }
    if ((i + 1) % 10 === 0) console.log(`  Обработано ${i + 1}/${summaries.length}`);
  }

  // 3) Сохраняем JSON-дамп.
  const jsonPath = join(opts.out, "notes.json");
  await writeFile(jsonPath, JSON.stringify(full, null, 2), "utf8");
  console.log(`Сохранено: ${jsonPath}`);

  // 4) Markdown по каждой заметке.
  if (opts.markdown) {
    let n = 0;
    for (const note of full) {
      const id = pick(note, ["id", "note_id", "document_id"]) || `note-${++n}`;
      const title = pick(note, ["title", "name"]);
      const fname = `${id}-${slugify(title)}.md`;
      await writeFile(join(opts.out, fname), noteToMarkdown(note), "utf8");
    }
    console.log(`Markdown-файлы (${full.length}) записаны в ${opts.out}/`);
  }

  console.log("Готово.");
}

main().catch((err) => {
  console.error("Ошибка:", err.message);
  process.exit(1);
});
