#!/usr/bin/env bash
set -e

SRC="./public/assets/images/logotype.svg"
BUILD_ICONS_DIR="./build/icons"

if [ ! -f "$SRC" ]; then
    echo "Error: Source file '$SRC' not found!" >&2
    exit 1
fi

rm -rf "$BUILD_ICONS_DIR"
mkdir -p "$BUILD_ICONS_DIR/png"

SIZES=(16 32 48 64 128 256 512 1024)
for SIZE in "${SIZES[@]}"; do
    ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=${SIZE}:${SIZE}" "$BUILD_ICONS_DIR/png/${SIZE}x${SIZE}.png"
done

cp "$BUILD_ICONS_DIR/png/512x512.png" "$BUILD_ICONS_DIR/icon.png"

# Windows ICO
ffmpeg -y -hide_banner -loglevel error \
  -i "$BUILD_ICONS_DIR/png/16x16.png" \
  -i "$BUILD_ICONS_DIR/png/32x32.png" \
  -i "$BUILD_ICONS_DIR/png/48x48.png" \
  -i "$BUILD_ICONS_DIR/png/64x64.png" \
  -i "$BUILD_ICONS_DIR/png/128x128.png" \
  -i "$BUILD_ICONS_DIR/png/256x256.png" \
  -f ico "$BUILD_ICONS_DIR/icon.ico"

echo "Done generating app icons in build/icons/!"
