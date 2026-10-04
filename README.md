# FreshStart Jobs — AI-Driven Job Portal for Fresh Graduates

A job portal built specifically for fresh graduates entering the job market,
with TensorFlow-powered client-side machine learning for fast, personalized
job matching and an integrated career chatbot.

## Features

- Job listings curated for fresh graduates (no "5 years experience required")
- Client-side ML matching with TensorFlow.js — recommendations without round-trips
- Career chatbot (`chatbot.js`) with configurable intents (`chatbot-intents.json`)
- Quick-reply shortcuts for common questions (`chatbot-quick.json`)
- Responsive single-page frontend

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no build step)
- **ML:** TensorFlow.js (in-browser inference)
- **Utilities:** Python (`update.py` — Gemini Live API voice/vision assistant)

## Getting Started

No build tools needed — it's a static site:

```bash
# Option 1: just open it
open index.html

# Option 2: serve locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project Structure

```
index.html            # main portal page ("FreshStart Jobs")
style.css             # portal styles
app.js                # portal logic
chatbot.js            # chatbot widget
chatbot-intents.json  # chatbot intents (edit to teach it new answers)
chatbot-quick.json    # quick-reply shortcuts
chatbot.css           # chatbot styles
update.py             # standalone Gemini Live API assistant (needs API key)
```

## Notes

- `update.py` requires a Gemini API key and Python packages (`google-genai`,
  `opencv-python`, `pyaudio`, `pillow`, `mss`) — see its docstring.
- Never commit API keys: keep them in environment variables, not in code.

## Author

Kazi Nafis Nawaz
