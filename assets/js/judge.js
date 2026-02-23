// Answer normalization, leniency rules, diffing + scoring (ES module)
import { KANA_MAP, kanaToUnits, leadingConsonant } from "./kana-map.js";

const clean = (s) => (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
const stripSpaces = (s) => s.replace(/\s+/g, "");
function expandLenientEquivalents(str){
    const base = stripSpaces(clean(str));
    const set = new Set([base]);

    const swaps = [
      ["shi","si"], ["chi","ti"], ["tsu","tu"], ["fu","hu"], ["ji","zi"],
      ["ja","zya"], ["ju","zyu"], ["jo","zyo"],
      ["sha","sya"], ["shu","syu"], ["sho","syo"],
      ["cha","tya"], ["chu","tyu"], ["cho","tyo"],
    ];

    for (const [a,b] of swaps) {
      for (const v of Array.from(set)) {
        if (v.includes(a)) set.add(v.replaceAll(a,b));
        if (v.includes(b)) set.add(v.replaceAll(b,a));
      }
    }

    const patterns = [
      { std:"cha", almost:["chya","cya"] },
      { std:"chu", almost:["chyu","cyu"] },
      { std:"cho", almost:["chyo","cyo"] },
      { std:"sha", almost:["shya","sya"] },
      { std:"shu", almost:["shyu","syu"] },
      { std:"sho", almost:["shyo","syo"] },
      { std:"ja",  almost:["jya","zya"] },
      { std:"ju",  almost:["jyu","zyu"] },
      { std:"jo",  almost:["jyo","zyo"] },
    ];
    for (const p of patterns){
      for (const v of Array.from(set)){
        if (v.includes(p.std)) for (const a of p.almost) set.add(v.replaceAll(p.std, a));
        for (const a of p.almost) if (v.includes(a)) set.add(v.replaceAll(a, p.std));
      }
    }

    for (const v of Array.from(set)) {
      set.add(v.replaceAll("ou","oo"));
      set.add(v.replaceAll("oo","ou"));
      set.add(v.replaceAll("aa","a"));
      set.add(v.replaceAll("ii","i"));
      set.add(v.replaceAll("uu","u"));
      set.add(v.replaceAll("ee","e"));
      set.add(v.replaceAll("oo","o"));
    }

    return set;
  }
function escapeHtml(s){
    return (s ?? "").toString()
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

/* --- Diff helpers (for bolding mistakes + specific Almost feedback) --- */
function highlightUserDiffHtml(userRaw, expectedRaw){
    const u = stripSpaces(clean(userRaw));
    const e = stripSpaces(clean(expectedRaw));
    const max = Math.max(u.length, e.length);
    let html = "";
    for (let i=0;i<max;i++){
      const uc = u[i] ?? "";
      const ec = e[i] ?? "";
      const wrong = (uc !== ec);
      if (!uc) continue;
      html += wrong ? `<b>${escapeHtml(uc)}</b>` : escapeHtml(uc);
    }
    return html || escapeHtml(u || "—");
  }

function highlightExpectedDiffHtml(userRaw, expectedRaw){
    const u = stripSpaces(clean(userRaw));
    const e = stripSpaces(clean(expectedRaw));
    const max = Math.max(u.length, e.length);
    let html = "";
    for (let i=0;i<max;i++){
      const uc = u[i] ?? "";
      const ec = e[i] ?? "";
      const wrong = (uc !== ec);
      if (!ec) continue;
      html += wrong ? `<b>${escapeHtml(ec)}</b>` : escapeHtml(ec);
    }
    return html || escapeHtml(e || "—");
  }

function describeDiff(userRaw, expectedRaw){
    const u = stripSpaces(clean(userRaw));
    const e = stripSpaces(clean(expectedRaw));
    if (!u || !e) return "";

    const diffs = [];
    const max = Math.max(u.length, e.length);
    for (let i=0;i<max;i++){
      const uc = u[i] ?? "∅";
      const ec = e[i] ?? "∅";
      if (uc !== ec) diffs.push({ i, got: uc, exp: ec });
      if (diffs.length >= 6) break;
    }

    if (!diffs.length) return "";

    if (diffs.length === 1){
      const d = diffs[0];
      if (d.got === "∅") return `You missed a character at position ${d.i+1}: expected “${d.exp}”.`;
      if (d.exp === "∅") return `You added an extra character at position ${d.i+1}: “${d.got}”.`;
      return `At position ${d.i+1}: expected “${d.exp}”, you typed “${d.got}”.`;
    }

    const parts = diffs.map(d => {
      if (d.got === "∅") return `pos ${d.i+1}: missing “${d.exp}”`;
      if (d.exp === "∅") return `pos ${d.i+1}: extra “${d.got}”`;
      return `pos ${d.i+1}: “${d.got}”→“${d.exp}”`;
    });
    return `Differences: ${parts.join(", ")}.`;
  }

function addWoParticleVariants(acceptedList, kana){
    const accepted = Array.isArray(acceptedList) ? acceptedList.slice() : [acceptedList];
    const hasWoParticle = (kana || "").includes("を") || (kana || "").includes("ヲ");
    if (!hasWoParticle) return accepted;

    for (const a of accepted.slice()){
      const base = clean(a);
      const alt1 = base.replace(/\bo\b/g, "wo");
      const alt2 = base.replace(/\bwo\b/g, "o");
      if (alt1 !== base) accepted.push(alt1);
      if (alt2 !== base) accepted.push(alt2);
    }

    if (kana === "を" || kana === "ヲ") accepted.push("wo");

    return Array.from(new Set(accepted));
  }

function classifyMatch(userInput, primary, settings, itemKana){
    const user = stripSpaces(clean(userInput));
    const prim = stripSpaces(clean(primary));
    if (!user) return { verdict:"bad", reason:"No answer entered." };
    if (user === prim) return { verdict:"good" };
    if (!settings.lenient) return { verdict:"bad" };

    const primSet = new Set([prim, ...expandLenientEquivalents(prim)]);

    if ((itemKana || "").includes("を") || (itemKana || "").includes("ヲ")) {
      const primWithSpaces = clean(primary);
      const tokenWo = stripSpaces(primWithSpaces.replace(/\bo\b/g, "wo"));
      const tokenO  = stripSpaces(primWithSpaces.replace(/\bwo\b/g, "o"));
      if (tokenWo) primSet.add(tokenWo);
      if (tokenO) primSet.add(tokenO);
      if ((itemKana === "を" || itemKana === "ヲ")) primSet.add("wo");
    }

    if (primSet.has(user)) {
      if (settings.allowAlmost) {
        const yReasonPairs = [
          ["cha","cya"],["cha","chya"],["chu","cyu"],["chu","chyu"],["cho","cyo"],["cho","chyo"],
          ["sha","sya"],["sha","shya"],["shu","syu"],["shu","shyu"],["sho","syo"],["sho","shyo"],
          ["ja","jya"],["ju","jyu"],["jo","jyo"],
        ];
        for (const [std, alt] of yReasonPairs){
          if (prim.includes(std) && user.includes(alt)) {
            return { verdict:"almost", reason:`You wrote “${alt}” where the standard spelling is “${std}”. ${describeDiff(userInput, primary)}`.trim() };
          }
        }

        const swapped = prim.replaceAll("wa","ha");
        if (user === swapped) {
          return { verdict:"almost", reason:`You typed “ha” for the topic particle “は”. In romaji we usually write it as “wa”. ${describeDiff(userInput, primary)}`.trim() };
        }

        if ((itemKana || "").includes("を") || (itemKana || "").includes("ヲ")) {
          const primWithSpaces = clean(primary);
          const asWo = stripSpaces(primWithSpaces.replace(/\bo\b/g, "wo"));
          const asO  = stripSpaces(primWithSpaces.replace(/\bwo\b/g, "o"));
          if (user === asWo || user === asO || ((itemKana === "を" || itemKana === "ヲ") && user === "wo")) {
            return { verdict:"almost", reason:`For the object particle “を”, “o” is the common standard (though “wo” is also seen). ${describeDiff(userInput, primary)}`.trim() };
          }
        }

        return { verdict:"almost", reason:`Close variant. ${describeDiff(userInput, primary)}`.trim() };
      }
      return { verdict:"good" };
    }
    return { verdict:"bad" };
  }

function isCorrectDetailed(userInput, acceptedList, settings, itemKana){
    let accepted = Array.isArray(acceptedList) ? acceptedList : [acceptedList];
    accepted = addWoParticleVariants(accepted, itemKana);

    const primary = accepted[0] ?? "";
    const user = stripSpaces(clean(userInput));
    if (!user) return { verdict:"bad", primary, accepted, reason:"No answer entered." };

    const primaryNorm = stripSpaces(clean(primary));
    if (user === primaryNorm) return { verdict:"good", primary, accepted };

    for (let i=1;i<accepted.length;i++){
      const a = stripSpaces(clean(accepted[i]));
      if (user === a) {
        if (settings.allowAlmost) {
          return {
            verdict:"almost",
            primary,
            accepted,
            reason: `You entered an accepted alternate spelling (“${stripSpaces(clean(accepted[i]))}”), but the standard we’re aiming for is “${primaryNorm}”. ${describeDiff(userInput, primary)}`.trim()
          };
        }
        return { verdict:"good", primary, accepted };
      }
    }

    const classified = classifyMatch(userInput, primary, settings, itemKana);
    if (classified.verdict !== "bad") return { verdict: classified.verdict, primary, accepted, reason: classified.reason };
    return { verdict:"bad", primary, accepted };
  }

function attributeUnits(itemKana, userRomajiRaw){
    const units = kanaToUnits(itemKana);
    const expectedPerUnit = [];
    for (let i=0;i<units.length;i++){
      const u = units[i];
      const v = KANA_MAP.get(u);
      if (!v) { expectedPerUnit.push(""); continue; }
      if (v === "(sokuon)"){
        const next = units[i+1];
        const nextRomaji = next ? (KANA_MAP.get(next) || "") : "";
        expectedPerUnit.push(leadingConsonant(nextRomaji) || "");
        continue;
      }
      if (v === "(long)"){ expectedPerUnit.push("(long)"); continue; }
      expectedPerUnit.push(v);
    }

    const user = stripSpaces(clean(userRomajiRaw));
    let cursor = 0;
    const wrongUnits = new Set();
    const seenUnits = new Set();

    const unitVariants = expectedPerUnit.map(v => {
      if (v === "(long)" || !v) return new Set([""]);
      return expandLenientEquivalents(v);
    });

    for (let i=0;i<units.length;i++){
      const u = units[i];
      const v = expectedPerUnit[i];
      if (v === "(long)" || !v) continue;

      seenUnits.add(u);

      const candidates = Array.from(unitVariants[i]).sort((a,b)=>b.length-a.length);
      let matched = null;
      for (const c of candidates){
        if (!c) continue;
        if (user.slice(cursor, cursor+c.length) === c) { matched = c; break; }
      }
      if (matched) cursor += matched.length;
      else {
        wrongUnits.add(u);
        if (cursor < user.length) cursor += 1;
      }
    }

    const filterKana = (x) => KANA_MAP.has(x) && KANA_MAP.get(x) !== "(sokuon)" && KANA_MAP.get(x) !== "(long)";
    return {
      seen: Array.from(seenUnits).filter(filterKana),
      wrong: Array.from(wrongUnits).filter(filterKana),
    };
  }

export {
  clean,
  stripSpaces,
  expandLenientEquivalents,
  escapeHtml,
  highlightUserDiffHtml,
  highlightExpectedDiffHtml,
  describeDiff,
  isCorrectDetailed,
  attributeUnits,
};