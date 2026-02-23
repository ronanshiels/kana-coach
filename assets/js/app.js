// App wiring + UI events (ES module)
import { KANA_MAP, kanaToUnits, unitsToRomaji } from "./kana-map.js";
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
    if (!stats[key]) stats[key] = { seen:0, wrong:0, last:0 };
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
      if (score > 0) out.push({ unit:u, score, seen:stat.seen, wrong:stat.wrong });
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

    kanaFont: loadJson(LS_KEY_KANA_FONT, "rounded"),
  };

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

  function getSettings(){
    return {
      mixChars: els.mixChars.checked,
      mixWords: els.mixWords.checked,
      mixSentences: els.mixSentences.checked,
      lenient: els.allowLenient.checked,
      allowAlmost: els.allowAlmost.checked,
      script: els.scriptSelect.value,
      difficulty: els.difficultySelect.value,
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

  function countTroubleKana(){
    const eligibleUnits = buildCharItems(state.settings.script, "spicy").map(x => x.kana);
    return getTroubleUnitKeysFromPool(eligibleUnits, state.unitStats).length;
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
  }

  function applyMode(resetIndex){
    state.mode = els.modeSelect.value;

    if (state.mode === "normal"){
      state.deck = shuffle(state.pool);
      els.modeHint.textContent = "A mix of what you’ve enabled in settings.";
    } else if (state.mode === "trouble"){
      const allUnits = buildCharItems(state.settings.script, "spicy").map(x => x.kana);
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
        const allUnits = buildCharItems(state.settings.script, "spicy").map(x => x.kana);
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

    state.current = state.deck[state.idx++];
    els.prompt.textContent = state.current.kana;
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
          : "—");

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

  function updateUnitStatsFromAttempt(item, userInput, verdict){
    const { seen, wrong } = attributeUnits(item.kana, userInput);

    for (const u of seen){
      const key = unitKey(u);
      const st = ensureUnitStat(state.unitStats, key);
      st.seen += 1;
      st.last = Date.now();
    }

    if (verdict === "bad"){
      for (const u of wrong){
        const key = unitKey(u);
        const st = ensureUnitStat(state.unitStats, key);
        st.wrong += 1;
        st.last = Date.now();
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
    // Mark tutorial as seen on close (no separate "Got it" button)
    saveJson(LS_KEY_TUTORIAL, true);
    els.helpModal.classList.remove("open");
    els.helpOverlay.classList.remove("open");
    document.body.style.overflow = "";
    els.answer.focus();
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

  els.resetSessionBtn.addEventListener("click", resetSession);
  els.resetHistoryBtn.addEventListener("click", resetHistory);

  if (els.kanaFontSerif){
    els.kanaFontSerif.addEventListener("change", setKanaFontFromToggle);
  }

  function handleKey(e){
    const drawerOpen = els.drawer.classList.contains("open");
    const helpOpen = els.helpModal.classList.contains("open");
    if (drawerOpen || helpOpen) {
      if (e.key === "Escape") {
        if (helpOpen) closeHelp();
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
    buildPool();
    applyMode(true);
    updateStatsUI();
  }

  // Apply saved prompt font preference early
  applyKanaFont();

  setInitialPills();

  const tutorialSeen = !!loadJson(LS_KEY_TUTORIAL, false);
  if (!tutorialSeen) openHelp();
})();