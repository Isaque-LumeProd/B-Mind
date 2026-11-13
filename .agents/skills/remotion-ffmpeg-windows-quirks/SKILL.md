---
name: remotion-ffmpeg-windows-quirks
description: Use when preprocessing iPhone HLG HDR .MOV footage, slicing frame-exact audio, or rendering OffthreadVideo timelines with Remotion's bundled FFmpeg on Windows without compositor or missing-filter errors.
metadata:
  origin: user-learned
---

# Soluções FFmpeg + Remotion no Windows

Armadilhas reais observadas no `@remotion/compositor-win32-x64-msvc` (`ffmpeg.exe` / `ffprobe.exe` slim) no Windows e suas soluções definitivas.

## 1. Filtros ausentes no `ffmpeg.exe` do Remotion

O build enxuto incluído no `@remotion/compositor-win32-x64-msvc` **não inclui** diversos filtros comuns:
- **Ausentes em vídeo:** `fps`, `drawtext`, `tile`, `setpts`.
  - Use `-r 30` como flag de saída (em vez de `fps=30` dentro de `-vf`).
  - Gere contact sheets HTML + `chrome-headless-shell.exe` em vez de `-vf tile` ou `drawtext`.
- **Ausentes em áudio:** `afade`, `highpass`, `anullsrc`.
  - Filtros disponíveis confirmados: `loudnorm`, `volume`, `aresample`, `aformat`, `amix`, `amerge`, `apad`, `atrim`, `silencedetect`.
  - Para micro-fades (`15ms`) sem cliques em cortes e silêncios exatos, processe os `.wav` em Python (`wave` + `struct` a `48000Hz` = `1600` samples/quadro a `30fps`) e aplique `loudnorm=I=-16:TP=-1.5:LRA=11` via FFmpeg ao final.

## 2. Conversão iPhone 10-bit HLG HDR (`arib-std-b67`) para SDR Preview

Para evitar cores lavadas ou estouradas em previews `libx264` (`yuv420p`) e erros de range em thumbnails `mjpeg`:
- **Preview MP4 (`Rec. 709`):**
  `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p` com `-r 30`.
- **Thumbnails `.jpg`:** adicionar `format=yuvj420p` e `-strict unofficial` (e sempre limitar `-ss` abaixo de `duration - 0.35s`).

## 3. Erro `Compositor error: No frame found at position ...` no `<OffthreadVideo>`

- Input seeking (`-ss` antes de `-i`) pode deixar PTS inicial deslocado ou contagem insuficiente de quadros perto do fim do clipe.
- Para clipes curtos e cortes finais próximos ao EOF, prefira **`-ss` após `-i`** com pequena margem extra em `-t`, e encodar com **`-g 1` (`all-intra`)** para busca instantânea e determinística em cada quadro do Remotion (`--concurrency=2` mantém o compositor Win32 estável em renderizações longas).

