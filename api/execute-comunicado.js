import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const pythonScript = path.join(process.cwd(), 'Comunicado.py');
  
  const pythonProcess = spawn('python', [pythonScript]);
  
  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).send(`Comunicado.py ejecutado exitosamente:\n${output}`);
    } else {
      res.status(500).send(`Error ejecutando Comunicado.py:\n${errorOutput}`);
    }
  });

  pythonProcess.on('error', (error) => {
    res.status(500).send(`Error al iniciar el proceso Python: ${error.message}`);
  });
}