import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SqliteDB } from './sqlite-adapter.mjs';
import { webcrypto } from 'node:crypto';
import worker, { hash, encrypt, decrypt } from '../worker/index.js';
globalThis.crypto ??= webcrypto;
const site = 'https://ai.math.uw.edu', service = 'https://blog.test';
const temp = mkdtempSync(join(tmpdir(), 'math-ai-blog-test-'));
const DB = new SqliteDB(join(temp, 'test.sqlite'));
for (const migration of JSON.parse(readFileSync('drizzle/meta/_journal.json','utf8')).entries) DB.execute({ script: readFileSync('drizzle/'+migration.tag+'.sql','utf8') });
const env = { DB, BLOG_SITE_URL: site, SERVICE_URL: service, ROOT_GITHUB_ID: '134547794', RUNTIME_SECRET: Buffer.alloc(32, 9).toString('base64url'), GITHUB_CLIENT_ID: 'client', GITHUB_CLIENT_SECRET: 'secret', BUCKET: { async put() {} }, FETCH: async url => new Response(JSON.stringify(url.includes('/access_token') ? { access_token: 'test-github' } : { id: 134547794, login: 'zengrf', name: 'Michael', type: 'User' }), { headers: { 'Content-Type': 'application/json' } }) };
const admin = 'a'.repeat(43), author = 'b'.repeat(43), other = 'c'.repeat(43), reader = 'd'.repeat(43);
async function call(path, method='GET', data, token, headers={}) {
  const r = await worker.fetch(new Request(service + path, { method, headers: { Origin: site, ...(data ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers }, ...(data ? { body: JSON.stringify(data) } : {}) }), env, {});
  return { status: r.status, headers: r.headers, data: r.headers.get('content-type')?.includes('json') ? await r.json() : await r.text() };
}
test('blog access, publishing, and GitHub sign-in', async t => {
  for (const [token,id,login] of [[admin,134547794,'zengrf'],[author,2,'author'],[other,3,'other'],[reader,4,'reader']]) {
    DB.execute({ sql:'INSERT INTO sessions VALUES(?,?,?,?,?,?)', args:[await hash(token),id,login,login,'',Date.now()+86400000] });
  }
  for (const [id,login] of [[2,'author'],[3,'other']]) DB.execute({sql:'INSERT INTO authors VALUES(?,?,?,?,?,?)',args:[id,login,login,'','author',Date.now()]});
  await t.test('anonymous and unapproved users cannot write; authors cannot approve', async () => {
    assert.equal((await call('/editor/posts','POST',{},undefined)).status,401);
    assert.equal((await call('/editor/posts','POST',{},reader)).status,403);
    assert.equal((await call('/admin/authors','GET',undefined,author)).status,403);
    assert.equal((await call('/editor/posts','POST',{},admin,{Origin:'https://evil.test'})).status,403);
  });
  let post = (await call('/editor/posts','POST',{},author)).data.post;
  await t.test('drafts are private, and another author cannot read or change them',async()=>{
    assert.equal((await call('/editor/posts/'+post.id,'GET',undefined,other)).status,403);
    assert.equal((await call('/posts')).data.posts.length,0);
    assert.equal((await call('/posts/'+post.slug)).status,404);
  });
  await t.test('optimistic locking rejects stale saves',async()=>{
    const stale = {...post,title:'First post',summary:'Summary',body:'Hello',tags:[]};
    post=(await call('/editor/posts/'+post.id,'PUT',stale,author)).data.post;
    assert.equal(post.version,2);
    assert.equal((await call('/editor/posts/'+post.id,'PUT',stale,author)).status,409);
  });
  await t.test('published revisions are explicit; autosaving never changes the public post',async()=>{
    post=(await call('/editor/posts/'+post.id+'/publish','POST',{version:post.version},author)).data.post;
    assert.equal((await call('/posts/'+post.slug)).data.post.body,'Hello');
    post=(await call('/editor/posts/'+post.id,'PUT',{...post,body:'Private revision'},author)).data.post;
    assert.equal((await call('/posts/'+post.slug)).data.post.body,'Hello');
    post=(await call('/editor/posts/'+post.id+'/publish','POST',{version:post.version},author)).data.post;
    assert.equal((await call('/posts/'+post.slug)).data.post.body,'Private revision');
  });
  await t.test('search operates on published snapshots and never finds draft text', async()=>{
    assert.equal((await call('/posts?q=First')).data.posts.length,1);
    assert.equal((await call('/posts?q=missing')).data.posts.length,0);
    assert.equal((await call('/posts?tag=missing')).data.posts.length,0);
    const saved=await call('/editor/posts/'+post.id,'PUT',{...post,title:'Unpublished title'},author);post=saved.data.post;
    assert.equal((await call('/posts?q=Unpublished')).data.posts.length,0);
  });
  await t.test('revocation takes effect on an existing session, and admin can unpublish',async()=>{
    assert.equal((await call('/admin/authors/2','DELETE',{},admin)).status,200);
    assert.equal((await call('/editor/posts/'+post.id,'PUT',post,author)).status,403);
    post=(await call('/editor/posts/'+post.id+'/unpublish','POST',{version:post.version},admin)).data.post;
    assert.equal((await call('/posts/'+post.slug)).status,404);
    assert.equal((await call('/admin/authors/134547794','DELETE',{},admin)).status,400);
  });
  await t.test('OAuth checks its state cookie, PKCE, one-time exchange, and logout',async()=>{
    const verifier='v'.repeat(43), state='s'.repeat(43);
    const start=await call('/auth/github/start?challenge='+await hash(verifier)+'&state='+state);
    assert.equal(start.status,303);
    const auth=new URL(start.headers.get('location'));
    assert.equal(auth.searchParams.get('code_challenge_method'),'S256');
    const callback='/auth/github/callback?code=code&state='+auth.searchParams.get('state');
    assert.equal((await call(callback)).status,403);
    const completed=await call(callback,'GET',undefined,undefined,{Cookie:start.headers.get('set-cookie').split(';')[0]});
    const code=new URLSearchParams(new URL(completed.headers.get('location')).hash.slice(1)).get('code');
    assert.equal((await call('/auth/exchange','POST',{code,verifier:'wrong'})).status,400);
    const exchanged=await call('/auth/exchange','POST',{code,verifier});
    assert.equal(exchanged.status,200);
    assert.equal((await call('/auth/exchange','POST',{code,verifier})).status,401);
    assert.equal((await call('/auth/session','GET',undefined,exchanged.data.token)).data.user.role,'admin');
    const access=DB.execute({sql:'SELECT token FROM github_access WHERE github_id=?',args:[134547794]})[0];
    assert.ok(access && !access.token.includes('test-github'));
    assert.equal((await decrypt(env,access.token)).access_token,'test-github');
    assert.ok(!JSON.stringify((await call('/admin/export','GET',undefined,exchanged.data.token)).data).includes('test-github'));
    await call('/auth/logout','POST',{},exchanged.data.token);
    assert.equal((await call('/auth/session','GET',undefined,exchanged.data.token)).data.user,null);
    assert.equal(DB.execute({sql:'SELECT * FROM github_access WHERE github_id=?',args:[134547794]}).length,0);
  });
  await t.test('credentials are encrypted and setup rejects a missing secret',async()=>{
    const value=await encrypt(env,{client_secret:'sensitive'});
    assert.ok(!value.includes('sensitive'));
    assert.deepEqual(await decrypt(env,value),{client_secret:'sensitive'});
    const r=await worker.fetch(new Request(service+'/setup'),{...env,GITHUB_CLIENT_ID:null,GITHUB_CLIENT_SECRET:null},{});
    assert.equal(r.status,403);
  });
  await t.test('legacy administrator sessions request sign-in refresh before changing access',async()=>{
    const result=await call('/admin/authors','POST',{login:'reader',role:'author'},admin);
    assert.equal(result.status,428);assert.match(result.data.error,/Refresh your GitHub sign-in/);
    assert.equal(DB.execute({sql:'SELECT * FROM authors WHERE login=?',args:['reader']}).length,0);
  });
  await t.test('the requested aurasoph approval grants author access only',async()=>{
    const session='e'.repeat(43);
    DB.execute({sql:'INSERT INTO sessions VALUES(?,?,?,?,?,?)',args:[await hash(session),179036840,'aurasoph','Yiran Wang','',Date.now()+86400000]});
    assert.equal((await call('/auth/session','GET',undefined,session)).data.user.role,'author');
    assert.equal((await call('/admin/authors','GET',undefined,session)).status,403);
    assert.equal((await call('/editor/posts','POST',{},session)).status,201);
  });
  await t.test('HTML and SVG cannot be uploaded as images',async()=>{
    const r=await worker.fetch(new Request(service+'/editor/media',{method:'POST',headers:{Origin:site,Authorization:'Bearer '+admin,'Content-Type':'image/png'},body:'<svg onload="alert(1)"></svg>'}),env,{});
    assert.equal(r.status,400);
  });
  await t.test('author approval resolves stable GitHub IDs and allows a current reader to post',async()=>{
    const original=env.FETCH;
    await DB.prepare('INSERT INTO github_access VALUES(?,?,?)').bind(134547794,await encrypt(env,{access_token:'admin-lookup-token'}),Date.now()+3600000).run();
    env.FETCH=async(url,options)=>{ assert.equal(url,'https://api.github.com/users/reader'); assert.equal(options.headers.Authorization,'Bearer admin-lookup-token'); return new Response(JSON.stringify({id:4,login:'reader',name:'Reader',type:'User'}),{headers:{'Content-Type':'application/json'}}); };
    assert.equal((await call('/admin/authors','POST',{login:'reader',role:'author'},admin)).status,200);
    assert.equal((await call('/auth/session','GET',undefined,reader)).data.user.role,'author');
    assert.equal((await call('/editor/posts','POST',{},reader)).status,201);
    env.FETCH=original;
  });
  await t.test('failed GitHub lookups explain the error and cannot grant author access', async()=>{
    const original=env.FETCH;
    try {
      for (const [status,headers,expected,message] of [[404,{},400,/not found/],[403,{'x-ratelimit-remaining':'0'},503,/rate-limited/],[429,{},503,/rate-limited/],[503,{},502,/GitHub could not/]]) {
        env.FETCH=async()=>new Response('{}',{status,headers:{'Content-Type':'application/json',...headers}});
        const result=await call('/admin/authors','POST',{login:'unapproved',role:'author'},admin);
        assert.equal(result.status,expected);assert.match(result.data.error,message);
        assert.equal(DB.execute({sql:'SELECT * FROM authors WHERE login=?',args:['unapproved']}).length,0);
      }
      env.FETCH=async()=>new Response(JSON.stringify({id:5,login:'someone-else',type:'User'}),{headers:{'Content-Type':'application/json'}});
      assert.equal((await call('/admin/authors','POST',{login:'unapproved',role:'author'},admin)).status,502);
    } finally { env.FETCH=original; }
  });
  await t.test('expired sessions cannot write, and cancelled OAuth clears the flow',async()=>{
    DB.execute({sql:'UPDATE sessions SET expires_at=? WHERE token_hash=?',args:[1,await hash(other)]});
    assert.equal((await call('/editor/posts','POST',{},other)).status,401);
    const start=await call('/auth/github/start?challenge='+await hash('v'.repeat(43))+'&state='+'s'.repeat(43));
    const state=new URL(start.headers.get('location')).searchParams.get('state');
    const r=await call('/auth/github/callback?error=access_denied&state='+state,'GET',undefined,undefined,{Cookie:start.headers.get('set-cookie').split(';')[0]});
    assert.equal(r.status,303);assert.ok(r.headers.get('location').endsWith('?signin=cancelled'));
  });
  await t.test('invalid GitHub credentials request refresh rather than dropping the blog session',async()=>{
    const original=env.FETCH;
    try {
      env.FETCH=async()=>new Response('{}',{status:401,headers:{'Content-Type':'application/json'}});
      assert.equal((await call('/admin/authors','POST',{login:'reader',role:'author'},admin)).status,428);
      assert.equal((await call('/auth/session','GET',undefined,admin)).data.user.role,'admin');
      assert.equal(DB.execute({sql:'SELECT * FROM github_access WHERE github_id=?',args:[134547794]}).length,0);
    } finally { env.FETCH=original; }
  });
  await t.test('setup converts a GitHub manifest, stores encrypted credentials, then closes itself',async()=>{
    const setupEnv={...env,GITHUB_CLIENT_ID:null,GITHUB_CLIENT_SECRET:null,SETUP_TOKEN:'test-setup-token',FETCH:async()=>new Response(JSON.stringify({owner:{id:134547794},client_id:'created-app',client_secret:'created-secret'}),{headers:{'Content-Type':'application/json'}})};
    const start=await worker.fetch(new Request(service+'/setup?token=test-setup-token'),setupEnv,{});
    assert.equal(start.status,200);const cookie=start.headers.get('set-cookie').split(';')[0],state=cookie.split('=')[1];
    assert.equal((await worker.fetch(new Request(service+'/setup/complete?state='+state+'&code=code'),setupEnv,{})).status,403);
    const result=await worker.fetch(new Request(service+'/setup/complete?state='+state+'&code=code',{headers:{Cookie:cookie}}),setupEnv,{});
    assert.equal(result.status,200);
    const row=DB.execute({sql:"SELECT value FROM settings WHERE key='github_app'",args:[]})[0];
    assert.ok(!row.value.includes('created-secret'));
    assert.equal((await decrypt(env,row.value)).client_id,'created-app');
    const closed=await worker.fetch(new Request(service+'/setup'),setupEnv,{});assert.match(await closed.text(),/already|is connected/);
    assert.equal((await worker.fetch(new Request(service+'/setup/complete?state='+state+'&code=code',{headers:{Cookie:cookie}}),setupEnv,{})).status,409);
  });
});
test.after(()=>rmSync(temp,{recursive:true,force:true}));
