import fs from 'fs';
import { chromium, FullConfig } from '@playwright/test';
import { login } from './helpers/auth';

const STORAGE_STATE_PATH = 'tests/e2e/storageState/admin.json';

async function globalSetup(config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  fs.mkdirSync('tests/e2e/storageState', { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  await login(page, 'admin');
  await context.storageState({ path: STORAGE_STATE_PATH });

  await browser.close();
}

export default globalSetup;
