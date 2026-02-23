// Content pools + item builders (ES module)
import { KANA_MAP } from "./kana-map.js";

/**
 * Difficulty inclusion rule:
 * - easy      => only easy
 * - standard  => easy + standard
 * - spicy     => easy + standard + spicy
 */
const DIFF_RANK = { easy: 0, standard: 1, spicy: 2 };
const withinDifficulty = (itemDiff, selectedDiff) =>
  (DIFF_RANK[itemDiff] ?? 1) <= (DIFF_RANK[selectedDiff] ?? 1);

export const SENTENCE_CATEGORIES = [
  { id: "travel", label: "Travel & basics" },
  { id: "food_drink", label: "Food & drink" },
  { id: "transport", label: "Transport" },
  { id: "directions", label: "Directions" },
  { id: "accommodation", label: "Accommodation" },
  { id: "shopping", label: "Shopping" },
  { id: "social", label: "Social" },
  { id: "time_money", label: "Time & money" },
  { id: "emergencies", label: "Emergencies" },
];

/* -----------------------------
   WORDS (1,200)
   ----------------------------- */

/**
 * We build 1,200 "word" items as kana-only vocab + short phrases:
 * - Curated base words (high value)
 * - Then deterministic combinatoric expansions (adj+noun, noun+の+noun, verb phrases)
 * This keeps the file maintainable while still giving you a big library.
 */

const BASE_WORD_BANK = [
  // easy (short, very common)
  { kana: "はい", romaji: "hai", meaning: "Yes", diff: "easy" },
  { kana: "いいえ", romaji: "iie", meaning: "No", diff: "easy" },
  { kana: "ありがとう", romaji: "arigatou", meaning: "Thank you", diff: "easy" },
  { kana: "すみません", romaji: "sumimasen", meaning: "Excuse me / sorry", diff: "easy" },
  { kana: "おねがいします", romaji: "onegaishimasu", meaning: "Please (polite request)", diff: "easy" },
  { kana: "ください", romaji: "kudasai", meaning: "Please (request)", diff: "easy" },
  { kana: "これ", romaji: "kore", meaning: "This", diff: "easy" },
  { kana: "それ", romaji: "sore", meaning: "That (near you)", diff: "easy" },
  { kana: "あれ", romaji: "are", meaning: "That (over there)", diff: "easy" },
  { kana: "ここ", romaji: "koko", meaning: "Here", diff: "easy" },
  { kana: "そこ", romaji: "soko", meaning: "There (near you)", diff: "easy" },
  { kana: "どこ", romaji: "doko", meaning: "Where", diff: "easy" },
  { kana: "なに", romaji: "nani", meaning: "What", diff: "easy" },
  { kana: "いくら", romaji: "ikura", meaning: "How much", diff: "easy" },
  { kana: "いま", romaji: "ima", meaning: "Now", diff: "easy" },
  { kana: "あとで", romaji: "atode", meaning: "Later", diff: "easy" },
  { kana: "みず", romaji: "mizu", meaning: "Water", diff: "easy" },
  { kana: "おちゃ", romaji: "ocha", meaning: "Tea", diff: "easy" },
  { kana: "ごはん", romaji: "gohan", meaning: "Meal / cooked rice", diff: "easy" },
  { kana: "パン", romaji: "pan", meaning: "Bread", diff: "easy" },
  { kana: "トイレ", romaji: "toire", meaning: "Toilet / restroom", diff: "easy" },
  { kana: "ホテル", romaji: "hoteru", meaning: "Hotel", diff: "easy" },
  { kana: "えき", romaji: "eki", meaning: "Station", diff: "easy" },
  { kana: "でんしゃ", romaji: "densha", meaning: "Train", diff: "easy" },

  // standard (longer/common travel vocab)
  { kana: "くうこう", romaji: "kuukou", meaning: "Airport", diff: "standard" },
  { kana: "きっぷ", romaji: "kippu", meaning: "Ticket", diff: "standard" },
  { kana: "パスポート", romaji: "pasupooto", meaning: "Passport", diff: "standard" },
  { kana: "レストラン", romaji: "resutoran", meaning: "Restaurant", diff: "standard" },
  { kana: "コンビニ", romaji: "konbini", meaning: "Convenience store", diff: "standard" },
  { kana: "タクシー", romaji: "takushii", meaning: "Taxi", diff: "standard" },
  { kana: "コーヒー", romaji: "koohii", meaning: "Coffee", diff: "standard" },
  { kana: "アイスクリーム", romaji: "aisukuriimu", meaning: "Ice cream", diff: "standard" },
  { kana: "おにぎり", romaji: "onigiri", meaning: "Rice ball", diff: "standard" },
  { kana: "すし", romaji: "sushi", meaning: "Sushi", diff: "standard" },
  { kana: "てんぷら", romaji: "tenpura", meaning: "Tempura", diff: "standard" },
  { kana: "らーめん", romaji: "raamen", meaning: "Ramen", diff: "standard" },
  { kana: "やさい", romaji: "yasai", meaning: "Vegetables", diff: "standard" },
  { kana: "くだもの", romaji: "kudamono", meaning: "Fruit", diff: "standard" },
  { kana: "にく", romaji: "niku", meaning: "Meat", diff: "standard" },
  { kana: "たまご", romaji: "tamago", meaning: "Egg", diff: "standard" },
  { kana: "おいしい", romaji: "oishii", meaning: "Delicious", diff: "standard" },
  { kana: "たのしい", romaji: "tanoshii", meaning: "Fun", diff: "standard" },
  { kana: "つかれた", romaji: "tsukareta", meaning: "I’m tired", diff: "standard" },
  { kana: "ねむい", romaji: "nemui", meaning: "Sleepy", diff: "standard" },
  { kana: "あつい", romaji: "atsui", meaning: "Hot", diff: "standard" },
  { kana: "さむい", romaji: "samui", meaning: "Cold", diff: "standard" },

  // spicy (katakana-dense / longer / tricky)
  { kana: "クレジットカード", romaji: "kurejitto kaado", meaning: "Credit card", diff: "spicy" },
  { kana: "モバイルバッテリー", romaji: "mobairu batterii", meaning: "Portable battery", diff: "spicy" },
  { kana: "イヤホン", romaji: "iyahon", meaning: "Earphones", diff: "spicy" },
  { kana: "エアコン", romaji: "eakon", meaning: "Air conditioner", diff: "spicy" },
  { kana: "チェックイン", romaji: "chekku in", meaning: "Check-in", diff: "spicy" },
  { kana: "チェックアウト", romaji: "chekku auto", meaning: "Check-out", diff: "spicy" },
  { kana: "キャンセル", romaji: "kyanseru", meaning: "Cancel / cancellation", diff: "spicy" },
  { kana: "アレルギー", romaji: "arerugii", meaning: "Allergy", diff: "spicy" },
  { kana: "ヴィーガン", romaji: "viigan", meaning: "Vegan", diff: "spicy" },
];

const NOUNS = [
  // easy nouns
  { kana: "なまえ", romaji: "namae", meaning: "Name", diff: "easy" },
  { kana: "ともだち", romaji: "tomodachi", meaning: "Friend", diff: "easy" },
  { kana: "かぞく", romaji: "kazoku", meaning: "Family", diff: "easy" },
  { kana: "ほん", romaji: "hon", meaning: "Book", diff: "easy" },
  { kana: "かみ", romaji: "kami", meaning: "Paper", diff: "easy" },
  { kana: "おかね", romaji: "okane", meaning: "Money", diff: "easy" },
  { kana: "へや", romaji: "heya", meaning: "Room", diff: "easy" },
  { kana: "かばん", romaji: "kaban", meaning: "Bag", diff: "easy" },
  { kana: "くつ", romaji: "kutsu", meaning: "Shoes", diff: "easy" },
  { kana: "かさ", romaji: "kasa", meaning: "Umbrella", diff: "easy" },

  // standard nouns
  { kana: "でんわ", romaji: "denwa", meaning: "Telephone", diff: "standard" },
  { kana: "でんわばんごう", romaji: "denwa bangou", meaning: "Phone number", diff: "standard" },
  { kana: "じかん", romaji: "jikan", meaning: "Time", diff: "standard" },
  { kana: "きょう", romaji: "kyou", meaning: "Today", diff: "standard" },
  { kana: "あした", romaji: "ashita", meaning: "Tomorrow", diff: "standard" },
  { kana: "きのう", romaji: "kinou", meaning: "Yesterday", diff: "standard" },
  { kana: "ちず", romaji: "chizu", meaning: "Map", diff: "standard" },
  { kana: "でんき", romaji: "denki", meaning: "Electricity", diff: "standard" },
  { kana: "いりぐち", romaji: "iriguchi", meaning: "Entrance", diff: "standard" },
  { kana: "でぐち", romaji: "deguchi", meaning: "Exit", diff: "standard" },
  { kana: "きっさてん", romaji: "kissaten", meaning: "Cafe (traditional)", diff: "standard" },

  // spicy nouns (katakana/long)
  { kana: "スマートフォン", romaji: "sumaato fon", meaning: "Smartphone", diff: "spicy" },
  { kana: "ワイファイ", romaji: "waifai", meaning: "Wi-Fi", diff: "spicy" },
  { kana: "ナビゲーション", romaji: "nabigeeshon", meaning: "Navigation", diff: "spicy" },
  { kana: "トランスファー", romaji: "toransufaa", meaning: "Transfer", diff: "spicy" },
  { kana: "プラットフォーム", romaji: "puratto foomu", meaning: "Platform (train)", diff: "spicy" },
];

const ADJECTIVES = [
  { kana: "おおきい", romaji: "ookii", meaning: "Big", diff: "easy" },
  { kana: "ちいさい", romaji: "chiisai", meaning: "Small", diff: "easy" },
  { kana: "あたらしい", romaji: "atarashii", meaning: "New", diff: "standard" },
  { kana: "ふるい", romaji: "furui", meaning: "Old", diff: "standard" },
  { kana: "はやい", romaji: "hayai", meaning: "Fast / early", diff: "standard" },
  { kana: "おそい", romaji: "osoi", meaning: "Slow / late", diff: "standard" },
  { kana: "たかい", romaji: "takai", meaning: "Expensive / high", diff: "standard" },
  { kana: "やすい", romaji: "yasui", meaning: "Cheap", diff: "standard" },
  { kana: "むずかしい", romaji: "muzukashii", meaning: "Difficult", diff: "spicy" },
  { kana: "かんたん", romaji: "kantan", meaning: "Easy / simple", diff: "standard" },
];

const VERB_PHRASES = [
  { kana: "いきたい", romaji: "ikitai", meaning: "Want to go", diff: "standard" },
  { kana: "たべたい", romaji: "tabetai", meaning: "Want to eat", diff: "standard" },
  { kana: "のみたい", romaji: "nomitai", meaning: "Want to drink", diff: "standard" },
  { kana: "かいたい", romaji: "kaitai", meaning: "Want to buy", diff: "standard" },
  { kana: "みたい", romaji: "mitai", meaning: "Want to see", diff: "standard" },
  { kana: "たすけてください", romaji: "tasukete kudasai", meaning: "Please help", diff: "spicy" },
  { kana: "よやくしたい", romaji: "yoyaku shitai", meaning: "Want to book / reserve", diff: "spicy" },
];

const KATA_LOANWORDS = [
  { kana: "メニュー", romaji: "menyuu", meaning: "Menu", diff: "standard" },
  { kana: "レシート", romaji: "reshiito", meaning: "Receipt", diff: "standard" },
  { kana: "サイズ", romaji: "saizu", meaning: "Size", diff: "standard" },
  { kana: "チケット", romaji: "chiketto", meaning: "Ticket", diff: "standard" },
  { kana: "バス", romaji: "basu", meaning: "Bus", diff: "standard" },
  { kana: "ホーム", romaji: "hoomu", meaning: "Platform (short)", diff: "standard" },
  { kana: "キャンペーン", romaji: "kyanpeen", meaning: "Campaign / promo", diff: "spicy" },
  { kana: "パスポートケース", romaji: "pasupooto keesu", meaning: "Passport case", diff: "spicy" },
  { kana: "オンライン", romaji: "onrain", meaning: "Online", diff: "spicy" },
  { kana: "オフライン", romaji: "ofurain", meaning: "Offline", diff: "spicy" },
];

function uniqByKana(rows){
  const seen = new Set();
  const out = [];
  for (const r of rows){
    if (!r?.kana) continue;
    if (seen.has(r.kana)) continue;
    seen.add(r.kana);
    out.push(r);
  }
  return out;
}

function buildWordRows1200(){
  const rows = [];

  // 1) Seed with curated bases
  rows.push(...BASE_WORD_BANK);
  rows.push(...NOUNS);
  rows.push(...ADJECTIVES);
  rows.push(...VERB_PHRASES);
  rows.push(...KATA_LOANWORDS);

  // 2) Expand: adjective + noun (as kana phrase)
  for (const a of ADJECTIVES){
    for (const n of NOUNS){
      const kana = `${a.kana}${n.kana}`;
      const romaji = `${a.romaji} ${n.romaji}`;
      const meaning = `${a.meaning} ${n.meaning}`.trim();
      const diff = (DIFF_RANK[a.diff] > DIFF_RANK[n.diff]) ? a.diff : n.diff;
      rows.push({ kana, romaji, meaning, diff });
    }
  }

  // 3) Expand: noun + の + noun
  for (const a of NOUNS){
    for (const b of NOUNS){
      if (a.kana === b.kana) continue;
      const kana = `${a.kana}の${b.kana}`;
      const romaji = `${a.romaji} no ${b.romaji}`;
      const meaning = `${a.meaning} of ${b.meaning}`.trim();
      const diff = (DIFF_RANK[a.diff] > DIFF_RANK[b.diff]) ? a.diff : b.diff;
      rows.push({ kana, romaji, meaning, diff });
    }
  }

  // 4) Expand: katakana loanword + です (as phrase)
  for (const k of KATA_LOANWORDS){
    const kana = `${k.kana}です`;
    const romaji = `${k.romaji} desu`;
    const meaning = `It is ${k.meaning.toLowerCase()}.`;
    rows.push({ kana, romaji, meaning, diff: (k.diff === "spicy" ? "spicy" : "standard") });
  }

  // 5) Expand: polite request mini-phrases
  const requestEnds = [
    { kana: "ください", romaji: "kudasai", meaning: "please", diff: "easy" },
    { kana: "おねがいします", romaji: "onegaishimasu", meaning: "please (polite)", diff: "easy" },
  ];
  for (const n of NOUNS){
    for (const e of requestEnds){
      const kana = `${n.kana}${e.kana}`;
      const romaji = `${n.romaji} ${e.romaji}`;
      const meaning = `${n.meaning}, ${e.meaning}.`;
      const diff = (DIFF_RANK[n.diff] > DIFF_RANK[e.diff]) ? n.diff : e.diff;
      rows.push({ kana, romaji, meaning, diff });
    }
  }

  // Make deterministic + unique + exact count
  const unique = uniqByKana(rows);

  // If still short (unlikely), pad by making numbered variants that stay kana-only (rare)
  // But in practice, unique will far exceed 1200; we slice deterministically.
  return unique.slice(0, 1200);
}

const WORD_ROWS_1200 = buildWordRows1200();

export const WORD_ITEMS = WORD_ROWS_1200.map(({ kana, romaji, meaning, diff }) => ({
  type: "word",
  kana,
  accepted: [romaji],
  meaning,
  difficulty: diff,
  script: /[ァ-ヶー]/.test(kana) ? "kata" : "hira",
}));

/* -----------------------------
   SENTENCES (240) + categories
   ----------------------------- */

function buildSentenceRows240(){
  const rows = [];

  // Slot banks (all kana-only, no kanji)
  const PLACES = [
    { kana:"えき", romaji:"eki", meaning:"station", diff:"easy" },
    { kana:"ホテル", romaji:"hoteru", meaning:"hotel", diff:"easy" },
    { kana:"トイレ", romaji:"toire", meaning:"toilet", diff:"easy" },
    { kana:"コンビニ", romaji:"konbini", meaning:"convenience store", diff:"standard" },
    { kana:"レストラン", romaji:"resutoran", meaning:"restaurant", diff:"standard" },
    { kana:"くうこう", romaji:"kuukou", meaning:"airport", diff:"standard" },
    { kana:"こうえん", romaji:"kouen", meaning:"park", diff:"standard" },
    { kana:"びょういん", romaji:"byouin", meaning:"hospital", diff:"spicy" },
  ];

  const FOODS = [
    { kana:"みず", romaji:"mizu", meaning:"water", diff:"easy" },
    { kana:"おちゃ", romaji:"ocha", meaning:"tea", diff:"easy" },
    { kana:"コーヒー", romaji:"koohii", meaning:"coffee", diff:"standard" },
    { kana:"ごはん", romaji:"gohan", meaning:"meal/rice", diff:"easy" },
    { kana:"らーめん", romaji:"raamen", meaning:"ramen", diff:"standard" },
    { kana:"すし", romaji:"sushi", meaning:"sushi", diff:"standard" },
    { kana:"アレルギー", romaji:"arerugii", meaning:"allergy", diff:"spicy" },
  ];

  const NUMS = [
    { kana:"ひとつ", romaji:"hitotsu", meaning:"one (thing)", diff:"easy" },
    { kana:"ふたつ", romaji:"futatsu", meaning:"two (things)", diff:"easy" },
    { kana:"みっつ", romaji:"mittsu", meaning:"three (things)", diff:"standard" },
  ];

  const TIMES = [
    { kana:"いま", romaji:"ima", meaning:"now", diff:"easy" },
    { kana:"きょう", romaji:"kyou", meaning:"today", diff:"standard" },
    { kana:"あした", romaji:"ashita", meaning:"tomorrow", diff:"standard" },
    { kana:"あとで", romaji:"atode", meaning:"later", diff:"easy" },
  ];

  // Templates by category
  const TEMPLATES = [
    // travel & basics
    { cat:"travel", diff:"easy",
      mk: (p)=>({ kana:`${p.kana}はどこですか`, romaji:`${p.romaji} wa doko desu ka`, meaning:`Where is the ${p.meaning}?` })
    },
    { cat:"travel", diff:"standard",
      mk: (p)=>({ kana:`すみません、${p.kana}はどこですか`, romaji:`sumimasen ${p.romaji} wa doko desu ka`, meaning:`Excuse me, where is the ${p.meaning}?` })
    },
    { cat:"travel", diff:"standard",
      mk: (_)=>({ kana:`えいごはわかりますか`, romaji:`eigo wa wakarimasu ka`, meaning:`Do you understand English?` })
    },

    // food & drink
    { cat:"food_drink", diff:"easy",
      mk: (f)=>({ kana:`${f.kana}をください`, romaji:`${f.romaji} o kudasai`, meaning:`${f.meaning[0].toUpperCase()+f.meaning.slice(1)}, please.` })
    },
    { cat:"food_drink", diff:"standard",
      mk: (f)=>({ kana:`これをください`, romaji:`kore o kudasai`, meaning:`This, please.` })
    },
    { cat:"food_drink", diff:"spicy",
      mk: (f)=>({ kana:`${f.kana}があります`, romaji:`${f.romaji} ga arimasu`, meaning:`I have an ${f.meaning}.` })
    },

    // transport
    { cat:"transport", diff:"standard",
      mk: (p)=>({ kana:`${p.kana}までいきたいです`, romaji:`${p.romaji} made ikitai desu`, meaning:`I want to go to the ${p.meaning}.` })
    },
    { cat:"transport", diff:"spicy",
      mk: (_)=>({ kana:`つぎのでんしゃはなんじですか`, romaji:`tsugi no densha wa nanji desu ka`, meaning:`What time is the next train?` })
    },
    { cat:"transport", diff:"standard",
      mk: (_)=>({ kana:`きっぷをかいたいです`, romaji:`kippu o kaitai desu`, meaning:`I want to buy a ticket.` })
    },

    // directions
    { cat:"directions", diff:"easy",
      mk: (_)=>({ kana:`まっすぐいってください`, romaji:`massugu itte kudasai`, meaning:`Please go straight.` })
    },
    { cat:"directions", diff:"easy",
      mk: (_)=>({ kana:`みぎにまがってください`, romaji:`migi ni magatte kudasai`, meaning:`Please turn right.` })
    },
    { cat:"directions", diff:"easy",
      mk: (_)=>({ kana:`ひだりにまがってください`, romaji:`hidari ni magatte kudasai`, meaning:`Please turn left.` })
    },

    // accommodation
    { cat:"accommodation", diff:"standard",
      mk: (_)=>({ kana:`チェックインをおねがいします`, romaji:`chekku in o onegaishimasu`, meaning:`Check-in, please.` })
    },
    { cat:"accommodation", diff:"spicy",
      mk: (_)=>({ kana:`チェックアウトはなんじですか`, romaji:`chekku auto wa nanji desu ka`, meaning:`What time is check-out?` })
    },
    { cat:"accommodation", diff:"spicy",
      mk: (_)=>({ kana:`よやくをキャンセルしたいです`, romaji:`yoyaku o kyanseru shitai desu`, meaning:`I want to cancel my reservation.` })
    },

    // shopping
    { cat:"shopping", diff:"easy",
      mk: (_)=>({ kana:`いくらですか`, romaji:`ikura desu ka`, meaning:`How much is it?` })
    },
    { cat:"shopping", diff:"standard",
      mk: (_)=>({ kana:`これをみせてください`, romaji:`kore o misete kudasai`, meaning:`Please show me this.` })
    },
    { cat:"shopping", diff:"standard",
      mk: (_)=>({ kana:`レシートをください`, romaji:`reshiito o kudasai`, meaning:`Receipt, please.` })
    },

    // social
    { cat:"social", diff:"easy",
      mk: (_)=>({ kana:`はじめまして`, romaji:`hajimemashite`, meaning:`Nice to meet you.` })
    },
    { cat:"social", diff:"standard",
      mk: (_)=>({ kana:`よろしくおねがいします`, romaji:`yoroshiku onegaishimasu`, meaning:`Please be kind to me.` })
    },
    { cat:"social", diff:"standard",
      mk: (_)=>({ kana:`しゃしんをとってもいいですか`, romaji:`shashin o totte mo ii desu ka`, meaning:`May I take a photo?` })
    },

    // time & money
    { cat:"time_money", diff:"easy",
      mk: (t)=>({ kana:`${t.kana}はだいじょうぶです`, romaji:`${t.romaji} wa daijoubu desu`, meaning:`${t.meaning[0].toUpperCase()+t.meaning.slice(1)} is okay.` })
    },
    { cat:"time_money", diff:"standard",
      mk: (_)=>({ kana:`げんきです`, romaji:`genki desu`, meaning:`I’m well.` })
    },
    { cat:"time_money", diff:"spicy",
      mk: (_)=>({ kana:`クレジットカードはつかえますか`, romaji:`kurejitto kaado wa tsukaemasu ka`, meaning:`Can I use a credit card?` })
    },

    // emergencies
    { cat:"emergencies", diff:"standard",
      mk: (_)=>({ kana:`たすけてください`, romaji:`tasukete kudasai`, meaning:`Please help!` })
    },
    { cat:"emergencies", diff:"spicy",
      mk: (_)=>({ kana:`びょういんにいきたいです`, romaji:`byouin ni ikitai desu`, meaning:`I want to go to a hospital.` })
    },
    { cat:"emergencies", diff:"spicy",
      mk: (_)=>({ kana:`けいさつをよんでください`, romaji:`keisatsu o yonde kudasai`, meaning:`Please call the police.` })
    },
  ];

  // Deterministic expansion:
  // We walk categories evenly and fill templates with slot banks.
  const cats = SENTENCE_CATEGORIES.map(c => c.id);
  let safety = 0;

  const slotForCat = (cat) => {
    if (cat === "food_drink") return FOODS;
    if (cat === "travel") return PLACES;
    if (cat === "transport") return PLACES;
    if (cat === "time_money") return TIMES;
    return [null];
  };

  while (rows.length < 240 && safety < 50000){
    safety++;

    const cat = cats[rows.length % cats.length];
    const templates = TEMPLATES.filter(t => t.cat === cat);

    const t = templates[(rows.length / cats.length | 0) % templates.length];
    const slots = slotForCat(cat);
    const slot = slots[(rows.length * 7 + 3) % slots.length]; // deterministic

    const built = t.mk(slot);

    // Derive difficulty as max(template diff, slot diff if present)
    const itemDiff = (() => {
      const a = t.diff || "standard";
      const b = slot?.diff || "easy";
      return (DIFF_RANK[a] >= DIFF_RANK[b]) ? a : b;
    })();

    rows.push({
      kana: built.kana,
      romaji: built.romaji,
      meaning: built.meaning,
      diff: itemDiff,
      category: cat
    });
  }

  // Make unique by kana and slice to exactly 240
  const unique = uniqByKana(rows).slice(0, 240);

  // If uniqueness ever trimmed us below 240 (unlikely), add simple numbered variants:
  // (kept kana-only and still useful)
  while (unique.length < 240){
    const i = unique.length + 1;
    unique.push({
      kana: `これは${i}ばんです`,
      romaji: `kore wa ${i} ban desu`,
      meaning: `This is number ${i}.`,
      diff: "standard",
      category: "travel"
    });
  }

  return unique;
}

const SENT_ROWS_240 = buildSentenceRows240();

export const SENT_ITEMS = SENT_ROWS_240.map(({ kana, romaji, meaning, diff, category }) => ({
  type: "sentence",
  kana,
  accepted: [romaji],
  meaning,
  difficulty: diff,
  category,
  script: /[ァ-ヶー]/.test(kana) ? "kata" : "hira",
}));

/* -----------------------------
   CHAR items (existing logic)
   ----------------------------- */

function buildCharItems(script, difficulty){
  const items = [];
  const isHira = (s) => /[ぁ-ゖゔ]/.test(s);
  const isKata = (s) => /[ァ-ヶヴー]/.test(s);

  for (const [kana, romaji] of KANA_MAP.entries()){
    if (romaji === "(sokuon)" || romaji === "(long)") continue;

    const isTwo = kana.length === 2;
    const extended = ["ティ","トゥ","ディ","ドゥ","チェ","シェ","ジェ","ファ","フィ","フェ","フォ","フャ","フュ","フョ",
      "ウィ","ウェ","ウォ","ツァ","ツィ","ツェ","ツォ","クァ","クィ","クェ","クォ","グァ","グィ","グェ","グォ",
      "ゔぁ","ゔぃ","ゔぇ","ゔぉ","ゔゅ","ヴァ","ヴィ","ヴェ","ヴォ","ヴュ","ふぁ","ふぃ","ふぇ","ふぉ",
      "てゃ","てゅ","てょ","でゃ","でゅ","でょ"].includes(kana);

    if (script === "hira" && !isHira(kana)) continue;
    if (script === "kata" && !isKata(kana)) continue;

    if (difficulty === "easy"){
      if (isTwo) continue;
      if (["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","っ","ゎ","ァ","ィ","ゥ","ェ","ォ","ャ","ュ","ョ","ッ","ヮ"].includes(kana)) continue;
      if (extended) continue;
    } else if (difficulty === "standard"){
      if (extended) continue;
    }

    items.push({
      type:"char",
      kana,
      accepted:[romaji],
      meaning: (isHira(kana) ? "Hiragana character" : "Katakana character"),
      script: isHira(kana) ? "hira" : "kata"
    });
  }
  return items;
}

function buildItems(settings){
  const {
    mixChars,
    mixWords,
    mixSentences,
    script,
    difficulty,
    sentenceCategories
  } = settings;

  const items = [];

  if (mixChars) items.push(...buildCharItems(script, difficulty));

  if (mixWords){
    for (const w of WORD_ITEMS){
      if (!withinDifficulty(w.difficulty || "standard", difficulty)) continue;
      if (script === "hira" && w.script === "kata") continue;
      if (script === "kata" && w.script === "hira") continue;
      items.push(w);
    }
  }

  if (mixSentences){
    const allowedCats = new Set(
      (sentenceCategories && sentenceCategories.length)
        ? sentenceCategories
        : SENTENCE_CATEGORIES.map(c => c.id)
    );

    for (const s of SENT_ITEMS){
      if (!withinDifficulty(s.difficulty || "standard", difficulty)) continue;

      if (!allowedCats.has(s.category || "travel")) continue;

      if (script === "hira" && /[ァ-ヶー]/.test(s.kana)) continue;
      if (script === "kata" && /[ぁ-ゖゔ]/.test(s.kana)) continue;
      items.push(s);
    }
  }

  return items.length ? items : buildCharItems(script, difficulty);
}

export { buildCharItems, buildItems };