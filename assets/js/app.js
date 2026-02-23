// App wiring + UI events (ES module)
import { KANA_MAP, kanaToUnits, unitsToRomaji, leadingConsonant } from "./kana-map.js";
import {
  clean,
  stripSpaces,
  escapeHtml,
  describeDiff,
  highlightUserDiffHtml,
  highlightExpectedDiffHtml,
  isCorrectDetailed,
  attributeUnits,
} from "./judge.js";
import { buildItems, buildCharItems } from "./data.js";
import { loadJson, saveJson } from "./storage.js";

(() => {
  const LS_KEY_UNIT_STATS = "kanaCoach.unitStats.v1";
  const LS_KEY_RECENT_UNITS = "kanaCoach.recentUnits.v1";
  const LS_KEY_TUTORIAL = "kanaCoach.tutorialSeen.v1";
  const LS_KEY_KANA_FONT = "kanaCoach.kanaFont.v1"; // "rounded" | "serif"
  const LS_KEY_SHOW_SPACES = "kanaCoach.showSpaces.v1";
  const LS_KEY_RECENT_SENTENCES = "kanaCoach.recentSentences.v1";

  // Avoid repeating sentence prompts that were shown very recently.
  // This is especially helpful when the sentence pool is smaller due to category filters.
  const SENTENCE_COOLDOWN_WINDOW = 40;

  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function unitKey(unit){
    const script = /[ぁ-ゖゔ]/.test(unit) ? "hira" : (/[ァ-ヶヴー]/.test(unit) ? "kata" : "other");
    return `${script}|${unit}`;
  }

  function ensureUnitStat(stats, key){
    // Backwards compatible: older entries may lack fields
    if (!stats[key]) stats[key] = { seen:0, wrong:0, last:0, streak:0 };
    if (typeof stats[key].seen !== "number") stats[key].seen = 0;
    if (typeof stats[key].wrong !== "number") stats[key].wrong = 0;
    if (typeof stats[key].last !== "number") stats[key].last = 0;
    if (typeof stats[key].streak !== "number") stats[key].streak = 0; // correct streak per unit
    return stats[key];
  }

  function troubleScoreUnit(stat){
    const seen = stat?.seen || 0;
    const wrong = stat?.wrong || 0;
    if (seen < 4 && wrong < 2) return 0;
    const rate = wrong / Math.max(1, seen);
    const volumeBoost = Math.min(1, seen / 12);
    return rate * (0.65 + 0.35 * volumeBoost);
  }

  function getTroubleUnitKeysFromPool(poolUnits, unitStats){
    const out = [];
    for (const u of poolUnits){
      const key = unitKey(u);
      const stat = unitStats[key];
      const score = troubleScoreUnit(stat);
      if (score > 0) out.push({ unit:u, key, score, seen:stat.seen, wrong:stat.wrong });
    }
    out.sort((a,b) => b.score - a.score || b.wrong - a.wrong || b.seen - a.seen);
    return out;
  }

  const els = {
    prompt: document.getElementById("prompt"),
    answer: document.getElementById("answer"),
    result: document.getElementById("result"),
    checkBtn: document.getElementById("checkBtn"),
    revealBtn: document.getElementById("revealBtn"),
    nextBtn: document.getElementById("nextBtn"),

    typeMeta: document.getElementById("typeMeta"),
    indexMeta: document.getElementById("indexMeta"),

    streakValue: document.getElementById("streakValue"),
    accValue: document.getElementById("accValue"),
    troubleValue: document.getElementById("troubleValue"),
    troubleSub: document.getElementById("troubleSub"),
    troubleCard: document.getElementById("troubleCard"),
    modeTiny: document.getElementById("modeTiny"),
    seenTiny: document.getElementById("seenTiny"),

    poolPill: document.getElementById("poolPill"),
    scriptPill: document.getElementById("scriptPill"),
    difficultyPill: document.getElementById("difficultyPill"),

    menuBtn: document.getElementById("menuBtn"),
    drawer: document.getElementById("drawer"),
    drawerOverlay: document.getElementById("drawerOverlay"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),

    helpBtn: document.getElementById("helpBtn"),
    helpOverlay: document.getElementById("helpOverlay"),
    helpModal: document.getElementById("helpModal"),
    closeHelpBtn: document.getElementById("closeHelpBtn"),

    modeSelect: document.getElementById("modeSelect"),
    modeHint: document.getElementById("modeHint"),
    resetSessionBtn: document.getElementById("resetSessionBtn"),
    resetHistoryBtn: document.getElementById("resetHistoryBtn"),

    mixChars: document.getElementById("mixChars"),
    mixWords: document.getElementById("mixWords"),
    mixSentences: document.getElementById("mixSentences"),
    allowLenient: document.getElementById("allowLenient"),
    allowAlmost: document.getElementById("allowAlmost"),
    scriptSelect: document.getElementById("scriptSelect"),
    difficultySelect: document.getElementById("difficultySelect"),

    kanaFontSerif: document.getElementById("kanaFontSerif"),
    showSpaces: document.getElementById("showSpaces"),

    // sentence categories
    sentenceCatBox: document.getElementById("sentenceCatBox"),
    sentenceCatChecks: Array.from(document.querySelectorAll(".sentCat")),

    // pool count line
    poolCountLine: document.getElementById("poolCountLine"),


    // Version / changelog
    versionTag: document.getElementById("versionTag"),
    changelogOverlay: document.getElementById("changelogOverlay"),
    changelogModal: document.getElementById("changelogModal"),
    closeChangelogBtn: document.getElementById("closeChangelogBtn"),
    changelogContent: document.getElementById("changelogContent"),

    // Trouble modal
    troubleOverlay: document.getElementById("troubleOverlay"),
    troubleModal: document.getElementById("troubleModal"),
    closeTroubleBtn: document.getElementById("closeTroubleBtn"),
    troubleList: document.getElementById("troubleList"),
  };

  const state = {
    settings: null,
    mode: "normal",
    pool: [],
    deck: [],
    idx: 0,
    current: null,

    checked: false,
    stats: { correct:0, wrong:0, almost:0, seen:0, streak:0 },

    unitStats: loadJson(LS_KEY_UNIT_STATS, {}),
    recentUnits: loadJson(LS_KEY_RECENT_UNITS, []),
    recentSentences: loadJson(LS_KEY_RECENT_SENTENCES, []),

    kanaFont: loadJson(LS_KEY_KANA_FONT, "rounded"),

    showSpaces: !!loadJson(LS_KEY_SHOW_SPACES, false),

    troubleSubTimeout: null,
  };

  function rememberRecentSentence(kana){
    if (!kana) return;
    // De-dupe (move to front)
    state.recentSentences = (state.recentSentences || []).filter(x => x !== kana);
    state.recentSentences.unshift(kana);
    if (state.recentSentences.length > 200) state.recentSentences = state.recentSentences.slice(0, 200);
    saveJson(LS_KEY_RECENT_SENTENCES, state.recentSentences);
  }

  function isSentenceInCooldown(kana){
    if (!kana) return false;
    const recent = state.recentSentences || [];
    return recent.slice(0, SENTENCE_COOLDOWN_WINDOW).includes(kana);
  }

  function applyKanaFont(){
    const serifOn = state.kanaFont === "serif";
    document.documentElement.classList.toggle("kanaSerif", serifOn);
    if (els.kanaFontSerif) els.kanaFontSerif.checked = serifOn;
  }

  function setKanaFontFromToggle(){
    state.kanaFont = els.kanaFontSerif && els.kanaFontSerif.checked ? "serif" : "rounded";
    saveJson(LS_KEY_KANA_FONT, state.kanaFont);
    applyKanaFont();
  }

  function applyShowSpaces(){
    document.documentElement.classList.toggle("showSpaces", !!state.showSpaces);
    if (els.showSpaces) els.showSpaces.checked = !!state.showSpaces;
  }

  function setShowSpacesFromToggle(){
    state.showSpaces = !!(els.showSpaces && els.showSpaces.checked);
    saveJson(LS_KEY_SHOW_SPACES, state.showSpaces);
    applyShowSpaces();
    // Refresh prompt display immediately
    if (state.current) {
      els.prompt.textContent = formatKanaForDisplay(state.current.kana, state.current.type, getPrimaryExpected(state.current));
    }
  }

  function getPrimaryExpected(item){
    if (!item) return "";
    return (item.accepted && item.accepted[0])
      ? item.accepted[0]
      : unitsToRomaji(kanaToUnits(item.kana));
  }

  function formatKanaForDisplay(kana, type, expectedRomaji){
    if (!state.showSpaces) return kana;

    // Only add spaces for words/sentences (never split individual characters)
    if (type === "char") return kana;

    const GAP = " "; // single space; visual size controlled by CSS word-spacing
    const raw = (kana || "");

    // Always add a small gap after common punctuation when Show spaces is enabled
    const punctuated = raw
      .replace(/、/g, "、" + GAP)
      .replace(/。/g, "。" + GAP)
      .replace(/！/g, "！" + GAP)
      .replace(/？/g, "？" + GAP);

    const expected = (expectedRomaji ?? "")
      .toLowerCase()
      .trim()
      .replace(/[’']/g, "")
      .replace(/\s+/g, " ");

    const words = expected ? expected.split(" ").filter(Boolean) : [];

    // If the expected romaji has no word breaks, don't introduce any (prevents false splits like わかりません → わか りません)
    if (words.length <= 1) {
      return punctuated.replace(/\s+/g, GAP).trim();
    }

    const expectedNoSpace = words.join("");

    const units = kanaToUnits(raw);

    // Build cumulative romaji-length after each kana unit, using the same mapping as the judge.
    let rom = "";
    const cumLens = [];
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const v = KANA_MAP.get(u);

      let contrib = "";
      if (v) {
        if (v === "(sokuon)") {
          const next = units[i + 1];
          const nextRomaji = next ? (KANA_MAP.get(next) || "") : "";
          const c = leadingConsonant(nextRomaji);
          contrib = c ? c : "";
        } else if (v === "(long)") {
          const prev = rom[rom.length - 1] || "";
          contrib = ("aeiou".includes(prev)) ? prev : "";
        } else {
          contrib = v;
        }
        rom += contrib;
      }
      cumLens.push(rom.length);
    }

    // If we can't confidently align romaji-to-kana, fall back to punctuation-only spacing.
    if (rom.length !== expectedNoSpace.length) {
      return punctuated.replace(/\s+/g, GAP).trim();
    }

    // Boundary positions in the romaji string where we should insert gaps in the kana
    const boundaries = new Set();
    let pos = 0;
    for (let w = 0; w < words.length - 1; w++) {
      pos += words[w].length;
      boundaries.add(pos);
    }

    // Build spaced kana output: insert a gap after the kana unit that completes each romaji word.
    let out = "";
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      out += u;

      // Preserve punctuation spacing
      if (u === "、" || u === "。" || u === "！" || u === "？") out += GAP;

      if (boundaries.has(cumLens[i])) out += GAP;
    }

    return out.replace(/\s+/g, GAP).trim();
  }

  function getSelectedSentenceCategories(){
    const checks = els.sentenceCatChecks || [];
    const selected = checks.filter(c => c.checked).map(c => c.value);
    return selected.length ? selected : checks.map(c => c.value);
  }

  function updateSentenceCategoryUI(){
    const on = !!els.mixSentences?.checked;

    if (!els.sentenceCatBox) return;

    els.sentenceCatBox.classList.toggle("collapsed", !on);
    els.sentenceCatBox.classList.toggle("disabled", !on);

    for (const cb of (els.sentenceCatChecks || [])){
      cb.disabled = !on;
    }
  }

  function getSettings(){
    return {
      mixChars: els.mixChars.checked,
      mixWords: els.mixWords.checked,
      mixSentences: els.mixSentences.checked,
      lenient: els.allowLenient.checked,
      allowAlmost: els.allowAlmost.checked,
      script: els.scriptSelect.value,
      difficulty: els.difficultySelect.value,
      sentenceCategories: getSelectedSentenceCategories(),
    };
  }

  function setPills(){
    const s = state.settings;
    const what = [];
    if (s.mixChars) what.push("chars");
    if (s.mixWords) what.push("words");
    if (s.mixSentences) what.push("sentences");
    els.poolPill.textContent = `Practice: ${what.join(" + ") || "chars"}`;
    els.scriptPill.textContent = `Script: ${s.script === "both" ? "hiragana + katakana" : s.script}`;
    els.difficultyPill.textContent = `Level: ${s.difficulty}`;
  }

  function updatePoolCountUI(){
    if (!els.poolCountLine) return;

    const counts = { char:0, word:0, sentence:0 };
    for (const it of (state.pool || [])){
      if (it?.type === "char") counts.char++;
      else if (it?.type === "word") counts.word++;
      else if (it?.type === "sentence") counts.sentence++;
    }
    const total = counts.char + counts.word + counts.sentence;

    const parts = [];
    if (counts.char) parts.push(`chars ${counts.char}`);
    if (counts.word) parts.push(`words ${counts.word}`);
    if (counts.sentence) parts.push(`sentences ${counts.sentence}`);

    els.poolCountLine.textContent = total
      ? `Pool: ${total} (${parts.join(" • ")})`
      : "Pool: —";
  }

  function eligibleTroubleUnits(){
    // Trouble tracking uses character units (not words/sentences), but can be triggered by misses inside any context.
    return buildCharItems(state.settings.script, "spicy").map(x => x.kana);
  }

  function getTroubleList(){
    const eligibleUnits = eligibleTroubleUnits();
    return getTroubleUnitKeysFromPool(eligibleUnits, state.unitStats);
  }

  function countTroubleKana(){
    return getTroubleList().length;
  }

  function setTroubleSubMessage(msg){
    if (!els.troubleSub) return;
    if (state.troubleSubTimeout) clearTimeout(state.troubleSubTimeout);

    els.troubleSub.textContent = msg;
    state.troubleSubTimeout = setTimeout(() => {
      els.troubleSub.textContent = "characters flagged";
      state.troubleSubTimeout = null;
    }, 1600);
  }

  function pulseTrouble(delta){
    if (!els.troubleCard || !els.troubleValue) return;

    els.troubleCard.classList.remove("pulseAdd","pulseRemove");
    // reflow to restart animation reliably
    void els.troubleCard.offsetWidth;

    if (delta > 0){
      els.troubleCard.classList.add("pulseAdd");
      setTroubleSubMessage(`+${delta} added to trouble`);
    } else if (delta < 0){
      els.troubleCard.classList.add("pulseRemove");
      setTroubleSubMessage(`${Math.abs(delta)} released 🎉`);
    }
  }

  function updateStatsUI(){
    const { correct, almost, seen, streak } = state.stats;
    const acc = seen ? Math.round(((correct + 0.5*almost)/seen)*100) : null;

    els.streakValue.textContent = String(streak);
    els.accValue.textContent = acc === null ? "—" : `${acc}%`;
    els.seenTiny.textContent = `${seen} attempts`;
    els.troubleValue.textContent = String(countTroubleKana());

    const modeLabel = state.mode === "normal" ? "Normal" : (state.mode === "trouble" ? "Trouble kana" : "Recent kana");
    els.modeTiny.textContent = `Mode: ${modeLabel}`;
  }

  function buildPool(){
    state.settings = getSettings();
    setPills();
    state.pool = buildItems(state.settings);
    updatePoolCountUI();
  }

  function applyMode(resetIndex){
    state.mode = els.modeSelect.value;

    if (state.mode === "normal"){
      state.deck = shuffle(state.pool);
      els.modeHint.textContent = "A mix of what you’ve enabled in settings.";
    } else if (state.mode === "trouble"){
      const allUnits = eligibleTroubleUnits();
      const trouble = getTroubleUnitKeysFromPool(allUnits, state.unitStats);
      let deckUnits = trouble.slice(0, 60).map(t => t.unit);

      if (deckUnits.length < 12){
        deckUnits = shuffle(allUnits).slice(0, 30);
        els.modeHint.textContent = "Not enough trouble data yet — showing random kana to build your profile.";
      } else {
        els.modeHint.textContent = `Drilling your most-missed kana (${deckUnits.length} in this deck).`;
      }

      state.deck = shuffle(deckUnits.map(u => ({
        type:"char",
        kana: u,
        accepted: [KANA_MAP.get(u)],
        meaning: /[ぁ-ゖゔ]/.test(u) ? "Hiragana character" : "Katakana character",
        script: /[ぁ-ゖゔ]/.test(u) ? "hira" : "kata",
      })));
    } else {
      const allowed = (u) => {
        if (state.settings.script === "both") return true;
        if (state.settings.script === "hira") return /[ぁ-ゖゔ]/.test(u);
        if (state.settings.script === "kata") return /[ァ-ヶヴー]/.test(u);
        return true;
      };
      let deckUnits = state.recentUnits.filter(allowed).slice(0, 60);
      if (deckUnits.length < 10){
        const allUnits = eligibleTroubleUnits();
        deckUnits = shuffle(allUnits).slice(0, 30);
        els.modeHint.textContent = "No recent trouble kana yet — showing random kana for quick practice.";
      } else {
        els.modeHint.textContent = `Redoing your last ${deckUnits.length} missed kana.`;
      }
      state.deck = shuffle(deckUnits.map(u => ({
        type:"char",
        kana: u,
        accepted: [KANA_MAP.get(u)],
        meaning: /[ぁ-ゖゔ]/.test(u) ? "Hiragana character" : "Katakana character",
        script: /[ぁ-ゖゔ]/.test(u) ? "hira" : "kata",
      })));
    }

    if (resetIndex) state.idx = 0;
    state.current = null;
    state.checked = false;

    nextItem(true);
    updateStatsUI();
  }

  function rebuildPool(){
    updateSentenceCategoryUI();
    buildPool();
    applyMode(true);
  }

  function nextItem(isFirst=false){
    state.checked = false;

    if (state.deck.length === 0){
      state.deck = shuffle(state.pool.length ? state.pool : buildItems(state.settings));
      state.idx = 0;
    }
    if (state.idx >= state.deck.length){
      state.deck = shuffle(state.deck);
      state.idx = 0;
    }

    // Sentence cooldown: avoid showing sentences that were displayed very recently.
    // We scan forward through the deck (wrapping if needed) to find a non-cooldown sentence.
    let candidate = null;
    const maxScan = Math.max(1, state.deck.length);
    for (let tries = 0; tries < maxScan; tries++){
      if (state.idx >= state.deck.length){
        state.deck = shuffle(state.deck);
        state.idx = 0;
      }

      const c = state.deck[state.idx++];
      if (c?.type === "sentence" && isSentenceInCooldown(c.kana)){
        continue;
      }
      candidate = c;
      break;
    }
    state.current = candidate || state.deck[Math.max(0, Math.min(state.idx - 1, state.deck.length - 1))];

    if (state.current?.type === "sentence") rememberRecentSentence(state.current.kana);
    els.prompt.textContent = formatKanaForDisplay(state.current.kana, state.current.type, getPrimaryExpected(state.current));
    els.answer.value = "";
    els.answer.focus();

    els.typeMeta.textContent = `Type: ${state.current.type}`;
    els.indexMeta.textContent = `Card ${state.idx} / ${state.deck.length}`;

    els.result.innerHTML = isFirst
      ? `<p class="mini">Press <b>Enter</b> to check. Press <b>Enter</b> again for next.</p>`
      : `<p class="mini">New card. <b>Enter</b> to check.</p>`;
  }

  function showResult({ status, title, meaning, romaji, noteHtml }){
    const meaningText = meaning && meaning.trim()
      ? meaning
      : (state.current?.type === "char"
        ? (state.current?.meaning || "Kana character")
        : (state.current?.type === "word"
          ? "Kana word"
          : "Kana sentence"));

    const def = `
      <div class="defBox">
        <p class="defLabel">Meaning</p>
        <p class="defText">${escapeHtml(meaningText)}</p>
      </div>`;

    const r = romaji ? `<p class="mini"><b>Romaji:</b> <span class="mono">${escapeHtml(romaji)}</span></p>` : "";
    els.result.innerHTML = `
      <p class="status ${status}">${title}</p>
      ${def}
      ${r}
      ${noteHtml || ""}
    `;
  }

  function addRecentUnit(unit){
    state.recentUnits = state.recentUnits.filter(x => x !== unit);
    state.recentUnits.unshift(unit);
    if (state.recentUnits.length > 120) state.recentUnits = state.recentUnits.slice(0,120);
    saveJson(LS_KEY_RECENT_UNITS, state.recentUnits);
  }

  function removeRecentUnit(unit){
    const before = state.recentUnits.length;
    state.recentUnits = state.recentUnits.filter(x => x !== unit);
    if (state.recentUnits.length !== before) saveJson(LS_KEY_RECENT_UNITS, state.recentUnits);
  }

  function resetUnitToReleaseFromTrouble(stat){
    stat.seen = 0;
    stat.wrong = 0;
    stat.streak = 0;
    stat.last = Date.now();
  }

  function updateUnitStatsFromAttempt(item, userInput, verdict){
    const { seen, wrong } = attributeUnits(item.kana, userInput);

    // Seen always increments
    for (const u of seen){
      const key = unitKey(u);
      const st = ensureUnitStat(state.unitStats, key);
      st.seen += 1;
      st.last = Date.now();

      // Streak logic:
      // - good/almost => correct streak +1
      // - bad => reset streak
      if (verdict === "good" || verdict === "almost"){
        st.streak += 1;

        // Release rule: 3 correct in a row removes from Trouble by resetting that unit’s trouble stats
        if (st.streak >= 3 && troubleScoreUnit(st) > 0){
          resetUnitToReleaseFromTrouble(st);
          removeRecentUnit(u);
        }
      } else {
        st.streak = 0;
      }
    }

    if (verdict === "bad"){
      // Wrong increments only for those units attributed as wrong
      for (const u of wrong){
        const key = unitKey(u);
        const st = ensureUnitStat(state.unitStats, key);
        st.wrong += 1;
        st.last = Date.now();
        st.streak = 0;
        addRecentUnit(u);
      }
    }

    saveJson(LS_KEY_UNIT_STATS, state.unitStats);
  }

  function checkAnswer(){
    if (!state.current || state.checked) return;

    const item = state.current;
    const userRaw = els.answer.value;

    const primary = (item.accepted && item.accepted[0])
      ? item.accepted[0]
      : unitsToRomaji(kanaToUnits(item.kana));

    const accepted = [primary, primary.replaceAll("wa","ha")];

    // Trouble count before
    const troubleBefore = getTroubleList();
    const troubleBeforeKeys = new Set(troubleBefore.map(x => x.key));
    const beforeCount = troubleBefore.length;

    const result = isCorrectDetailed(userRaw, accepted, state.settings, item.kana);

    state.stats.seen += 1;

    const userNorm = stripSpaces(clean(userRaw));
    const primaryNorm = stripSpaces(clean(primary));

    if (result.verdict === "good"){
      state.stats.correct += 1;
      state.stats.streak += 1;
      updateUnitStatsFromAttempt(item, userRaw, "good");

      showResult({
        status: "good",
        title: "Correct ✅",
        meaning: item.meaning || "",
        romaji: primary
      });
    } else if (result.verdict === "almost"){
      state.stats.almost += 1;
      state.stats.streak += 1;
      updateUnitStatsFromAttempt(item, userRaw, "almost");

      const yourHtml = highlightUserDiffHtml(userRaw, primary);
      const expHtml = highlightExpectedDiffHtml(userRaw, primary);

      showResult({
        status: "almost",
        title: "Almost ✅",
        meaning: item.meaning || "",
        romaji: primary,
        noteHtml: `
          <p class="mini"><b>Your answer (normalized):</b> <span class="mono">${yourHtml || escapeHtml(userNorm || "—")}</span></p>
          <p class="mini"><b>Expected:</b> <span class="mono">${expHtml || escapeHtml(primaryNorm)}</span></p>
          <p class="mini">${escapeHtml(result.reason || describeDiff(userRaw, primary) || "Close variant.")}</p>
        `
      });
    } else {
      state.stats.wrong += 1;
      state.stats.streak = 0;
      updateUnitStatsFromAttempt(item, userRaw, "bad");

      const yourHtml = highlightUserDiffHtml(userRaw, primary);

      showResult({
        status: "bad",
        title: result.reason === "No answer entered." ? "No answer ❗" : "Incorrect ❌",
        meaning: item.meaning || "",
        romaji: primary,
        noteHtml: `
          <p class="mini"><b>Your answer (normalized):</b> <span class="mono">${yourHtml || escapeHtml(userNorm || "—")}</span></p>
          <p class="mini">${escapeHtml(describeDiff(userRaw, primary) || "")}</p>
        `
      });
    }

    // Trouble count after + pulse
    const troubleAfter = getTroubleList();
    const afterCount = troubleAfter.length;
    const delta = afterCount - beforeCount;

    if (delta !== 0){
      pulseTrouble(delta);
    } else {
      // Still provide a subtle “release” message when a unit hits 3 streak even if count unchanged due to script filter,
      // but we keep it simple to avoid noise.
    }

    state.checked = true;
    updateStatsUI();
  }

  function reveal(){
    if (!state.current) return;
    const item = state.current;
    const primary = (item.accepted && item.accepted[0])
      ? item.accepted[0]
      : unitsToRomaji(kanaToUnits(item.kana));

    showResult({
      status: "almost",
      title: "Revealed 👀",
      meaning: item.meaning || "",
      romaji: primary
    });
    state.checked = true;
  }

  function next(){ nextItem(false); }

  function resetSession(){
    state.stats = { correct:0, wrong:0, almost:0, seen:0, streak:0 };
    updateStatsUI();
    els.result.innerHTML = `<p class="mini">Session stats reset.</p>`;
  }

  function resetHistory(){
    state.unitStats = {};
    state.recentUnits = [];
    saveJson(LS_KEY_UNIT_STATS, state.unitStats);
    saveJson(LS_KEY_RECENT_UNITS, state.recentUnits);
    updateStatsUI();
    els.modeHint.textContent = "Learning history cleared. Trouble kana will repopulate as you practise.";
  }

  function openDrawer(){
    els.drawer.classList.add("open");
    els.drawerOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    els.drawer.classList.remove("open");
    els.drawerOverlay.classList.remove("open");
    document.body.style.overflow = "";
    els.answer.focus();
  }
  function openHelp(){
    els.helpModal.classList.add("open");
    els.helpOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeHelp(){
    saveJson(LS_KEY_TUTORIAL, true);
    els.helpModal.classList.remove("open");
    els.helpOverlay.classList.remove("open");
    document.body.style.overflow = "";
    els.answer.focus();
  }

  /* -----------------------------
     Changelog (opened via version tag)
     ----------------------------- */

  const CHANGELOG = [
    
    {
      version: "v0.8.5",
      date: "2026-02-23",
      items: [
        "Improved iOS Home Screen (standalone) display: enabled translucent status bar and ensured content respects the safe-area inset so the top bar never sits under the notch.",
      ]
    },
    
    {
      version: "v0.8.4",
      date: "2026-02-23",
      items: [
        "Disabled OS-level autocorrect, autocapitalisation, autocomplete and spellcheck on the romaji input field to prevent unintended input changes on mobile.",
      ]
    },
{
      version: "v0.8.3",
      date: "2026-02-23",
      items: [
        "Fixed “Show spaces between words” for sentences: spacing is now derived from the expected romaji (word boundaries) rather than particle heuristics, preventing false splits like わかりません → わか りません.",
        "Kana display still adds a subtle gap after punctuation when Show spaces is enabled.",
      ]
    },
    {
      version: "v0.8.2",
      date: "2026-02-23",
      items: [
        "Reduced the visual size of word-spacing when “Show spaces between words” is enabled.",
        "Refined Welcome copy: new intro message, reordered Answer checking points, clearer Trouble kana + Progress explanations.",
        "Welcome modal now scrolls on small screens; close (X) button slightly reduced.",
      ]
    },
    {
      version: "v0.8.1",
      date: "2026-02-23",
      items: [
        "Refined sentence population (frame-based whitelisted variants approach) and updated related UI language.",
        "Added “Show spaces between words” option and updated spacing rules for scoring.",
        "Tidied Welcome panel and other small UI refinements."
      ]
    }
  ];

  function renderChangelog(){
    if (!els.changelogContent) return;
    const html = CHANGELOG.map(entry => {
      const items = (entry.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
      return `
        <div class="helpSection" style="margin:0 0 10px">
          <h4 style="margin:0 0 6px">${escapeHtml(entry.version)} <span class="mini" style="margin-left:8px">${escapeHtml(entry.date)}</span></h4>
          <ul style="margin-top:6px">${items}</ul>
        </div>
      `;
    }).join("");
    els.changelogContent.innerHTML = html || "<p class=\"mini\">No changelog entries yet.</p>";
  }

  function openChangelog(){
    if (!els.changelogModal || !els.changelogOverlay) return;
    renderChangelog();
    els.changelogModal.classList.add("open");
    els.changelogOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeChangelog(){
    if (!els.changelogModal || !els.changelogOverlay) return;
    els.changelogModal.classList.remove("open");
    els.changelogOverlay.classList.remove("open");
    document.body.style.overflow = "";
    els.answer.focus();
  }


  function openTroubleModal(){
    if (!els.troubleModal || !els.troubleOverlay) return;

    const rows = getTroubleList();
    if (els.troubleList){
      if (!rows.length){
        els.troubleList.innerHTML = `
          <div class="troubleEmpty">
            <p class="mini" style="margin:0 0 6px"><b>No trouble kana right now.</b></p>
            <p class="mini" style="margin:0">Keep practising — items you miss repeatedly will appear here.</p>
          </div>
        `;
      } else {
        const html = rows.map(r => {
          const acc = r.seen ? Math.round(((r.seen - r.wrong) / r.seen) * 100) : 0;
          return `
            <div class="troubleRow">
              <div class="troubleKana">${escapeHtml(r.unit)}</div>
              <div class="troubleMeta">
                <div><span class="troublePill">wrong</span> <b>${r.wrong}</b></div>
                <div><span class="troublePill">seen</span> <b>${r.seen}</b></div>
                <div><span class="troublePill">acc</span> <b>${acc}%</b></div>
              </div>
            </div>
          `;
        }).join("");
        els.troubleList.innerHTML = html;
      }
    }

    els.troubleModal.classList.add("open");
    els.troubleOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeTroubleModal(){
    if (!els.troubleModal || !els.troubleOverlay) return;
    els.troubleModal.classList.remove("open");
    els.troubleOverlay.classList.remove("open");
    document.body.style.overflow = "";
    els.answer.focus();
  }

  function handleTroubleCardActivate(){
    openTroubleModal();
  }

  els.checkBtn.addEventListener("click", checkAnswer);
  els.revealBtn.addEventListener("click", reveal);
  els.nextBtn.addEventListener("click", next);

  els.menuBtn.addEventListener("click", openDrawer);
  els.closeDrawerBtn.addEventListener("click", closeDrawer);
  els.drawerOverlay.addEventListener("click", closeDrawer);

  els.helpBtn.addEventListener("click", openHelp);
  els.closeHelpBtn.addEventListener("click", closeHelp);
  els.helpOverlay.addEventListener("click", closeHelp);

  els.modeSelect.addEventListener("change", () => applyMode(true));

  [els.mixChars, els.mixWords, els.mixSentences, els.allowLenient, els.allowAlmost, els.scriptSelect, els.difficultySelect]
    .forEach(el => el.addEventListener("change", rebuildPool));

  (els.sentenceCatChecks || []).forEach(cb => cb.addEventListener("change", rebuildPool));

  els.resetSessionBtn.addEventListener("click", resetSession);
  els.resetHistoryBtn.addEventListener("click", resetHistory);

  if (els.kanaFontSerif){
    els.kanaFontSerif.addEventListener("change", setKanaFontFromToggle);
  }
  if (els.showSpaces){
    els.showSpaces.addEventListener("change", setShowSpacesFromToggle);
  }

  // Trouble modal events
  if (els.troubleCard){
    els.troubleCard.addEventListener("click", handleTroubleCardActivate);
    els.troubleCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        handleTroubleCardActivate();
      }
    });
  }
  if (els.closeTroubleBtn) els.closeTroubleBtn.addEventListener("click", closeTroubleModal);
  if (els.troubleOverlay) els.troubleOverlay.addEventListener("click", closeTroubleModal);

  // Changelog modal events
  if (els.versionTag){
    els.versionTag.addEventListener("click", openChangelog);
    els.versionTag.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openChangelog();
      }
    });
  }
  if (els.closeChangelogBtn) els.closeChangelogBtn.addEventListener("click", closeChangelog);
  if (els.changelogOverlay) els.changelogOverlay.addEventListener("click", closeChangelog);


  function handleKey(e){
    const drawerOpen = els.drawer.classList.contains("open");
    const helpOpen = els.helpModal.classList.contains("open");
    const troubleOpen = els.troubleModal && els.troubleModal.classList.contains("open");
    const changelogOpen = els.changelogModal && els.changelogModal.classList.contains("open");

    if (drawerOpen || helpOpen || troubleOpen || changelogOpen) {
      if (e.key === "Escape") {
        if (helpOpen) closeHelp();
        else if (troubleOpen) closeTroubleModal();
        else if (changelogOpen) closeChangelog();
        else closeDrawer();
        e.preventDefault();
      }
      return;
    }
    if (e.key === "Escape") { next(); e.preventDefault(); return; }
    if (e.key === "Enter" && e.shiftKey) { reveal(); e.preventDefault(); return; }
    if (e.key === "Enter") {
      if (state.checked) next();
      else checkAnswer();
      e.preventDefault();
    }
  }

  els.answer.addEventListener("keydown", handleKey);
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    const inInput = tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable;
    if (inInput) return;
    handleKey(e);
  });

  function setInitialPills(){
    updateSentenceCategoryUI();
    buildPool();
    applyMode(true);
    updateStatsUI();
  }

  applyKanaFont();
  applyShowSpaces();
  setInitialPills();

  const tutorialSeen = !!loadJson(LS_KEY_TUTORIAL, false);
  if (!tutorialSeen) openHelp();
})();