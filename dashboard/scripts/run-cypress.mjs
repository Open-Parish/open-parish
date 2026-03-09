import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

const SERVER_PORT = 5173;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const VITE_CMD = ['npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', `${SERVER_PORT}`, '--strictPort']];
const CYPRESS_BIN = './node_modules/.bin/cypress';
const TEST_ENV_FILE = path.resolve(process.cwd(), '.env.test');

const parseEnvFile = (content) =>
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .reduce((acc, line) => {
      const idx = line.indexOf('=');
      if (idx <= 0) return acc;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});

const loadTestEnv = () => {
  const env = {};

  if (fs.existsSync(TEST_ENV_FILE)) {
    Object.assign(env, parseEnvFile(fs.readFileSync(TEST_ENV_FILE, 'utf8')));
  }

  return env;
};

const waitForServer = (url, timeoutMs = 30000) =>
  new Promise((resolve, reject) => {
    const started = Date.now();
    const ping = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(ping, 500);
      });
    };
    ping();
  });

const run = async () => {
  const testEnv = loadTestEnv();
  const server = spawn(...VITE_CMD, { stdio: 'inherit' });

  const cleanup = (code = 0) => {
    if (!server.killed) {
      server.kill('SIGTERM');
    }
    process.exit(code);
  };

  process.on('SIGINT', () => cleanup(130));
  process.on('SIGTERM', () => cleanup(143));

  try {
    await waitForServer(SERVER_URL);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    cleanup(1);
    return;
  }

  const cypress = spawn(CYPRESS_BIN, ['run'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...testEnv,
      CYPRESS_VIDEO: 'true',
    },
  });

  cypress.on('exit', (code) => {
    cleanup(code ?? 1);
  });
};

run();
