import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import type { 
  DrawGridRequest, 
  DrawGridResponse, 
  PlayMoveRequest, 
  PlayMoveResponse
} from '@/types/Game';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const EXTERNAL_API_BASE_URL = 'http://127.0.0.1'; 


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