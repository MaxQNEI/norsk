#!/usr/bin/env bash
set -e

if ! command -v ffmpeg &> /dev/null; then
    echo "Error: 'ffmpeg' command not found." >&2
    exit 1
fi

SRC="./static/images/logotype.png"
PUBLIC_DIR="./static"

if [ ! -f "$SRC" ]; then
    echo "Error: Source file '$SRC' not found!" >&2
    exit 1
fi

echo "Generating favicons in $PUBLIC_DIR from $SRC..."

ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=16:16" "$PUBLIC_DIR/favicon-16x16.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=32:32" "$PUBLIC_DIR/favicon-32x32.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=32:32" "$PUBLIC_DIR/favicon.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=180:180" "$PUBLIC_DIR/apple-touch-icon.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=192:192" "$PUBLIC_DIR/icon-192.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=512:512" "$PUBLIC_DIR/icon-512.png"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vf "scale=48:48" -f ico "$PUBLIC_DIR/favicon.ico"
# cp "$SRC" "$PUBLIC_DIR/favicon.svg"

# Создаем site.webmanifest в public/
cat << 'EOF' > "$PUBLIC_DIR/site.webmanifest"
{
    "name": "Norsk",
    "short_name": "NMQ",
    "start_url": "/",
    "display": "fullscreen",
    "orientation": "portrait",
    "background_color": "#1a1c23",
    "theme_color": "#2a2d37",
    "icons": [
        { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
}
EOF

echo "Done generating favicons in $PUBLIC_DIR/!"