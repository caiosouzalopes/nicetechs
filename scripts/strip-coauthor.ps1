# Remove linhas "Co-authored-by: Cursor ..." da mensagem de commit (stdin -> stdout)
$input | Where-Object { $_ -notmatch 'Co-authored-by:\s*Cursor' }
