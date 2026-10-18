#!/usr/bin/env bash
# Encode a raw screen recording into the three files a demo clip ships with (src/data/videoObject.js
# `clipUrls`): <id>.mp4 (H.264, faststart), <id>.webm (VP9) and <id>.webp (poster), all under
# public/assets/videos/<id>/, 1280 px wide, no audio, each video under 3 MB.
#
#   scripts/encode-demo-clip.sh RAW ID [POSTER_SECONDS] [FPS]
#
# RAW is anything ffmpeg reads (an mp4, or a frame sequence pattern like 'frames/%05d.png' with FPS).
# Heavy: run it under `wr-heavy`. Prints the duration to put in src/data/demoClips.js.
set -euo pipefail
raw=${1:?usage: encode-demo-clip.sh RAW ID [POSTER_SECONDS] [FPS]}
id=${2:?id}
poster_at=${3:-2}
fps=${4:-30}
out="$(cd "$(dirname "$0")/.." && pwd)/public/assets/videos/$id"
mkdir -p "$out"
in=(-i "$raw")
case "$raw" in *%*) in=(-framerate "$fps" -i "$raw");; esac
vf="fps=$fps,scale=1280:-2:flags=lanczos"

ffmpeg -y -loglevel error "${in[@]}" -vf "$vf" -c:v libx264 -crf 21 -maxrate 2200k -bufsize 4400k \
  -preset slow -pix_fmt yuv420p -an -movflags +faststart "$out/$id.mp4"
ffmpeg -y -loglevel error "${in[@]}" -vf "$vf" -c:v libvpx-vp9 -crf 29 -b:v 2000k -maxrate 2000k \
  -row-mt 1 -pix_fmt yuv420p -an "$out/$id.webm"
ffmpeg -y -loglevel error -ss "$poster_at" "${in[@]}" -frames:v 1 -vf "scale=1280:-2:flags=lanczos" \
  -c:v libwebp -quality 80 "$out/$id.webp"

for f in mp4 webm; do
  bytes=$(stat -c %s "$out/$id.$f")
  echo "$id.$f $bytes bytes"
  [ "$bytes" -lt 3000000 ] || { echo "FAIL: $id.$f is over 3 MB" >&2; exit 1; }
done
echo "duration: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/$id.mp4") s"
echo "size: $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$out/$id.mp4")"
