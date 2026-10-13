# 08 - Fake News Language Pattern Analyzer

A media literacy and computational linguistics application built for the **Text and Speech Analysis** laboratory course. It inspects written news articles and social media posts for linguistic markers of sensationalism, including clickbait phrases, unsupported certainty claims, emotional outrage triggers, ALL-CAPS hyperbole, and excessive punctuation, pairing findings with an interactive critical-reading verification checklist.

> [!WARNING]
> **Critical Media Literacy Disclaimer:** This tool analyzes rhetorical style and linguistic indicators of sensationalism. It does **not** fact-check claims or verify empirical truth. An article with a high sensationalism score may still report true events in an exaggerated style, while carefully phrased misinformation can mimic sober, objective prose. Reliable verification requires investigating primary sources, author credentials, and empirical evidence.

---

## 1. Project Title
**Fake News Language Pattern Analyzer** (Project 08 of 10)

## 2. Project Description
Sensationalized and misleading online news often relies on predictable rhetorical patterns designed to manipulate emotions, provoke impulsive social sharing, and suppress critical scrutiny. This project provides a transparent, client-side NLP tool that flags hyperbolic phraseology, quantifies a 0–100 Sensationalism Index, explains the rhetorical danger of each matched pattern, and equips readers with a structured checklist for independent source verification.

## 3. Objectives
- Implement rule-based pattern matching for common sensational and conspiratorial rhetoric.
- Detect unsupported epistemic certainty markers (*"100% proven"*, *"undeniable proof"*).
- Identify emotional outrage and panic vocabulary (*"disaster"*, *"horrifying"*, *"catastrophe"*).
- Detect hyperbolic ALL-CAPS tokens while strictly whitelisting legitimate organizational acronyms (NASA, WHO, FBI, etc.).
- Flag informal excessive punctuation (*"???"*, *"!!!!"*, *"?!*).
- Calculate an explainable Sensationalism Indicator Score (0–100).
- Provide an educational Critical-Reading Checklist.

## 4. Features
- **Sensational Phrase Detection:** Identifies clickbait expressions (*"you won't believe"*, *"miracle cure"*, *"banned by mainstream"*).
- **Unsupported Certainty Analysis:** Flags claims of absolute certainty that lack scientific hedging (*"undeniable proof"*, *"100% proven"*).
- **Emotional Outrage Index:** Identifies affective panic triggers (*"catastrophe"*, *"terrifying"*, *"panic"*).
- **Smart ALL-CAPS Filter:** Flags shouted words while ignoring legitimate uppercase entities like `NASA`, `WHO`, `COVID`, and `NATO`.
- **Excessive Punctuation Detection:** Catches sensationalist exclamation and question mark clusters.
- **Color-Coded Visual Highlighting:** Categorically highlights flagged spans across the article.
- **Sensationalism Index Meter:** Visual gauge classifying text into Low, Medium, or High Sensationalism.
- **Detailed Pattern Explanations:** Itemized cards explaining the rhetorical intent behind each flagged phrase.
- **Interactive Verification Checklist:** Five-point media literacy rubric prompting readers to investigate authors, evidence, and independent corroboration.
- **Pre-Built Contrast Samples:** Instant buttons comparing sensational conspiracy clickbait against peer-reviewed scientific journalism.

## 5. Technologies Used
- **HTML5:** Semantic document markup, accessible checklist inputs, and meter bars.
- **CSS3:** Orange and charcoal news palette, responsive CSS Grid, and custom highlight badges.
- **Vanilla JavaScript (ES6+):** Word boundary regular expressions, acronym set filtering, and DOM builders.
- **Node.js (Optional):** Zero-dependency static server and test suite runner.

## 6. How It Works
1. **Input:** The user pastes news text or loads one of the sample articles.
2. **Lexical & Syntactic Scanning:**
   - Text is scanned against the sensationalism and conspiracy phrase lexicon.
   - Text is scanned against the absolute certainty phrase lexicon.
   - Emotional panic words are identified using whole-word boundary matching.
   - Uppercase tokens of length $\ge 3$ are checked against `ACRONYM_WHITELIST`; non-whitelisted tokens are flagged as ALL-CAPS emphasis.
   - Punctuation clusters (`!{2,}`, `\?{2,}`, `[?!]{2,}`) are located.
3. **Score Computation:**
   - Weighted points from each category are summed and clamped to the 0–100 scale.
4. **Rendering:** Highlights are layered onto the source text, the meter is animated, and pattern explanations are populated alongside the interactive checklist.

## 7. Algorithm Explanation

### A. Sensationalism Score Formula
$$\text{Score} = \min(35, N_{\text{sens}} \times 15) + \min(25, N_{\text{cert}} \times 15) + \min(20, N_{\text{emot}} \times 6) + \min(15, N_{\text{caps}} \times 5) + \min(15, N_{\text{punct}} \times 8)$$
$$\text{FinalIndex} = \max(0, \min(100, \text{Score}))$$

Where:
- $N_{\text{sens}}$: Count of matched clickbait/sensational phrases.
- $N_{\text{cert}}$: Count of matched unsupported certainty phrases.
- $N_{\text{emot}}$: Count of emotional outrage triggers.
- $N_{\text{caps}}$: Count of non-whitelisted ALL-CAPS words.
- $N_{\text{punct}}$: Count of excessive punctuation occurrences.

### B. Rating Categorization
$$\text{Rating} = \begin{cases} \text{High Sensationalism}, & \text{if } \text{FinalIndex} \ge 65 \\ \text{Moderate Sensationalism}, & \text{if } 35 \le \text{FinalIndex} < 65 \\ \text{Balanced \& Measured}, & \text{if } \text{FinalIndex} < 35 \end{cases}$$

### C. Acronym Whitelisting
To prevent false alarms on news entities like *"NASA"* or *"WHO"*, a hash set $W$ is evaluated:
$$\text{IsHyperbolicCaps}(w) = (w \equiv \text{UpperCase}(w)) \land (|w| \ge 3) \land (w \notin W)$$

## 8. Installation Instructions
No external npm dependencies required.

```bash
cd 08-fake-news-language-analyzer
```

## 9. How to Run Locally

### Option A: Open Directly in Browser
Double-click `index.html` to open in any web browser.

### Option B: Built-In Node Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:3008`.

### Option C: Run Automated Tests
```bash
npm test
```

## 10. Example Input and Expected Output

### Input (Sensational Clickbait):
```text
SHOCKING CONSPIRACY EXPOSED: You won't believe what mainstream doctors are hiding from you!!!!
Scientists don't want you to know this 100% proven miracle cure that eliminates heart disease overnight!
Big pharma is in absolute panic as the undeniable truth leaks out.
```

### Expected Output:
- **Sensationalism Index:** ~81 / 100 (High Sensationalism)
- **Sensational Phrases (3):** `SHOCKING`, `EXPOSED`, `You won't believe`, `miracle cure`
- **Unsupported Certainty (2):** `Scientists don't want you to know`, `100% proven`, `undeniable truth`
- **Emotional Words (1):** `panic`
- **ALL-CAPS Words (3):** `SHOCKING`, `CONSPIRACY`, `EXPOSED`
- **Excessive Punctuation (2):** `!!!!`, `!`

## 11. Project Structure
```text
08-fake-news-language-analyzer/
├── index.html         # Application layout, score meter, checklist
├── style.css          # Orange/charcoal theme, highlight chips, meter animations
├── script.js          # Heuristic scanners, acronym whitelist, DOM controllers
├── package.json       # Dev server and test runner scripts
├── .gitignore         # Git ignore exclusions
└── README.md          # Complete laboratory documentation
```

## 12. Browser Compatibility Notes
- 100% compatible with Chrome, Edge, Firefox, Safari, and mobile browsers.
- Executes client-side with zero network dependencies.

## 13. Limitations
- **Style vs. Fact:** Writing style does not prove truth. Sincere reporting on an actual emergency (e.g., an earthquake) may contain words like *"catastrophe"* or *"deadly threat"*, yet remain factual.
- **Satire Detection:** Satirical publications (e.g., *The Onion*) mimic sensationalist language intentionally; heuristic tools cannot infer humorous irony.
- **No Database of Verified Claims:** This tool does not query claim databases (such as PolitiFact or Snopes); it performs computational linguistic analysis.

## 14. Future Enhancements
- Integrate Named Entity Recognition (NER) to check whether referenced sources are real institutions.
- Add headline-versus-body stance detection to measure clickbait discrepancy.

## 15. Screenshot Placeholder
```text
+--------------------------------------------------------------------+
|  [PROJECT 08] Fake News Language Pattern Analyzer                  |
+--------------------------------------------------------------------+
|  [Sensational Sample]  [Balanced Report]                           |
|  [SHOCKING CONSPIRACY EXPOSED: You won't believe what doctors...]  |
|  [ 🔍 Analyze Article Language ]  [ ✖ Clear ]                      |
+--------------------------------------------------------------------+
|  RATING: HIGH SENSATIONALISM (81 / 100) [████████████████████░░░░] |
|  • Phrases: 4 | Certainty: 2 | Emotional: 1 | ALL-CAPS: 3          |
+---------------------------------+----------------------------------+
|  HIGHLIGHTED LANGUAGE PATTERNS  | CRITICAL READING CHECKLIST       |
|  "[SHOCKING] [CONSPIRACY]       | [ ] 1. Identifiable source?      |
|  [EXPOSED]: [You won't believe] | [ ] 2. Supporting evidence?      |
|  what doctors are hiding..."    | [ ] 3. Multiple perspectives?    |
+---------------------------------+----------------------------------+
```

## 16. Viva Preparation: Questions & Answers

### Q1: Can a natural language processing model determine if a statement is factually true solely from its text?
**Answer:** No. Natural language processing models evaluate syntax, vocabulary, sentiment, and statistical patterns. Factual truth requires external world knowledge, empirical evidence, and source verification. An article written in elegant, sober language can contain false fabrications, while emotional prose can describe an actual disaster.

### Q2: What is "epistemic modality", and why does sensational news minimize it?
**Answer:** Epistemic modality refers to linguistic devices that express degrees of certainty, possibility, or doubt (e.g., *"preliminary evidence suggests"*, *"investigators hypothesize"*, *"results indicate"*). Sensationalist writing strips away epistemic hedging, using absolutist phrases (*"100% proven"*, *"undeniable truth"*) to manufacture unearned credibility.

### Q3: Why is an acronym whitelist essential when flagging ALL-CAPS text?
**Answer:** Legitimate news articles frequently reference government agencies, international organizations, and scientific concepts in all-caps (e.g., NASA, WHO, COVID, NATO, FBI). If every uppercase word were flagged as shouting, standard objective reports would receive falsely inflated sensationalism scores.

### Q4: What rhetorical role do excessive punctuation marks (e.g., "??!!") play in misinformation?
**Answer:** Clustered punctuation marks violate journalistic stylebooks (like AP or Reuters). They act as emotional amplifiers, conveying agitation, outrage, or astonishment to elicit rapid emotional reactions from readers before they have time to critically evaluate the claim.

### Q5: How does the application avoid XSS vulnerabilities when generating highlighted text?
**Answer:** The original text is escaped using an HTML entity replacement function (`escapeHtml()`) that converts characters like `<`, `>`, `&`, and `"` to safe character entities. Highlights are built by inserting valid, sanitized `<mark>` elements around isolated index ranges.

---

## 17. Git Upload Instructions
To publish this project to an independent GitHub repository:

```bash
# 1. Initialize git
git init

# 2. Stage all project files
git add .

# 3. Commit files
git commit -m "Initial commit: Project 08 Fake News Language Pattern Analyzer"

# 4. Set default branch to main
git branch -M main

# 5. Link your independent GitHub repository
git remote add origin YOUR_GITHUB_REPOSITORY_URL

# 6. Push to GitHub
git push -u origin main
```
*(Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual remote URL).*

---

## 18. License
This project is licensed under the **MIT License**.
