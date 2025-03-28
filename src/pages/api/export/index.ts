import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    const { metrics, format, dateRange } = req.body;

    // Получаем данные метрик
    const metricData = await prisma.metricData.findMany({
      where: {
        metricId: {
          in: metrics,
        },
        date: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      include: {
        metric: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Форматируем данные для экспорта
    const formattedData = metricData.map((data) => ({
      Дата: data.date.toLocaleDateString(),
      Метрика: data.metric.name,
      Значение: data.value,
    }));

    let fileContent: Buffer;
    let contentType: string;
    let fileName: string;

    switch (format) {
      case 'csv':
        const parser = new Parser();
        fileContent = Buffer.from(parser.parse(formattedData));
        contentType = 'text/csv';
        fileName = 'metrics.csv';
        break;

      case 'excel':
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Метрики');
        fileContent = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName = 'metrics.xlsx';
        break;

      case 'json':
        fileContent = Buffer.from(JSON.stringify(formattedData, null, 2));
        contentType = 'application/json';
        fileName = 'metrics.json';
        break;

      default:
        return res.status(400).json({ error: 'Неподдерживаемый формат' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    );
    res.send(fileContent);
  } catch (error) {
    console.error('Ошибка при экспорте:', error);
    res.status(500).json({ error: 'Ошибка при экспорте данных' });
  }
} 