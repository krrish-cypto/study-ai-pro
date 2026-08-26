# 🎓 StudyAI Pro

**Live Demo:** [https://krrish-cypto.github.io/study-ai-pro/](https://krrish-cypto.github.io/study-ai-pro/)

Built by **Krishna Dubey** as a Beginner Level task for the AI Engineer Internship at ShadowFox.

StudyAI Pro is an intelligent, completely client-side AI student assistant built to help students process, understand, and plan their studies. It utilizes the Google Gemini API to offer a suite of five powerful educational tools.

---

## 🛠️ Tech Stack

- 🌐 **HTML5**: Semantic structure and layout of the web application.
- 🎨 **Vanilla CSS3**: Styling, responsive design, glassmorphism UI, and interactive animations (no external CSS frameworks used).
- ⚡ **JavaScript (ES6+)**: Core application logic, DOM manipulation, state management, and asynchronous API integration.
- 🧠 **Google Gemini API** (`gemini-3.6-flash`): The underlying Large Language Model providing the AI capabilities.
- 📝 **Marked.js**: Used for rendering the Markdown responses from the AI into beautifully formatted HTML.

---

## ✨ Features

1. **Note Summarizer**: Condenses long study notes into key bullet points.
2. **Concept Explainer**: Explains complex topics clearly with real-world examples.
3. **Quiz Generator**: Automatically generates short, multiple-choice quizzes from provided text.
4. **Answer Improver**: Reviews draft answers and provides constructive feedback and a polished version.
5. **Schedule Maker**: Creates structured study timetables based on topics and available time.
6. **Local History**: Automatically saves your past AI generations to the browser's `localStorage` so you never lose your work.
7. **Export Tools**: One-click "Copy to Clipboard" and "Export as TXT" functionality.
8. **Bring-Your-Own-Key (BYOK)**: Securely authenticates users using their personal Gemini API key.

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
   *Or using Node.js/npm:*
   ```bash
   npx serve .
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

4. **Enter your API Key:**
   When the app loads, it will prompt you for a Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/).

---

## 🔄 Workflow & Architecture Flow Diagram

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
    K --> M[Export to TXT]
```

### Application Flow Details:
1. **Initialization**: The app checks `localStorage` for a saved Gemini API key and past generation history.
2. **Feature Selection**: The user selects one of the five AI tools from the sidebar. The UI updates dynamically to reflect the required input.
3. **Generation Trigger**: The user inputs their study text and clicks "Generate".
4. **API Call**: `app.js` wraps the user's input with a hardcoded prompt specific to the selected tool (e.g., instructing the AI to act as a quiz generator) and sends a `POST` request to the Google Gemini API.
5. **Response Processing**: 
   - The response is saved to the browser's local storage.
   - The markdown response is parsed into HTML.
   - The UI reveals the output using a simulated "typing" effect.
6. **Post-Processing**: The user can view their generated content, download it as a `.txt` file, copy it, or retrieve it later from the History panel.
