const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Create a folder for Java files if it doesn't exist
const javaFolder = path.join(__dirname, 'java_files');
if (!fs.existsSync(javaFolder)) {
  fs.mkdirSync(javaFolder);
}

// Limit the number of concurrent executions
const MAX_CONCURRENT_EXECUTIONS = 5;
let currentExecutions = 0;

app.post('/execute', (req, res) => {
  if (currentExecutions >= MAX_CONCURRENT_EXECUTIONS) {
    return res.status(429).json({ error: 'Too many concurrent executions. Please try again later.' });
  }

  const { code } = req.body;

  // Limit code size
  if (code.length > 10000) {
    return res.status(400).json({ error: 'Code size exceeds the maximum limit.' });
  }

  
  console.log('Received code:', code);

  const javaFilePath = path.join(javaFolder, 'Main.java');
  const runShPath = path.join(javaFolder, 'run.sh');

  fs.copyFile(path.join(__dirname, 'run.sh'), runShPath, (err) => {
    if (err) {
      console.error('Error copying run.sh:', err);
      return res.status(500).json({ error: 'Error copying run.sh file' });
    }
  
  fs.writeFile(javaFilePath, code, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({ error: 'Error writing Java file' });
    }

    currentExecutions++;

    const dockerCommand = `docker run --rm -v "${javaFolder}:/app" --memory=512m --cpus=0.5 java-runner`;
    const timeout = setTimeout(() => {
      exec(`docker stop $(docker ps -q --filter ancestor=java-runner)`);
      currentExecutions--;
      res.status(408).json({ error: 'Execution timed out' });
    }, 10000); // 10 seconds timeout

    exec(dockerCommand, (error, stdout, stderr) => {
      clearTimeout(timeout);
      currentExecutions--;

      if (error) {
        console.error('Error executing Java code:', error);
        return res.status(500).json({ error: error.message, stderr });
      }
      if (stderr) {
        console.error('Java execution stderr:', stderr);
      }
      console.log('Java execution stdout:', stdout);
      res.json({ output: stdout });
    });
  });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));