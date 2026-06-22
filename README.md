# Productivity Dashboard

A simple browser-based productivity dashboard with a live clock, calculator, and notes section.

## Features

- Live analog and digital clock
- Calculator with button and keyboard support
- Notes section with auto-save in the browser
- Responsive layout for desktop and mobile screens

## Files

- `index.html` - Dashboard structure
- `index.css` - Dashboard and clock styling
- `index.js` - Clock, calculator, and notes functionality

## How to Run

Open `index.html` in any modern browser.

```text
Productivity_Dashboard/index.html
```

## Bug Fix Challenge Notes

- Fixed calculator symbols so divide, multiply, minus, and backspace display consistently.
- Improved calculator input handling so it does not start with invalid operators and backspace clears an error state cleanly.
- Smoothed the analog clock hour dial so it moves gradually as minutes pass.
- Added safer notes saving so the app still works if browser storage is blocked.
- Corrected the run path in this README.

## Calculator Keyboard Shortcuts

- Number keys: enter numbers
- `+`, `-`, `*`, `/`, `%`: operators
- `Enter`: calculate result
- `Backspace`: delete last character
- `Escape`: clear calculator

## Notes

Notes are saved automatically using `localStorage`, so they stay available after refreshing the page in the same browser.
