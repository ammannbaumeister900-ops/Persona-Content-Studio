/* 极简 .env 读取：不覆盖已存在的环境变量 */
import { readFileSync } from 'node:fs';
import { fromRoot } from './paths.js';

export function loadEnv(file = fromRoot('.env')) {
  let raw;
  try { raw = readFileSync(file, 'utf8'); } catch { raw = ''; }
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let value = t.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }

  // 本地 DeepSeek 密钥文件：环境变量和 .env 的配置优先。
  if (!process.env.OPENAI_API_KEY && !process.env.LLM_API_KEY) {
    let key;
    try { key = readFileSync(fromRoot('dsapikey.md'), 'utf8').trim(); } catch { return; }
    if (/^sk-[A-Za-z0-9_-]+$/.test(key)) process.env.OPENAI_API_KEY = key;
  }
}
