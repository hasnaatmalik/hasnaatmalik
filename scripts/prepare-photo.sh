#!/usr/bin/env bash
# Gets a photo ready for the gallery: long edge 1600px, JPEG, saved to public/gallery (macOS `sips`).
# Works with iPhone HEIC files too. Prints the line to paste into src/constants/gallery.ts.
#
#   scripts/prepare-photo.sh <photo> <slug>
#
#   photo  the original file, e.g. ~/Desktop/IMG_4821.HEIC
#   slug   a short descriptive name: hunza-sunset → public/gallery/hunza-sunset.jpg
set -euo pipefail

in="${1:?usage: scripts/prepare-photo.sh <photo> <slug>}"
slug="${2:?usage: scripts/prepare-photo.sh <photo> <slug>}"
in="$(cd "$(dirname "$in")" && pwd)/$(basename "$in")"
cd "$(dirname "$0")/.."

out="public/gallery/$slug.jpg"
sips -s format jpeg -s formatOptions 82 -Z 1600 "$in" --out "$out" >/dev/null
w=$(sips -g pixelWidth "$out" | awk '/pixelWidth/ { print $2 }')
h=$(sips -g pixelHeight "$out" | awk '/pixelHeight/ { print $2 }')

echo "Saved $out (${w}×${h}). Check it's the right way up, then add to src/constants/gallery.ts:"
echo
echo "  {"
echo "    src: \"/gallery/$slug.jpg\","
echo "    width: $w,"
echo "    height: $h,"
echo "    alt: \"Describe what's in the photo\","
echo "  },"
