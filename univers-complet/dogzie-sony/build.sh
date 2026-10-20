cd /workspace/dogzie-sony
rm -f page-*.png
timeout 90 google-chrome --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=Dogzie-Town-Sony-pitch.pdf dossier.html >/dev/null 2>&1
pdftoppm -r 96 -png Dogzie-Town-Sony-pitch.pdf page
for f in page-?.png; do [ -e "$f" ] && mv "$f" "page-0${f#page-}"; done
pdfinfo Dogzie-Town-Sony-pitch.pdf | grep -E "Pages|Page size"; ls page-*.png | wc -l
