import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { exec } from 'child_process';

import type { 
  DrawGridRequest, 
  DrawGridResponse, 
  PlayMoveRequest, 
  PlayMoveResponse
} from '@/types/Game';


const app = express();
const PORT = 3000;
dotenv.config();

const EXTERNAL_API_BASE_URL = 'http://127.0.0.1';

app.use(cors());
app.use(bodyParser.json());


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
      throw new Error(`HTTP error! status: ${response.status}`);
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


app.get('/start', (req, res) => {
  exec('bash /home/fari/Documents/demo-fari-tic-tac-toe-backend/start.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.send(`Error executing script: ${error}`);
    }
    res.send(`Script executed successfully: ${stdout}`);
  });
});

app.get('/stop', (req, res) => {
  exec('bash /home/fari/Documents/demo-fari-tic-tac-toe-backend/stop.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.send(`Error executing script: ${error}`);
    }
    res.send(`Script executed successfully: ${stdout}`);
  });
});


app.listen(PORT, () => 
  console.info(`Server is running on http://localhost:${PORT}`)
);