# Kanji Flash

Kanji Flash is a web app for learning and reinforcing kanji through flash cards and games, built with Svelte 5 and hosted on GitHub Pages.

Available at: https://christian-schefe.github.io/kanji-flash/

## Routes

### Play

As of now, two game modes are implemented:

#### Flash

The front shows either the literal or the meaning of the kanji. On reveal, the kanij details are displayed. If "Bad" is chosen, the kanji is added onto a review list that can be played as well.

#### Time Attack

Try to get as many readings or onyomi correct within the given time period. At the end, all played kanji are displayed.

### Collections

A variety of collections encompassing a selection of kanji.
Examples include JLPT N5 through N1, Kyouiku, Jouyou and Jinmeiyou.

### Reference

A place to search for kanji using various filters.
Includes a detail page with meanings, readings and stroke order.

### Settings

Different settings, including dark mode, font and data deletion.

## Data

The bulk of the kanji data comes from Kanjidic2, enriched with the matching RTK keyword if present.
