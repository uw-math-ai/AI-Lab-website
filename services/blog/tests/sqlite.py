import sys, json, sqlite3
db = sqlite3.connect(sys.argv[1]); db.row_factory = sqlite3.Row
request = json.load(sys.stdin)
if 'script' in request:
    db.executescript(request['script']); result = None
elif 'batch' in request:
    result = []
    with db:
        for statement in request['batch']:
            cursor = db.execute(statement['sql'], statement.get('args', []))
            result.append({'results': [dict(row) for row in cursor.fetchall()] if cursor.description else []})
else:
    cursor = db.execute(request['sql'], request.get('args', []))
    result = [dict(row) for row in cursor.fetchall()] if cursor.description else []
db.commit(); print(json.dumps(result))
