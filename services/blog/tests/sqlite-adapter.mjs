import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export class SqliteDB {
  constructor(file) { this.file = file; }
  execute(data) { return JSON.parse(execFileSync(process.env.PYTHON || 'python3', [fileURLToPath(new URL('./sqlite.py', import.meta.url)), this.file], { input: JSON.stringify(data), encoding: 'utf8' })); }
  prepare(sql) { const db = this; return { bind(...args) { return { async first() { return db.execute({ sql, args })[0] || null; }, async all() { return { results: db.execute({ sql, args }) }; }, async run() { return db.execute({ sql, args }); } }; } }; }
}
