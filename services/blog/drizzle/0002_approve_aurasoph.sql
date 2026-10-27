-- Complete the owner's failed author approval. Account ID verified with GitHub.
-- A migration runs once; later revocation from the Authors tab remains effective.
INSERT INTO authors (github_id,login,name,avatar,role,added_at)
VALUES (179036840,'aurasoph','Yiran Wang','https://avatars.githubusercontent.com/u/179036840?v=4','author',CAST(strftime('%s','now') AS INTEGER)*1000)
ON CONFLICT(github_id) DO NOTHING;
