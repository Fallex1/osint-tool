# Design spec (exported from FigCraft)

Source of truth: `osint-console.figcraft`. Machine tree: `spec/design-tree.json` (every node, x/y/w/h, text, fill, font).

## 01 · Desktop · Investigation — 1440×900

| x | y | w | h | layer |
|---|---|---|---|---|
| 0 | 0 | 1440 | 56 | topbar |
| 24 | 20 | 75 | 16 | SENTINEL |
| 110 | 21 | 49 | 16 | //osint |
| 260 | 21 | 44 | 16 | Search |
| 344 | 21 | 39 | 16 | Cases |
| 421 | 21 | 51 | 16 | Sources |
| 512 | 21 | 36 | 16 | Alerts |
| 552 | 18 | 6 | 6 | alert dot |
| 1128 | 21 | 79 | 15 | 14/14 sources |
| 1250 | 16 | 24 | 24 | avatar |
| 1290 | 21 | 45 | 15 | free tier |
| 0 | 56 | 1440 | 1 | divider |
| 24 | 108 | 752 | 52 | query field |
| 44 | 124 | 176 | 18 | ghostbyte77@gmail.com |
| 44 | 146 | 148 | 1 | field underline |
| 792 | 108 | 104 | 52 | lookup button |
| 792 | 108 | 104 | 52 | button tint |
| 818 | 125 | 50 | 17 | Lookup |
| 910 | 127 | 24 | 15 | ⌘⏎ |
| 24 | 176 | 57 | 26 | type pill |
| 89 | 176 | 57 | 26 | type pill |
| 154 | 176 | 64 | 26 | type pill |
| 226 | 176 | 78 | 26 | type pill |
| 312 | 176 | 36 | 26 | type pill |
| 356 | 176 | 64 | 26 | type pill |
| 24 | 224 | 208 | 600 | rail |
| 44 | 264 | 90 | 15 | gmail · personal |
| 44 | 290 | 92 | 15 | telkomsel · 0812 |
| 44 | 316 | 103 | 15 | nova craft domain |
| 44 | 342 | 105 | 15 | ghostbyte handles |
| 44 | 356 | 168 | 1 | divider |
| 44 | 396 | 6 | 6 | src dot |
| 60 | 392 | 62 | 15 | DNS / DoH |
| 44 | 426 | 6 | 6 | src dot |
| 60 | 422 | 49 | 15 | Gravatar |
| 44 | 456 | 6 | 6 | src dot |
| 60 | 452 | 28 | 15 | HIBP |
| 44 | 486 | 6 | 6 | src dot |
| 60 | 482 | 33 | 15 | crt.sh |
| 44 | 516 | 6 | 6 | src dot |
| 60 | 512 | 32 | 15 | RDAP |
| 44 | 546 | 6 | 6 | src dot |
| 60 | 542 | 40 | 15 | GitHub |
| 44 | 576 | 6 | 6 | src dot |
| 60 | 572 | 44 | 15 | Shodan |
| 44 | 606 | 6 | 6 | src dot |
| 60 | 602 | 59 | 15 | X / Twitter |
| 44 | 636 | 168 | 1 | divider |
| 44 | 674 | 168 | 4 | quota track |
| 44 | 674 | 118 | 4 | quota fill |
| 256 | 300 | 832 | 1 | divider |
| 248 | 306 | 848 | 60 | row active |
| 256 | 320 | 153 | 16 | ghostbyte77@gmail.com |
| 664 | 322 | 31 | 15 | email |
| 792 | 321 | 40 | 20 | chip HIBP |
| 838 | 321 | 64 | 20 | chip Gravatar |
| 908 | 321 | 52 | 20 | chip GitHub |
| 1010 | 320 | 29 | 16 | 92% |
| 1010 | 342 | 84 | 4 | conf track |
| 1010 | 342 | 77 | 4 | conf fill |
| 256 | 362 | 832 | 1 | divider |
| 256 | 384 | 107 | 16 | api.novacraft.dev |
| 664 | 386 | 42 | 15 | domain |
| 792 | 385 | 40 | 20 | chip RDAP |
| 838 | 385 | 52 | 20 | chip crt.sh |
| 896 | 385 | 34 | 20 | chip DNS |
| 1010 | 384 | 27 | 16 | 81% |
| 1010 | 406 | 84 | 4 | conf track |
| 1010 | 406 | 68 | 4 | conf fill |
| 256 | 426 | 832 | 1 | divider |
| 256 | 448 | 121 | 16 | +62 812 3456 7890 |
| 664 | 450 | 36 | 15 | phone |
| 792 | 449 | 40 | 20 | chip HIBP |
| 838 | 449 | 58 | 20 | chip carrier |
| 902 | 449 | 76 | 20 | chip Truecaller |
| 1010 | 448 | 28 | 16 | 78% |
| 1010 | 470 | 84 | 4 | conf track |
| 1010 | 470 | 65 | 4 | conf fill |
| 256 | 490 | 832 | 1 | divider |
| 256 | 512 | 83 | 16 | ghostbyte_77 |
| 664 | 514 | 57 | 15 | username |
| 792 | 513 | 52 | 20 | chip GitHub |
| 850 | 513 | 52 | 20 | chip Reddit |
| 908 | 513 | 28 | 20 | chip HN |
| 1010 | 512 | 30 | 16 | 64% |
| 1010 | 534 | 84 | 4 | conf track |
| 1010 | 534 | 53 | 4 | conf fill |
| 256 | 554 | 832 | 1 | divider |
| 256 | 576 | 71 | 16 | 104.21.44.9 |
| 664 | 578 | 11 | 15 | ip |
| 792 | 577 | 40 | 20 | chip RDAP |
| 838 | 577 | 52 | 20 | chip Shodan |
| 1010 | 576 | 29 | 16 | 58% |
| 1010 | 598 | 84 | 4 | conf track |
| 1010 | 598 | 48 | 4 | conf fill |
| 256 | 618 | 832 | 1 | divider |
| 256 | 640 | 152 | 16 | ghostbyte77@proton.me |
| 664 | 642 | 31 | 15 | email |
| 792 | 641 | 40 | 20 | chip HIBP |
| 838 | 641 | 64 | 20 | chip Gravatar |
| 1010 | 640 | 26 | 16 | 51% |
| 1010 | 662 | 84 | 4 | conf track |
| 1010 | 662 | 42 | 4 | conf fill |
| 256 | 712 | 75 | 15 | Show 2 more |
| 368 | 712 | 175 | 15 | 3 sources returned partial data |
| 608 | 712 | 46 | 15 | 0 errors |
| 1120 | 224 | 296 | 600 | feed |
| 1372 | 236 | 16 | 16 | pause btn |
| 1188 | 266 | 33 | 15 | crt.sh |
| 1140 | 310 | 256 | 1 | divider |
| 1188 | 328 | 32 | 15 | RDAP |
| 1140 | 372 | 256 | 1 | divider |
| 1188 | 390 | 28 | 15 | HIBP |
| 1140 | 434 | 256 | 1 | divider |
| 1188 | 452 | 49 | 15 | Gravatar |
| 1140 | 496 | 256 | 1 | divider |
| 1188 | 514 | 26 | 15 | DNS |
| 1140 | 558 | 256 | 1 | divider |
| 1188 | 576 | 40 | 15 | GitHub |
| 1140 | 620 | 256 | 1 | divider |
| 1188 | 638 | 44 | 15 | Shodan |
| 1140 | 682 | 256 | 1 | divider |
| 1188 | 700 | 9 | 15 | X |
| 0 | 876 | 1440 | 24 | statusbar |

## 02 · Mobile · Investigation — 390×844

| x | y | w | h | layer |
|---|---|---|---|---|
| 0 | 0 | 390 | 52 | topbar mobile |
| 16 | 18 | 68 | 15 | SENTINEL |
| 346 | 14 | 24 | 24 | avatar mobile |
| 16 | 72 | 270 | 44 | query mobile |
| 30 | 86 | 123 | 15 | ghostbyte77@gmail… |
| 30 | 106 | 96 | 1 | field underline mobile |
| 294 | 72 | 80 | 44 | go mobile |
| 316 | 86 | 43 | 15 | Lookup |
| 16 | 128 | 55 | 26 | rect |
| 79 | 128 | 55 | 26 | rect |
| 142 | 128 | 62 | 26 | rect |
| 212 | 128 | 48 | 26 | rect |
| 8 | 190 | 374 | 80 | row active mobile |
| 16 | 204 | 141 | 15 | ghostbyte77@gmail.com |
| 16 | 244 | 40 | 20 | chip HIBP |
| 62 | 244 | 64 | 20 | chip Gravatar |
| 296 | 204 | 27 | 15 | 92% |
| 296 | 226 | 72 | 3 | rect |
| 296 | 226 | 66 | 3 | rect |
| 16 | 262 | 358 | 1 | divider |
| 16 | 290 | 99 | 15 | api.novacraft.dev |
| 16 | 330 | 40 | 20 | chip RDAP |
| 62 | 330 | 52 | 20 | chip crt.sh |
| 296 | 290 | 25 | 15 | 81% |
| 296 | 312 | 72 | 3 | rect |
| 296 | 312 | 58 | 3 | rect |
| 16 | 348 | 358 | 1 | divider |
| 16 | 376 | 112 | 15 | +62 812 3456 7890 |
| 16 | 416 | 40 | 20 | chip HIBP |
| 62 | 416 | 58 | 20 | chip carrier |
| 296 | 376 | 26 | 15 | 78% |
| 296 | 398 | 72 | 3 | rect |
| 296 | 398 | 56 | 3 | rect |
| 16 | 434 | 358 | 1 | divider |
| 16 | 462 | 77 | 15 | ghostbyte_77 |
| 16 | 502 | 52 | 20 | chip GitHub |
| 74 | 502 | 52 | 20 | chip Reddit |
| 296 | 462 | 27 | 15 | 64% |
| 296 | 484 | 72 | 3 | rect |
| 296 | 484 | 46 | 3 | rect |
| 0 | 780 | 390 | 64 | tabbar |
| 0 | 780 | 390 | 1 | divider |
| 28 | 796 | 9 | 17 | ⌕ |
| 118 | 796 | 14 | 17 | ▤ |
| 208 | 796 | 11 | 17 | ◈ |
| 298 | 796 | 13 | 17 | ◔ |

## Type scale

- 11.0px × 44
- 12.0px × 43
- 10.0px × 42
- 13.0px × 18
- 9.0px × 12
- 14.0px × 5
- 15.0px × 1
- 8.0px × 1

## Families

- Fira Code × 119
- Fira Sans × 47

## Fills

- `#9AABBD` × 60
- `#8A9AAC` × 52
- `#E8EEF6` × 32
- `#1E2A35` × 32
- `#0B0F14` × 27
- `#3FB950` × 19
- `#111821` × 15
- `#3B82F6` × 12
- `#E8A33D` × 10
- `#16202B` × 4
- `#1C2937` × 2
- `#132033` × 2