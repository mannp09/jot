# jot

A capture app. One HTML file, no server, no account, no network.

**Live: https://mannp09.github.io/jot/**

## What it is

You have a thought. You open jot, you type it, it is kept. That is the whole
product. Everything else in here exists to keep that path short.

- **Eight prompts** — what's on your mind, what you ate, what your body did, who
  you saw, what you're building, what you're grateful for, what you're avoiding,
  what made today count. Tapping one opens a pad already in that category.
- **Continuous entries** — each paragraph carries its own timestamp, so a jot is
  a thread through a day rather than a single moment.
- **A library that is an address, not a list** — every entry is filed by year,
  month, week, day and time the moment you write it, so browsing is navigation
  rather than scrolling.
- **Patterns** — words per day, streaks, longest pause, category mix, and a
  histogram of when you actually write.

## Where your writing lives

**In your browser, on your device, and nowhere else.** There is no account, no
sync and no server to send anything to. The app makes zero network requests
after it loads.

That is a real trade and it should be stated plainly: **the data is as durable
as the browser profile holding it.** Clearing site data deletes it. Use
**Options -> Export** to take a JSON copy, and **Import** to merge one back —
import is additive and idempotent, so re-importing the same file changes
nothing.

## Install it

Open the link, then Add to Home Screen. It registers a service worker and opens
offline afterwards.

> ⚠ **iOS specifics.** Safari clears script-writable storage after 7 days
> without a visit to the origin. Installing to the Home Screen and opening it
> regularly is what keeps the corpus alive; exporting periodically is the real
> backup.

## Scale

The library's grouping level is derived from the corpus rather than fixed, so it
stays navigable as the store grows. Measured against generated multi-year
corpora shaped like real usage (~10 entries/day):

| corpus | entries | grouping chosen | top-level rows | DOM nodes |
|---|---|---|---|---|
| 1 month | ~300 | day | 26 | ~400 |
| 1 year | 2,976 | month | 13 | 485 |
| 3 years | 9,317 | month | 37 | 784 |
| 10 years | 30,740 | year | 11 | 564 |

Before this was derived, a three-year store rendered 939 day-rows, 12,417 DOM
nodes and **85 screens of scrolling** to reach the oldest entry. Picking a level
by hand disables the automatic choice permanently — a derived default is a
starting point, not an override.

The generator is `jot_simulate.py` in the author's workspace; it draws from
measured distributions (median 13 words, mean 32, bimodal at midday and night)
rather than uniform filler, because the skew is the workload.

## Build

There is no build. `index.html` is the app — HTML, CSS, JS, icons and the font
inlined into one file. Edit it and reload.

`sw.js` caches the shell. **Bump `CACHE` on every change** or browsers keep
serving the old one; a deploy takes two opens to appear, by design — a stale
shell that opens beats a fresh one that does not.

## License

MIT
