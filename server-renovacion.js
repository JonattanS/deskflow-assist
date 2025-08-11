import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3011;

app.use(cors());
app.use(express.json());

app.post('/execute-renovacion', (req, res) => {
  const pythonScript = path.join(__dirname, 'Renovacion1.py');
  
  const pythonProcess = spawn('python', [pythonScript], {
    detached: false,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let output = '';
  let errorOutput = '';
  let finished = false;

  const timeout = setTimeout(() => {
    if (!finished) {
      pythonProcess.kill();
      res.status(500).send('Timeout: El proceso Python tardó demasiado');
      finished = true;
    }
  }, 30000);

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    
    if (code === 0) {
      res.status(200).send(`Renovacion1.py ejecutado exitosamente:\n${output}`);
    } else {
      res.status(500).send(`Error ejecutando Renovacion1.py:\n${errorOutput}`);
    }
  });

  pythonProcess.on('error', (error) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    res.status(500).send(`Error al iniciar el proceso Python: ${error.message}`);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Renovación ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor');
});

process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  process.exit(0);
});