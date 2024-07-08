import sqlite3 from 'sqlite3'
import { open } from 'sqlite';
import { dbLog as log } from '../util/winston.js';

export async function openDb() {
  return open({
    filename: '/tmp/chezmoi.db',
    driver: sqlite3.cached.Database
  });
}

const db = await openDb();

db.on('trace', (data) => {
  log.info(data);
})

export async function seedDb() {
  await db.exec('CREATE TABLE apps (col JSON)');
}

export async function checkTableExists() {
  await db.exec('SHOW TABLES LIKE "apps"');
}

export async function insertRow(json) {
  await db.exec(`INSERT INTO apps (JSON) VALUES (${json})`);
}

export async function getAllRows() {
  return await db.all('SELECT * FROM apps');
}

