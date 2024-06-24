import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


import type { 
  DrawGridRequest, 
  DrawGridResponse, 
  PlayMoveRequest, 
  PlayMoveResponse
} from '@/types/Game';


const app = express();
const PORT = 3000;
dotenv.config();

const strapiURL = process.env.API_URL
const EXTERNAL_API_BASE_URL = 'http://127.0.0.1';

interface Attributes {
  locale: string;
  logo: string
  research_head: string
  research_lead: string
  explanation_short: {
    en: string
    nl: string
    'fr-FR': string
  }
}

app.use(cors());
app.use(bodyParser.json());


app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${strapiURL}/api/demos/52?populate=*`);
    const {data} = await response.json();
    const { localizations, explanation_short, research_head, research_lead } = data.attributes
    const locales = localizations.data.map(({ attributes }: { attributes: Attributes }) => ({ locale: attributes.locale, explanation_short: attributes.explanation_short }))

    const airLogo = await fetch(`${strapiURL}/uploads/air_a5e1c08136.svg`);
    const logo = await airLogo.text()

    const content = [
      { logo },
      { research_head, research_lead },
      { locale: 'en', explanation_short }, 
      ...locales
    ]
    res.send(content);

  } catch (error) {
    console.error({error})
    res.status(500).send('Error fetching data from Strapi');
  }
});


app.post('/draw_grid', async (req: Request, res: Response) => {
  try {
    const { center, size } = req.body as DrawGridRequest;

    const response = await fetch(`${EXTERNAL_API_BASE_URL}:5000/draw_grid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ center, size })
    });

    if (!response.ok) {
      throw new Error(`HTTP error!? status: ${response.status}`);
    }
    
    const data: DrawGridResponse = await response.json();

    res.json(data);
  } catch (error: any) {
    console.error({ error })
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/play', async (req: Request, res: Response) => {
  try {
    const { image } = req.body as PlayMoveRequest;
    const response = await fetch(`${EXTERNAL_API_BASE_URL}:5000/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${ response.status }`);

    const data: PlayMoveResponse = await response.json();
    res.send(data);

  } catch (error: any) {
    console.error({ error })
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => 
  console.info(`Server is running on http://localhost:${PORT}`)
);