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

const BASE_WORD_BANK = [
  // easy
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

  // standard
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

  // spicy
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
  // easy
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

  // standard
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

  // spicy
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

  // Seed with curated bases
  rows.push(...BASE_WORD_BANK);
  rows.push(...NOUNS);
  rows.push(...ADJECTIVES);
  rows.push(...VERB_PHRASES);
  rows.push(...KATA_LOANWORDS);

  // adjective + noun
  for (const a of ADJECTIVES){
    for (const n of NOUNS){
      const kana = `${a.kana}${n.kana}`;
      const romaji = `${a.romaji} ${n.romaji}`;
      const meaning = `${a.meaning} ${n.meaning}`.trim();
      const diff = (DIFF_RANK[a.diff] > DIFF_RANK[n.diff]) ? a.diff : n.diff;
      rows.push({ kana, romaji, meaning, diff });
    }
  }

  // noun + の + noun
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

  // loanword + です
  for (const k of KATA_LOANWORDS){
    const kana = `${k.kana}です`;
    const romaji = `${k.romaji} desu`;
    const meaning = `It is ${k.meaning.toLowerCase()}.`;
    rows.push({ kana, romaji, meaning, diff: (k.diff === "spicy" ? "spicy" : "standard") });
  }

  // noun + (ください / おねがいします)
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

  const unique = uniqByKana(rows);
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
   SENTENCES (240) — frame-based + whitelisted variants
   ----------------------------- */

// Slot helpers
const maxDiff = (a, b) => (DIFF_RANK[a] >= DIFF_RANK[b]) ? a : b;

// Whitelisted slot sets (curated for “sounds natural in this frame”)
const PLACES_WHERE = [
  { kana:"トイレ", romaji:"toire", meaning:"toilet", diff:"easy" },
  { kana:"えき", romaji:"eki", meaning:"station", diff:"easy" },
  { kana:"ホテル", romaji:"hoteru", meaning:"hotel", diff:"easy" },
  { kana:"レストラン", romaji:"resutoran", meaning:"restaurant", diff:"standard" },
  { kana:"コンビニ", romaji:"konbini", meaning:"convenience store", diff:"standard" },
  { kana:"くうこう", romaji:"kuukou", meaning:"airport", diff:"standard" },
  { kana:"こうえん", romaji:"kouen", meaning:"park", diff:"standard" },
  { kana:"びょういん", romaji:"byouin", meaning:"hospital", diff:"spicy" },
  { kana:"こうばん", romaji:"kouban", meaning:"police box", diff:"spicy" },
];

const PLACES_GO = [
  { kana:"えき", romaji:"eki", meaning:"station", diff:"easy" },
  { kana:"ホテル", romaji:"hoteru", meaning:"hotel", diff:"easy" },
  { kana:"くうこう", romaji:"kuukou", meaning:"airport", diff:"standard" },
  { kana:"レストラン", romaji:"resutoran", meaning:"restaurant", diff:"standard" },
  { kana:"こうえん", romaji:"kouen", meaning:"park", diff:"standard" },
  { kana:"びょういん", romaji:"byouin", meaning:"hospital", diff:"spicy" },
];

const FOOD_ORDER = [
  { kana:"みず", romaji:"mizu", meaning:"water", diff:"easy" },
  { kana:"おちゃ", romaji:"ocha", meaning:"tea", diff:"easy" },
  { kana:"コーヒー", romaji:"koohii", meaning:"coffee", diff:"standard" },
  { kana:"ごはん", romaji:"gohan", meaning:"rice / meal", diff:"easy" },
  { kana:"らーめん", romaji:"raamen", meaning:"ramen", diff:"standard" },
  { kana:"すし", romaji:"sushi", meaning:"sushi", diff:"standard" },
  { kana:"てんぷら", romaji:"tenpura", meaning:"tempura", diff:"standard" },
];

const COUNTABLE_ORDER = [
  { kana:"ひとつ", romaji:"hitotsu", meaning:"one (thing)", diff:"easy" },
  { kana:"ふたつ", romaji:"futatsu", meaning:"two (things)", diff:"easy" },
  { kana:"みっつ", romaji:"mittsu", meaning:"three (things)", diff:"standard" },
];

const TRANSIT_NOUNS = [
  { kana:"でんしゃ", romaji:"densha", meaning:"train", diff:"easy" },
  { kana:"バス", romaji:"basu", meaning:"bus", diff:"standard" },
  { kana:"タクシー", romaji:"takushii", meaning:"taxi", diff:"standard" },
];

const PAYMENT_METHODS = [
  { kana:"げんきん", romaji:"genkin", meaning:"cash", diff:"standard" },
  { kana:"クレジットカード", romaji:"kurejitto kaado", meaning:"credit card", diff:"spicy" },
];

const BASIC_FEELINGS = [
  { kana:"だいじょうぶ", romaji:"daijoubu", meaning:"okay", diff:"easy" },
  { kana:"つかれました", romaji:"tsukaremashita", meaning:"tired (polite)", diff:"standard" },
  { kana:"きもちわるいです", romaji:"kimochi warui desu", meaning:"I feel sick.", diff:"spicy" },
];

const TIMES = [
  { kana:"いま", romaji:"ima", meaning:"now", diff:"easy" },
  { kana:"きょう", romaji:"kyou", meaning:"today", diff:"standard" },
  { kana:"あした", romaji:"ashita", meaning:"tomorrow", diff:"standard" },
  { kana:"あとで", romaji:"atode", meaning:"later", diff:"easy" },
];

// Frame definition:
// - category
// - baseDifficulty (can be upgraded by slots)
// - builder(slot) returns { kana, romaji, meaning }
const SENT_FRAMES = [
  // --- Travel & basics (slight skew: more frames + more variants) ---
  {
    id: "where_basic",
    category: "travel",
    baseDifficulty: "easy",
    slots: PLACES_WHERE,
    build: (p) => ({
      kana: `${p.kana}はどこですか`,
      romaji: `${p.romaji} wa doko desu ka`,
      meaning: `Where is the ${p.meaning}?`,
    }),
  },
  {
    id: "where_polite",
    category: "travel",
    baseDifficulty: "standard",
    slots: PLACES_WHERE,
    build: (p) => ({
      kana: `すみません、${p.kana}はどこですか`,
      romaji: `sumimasen ${p.romaji} wa doko desu ka`,
      meaning: `Excuse me, where is the ${p.meaning}?`,
    }),
  },
  {
    id: "dont_understand",
    category: "travel",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "わかりません",
      romaji: "wakarimasen",
      meaning: "I don’t understand.",
    }),
  },
  {
    id: "one_more_time",
    category: "travel",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "もういちどいってください",
      romaji: "mou ichido itte kudasai",
      meaning: "Please say it one more time.",
    }),
  },
  {
    id: "speak_slowly",
    category: "travel",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "ゆっくりはなしてください",
      romaji: "yukkuri hanashite kudasai",
      meaning: "Please speak slowly.",
    }),
  },
  {
    id: "do_you_speak_english",
    category: "travel",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "えいごははなせますか",
      romaji: "eigo wa hanasemasu ka",
      meaning: "Do you speak English?",
    }),
  },

  // --- Directions ---
  {
    id: "go_straight",
    category: "directions",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "まっすぐいってください",
      romaji: "massugu itte kudasai",
      meaning: "Please go straight.",
    }),
  },
  {
    id: "turn_right",
    category: "directions",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "みぎにまがってください",
      romaji: "migi ni magatte kudasai",
      meaning: "Please turn right.",
    }),
  },
  {
    id: "turn_left",
    category: "directions",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "ひだりにまがってください",
      romaji: "hidari ni magatte kudasai",
      meaning: "Please turn left.",
    }),
  },
  {
    id: "how_do_i_get_to",
    category: "directions",
    baseDifficulty: "standard",
    slots: PLACES_GO,
    build: (p) => ({
      kana: `${p.kana}にどうやっていきますか`,
      romaji: `${p.romaji} ni dou yatte ikimasu ka`,
      meaning: `How do I get to the ${p.meaning}?`,
    }),
  },

  // --- Transport ---
  {
    id: "want_to_go_to",
    category: "transport",
    baseDifficulty: "standard",
    slots: PLACES_GO,
    build: (p) => ({
      kana: `${p.kana}にいきたいです`,
      romaji: `${p.romaji} ni ikitai desu`,
      meaning: `I want to go to the ${p.meaning}.`,
    }),
  },
  {
    id: "where_is_platform",
    category: "transport",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "プラットフォームはどこですか",
      romaji: "puratto foomu wa doko desu ka",
      meaning: "Where is the platform?",
    }),
  },
  {
    id: "what_time_next_train",
    category: "transport",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "つぎのでんしゃはなんじですか",
      romaji: "tsugi no densha wa nanji desu ka",
      meaning: "What time is the next train?",
    }),
  },
  {
    id: "buy_ticket",
    category: "transport",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "きっぷをかいたいです",
      romaji: "kippu o kaitai desu",
      meaning: "I want to buy a ticket.",
    }),
  },
  {
    id: "call_taxi",
    category: "transport",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "タクシーをよんでください",
      romaji: "takushii o yonde kudasai",
      meaning: "Please call a taxi.",
    }),
  },

  // --- Food & drink ---
  {
    id: "order_please",
    category: "food_drink",
    baseDifficulty: "easy",
    slots: FOOD_ORDER,
    build: (f) => ({
      kana: `${f.kana}をください`,
      romaji: `${f.romaji} o kudasai`,
      meaning: `${f.meaning[0].toUpperCase() + f.meaning.slice(1)}, please.`,
    }),
  },
  {
    id: "this_please",
    category: "food_drink",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "これをください",
      romaji: "kore o kudasai",
      meaning: "This, please.",
    }),
  },
  {
    id: "takeaway",
    category: "food_drink",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "もちかえりです",
      romaji: "mochikaeri desu",
      meaning: "It’s takeaway.",
    }),
  },
  {
    id: "eat_here",
    category: "food_drink",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "ここでたべます",
      romaji: "koko de tabemasu",
      meaning: "I’ll eat here.",
    }),
  },
  {
    id: "how_many",
    category: "food_drink",
    baseDifficulty: "standard",
    slots: COUNTABLE_ORDER,
    build: (c) => ({
      kana: `${c.kana}ください`,
      romaji: `${c.romaji} kudasai`,
      meaning: `One / two / three, please.`,
    }),
  },
  {
    id: "allergy",
    category: "food_drink",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "アレルギーがあります",
      romaji: "arerugii ga arimasu",
      meaning: "I have an allergy.",
    }),
  },
  {
    id: "no_meat",
    category: "food_drink",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "にくはたべません",
      romaji: "niku wa tabemasen",
      meaning: "I don’t eat meat.",
    }),
  },

  // --- Accommodation ---
  {
    id: "check_in",
    category: "accommodation",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "チェックインをおねがいします",
      romaji: "chekku in o onegaishimasu",
      meaning: "Check-in, please.",
    }),
  },
  {
    id: "check_out_time",
    category: "accommodation",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "チェックアウトはなんじですか",
      romaji: "chekku auto wa nanji desu ka",
      meaning: "What time is check-out?",
    }),
  },
  {
    id: "reservation_name",
    category: "accommodation",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "よやくのなまえはこれです",
      romaji: "yoyaku no namae wa kore desu",
      meaning: "This is the name for the reservation.",
    }),
  },
  {
    id: "room_key",
    category: "accommodation",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "かぎをなくしました",
      romaji: "kagi o nakushimashita",
      meaning: "I lost the key.",
    }),
  },
  {
    id: "wifi_password",
    category: "accommodation",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "ワイファイのパスワードはなんですか",
      romaji: "waifai no pasuwaado wa nan desu ka",
      meaning: "What is the Wi-Fi password?",
    }),
  },

  // --- Shopping ---
  {
    id: "how_much",
    category: "shopping",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "いくらですか",
      romaji: "ikura desu ka",
      meaning: "How much is it?",
    }),
  },
  {
    id: "receipt",
    category: "shopping",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "レシートをください",
      romaji: "reshiito o kudasai",
      meaning: "Receipt, please.",
    }),
  },
  {
    id: "show_me_this",
    category: "shopping",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "これをみせてください",
      romaji: "kore o misete kudasai",
      meaning: "Please show me this.",
    }),
  },
  {
    id: "pay_method",
    category: "shopping",
    baseDifficulty: "standard",
    slots: PAYMENT_METHODS,
    build: (m) => ({
      kana: `${m.kana}はつかえますか`,
      romaji: `${m.romaji} wa tsukaemasu ka`,
      meaning: `Can I use ${m.meaning}?`,
    }),
  },

  // --- Social ---
  {
    id: "nice_to_meet",
    category: "social",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "はじめまして",
      romaji: "hajimemashite",
      meaning: "Nice to meet you.",
    }),
  },
  {
    id: "please_be_kind",
    category: "social",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "よろしくおねがいします",
      romaji: "yoroshiku onegaishimasu",
      meaning: "Please be kind to me.",
    }),
  },
  {
    id: "my_name_is",
    category: "social",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "なまえはなんですか",
      romaji: "namae wa nan desu ka",
      meaning: "What is your name?",
    }),
  },
  {
    id: "photo_ok",
    category: "social",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "しゃしんをとってもいいですか",
      romaji: "shashin o totte mo ii desu ka",
      meaning: "May I take a photo?",
    }),
  },

  // --- Time & money ---
  {
    id: "now_ok",
    category: "time_money",
    baseDifficulty: "easy",
    slots: TIMES,
    build: (t) => ({
      kana: `${t.kana}はだいじょうぶです`,
      romaji: `${t.romaji} wa daijoubu desu`,
      meaning: `${t.meaning[0].toUpperCase() + t.meaning.slice(1)} is okay.`,
    }),
  },
  {
    id: "i_am_ok",
    category: "time_money",
    baseDifficulty: "easy",
    slots: [null],
    build: () => ({
      kana: "だいじょうぶです",
      romaji: "daijoubu desu",
      meaning: "It’s okay.",
    }),
  },
  {
    id: "where_exchange",
    category: "time_money",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "おかねはどこでかえられますか",
      romaji: "okane wa doko de kaeraremasu ka",
      meaning: "Where can I exchange money?",
    }),
  },

  // --- Emergencies ---
  {
    id: "help",
    category: "emergencies",
    baseDifficulty: "standard",
    slots: [null],
    build: () => ({
      kana: "たすけてください",
      romaji: "tasukete kudasai",
      meaning: "Please help!",
    }),
  },
  {
    id: "lost_item",
    category: "emergencies",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "なくしました",
      romaji: "nakushimashita",
      meaning: "I lost it.",
    }),
  },
  {
    id: "passport_lost",
    category: "emergencies",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "パスポートをなくしました",
      romaji: "pasupooto o nakushimashita",
      meaning: "I lost my passport.",
    }),
  },
  {
    id: "feelings",
    category: "emergencies",
    baseDifficulty: "standard",
    slots: BASIC_FEELINGS,
    build: (f) => ({
      kana: `${f.kana}`,
      romaji: `${f.romaji}`,
      meaning: `${f.meaning}`,
    }),
  },
  {
    id: "call_police",
    category: "emergencies",
    baseDifficulty: "spicy",
    slots: [null],
    build: () => ({
      kana: "けいさつをよんでください",
      romaji: "keisatsu o yonde kudasai",
      meaning: "Please call the police.",
    }),
  },
];

// Controlled “micro-variants” for some frames (still whitelisted, still natural)
function expandMicroVariants(frameId, slot){
  // Return array of additional variant objects: { kana, romaji, meaning, addDiff? }
  // Keep these conservative: no weird semantics.
  if (frameId === "where_basic" && slot){
    return [
      {
        kana: `${slot.kana}はどこですか`,
        romaji: `${slot.romaji} wa doko desu ka`,
        meaning: `Where is the ${slot.meaning}?`,
      },
      {
        kana: `${slot.kana}はどこにありますか`,
        romaji: `${slot.romaji} wa doko ni arimasu ka`,
        meaning: `Where is the ${slot.meaning}?`,
      },
    ];
  }

  if (frameId === "where_polite" && slot){
    return [
      {
        kana: `すみません、${slot.kana}はどこにありますか`,
        romaji: `sumimasen ${slot.romaji} wa doko ni arimasu ka`,
        meaning: `Excuse me, where is the ${slot.meaning}?`,
      },
    ];
  }

  if (frameId === "order_please" && slot){
    return [
      {
        kana: `${slot.kana}をひとつください`,
        romaji: `${slot.romaji} o hitotsu kudasai`,
        meaning: `${slot.meaning[0].toUpperCase() + slot.meaning.slice(1)}, one please.`,
        addDiff: "standard",
      },
    ];
  }

  if (frameId === "want_to_go_to" && slot){
    return [
      {
        kana: `${slot.kana}までいきたいです`,
        romaji: `${slot.romaji} made ikitai desu`,
        meaning: `I want to go to the ${slot.meaning}.`,
      },
    ];
  }

  return [];
}

function buildSentenceRows240(){
  const rows = [];

  // Light travel skew:
  // - We include more frames in travel/transport/directions,
  // - And we allow more variants per slot on travel frames via micro-variants.

  // Deterministic expansion pass:
  // For each frame, iterate its slots in order and emit:
  // - base sentence
  // - optional micro variants (frame-specific, safe)
  for (const frame of SENT_FRAMES){
    const slots = (frame.slots && frame.slots.length) ? frame.slots : [null];

    for (const slot of slots){
      const built = frame.build(slot);
      const slotDiff = slot?.diff || "easy";
      const diff = maxDiff(frame.baseDifficulty || "standard", slotDiff);

      rows.push({
        kana: built.kana,
        romaji: built.romaji,
        meaning: built.meaning,
        diff,
        category: frame.category,
      });

      const extras = expandMicroVariants(frame.id, slot);
      for (const ex of extras){
        const exDiff = ex.addDiff ? maxDiff(diff, ex.addDiff) : diff;
        rows.push({
          kana: ex.kana,
          romaji: ex.romaji,
          meaning: ex.meaning,
          diff: exDiff,
          category: frame.category,
        });
      }
    }
  }

  // Dedupe
  const unique = uniqByKana(rows);

  // We need EXACTLY 240. If we have more, slice deterministically but keep breadth:
  // - round-robin by category for the first pass, then fill remaining.
  const byCat = new Map();
  for (const c of SENTENCE_CATEGORIES.map(x => x.id)) byCat.set(c, []);
  for (const r of unique){
    const cat = byCat.has(r.category) ? r.category : "travel";
    byCat.get(cat).push(r);
  }

  const roundRobin = [];
  let added = true;
  while (added && roundRobin.length < 260){ // a bit beyond 240 for safety
    added = false;
    for (const c of SENTENCE_CATEGORIES.map(x => x.id)){
      const arr = byCat.get(c) || [];
      if (arr.length){
        roundRobin.push(arr.shift());
        added = true;
      }
      if (roundRobin.length >= 260) break;
    }
  }

  // After round-robin, append any leftovers (still deterministic)
  const leftovers = [];
  for (const c of SENTENCE_CATEGORIES.map(x => x.id)){
    leftovers.push(...(byCat.get(c) || []));
  }
  const ordered = roundRobin.concat(leftovers);

  // If we’re short (unlikely), add a small set of fully curated filler sentences.
  const fallback = [
    { kana:"すみません", romaji:"sumimasen", meaning:"Excuse me.", diff:"easy", category:"travel" },
    { kana:"おねがいします", romaji:"onegaishimasu", meaning:"Please.", diff:"easy", category:"travel" },
    { kana:"だいじょうぶです", romaji:"daijoubu desu", meaning:"It’s okay.", diff:"easy", category:"time_money" },
    { kana:"トイレにいきたいです", romaji:"toire ni ikitai desu", meaning:"I want to go to the toilet.", diff:"standard", category:"travel" },
    { kana:"ちょっとまってください", romaji:"chotto matte kudasai", meaning:"Please wait a moment.", diff:"standard", category:"travel" },
    { kana:"たすけてください", romaji:"tasukete kudasai", meaning:"Please help!", diff:"standard", category:"emergencies" },
  ];

  const out = [];
  const seenKana = new Set();
  for (const r of ordered){
    if (out.length >= 240) break;
    if (seenKana.has(r.kana)) continue;
    seenKana.add(r.kana);
    out.push(r);
  }

  let i = 0;
  while (out.length < 240){
    const f = fallback[i % fallback.length];
    if (!seenKana.has(f.kana)){
      out.push(f);
      seenKana.add(f.kana);
    }
    i++;
    if (i > 2000) break; // safety
  }

  // Final guarantee
  return out.slice(0, 240);
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