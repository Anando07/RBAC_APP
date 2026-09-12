# Nikosh font

Place a licensed `Nikosh.ttf` file in this directory:

`public/fonts/Nikosh.ttf`

The User Management PDF export loads this file from `/fonts/Nikosh.ttf`. If it is missing, the PDF still downloads with jsPDF's fallback font, but Bangla text may not render correctly.

For English PDF exports, place a licensed `TimesNewRoman.ttf` file in this directory:

`public/fonts/TimesNewRoman.ttf`

English exports use Times New Roman when this file is available; otherwise they use the standard PDF fallback font.
