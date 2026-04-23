# 📊 Teacher Toolkit · 考試分析系統

A browser-based exam analysis tool for teachers — upload student results, auto-generate parent messages, and export everything with zero setup.

🌐 **[Live Demo → ssps6210.github.io/teacher-toolkit](https://ssps6210.github.io/teacher-toolkit/)**

---

## ✨ Features

- 📁 Upload student score Excel (`.xlsx`) and auto-parse results
- 📝 Upload your own question analysis Word doc (`.docx`) — skips AI entirely
- 🤖 Or let AI (Claude / Gemini / GPT) read exam + answer PDFs and generate explanations
- 📉 Wrong-question heatmap and per-student breakdown
- 📨 One-click personalised parent messages (Traditional Chinese or English)
- 📊 Export full analysis as `.xlsx` with 4 sheets
- 🛠️ Export parent messages as a standalone `.html` tool
- 🔒 Fully client-side — no data ever leaves your browser

---

## 🎯 How to Use

1. Go to the [live demo](https://ssps6210.github.io/teacher-toolkit/) or open `index.html` locally
2. **Step 1 — Upload files:**
   - Required: student score `.xlsx` (must have `Real Name`, `Total Score`, `Q1`, `Q2`… columns)
   - Required: question analysis `.docx` (your own write-up) **or** exam + answer `.pdf` files for AI
   - Optional: report link `.xlsx` (name → URL mapping, auto-inserted into messages)
3. **Step 2 — Configure:** set grade, class, exam name, teacher name, language
4. **Step 3 — Generate:** click ⚡ and let the system run all tasks
5. **Step 4 — Preview** parent messages per student, copy to WhatsApp
6. **Step 5 — Download** `.xlsx` analysis and `.html` message tool

---

## 🤖 Supported AI Providers

| Provider | Key format | Where to get |
|----------|-----------|--------------|
| Claude (Anthropic) | `sk-ant-...` | [console.anthropic.com](https://console.anthropic.com) |
| Gemini (Google) | `AIza...` | [aistudio.google.com](https://aistudio.google.com) |
| GPT (OpenAI) | `sk-...` | [platform.openai.com](https://platform.openai.com) |

> API keys are stored in-browser only and never transmitted anywhere except the chosen provider.

---

## 🛠️ Tech Stack

- Pure HTML / CSS / JavaScript — zero build step, zero dependencies to install
- [SheetJS](https://sheetjs.com/) for Excel parsing and generation
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for Word doc parsing
- Anthropic / Google / OpenAI APIs (optional, only if you provide a key)

---

## ☕ Support

If this tool has saved you time, consider buying me a coffee!

<a href="https://www.buymeacoffee.com/ssps6210noa" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height:60px;width:217px;" />
</a>

---

## 📁 Version History

| File | Description |
|------|-------------|
| `index.html` | Latest version (v8) |
| `teacher_toolkit(8).html` | Source for current index |
| `teacher_toolkit.html` – `(7).html` | Previous versions |
| `parent_message_generator.jsx` | Standalone message generator (early prototype) |

---

## Disclaimer

This is an educational, non-profit project. API keys are your own responsibility. Not affiliated with any school, exam board, or publisher.
