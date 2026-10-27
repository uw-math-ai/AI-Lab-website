// Local-only preview: seeded accounts and posts never enter the production database.
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { webcrypto } from 'node:crypto';
import { SqliteDB } from './sqlite-adapter.mjs';
import worker, { hash } from '../worker/index.js';
globalThis.crypto ??= webcrypto;
const DB = new SqliteDB(join(mkdtempSync(join(tmpdir(),'blog-preview-')),'preview.sqlite'));
DB.execute({script:readFileSync(new URL('../drizzle/0000_blog.sql',import.meta.url),'utf8')});
const port=Number(process.env.PORT || 4318), site='http://127.0.0.1:4317', service=`http://127.0.0.1:${port}`, images=new Map();
const env={DB,BLOG_SITE_URL:site,SERVICE_URL:service,ROOT_GITHUB_ID:'134547794',LOCAL_PREVIEW:'true',RUNTIME_SECRET:Buffer.alloc(32,9).toString('base64url'),GITHUB_CLIENT_ID:'local-preview',GITHUB_CLIENT_SECRET:'local-preview',BUCKET:{async put(key,bytes,options){images.set(key,{bytes,options});},async get(key){const entry=images.get(key);return entry&&{body:entry.bytes,httpEtag:'"local"',writeHttpMetadata(headers){headers.set('Content-Type',entry.options.httpMetadata.contentType);}};}},FETCH:async url=>new Response(JSON.stringify({id:2,login:url.split('/').pop(),name:'Preview Author',type:'User'}),{headers:{'Content-Type':'application/json'}})};
for(const [letter,id,login,name] of [['a',134547794,'zengrf','Michael R. Zeng'],['b',2,'author','Preview Author'],['d',4,'reader','Preview Reader']]) DB.execute({sql:'INSERT INTO sessions VALUES(?,?,?,?,?,?)',args:[await hash(letter.repeat(43)),id,login,name,'',Date.now()+86400000]});
DB.execute({sql:'INSERT INTO authors VALUES(?,?,?,?,?,?)',args:[2,'author','Preview Author','','author',Date.now()]});
createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const response=await worker.fetch(new Request(service+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}),env,{waitUntil:p=>p.catch(console.error)});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Preview server error');}}).listen(port,'127.0.0.1',()=>console.log(`Local test API: ${service}`));
