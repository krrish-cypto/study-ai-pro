<div align="center">
  
# 🎓 StudyAI Pro

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available-success?style=for-the-badge&logo=vercel)](https://krrish-cypto.github.io/study-ai-pro/)
<br>

**Tech Stack:**
<br>
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

<br>
<i>An intelligent, completely client-side AI student assistant built to help students process, understand, and plan their studies.</i>

</div>

---

## ✨ Features

- 📝 **Note Summarizer**: Condenses long study notes into key bullet points.
- 💡 **Concept Explainer**: Explains complex topics clearly with real-world examples.
- 🎯 **Quiz Generator**: Automatically generates short, multiple-choice quizzes from provided text.
- ✍️ **Answer Improver**: Reviews draft answers and provides constructive feedback and a polished version.
- 📅 **Schedule Maker**: Creates structured study timetables based on topics and available time.
- 💾 **Local History**: Automatically saves your past AI generations to the browser's `localStorage` so you never lose your work.
- 📤 **Export Tools**: One-click "Copy to Clipboard" and "Export as TXT" functionality.
- 🔐 **Bring-Your-Own-Key (BYOK)**: Securely authenticates users using their personal Gemini API key.

---

## 🚀 How to Run Locally

Since this project is completely client-side, running it locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krrish-cypto/study-ai-pro.git
   cd study-ai-pro
   ```

2. **Start a local server:**
   You can use any local web server to run the application. For example, if you have Python installed, open your terminal in the project folder and run:
   ```bash
   python -m http.server 8000
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

4. **Enter your API Key:**
   When the app loads, it will prompt you for a Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/).

---

## 🔄 Architecture & Flow Diagram

Below is the workflow diagram illustrating how data moves through the application from the user input to the final AI generation.

```mermaid
graph TD
    A[User] -->|Inputs text & selects tool| B(UI Interface)
    B --> C{API Key Check}
    C -->|No Key| D[Prompt Setup Modal]
    D --> B
    C -->|Has Key| E[app.js Core Logic]
    
    E -->|Constructs hidden prompt| F[Google Gemini API]
    
    F -->|Returns markdown response| G[Response Handler]
    G --> H[marked.js Parser]
    G --> I[Local Storage History]
    
    H -->|Renders formatted HTML| J(Output Display)
    J --> K{User Actions}
    
    K --> L[Copy to Clipboard]
    K --> M[Export as TXT]
```

---
<div align="center">
  <b>Built with ❤️ by Krishna Dubey</b>
  <br>
  <i>Beginner Level task for the AI Engineer Internship at ShadowFox</i>
</div>
