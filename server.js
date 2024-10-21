const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Piston API endpoints
const PISTON_EXECUTE_URL = 'https://emkc.org/api/v2/piston/execute';
const PISTON_RUNTIMES_URL = 'https://emkc.org/api/v2/piston/runtimes';

// Endpoint to get available runtimes from Piston
app.get('/runtimes', async (req, res) => {
  try {
    const response = await axios.get(PISTON_RUNTIMES_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to execute code
app.post('/execute', async (req, res) => {
  const { language, version, code, stdin } = req.body;

  try {
    const response = await axios.post(PISTON_EXECUTE_URL, {
      language,
      version,
      files: [
        {
          content: code
        }
      ],
      stdin: stdin || '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_cpu_time: 10000,
      run_cpu_time: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    });

    const output = response.data.run.stdout || response.data.run.stderr || 'No output received';
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
