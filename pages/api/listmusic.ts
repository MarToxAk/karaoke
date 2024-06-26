import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();


type ResponseData = {
  musicList: Array<{ ID: string, codigo: string, Artista: string, Titulo: string }>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_KEY });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE, // Nome da sua aba
  });

  const rows: any = response.data.values;
  if (rows.length) {
    const musicList = rows.slice(1)
      .filter((row: any) => row.length > 0 && row.every((cell: any) => cell.trim() !== ''))
      .map((row: any) => ({
        ID: uuidv4(), // Gera um ID único
        codigo: row[0], // Adiciona o valor original de row[0] para o campo "codigo"
        Artista: row[1],
        Titulo: row[2],
      }));


    res.status(200).json({ musicList });
  } else {
    res.status(200).json({ musicList: [] });
  }
}
