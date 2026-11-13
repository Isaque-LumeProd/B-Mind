$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Configurando workspace Antigravity em: $Root"

# 1. Garantir pasta Ideias e vínculos Mind -> .agents
New-Item -ItemType Directory -Force "$Root\Ideias" | Out-Null
New-Item -ItemType Directory -Force "$Root\Mind" | Out-Null

$mindLinks = @{
    "$Root\Mind\Agentes"   = "$Root\.agents\agents"
    "$Root\Mind\Regras"    = "$Root\.agents\rules"
    "$Root\Mind\Skills"    = "$Root\.agents\skills"
    "$Root\Mind\Workflows" = "$Root\.agents\workflows"
}
foreach ($kv in $mindLinks.GetEnumerator()) {
    if (-not (Test-Path $kv.Key) -and (Test-Path $kv.Value)) {
        New-Item -ItemType Junction -Path $kv.Key -Target $kv.Value | Out-Null
        Write-Host "[OK] Junction Mind criada: $($kv.Key)"
    }
}

# 2. Vincular 00_BRUTOS_ORIGINAIS caso os brutos estejam no mesmo caminho relativo
$rawPax = "$Root\Video Pax\Pax Vida"
$clientRaw = "$Root\Clientes\PAX VIDA\00_BRUTOS_ORIGINAIS"
if ((Test-Path $rawPax) -and -not (Test-Path $clientRaw)) {
    New-Item -ItemType Junction -Path $clientRaw -Target $rawPax | Out-Null
    Write-Host "[OK] Junction brutos Pax Vida criada."
}

# 3. Restaurar repositórios de apoio em Operacional/
$repos = @{
    "$Root\Operacional\ECC"          = "https://github.com/affaan-m/ECC.git"
    "$Root\Operacional\lemo-opuscar" = "https://github.com/lemomo-ai/lemo-opuscar.git"
    "$Root\Operacional\vercel-skills"= "https://github.com/vercel-labs/skills.git"
}
foreach ($kv in $repos.GetEnumerator()) {
    if (-not (Test-Path $kv.Key)) {
        Write-Host "Clonando $($kv.Value)..."
        git clone --depth 1 $kv.Value $kv.Key
    }
}

# 4. Instalar dependências do motor Remotion
$remotionDir = "$Root\Operacional\video-seguranca-residencial"
if (Test-Path "$remotionDir\package.json") {
    Write-Host "Instalando dependências npm do motor Remotion..."
    Push-Location $remotionDir
    npm install
    Pop-Location
}

Write-Host "`nSetup do segundo computador concluido com sucesso!" -ForegroundColor Green

