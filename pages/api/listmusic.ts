import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  musicList: Array<{ID: string, Artista: string, Titulo: string}>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const sheets = google.sheets({ version: 'v4', auth: 'AIzaSyDIWr0vlKpUXJbAHnYEid5NOOiWsiZilRE' });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1KPMD8qpPM3ZYwspBI-1YQP2jqyFM_wp2EgDz6IyxwBM',
    range: 'Página1', // Nome da sua aba
  });

  const rows = response.data.values;
  if (rows.length) {
    const musicList = rows.map((row) => ({
      ID: row[0],
      Artista: row[2],
      Titulo: row[1],
    }));

    res.status(200).json({ musicList });
  } else {
    res.status(200).json({ musicList: [] });
  }
}
