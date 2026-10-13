/**
 * Fake News Language Pattern Analyzer
 * Project 08 - Text & Speech Analysis
 *
 * Implements stylistic heuristic analysis for sensationalism,
 * excessive punctuation, ALL-CAPS hyperbole, and emotional rhetoric.
 *
 * NOTE: Educational media literacy tool. Does not fact-check empirical truth.
 */

// Whitelist of common uppercase acronyms that are legitimate in reporting
const ACRONYM_WHITELIST = new Set([
  "NASA", "WHO", "FBI", "CIA", "COVID", "USA", "UK", "BBC", "CNN", "NATO",
  "CDC", "CEO", "CFO", "CTO", "UN", "EU", "AI", "DNA", "RNA", "HTML", "CSS",
  "NLP", "NIH", "FDA", "MIT", "IMF", "SEC", "EPA", "GOP", "DNC", "AP", "AFP"
]);

// Sensational Clickbait Phrases
const SENSATIONAL_PHRASES = [
  "you won't believe", "you will not believe", "shocking", "miracle cure",
  "secret revealed", "conspiracy", "what they don't want you to know",
  "what they dont want you to know", "mind-blowing", "banned by the mainstream",
  "they are lying to you", "guaranteed cure", "unbelievable truth", "exposed",
  "hidden agenda", "mainstream media won't tell you", "they are hiding",
  "leaked documents prove", "secret plot", "bombshell revelation"
];

// Unsupported Certainty Phrases
const CERTAINTY_PHRASES = [
  "undeniable proof", "100% proven", "scientists don't want you to know",
  "absolute certainty", "beyond any doubt", "guaranteed truth",
  "undeniable fact", "undisputed fact", "miraculous breakthrough",
  "irrefutable proof", "indisputable truth", "zero doubt", "undeniable evidence"
];

// Emotional Outrage & Fear Keywords
const EMOTIONAL_WORDS = [
  "disaster", "horrifying", "outrageous", "terrifying", "catastrophe",
  "panic", "deadly threat", "fury", "scandal", "ruined", "destroying",
  "evil", "nightmare", "rage", "monstrous", "sinister", "apocalypse",
  "catastrophic", "shocking", "disastrous", "treason"
];

// Sample Articles
const SAMPLES = {
  sensational: `SHOCKING CONSPIRACY EXPOSED: You won't believe what mainstream doctors are hiding from you!!!!
Scientists don't want you to know this 100% proven miracle cure that eliminates heart disease overnight!
Big pharma is in absolute panic as the undeniable truth leaks out to the public.
Share this immediately before it gets banned by the mainstream media?!?!`,
  balanced: `Researchers at the National Institutes of Health published a comprehensive phase-three study on cardiovascular health in the New England Journal of Medicine.
The randomized trial observed a 14% relative reduction in hypertension complications among participants receiving lifestyle interventions.
Lead investigators emphasized that while the findings are encouraging, additional longitudinal studies across diverse cohorts are necessary before clinical guidelines are updated.`
};

// DOM and Browser Integration
if (typeof document !== "undefined") {
  const articleInput = document.getElementById("articleInput");
  const liveWordCount = document.getElementById("liveWordCount");
  const statusAlert = document.getElementById("statusAlert");
  const sampleSensationalBtn = document.getElementById("sampleSensationalBtn");
  const sampleBalancedBtn = document.getElementById("sampleBalancedBtn");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const clearBtn = document.getElementById("clearBtn");
  const emptyState = document.getElementById("emptyState");
  const resultsSection = document.getElementById("resultsSection");

  // Overview Elements
  const ratingBadge = document.getElementById("ratingBadge");
  const scoreValue = document.getElementById("scoreValue");
  const meterFill = document.getElementById("meterFill");
  const countSensational = document.getElementById("countSensational");
  const countCertainty = document.getElementById("countCertainty");
  const countEmotional = document.getElementById("countEmotional");
  const countAllCaps = document.getElementById("countAllCaps");
  const countPunctuation = document.getElementById("countPunctuation");
  const highlightedView = document.getElementById("highlightedView");
  const totalPatternsCount = document.getElementById("totalPatternsCount");
  const patternsBreakdownList = document.getElementById("patternsBreakdownList");

  // Event Listeners
  if (articleInput) articleInput.addEventListener("input", updateInputWordMetrics);
  if (analyzeBtn) analyzeBtn.addEventListener("click", handleAnalyze);
  if (clearBtn) clearBtn.addEventListener("click", handleClear);
  if (sampleSensationalBtn) sampleSensationalBtn.addEventListener("click", () => loadSample("sensational"));
  if (sampleBalancedBtn) sampleBalancedBtn.addEventListener("click", () => loadSample("balanced"));

  function updateInputWordMetrics() {
    const text = articleInput.value.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const sentences = text ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
    liveWordCount.textContent = `${words} words | ${sentences} sentences`;
  }

  function showAlert(msg, type = "error") {
    statusAlert.textContent = msg;
    statusAlert.className = `status-alert ${type}`;
    statusAlert.classList.remove("hidden");
  }

  function clearAlert() {
    statusAlert.textContent = "";
    statusAlert.className = "status-alert hidden";
  }

  function loadSample(key) {
    articleInput.value = SAMPLES[key];
    updateInputWordMetrics();
    clearAlert();
    handleAnalyze();
  }

  function handleClear() {
    articleInput.value = "";
    updateInputWordMetrics();
    clearAlert();
    emptyState.classList.remove("hidden");
    resultsSection.classList.add("hidden");
  }

  function handleAnalyze() {
    clearAlert();
    const text = articleInput.value.trim();

    if (!text) {
      showAlert("Please enter or paste article text to analyze.", "error");
      emptyState.classList.remove("hidden");
      resultsSection.classList.add("hidden");
      return;
    }

    const report = analyzeArticleLanguage(text);

    // Update Rating & Meter
    scoreValue.textContent = report.score;
    meterFill.style.width = `${report.score}%`;
    ratingBadge.textContent = `${report.rating} Sensationalism`;
    ratingBadge.className = `rating-badge rating-${report.rating.toLowerCase()}`;
    meterFill.className = `meter-fill fill-${report.rating.toLowerCase()}`;

    // Update Counts Grid
    countSensational.textContent = report.sensationalMatches.length;
    countCertainty.textContent = report.certaintyMatches.length;
    countEmotional.textContent = report.emotionalMatches.length;
    countAllCaps.textContent = report.allCapsMatches.length;
    countPunctuation.textContent = report.punctuationMatches.length;

    totalPatternsCount.textContent = report.allPatterns.length;

    // Render Highlights
    highlightedView.innerHTML = renderHighlightedPatterns(text, report.allPatterns);

    // Render Patterns Explanations
    renderPatternsList(report.allPatterns);

    emptyState.classList.add("hidden");
    resultsSection.classList.remove("hidden");
  }

  function renderPatternsList(patterns) {
    if (patterns.length === 0) {
      patternsBreakdownList.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-style: italic;">
          No sensational language patterns detected. The text maintains balanced, measured phrasing.
        </div>
      `;
      return;
    }

    patternsBreakdownList.innerHTML = patterns.map(item => `
      <div class="pattern-item">
        <div class="pattern-header">
          <span class="pattern-type chip-${item.type}">${escapeHtml(item.category)}</span>
        </div>
        <div class="pattern-snippet">"${escapeHtml(item.text)}"</div>
        <div class="pattern-reason">${escapeHtml(item.reason)}</div>
      </div>
    `).join("");
  }
}

/**
 * Text Processing & Linguistic Heuristics (Pure Logic & Testing)
 */

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function analyzeArticleLanguage(text) {
  const allPatterns = [];

  // 1. Sensational Phrases
  const sensationalMatches = [];
  for (const phrase of SENSATIONAL_PHRASES) {
    const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      const matchObj = {
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
        category: "Sensational Phrase",
        type: "sensational",
        reason: "Hyperbolic clickbait phrase commonly employed to provoke viral curiosity rather than report measured facts."
      };
      sensationalMatches.push(matchObj);
      allPatterns.push(matchObj);
    }
  }

  // 2. Unsupported Certainty Phrases
  const certaintyMatches = [];
  for (const phrase of CERTAINTY_PHRASES) {
    const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      const matchObj = {
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
        category: "Unsupported Certainty",
        type: "certainty",
        reason: "Absolute certainty claim. Legitimate scientific and journalistic prose normally expresses nuance, methodology, and confidence intervals."
      };
      certaintyMatches.push(matchObj);
      allPatterns.push(matchObj);
    }
  }

  // 3. Emotional / Outrage Keywords
  const emotionalMatches = [];
  for (const word of EMOTIONAL_WORDS) {
    const re = new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      // Prevent duplicate overlap with sensational phrases
      const overlap = allPatterns.some(p => m.index >= p.start && m.index < p.end);
      if (!overlap) {
        const matchObj = {
          text: m[0],
          start: m.index,
          end: m.index + m[0].length,
          category: "Emotional Trigger",
          type: "emotional",
          reason: "High-intensity affective term designed to evoke fear, panic, or moral outrage in the audience."
        };
        emotionalMatches.push(matchObj);
        allPatterns.push(matchObj);
      }
    }
  }

  // 4. ALL-CAPS Words (length >= 3, excluding acronyms)
  const allCapsMatches = [];
  const capsRegex = /\b[A-Z]{3,}\b/g;
  let m;
  while ((m = capsRegex.exec(text)) !== null) {
    const word = m[0];
    if (!ACRONYM_WHITELIST.has(word)) {
      const overlap = allPatterns.some(p => m.index >= p.start && m.index < p.end);
      if (!overlap) {
        const matchObj = {
          text: word,
          start: m.index,
          end: m.index + word.length,
          category: "ALL-CAPS Emphasis",
          type: "caps",
          reason: "Capitalized word used as visual shouting to artificially amplify emotional urgency."
        };
        allCapsMatches.push(matchObj);
        allPatterns.push(matchObj);
      }
    }
  }

  // 5. Excessive Repeated Punctuation (e.g. ???, !!!!, ?!)
  const punctuationMatches = [];
  const punctRegex = /([!?]){2,}|[!?]{2,}/g;
  while ((m = punctRegex.exec(text)) !== null) {
    const matchObj = {
      text: m[0],
      start: m.index,
      end: m.index + m[0].length,
      category: "Excessive Punctuation",
      type: "punct",
      reason: "Repeated punctuation marks (such as multiple exclamation or question marks) signal informal agitation rather than objective reporting."
    };
    punctuationMatches.push(matchObj);
    allPatterns.push(matchObj);
  }

  // Calculate Heuristic Sensationalism Score (0 to 100)
  let score = 0;
  score += Math.min(35, sensationalMatches.length * 15);
  score += Math.min(25, certaintyMatches.length * 15);
  score += Math.min(20, emotionalMatches.length * 6);
  score += Math.min(15, allCapsMatches.length * 5);
  score += Math.min(15, punctuationMatches.length * 8);

  score = Math.max(0, Math.min(100, score));

  let rating = "Low";
  if (score >= 65) {
    rating = "High";
  } else if (score >= 35) {
    rating = "Medium";
  }

  // Sort patterns chronologically
  allPatterns.sort((a, b) => a.start - b.start);

  return {
    score,
    rating,
    sensationalMatches,
    certaintyMatches,
    emotionalMatches,
    allCapsMatches,
    punctuationMatches,
    allPatterns
  };
}

function renderHighlightedPatterns(text, patterns) {
  // Filter non-overlapping patterns
  const nonOverlapping = [];
  let lastEnd = -1;
  for (const p of patterns) {
    if (p.start >= lastEnd) {
      nonOverlapping.push(p);
      lastEnd = p.end;
    }
  }

  let output = "";
  let cursor = 0;

  for (const p of nonOverlapping) {
    output += escapeHtml(text.slice(cursor, p.start));
    const token = text.slice(p.start, p.end);
    output += `<mark class="hl-${p.type}" title="${escapeHtml(p.category)}: ${escapeHtml(p.reason)}">${escapeHtml(token)}</mark>`;
    cursor = p.end;
  }

  output += escapeHtml(text.slice(cursor));
  return output;
}

// Module export for unit test verification
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SAMPLES,
    ACRONYM_WHITELIST,
    analyzeArticleLanguage,
    renderHighlightedPatterns
  };
}
