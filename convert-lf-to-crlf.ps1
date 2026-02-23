Param(
  [string[]]$Extensions = @('js','ts','tsx','jsx','json','jsonc','md','css','html','yml','yaml','env','txt','scss','less','xml'),
  [string[]]$Special = @('Dockerfile','.gitignore')
)

Get-ChildItem -Path . -Recurse -File | Where-Object {
  $ext = $_.Extension.TrimStart('.')
  ($Extensions -contains $ext) -or ($Special -contains $_.Name)
} | ForEach-Object {
  $p = $_.FullName
  try {
    $c = Get-Content -Raw -Encoding UTF8 -ErrorAction Stop $p
  } catch {
    try {
      $c = Get-Content -Raw -Encoding Default -ErrorAction Stop $p
    } catch {
      Write-Output "Skipped (encoding): $p"
      return
    }
  }
  $n = $c -replace '(?<!\\r)\\n', "`r`n"
  if ($n -ne $c) {
    Set-Content -NoNewline -Encoding UTF8 -Value $n -Path $p
    Write-Output "Converted: $p"
  } else {
    Write-Output "Unchanged: $p"
  }
}
