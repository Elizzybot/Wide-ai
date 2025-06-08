import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone } = req.body;

  const bot = spawn('node', ['index.js'], { cwd: process.cwd() });

  let output = '';
  bot.stdout.on('data', (data) => {
    output += data.toString();
    if (output.includes('pairing code') || output.match(/\d{8}/)) {
      bot.kill();
      res.status(200).send(`<pre>${output}</pre>`);
    }
  });

  bot.stderr.on('data', (data) => console.error('ERR:', data.toString()));
  bot.on('exit', (code) => console.log(`Bot exited with code ${code}`));
}