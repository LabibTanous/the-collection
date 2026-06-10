#!/usr/bin/env bash
# the Collection — content creation tool setup
# Run once: bash scripts/setup-tools.sh

set -e

echo "=== Installing yt-dlp ==="
pip install -q yt-dlp
echo "yt-dlp $(yt-dlp --version) installed"

echo ""
echo "=== Installing Whisper (OpenAI) ==="
pip install -q openai-whisper
echo "Whisper installed"

echo ""
echo "=== Ollama model ==="
echo "Make sure Ollama is running (https://ollama.com) then run:"
echo "  ollama pull llama3.2:1b    # fast, 1.3GB, good for product Q&A"
echo "  ollama pull qwen2.5:1.5b   # alternative, very small"
echo ""
echo "Start Ollama server: ollama serve"
echo "Test: curl http://localhost:11434/api/tags"

echo ""
echo "=== Fooocus (image generation) ==="
echo "Windows one-click installer:"
echo "  https://github.com/lllyasviel/Fooocus/releases"
echo "  Download Fooocus_win64_2-*.7z, extract, run run.bat"
echo "  See scripts/fooocus-prompts.txt for Gulf lifestyle prompts"

echo ""
echo "=== Penpot (open-source Figma) ==="
echo "Desktop app: https://penpot.app/downloads"
echo "Or cloud (free): https://penpot.app"

echo ""
echo "=== AppFlowy (Notion alternative) ==="
echo "Download: https://appflowy.io/download"
echo "Use for: edition tracker, waitlist queue, content calendar"

echo ""
echo "=== Cal.com (booking) ==="
echo "Cloud (free): https://cal.com/signup"
echo "  1. Create event type: 'Early Access — Next Drop'"
echo "  2. Set duration: 15 min, limit: 20 slots"
echo "  3. Copy your cal.com/yourname/early-access URL"
echo "  4. Update the 'Book early access' link in the HTML (search ppCalLink)"

echo ""
echo "=== Bitwarden (secrets manager) ==="
echo "Browser extension: https://bitwarden.com/download/"
echo "Store: RESEND_API_KEY, OWNER_EMAIL, SHIP_SECRET, SLACK_WEBHOOK_URL"
echo "Then add to Vercel: vercel env add RESEND_API_KEY"

echo ""
echo "All tools set up. See fooocus-prompts.txt for image generation prompts."
