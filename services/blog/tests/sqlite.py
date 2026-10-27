import sys, json, sqlite3
db = sqlite3.connect(sys.argv[1]); db.row_factory = sqlite3.Row
request = json.load(sys.stdin)
if 'script' in request:
    db.executescript(request['script']); result = None
else:
    cursor = db.execute(request['sql'], request.get('args', []))
    result = [dict(row) for row in cursor.fetchall()] if cursor.description else []
db.commit(); print(json.dumps(result))
