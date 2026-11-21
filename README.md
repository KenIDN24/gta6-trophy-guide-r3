# Leonida Legend — GTA VI Trophy Guide & Tracker (Third Edition)

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/KenIDN24/gta6-trophy-guide-r3/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/KenIDN24/gta6-trophy-guide-r3/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

The complete offline guide and tracker for the **55 official PlayStation 5 trophies of
Grand Theft Auto VI** — every trophy with its official name, description and grade as
PlayStation publishes them, and a guide written for this entry in which **every step
cites its source**.

## What's inside

- **251 cited steps** across all 55 trophies — each step tagged with the source it
  rests on (e.g. `[S24]`), so a reader can check any claim.
- **42 named sources** in a built-in directory: the official list, trophy databases,
  wikis, community maps, sheets and forums.
- **32 disputes resolved** in a public audit: where references disagreed (a count, a
  window, a missable flag), the disagreement and the resolution are written down.
- **6 missable trophies flagged**, with points of no return spelled out — the finale's
  partner lock, the VCIA departure window, the one-time partnership beat.
- **A 7-stage roadmap to the platinum**, ordered so no trip is wasted: story first,
  the fragile ones banked before the finale, grinds grouped by the routes they share,
  the 100% checklist closed last.
- **A real tracker**: checkbox progress saved in `localStorage`, per-grade tallies, a
  platinum ETA, filters (story / missable / collectibles / activities / partner),
  grade filter, five sort orders, full-text search, a **spoiler shield** that hides
  story trophies until they are earned, and progress **export / import** as a file.
- **Deep links** (`?view=roadmap`, `?kind=missable`, `?open=40`, `?spoiler=1`) open
  the app in any state — handy for sharing one trophy's guide.

## Run it

The app is plain static files under `app/` — no build step, no network at run time.

```sh
# any static server works, for example:
python3 -m http.server 8080 --directory app
# or the kit's own server:
node serve.ts            # then open http://localhost:8080
```

Hand the entry in (copies `app/` + `screenshots/` to the output directory and writes
`dossier.json` with the kit's vendored library):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

| Path | What it is |
|---|---|
| `app/index.html` | The page: masthead, progress panel, filters, the four views |
| `app/style.css` | The Vice-neon look — all original, no external assets |
| `app/app.js` | Tracker logic, the 42-source directory, the 32-dispute audit, the roadmap |
| `app/data/trophies.json` | The official 55 trophies with this entry's guide and cited steps for each |
| `screenshots/` | Four renders of the app itself (cover first), taken by its maker |
| `main.ts` | The hand-in program described above |
| `vendor/makefun-frontend.ts` | The kit's dossier library, unchanged |

## Notes

Trophy names, descriptions and grades are as PlayStation publishes them; every guide,
step, flag and resolution is written for this entry, and sources are cited — never
copied. A fan-made work: not affiliated with Rockstar Games or PlayStation, and no
official artwork is used anywhere in it.

## License

MIT — see `LICENSE`.
