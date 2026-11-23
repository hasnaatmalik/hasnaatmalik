#!/usr/bin/env bash
# Downloads a film's poster from TMDB, sized for the Movies section (480×720 JPEG, macOS `sips`).
#
#   scripts/fetch-poster.sh <tmdb-id> <slug>
#
#   tmdb-id  the number in the film's TMDB URL: themoviedb.org/movie/257211-the-intern → 257211
#   slug     the file name to save as: the-intern → public/movies/the-intern.jpg
#
# Then use it in src/constants/movies.ts:  posters: [poster("the-intern.jpg")]
set -euo pipefail

id="${1:?usage: scripts/fetch-poster.sh <tmdb-id> <slug>}"
slug="${2:?usage: scripts/fetch-poster.sh <tmdb-id> <slug>}"
cd "$(dirname "$0")/.."

ua="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
page=$(curl -fsSL -A "$ua" -H "Accept-Language: en-US" "https://www.themoviedb.org/movie/$id")
title=$(printf '%s' "$page" | grep -oE '<title>[^<]*' | head -1 | sed -e 's/<title>//' -e 's/ &#8212;.*//')
file=$(printf '%s' "$page" | grep -oE 'og:image" content="[^"]+' | head -1 | grep -oE '[A-Za-z0-9]+\.(jpg|png)$' || true)
if [ -z "$file" ]; then
  echo "Couldn't find a poster on https://www.themoviedb.org/movie/$id" >&2
  exit 1
fi

tmp="$(mktemp -d)/poster"
curl -fsSL -A "$ua" -o "$tmp" "https://image.tmdb.org/t/p/w780/$file"
out="public/movies/$slug.jpg"
sips -s format jpeg -s formatOptions 82 -z 720 480 "$tmp" --out "$out" >/dev/null
rm -rf "$(dirname "$tmp")"

echo "Saved $out  ($title)"
echo "Use it as:  posters: [poster(\"$slug.jpg\")],"
