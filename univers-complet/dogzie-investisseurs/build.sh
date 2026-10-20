cd /workspace/dogzie-investisseurs
rm -f page-*.png Dogzie-Family-Universe-investisseurs.pdf
timeout 60 google-chrome --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=Dogzie-Universe-investisseurs.pdf index.html >/dev/null 2>&1
pdftoppm -r 120 -png Dogzie-Universe-investisseurs.pdf page
for f in page-?.png; do [ -e "$f" ] && mv "$f" "page-0${f#page-}"; done
pdfinfo Dogzie-Universe-investisseurs.pdf | grep Pages; echo DONE
