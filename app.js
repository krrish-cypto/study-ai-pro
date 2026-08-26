const DOM = {
    // Modals
    apiKeyModal: document.getElementById('apiKeyModal'),
    historyModal: document.getElementById('historyModal'),
    
    // Inputs & Buttons
    apiKeyInput: document.getElementById('apiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
    changeKeyBtn: document.getElementById('changeKeyBtn'),
    viewHistoryBtn: document.getElementById('viewHistoryBtn'),
    closeHistoryBtn: document.getElementById('closeHistoryBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    generateBtn: document.getElementById('generateBtn'),
    copyBtn: document.getElementById('copyBtn'),
    exportBtn: document.getElementById('exportBtn'),
    
    // Core Layout
    navItems: document.querySelectorAll('.sidebar-nav .nav-item'),
    featureTitle: document.getElementById('featureTitle'),
    featureDescription: document.getElementById('featureDescription'),
    userInput: document.getElementById('userInput'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Output
    outputContainer: document.getElementById('outputContainer'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    historyList: document.getElementById('historyList')
};

const FEATURES = {
    summarizer: {
        title: "Note Summarizer",
        desc: "Condense your long study notes into key bullet points.",
        placeholder: "Paste your notes here...",
        prompt: "You are an expert AI tutor. Summarize the following study notes concisely. Use bullet points and highlight the most critical information.\n\nNotes:\n"
    },
    explainer: {
        title: "Concept Explainer",
        desc: "Explain complex topics in simple terms with an example.",
        placeholder: "What concept are you struggling with? (e.g., Quantum Entanglement)",
        prompt: "You are an expert AI tutor. Explain the following concept clearly and simply, as if explaining to a beginner. Always include an easy-to-understand real-world example.\n\nConcept:\n"
    },
    quiz: {
        title: "Quiz Generator",
        desc: "Generate short, multiple-choice quizzes based on your text.",
        placeholder: "Paste the text you want to be quizzed on...",
        prompt: "You are an expert AI tutor. Generate a short multiple-choice quiz (3 questions) based on the provided text. Provide the questions, options (A, B, C, D), and then provide the correct answers at the very end.\n\nText:\n"
    },
    improver: {
        title: "Answer Improver",
        desc: "Paste your draft answer and get actionable feedback to improve it.",
        placeholder: "Paste your draft answer here (and the question if you want)...",
        prompt: "You are an expert AI grader and tutor. Review the following draft answer provided by a student. First, provide constructive feedback on what is good and what is missing or incorrect. Then, provide a polished, improved version of the answer.\n\nStudent Answer:\n"
    },
    scheduler: {
        title: "Schedule Maker",
        desc: "Generate a structured study timetable from a list of topics.",
        placeholder: "e.g., I have 3 days to study: Calculus limits, derivatives, and integrals...",
        prompt: "You are an expert AI study coach. Create a structured, realistic study timetable based on the user's input below. Break it down day-by-day or hour-by-hour depending on the context provided.\n\nUser Constraints & Topics:\n"
    }
};

let currentFeature = 'summarizer';
let apiKey = localStorage.getItem('gemini_api_key');
let generationHistory = JSON.parse(localStorage.getItem('study_ai_history') || '[]');
let currentOutputRaw = ''; // To store raw markdown for exporting/copying

// Initialize
function init() {
    if (!apiKey) {
        DOM.apiKeyModal.classList.add('active');
    }
    setupEventListeners();
    renderHistory();
    setupInteractiveBackground();
}

// Interactive Background
function setupInteractiveBackground() {
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs[0].style.transform = `translate(${x * 30}px, ${y * 30}px) scale(1.1)`;
        if (blobs[1]) blobs[1].style.transform = `translate(${x * -40}px, ${y * -20}px) scale(1.05)`;
        if (blobs[2]) blobs[2].style.transform = `translate(${x * 20}px, ${y * -40}px) scale(1.1)`;
    });
}

// Event Listeners
function setupEventListeners() {
    // Modal controls
    DOM.saveApiKeyBtn.addEventListener('click', saveApiKey);
    DOM.changeKeyBtn.addEventListener('click', () => {
        DOM.apiKeyInput.value = apiKey || '';
        DOM.apiKeyModal.classList.add('active');
    });
    DOM.viewHistoryBtn.addEventListener('click', () => DOM.historyModal.classList.add('active'));
    DOM.closeHistoryBtn.addEventListener('click', () => DOM.historyModal.classList.remove('active'));
    DOM.clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Core Actions
    DOM.generateBtn.addEventListener('click', handleGenerate);
    DOM.copyBtn.addEventListener('click', copyToClipboard);
    DOM.exportBtn.addEventListener('click', exportToTxt);
    
    // Navigation
    DOM.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const feature = item.getAttribute('data-feature');
            if (feature) switchFeature(feature);
        });
    });
}

// API Key Logic
function saveApiKey() {
    const key = DOM.apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('gemini_api_key', apiKey);
        DOM.apiKeyModal.classList.remove('active');
        clearError();
    }
}

// Feature Switching
function switchFeature(featureKey) {
    currentFeature = featureKey;
    const config = FEATURES[featureKey];
    
    DOM.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-feature') === featureKey) {
            item.classList.add('active');
        }
    });
    
    DOM.featureTitle.textContent = config.title;
    DOM.featureDescription.textContent = config.desc;
    DOM.userInput.placeholder = config.placeholder;
    DOM.userInput.value = '';
    
    resetOutput();
    clearError();
}

// UI Helpers
function showError(msg) { DOM.errorMessage.textContent = msg; }
function clearError() { DOM.errorMessage.textContent = ''; }

function resetOutput() {
    DOM.outputContainer.innerHTML = `
        <div class="empty-state">
            <i class='bx bx-ghost'></i>
            <p>Output will appear here once generated.</p>
        </div>
    `;
    DOM.outputContainer.classList.add('empty');
    currentOutputRaw = '';
    DOM.copyBtn.disabled = true;
    DOM.exportBtn.disabled = true;
}

// Core Generation
async function handleGenerate() {
    if (!apiKey) {
        DOM.apiKeyModal.classList.add('active');
        return;
    }

    const input = DOM.userInput.value.trim();
    if (!input) {
        showError("Please enter some content first.");
        return;
    }

    clearError();
    
    // Set UI to loading state
    DOM.outputContainer.classList.add('hidden');
    DOM.outputContainer.classList.remove('empty');
    DOM.loadingIndicator.classList.remove('hidden');
    DOM.generateBtn.disabled = true;
    DOM.copyBtn.disabled = true;
    DOM.exportBtn.disabled = true;

    try {
        const resultText = await callGeminiAPI(input);
        currentOutputRaw = resultText;
        
        // Save to history
        saveToHistory(FEATURES[currentFeature].title, input, resultText);
        
        // Hide loader, show container
        DOM.loadingIndicator.classList.add('hidden');
        DOM.outputContainer.classList.remove('hidden');
        DOM.copyBtn.disabled = false;
        DOM.exportBtn.disabled = false;
        
        // Render with typing effect
        await typeEffect(marked.parse(resultText));
        
    } catch (error) {
        console.error(error);
        showError(error.message || "An error occurred while generating the output.");
        resetOutput();
        DOM.loadingIndicator.classList.add('hidden');
        DOM.outputContainer.classList.remove('hidden');
    } finally {
        DOM.generateBtn.disabled = false;
    }
}

async function callGeminiAPI(userInput) {
    const config = FEATURES[currentFeature];
    const fullPrompt = `${config.prompt}${userInput}`;

    let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
            signal: controller.signal
        });
    } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
            throw new Error("The request timed out. The AI model took too long to respond.");
        }
        throw fetchError;
    } finally {
        clearTimeout(timeoutId);
    }

    if (!response.ok) {
        let errorMsg = "Failed to connect to AI service.";
        try {
            const errData = await response.json();
            if (errData.error && errData.error.message) {
                errorMsg = errData.error.message;
                
                // If model not found, let's list available models to help the user
                if (errorMsg.includes("not found for API version") || errorMsg.includes("is not supported")) {
                    try {
                        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                        const listData = await listRes.json();
                        if (listData.models) {
                            const available = listData.models
                                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                                .map(m => m.name.replace('models/', ''))
                                .join(", ");
                            errorMsg += `\n\nDEBUG INFO: The models available to this API key are: ${available}. Please let the AI know this list!`;
                        }
                    } catch (listErr) {
                        console.error("Failed to list models", listErr);
                    }
                }
            } else {
                errorMsg = `API Error: ${response.status} ${response.statusText}`;
            }
        } catch (e) {
            if (response.status === 400) errorMsg = "Invalid Request. Check your API key or input.";
            else if (response.status === 403) errorMsg = "Unauthorized. Please check your API key.";
            else errorMsg = `API Error: ${response.status}`;
        }
        throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No response generated.");
    }
}

// Typing Effect
async function typeEffect(htmlContent) {
    DOM.outputContainer.innerHTML = '';
    // We parse the HTML into a temporary element so we can extract text while preserving structure,
    // but for simplicity in a web app context, fading it in or doing a block-level reveal is smoother 
    // for markdown than character-by-character (which breaks HTML tags). 
    // Let's do a fast block reveal to simulate AI typing without breaking markdown rendering.
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    DOM.outputContainer.appendChild(tempDiv);
    tempDiv.style.opacity = 0;
    
    // Quick fade in
    let opacity = 0;
    const interval = setInterval(() => {
        opacity += 0.1;
        tempDiv.style.opacity = opacity;
        if (opacity >= 1) clearInterval(interval);
    }, 30);
}

// History Management
function saveToHistory(type, input, output) {
    const item = {
        id: Date.now(),
        type: type,
        input: input,
        output: output,
        date: new Date().toLocaleString()
    };
    generationHistory.unshift(item);
    
    // Keep only last 50
    if (generationHistory.length > 50) {
        generationHistory.pop();
    }
    
    localStorage.setItem('study_ai_history', JSON.stringify(generationHistory));
    renderHistory();
}

function renderHistory() {
    if (generationHistory.length === 0) {
        DOM.historyList.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:20px;">No history yet. Start generating!</p>`;
        return;
    }
    
    DOM.historyList.innerHTML = generationHistory.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-item-header">
                <span class="history-item-title">${item.type}</span>
                <span>${item.date}</span>
            </div>
            <div class="history-item-preview">${item.input.substring(0, 100)}...</div>
        </div>
    `).join('');
    
    // Add click listeners to load history items
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.getAttribute('data-id'));
            const record = generationHistory.find(r => r.id === id);
            if (record) {
                DOM.historyModal.classList.remove('active');
                currentOutputRaw = record.output;
                DOM.userInput.value = record.input;
                
                // Try to find the correct feature tab
                const featureKey = Object.keys(FEATURES).find(k => FEATURES[k].title === record.type);
                if (featureKey) switchFeature(featureKey);
                
                DOM.userInput.value = record.input; // Repopulate
                
                DOM.outputContainer.classList.remove('empty');
                DOM.outputContainer.innerHTML = marked.parse(record.output);
                DOM.copyBtn.disabled = false;
                DOM.exportBtn.disabled = false;
            }
        });
    });
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
        generationHistory = [];
        localStorage.removeItem('study_ai_history');
        renderHistory();
    }
}

// Utility Actions
function copyToClipboard() {
    if (!currentOutputRaw) return;
    navigator.clipboard.writeText(currentOutputRaw).then(() => {
        const originalIcon = DOM.copyBtn.innerHTML;
        DOM.copyBtn.innerHTML = "<i class='bx bx-check' style='color:var(--success)'></i>";
        setTimeout(() => DOM.copyBtn.innerHTML = originalIcon, 2000);
    });
}

function exportToTxt() {
    if (!currentOutputRaw) return;
    const blob = new Blob([currentOutputRaw], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyAI_${FEATURES[currentFeature].title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Run app
document.addEventListener('DOMContentLoaded', init);
