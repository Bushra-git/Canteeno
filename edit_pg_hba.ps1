$content = [System.IO.File]::ReadAllText('C:\Program Files\PostgreSQL\17\data\pg_hba.conf') -replace 'scram-sha-256', 'trust'
[System.IO.File]::WriteAllText('C:\Program Files\PostgreSQL\17\data\pg_hba.conf', $content)
