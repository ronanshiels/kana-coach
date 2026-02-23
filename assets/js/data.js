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
   WORDS (curated practical list)
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

  { kana: "もしもし", romaji: "moshi moshi", meaning: "Hello (on the phone)", diff: "easy" },
  { kana: "よろしく", romaji: "yoroshiku", meaning: "Nice to meet you / thanks in advance (casual)", diff: "standard" },
  { kana: "だいじょうぶ", romaji: "daijoubu", meaning: "Okay / all right", diff: "easy" },
  { kana: "ちょっと", romaji: "chotto", meaning: "A little / a bit", diff: "easy" },
  { kana: "もういちど", romaji: "mou ichido", meaning: "One more time", diff: "standard" },
  { kana: "ゆっくり", romaji: "yukkuri", meaning: "Slowly", diff: "standard" },
  { kana: "はやく", romaji: "hayaku", meaning: "Quickly / early", diff: "standard" },
  { kana: "いまから", romaji: "ima kara", meaning: "From now", diff: "standard" },
  { kana: "きょう", romaji: "kyou", meaning: "Today", diff: "standard" },
  { kana: "あした", romaji: "ashita", meaning: "Tomorrow", diff: "standard" },
  { kana: "きのう", romaji: "kinou", meaning: "Yesterday", diff: "standard" },
  { kana: "まいにち", romaji: "mainichi", meaning: "Every day", diff: "standard" },
  { kana: "すこし", romaji: "sukoshi", meaning: "A little", diff: "easy" },
  { kana: "たくさん", romaji: "takusan", meaning: "A lot / many", diff: "standard" },
  { kana: "だめ", romaji: "dame", meaning: "No good / not allowed", diff: "standard" },
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

  { kana: "まち", romaji: "machi", meaning: "Town / city", diff: "easy" },
  { kana: "みち", romaji: "michi", meaning: "Road / way", diff: "easy" },
  { kana: "こうさてん", romaji: "kousaten", meaning: "Intersection", diff: "spicy" },
  { kana: "しんごう", romaji: "shingou", meaning: "Traffic light", diff: "spicy" },
  { kana: "はし", romaji: "hashi", meaning: "Bridge", diff: "standard" },
  { kana: "かわ", romaji: "kawa", meaning: "River", diff: "standard" },
  { kana: "うみ", romaji: "umi", meaning: "Sea", diff: "standard" },
  { kana: "やま", romaji: "yama", meaning: "Mountain", diff: "standard" },
  { kana: "てら", romaji: "tera", meaning: "Temple", diff: "standard" },
  { kana: "じんじゃ", romaji: "jinja", meaning: "Shrine", diff: "standard" },
  { kana: "はくぶつかん", romaji: "hakubutsukan", meaning: "Museum", diff: "spicy" },
  { kana: "びじゅつかん", romaji: "bijutsukan", meaning: "Art museum", diff: "spicy" },
  { kana: "えきまえ", romaji: "ekimae", meaning: "In front of the station", diff: "spicy" },
  { kana: "ちかてつ", romaji: "chikatetsu", meaning: "Subway", diff: "standard" },
  { kana: "しんかんせん", romaji: "shinkansen", meaning: "Bullet train", diff: "spicy" },
  { kana: "のりば", romaji: "noriba", meaning: "Platform / boarding area", diff: "spicy" },
  { kana: "かいさつ", romaji: "kaisatsu", meaning: "Ticket gate", diff: "spicy" },
  { kana: "ひこうき", romaji: "hikouki", meaning: "Airplane", diff: "standard" },
  { kana: "せき", romaji: "seki", meaning: "Seat", diff: "standard" },
  { kana: "にもつ", romaji: "nimotsu", meaning: "Luggage", diff: "standard" },
  { kana: "さいふ", romaji: "saifu", meaning: "Wallet", diff: "standard" },
  { kana: "かぎ", romaji: "kagi", meaning: "Key", diff: "standard" },
  { kana: "よやく", romaji: "yoyaku", meaning: "Reservation", diff: "spicy" },
  { kana: "よてい", romaji: "yotei", meaning: "Plan / schedule", diff: "spicy" },
  { kana: "じかんひょう", romaji: "jikanhyou", meaning: "Timetable", diff: "spicy" },
  { kana: "きっさてん", romaji: "kissaten", meaning: "Cafe (traditional)", diff: "standard" },
  { kana: "みせ", romaji: "mise", meaning: "Shop / store", diff: "easy" },
  { kana: "スーパー", romaji: "suupaa", meaning: "Supermarket", diff: "standard" },
  { kana: "やくきょく", romaji: "yakkyoku", meaning: "Pharmacy", diff: "spicy" },
  { kana: "びょういん", romaji: "byouin", meaning: "Hospital", diff: "spicy" },
  { kana: "こうばん", romaji: "kouban", meaning: "Police box", diff: "spicy" },
  { kana: "けいさつ", romaji: "keisatsu", meaning: "Police", diff: "spicy" },
  { kana: "えいご", romaji: "eigo", meaning: "English", diff: "easy" },
  { kana: "にほんご", romaji: "nihongo", meaning: "Japanese (language)", diff: "easy" },
  { kana: "ちゅうもん", romaji: "chuumon", meaning: "Order", diff: "spicy" },
  { kana: "おかいけい", romaji: "okaikei", meaning: "Bill / check", diff: "standard" },
  { kana: "れしーと", romaji: "reshiito", meaning: "Receipt", diff: "standard" },
  { kana: "げんきん", romaji: "genkin", meaning: "Cash", diff: "spicy" },
  { kana: "こうか", romaji: "kouka", meaning: "Coin", diff: "spicy" },
  { kana: "さつ", romaji: "satsu", meaning: "Bill / note (banknote)", diff: "spicy" },
  { kana: "えん", romaji: "en", meaning: "Yen", diff: "standard" },
  { kana: "びょうき", romaji: "byouki", meaning: "Illness", diff: "spicy" },
  { kana: "くすり", romaji: "kusuri", meaning: "Medicine", diff: "standard" },
  { kana: "あぶら", romaji: "abura", meaning: "Oil", diff: "spicy" },
  { kana: "しお", romaji: "shio", meaning: "Salt", diff: "standard" },
  { kana: "さとう", romaji: "satou", meaning: "Sugar", diff: "standard" },
  { kana: "こしょう", romaji: "koshou", meaning: "Pepper", diff: "spicy" },
  { kana: "にほんしゅ", romaji: "nihonshu", meaning: "Sake", diff: "spicy" },
  { kana: "のみもの", romaji: "nomimono", meaning: "Drink (beverage)", diff: "standard" },
  { kana: "たべもの", romaji: "tabemono", meaning: "Food", diff: "standard" },
  { kana: "あさごはん", romaji: "asa gohan", meaning: "Breakfast", diff: "standard" },
  { kana: "ひるごはん", romaji: "hiru gohan", meaning: "Lunch", diff: "standard" },
  { kana: "ばんごはん", romaji: "ban gohan", meaning: "Dinner", diff: "standard" },
  { kana: "でざーと", romaji: "dezaato", meaning: "Dessert", diff: "spicy" },
  { kana: "ぎゅうにゅう", romaji: "gyuunyuu", meaning: "Milk", diff: "spicy" },
  { kana: "さかな", romaji: "sakana", meaning: "Fish", diff: "standard" },
  { kana: "とりにく", romaji: "toriniku", meaning: "Chicken", diff: "spicy" },
  { kana: "ぶたにく", romaji: "butaniku", meaning: "Pork", diff: "spicy" },
  { kana: "ぎゅうにく", romaji: "gyuuniku", meaning: "Beef", diff: "spicy" },
  { kana: "やきとり", romaji: "yakitori", meaning: "Grilled chicken skewers", diff: "spicy" },
  { kana: "おちゃづけ", romaji: "ochazuke", meaning: "Rice with tea", diff: "spicy" },
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

  { kana: "あつい", romaji: "atsui", meaning: "Hot", diff: "standard" },
  { kana: "つめたい", romaji: "tsumetai", meaning: "Cold (to the touch)", diff: "spicy" },
  { kana: "あたたかい", romaji: "atatakai", meaning: "Warm", diff: "spicy" },
  { kana: "おいしい", romaji: "oishii", meaning: "Delicious", diff: "standard" },
  { kana: "まずい", romaji: "mazui", meaning: "Not tasty", diff: "spicy" },
  { kana: "からい", romaji: "karai", meaning: "Spicy", diff: "standard" },
  { kana: "あまい", romaji: "amai", meaning: "Sweet", diff: "standard" },
  { kana: "すっぱい", romaji: "suppai", meaning: "Sour", diff: "spicy" },
  { kana: "しょっぱい", romaji: "shoppai", meaning: "Salty", diff: "spicy" },
  { kana: "やさしい", romaji: "yasashii", meaning: "Kind / gentle", diff: "standard" },
  { kana: "こわい", romaji: "kowai", meaning: "Scary", diff: "standard" },
  { kana: "きれい", romaji: "kirei", meaning: "Pretty / clean", diff: "standard" },
  { kana: "しずか", romaji: "shizuka", meaning: "Quiet", diff: "standard" },
  { kana: "にぎやか", romaji: "nigiyaka", meaning: "Lively", diff: "spicy" },
];

const VERB_PHRASES = [
  { kana: "いきたい", romaji: "ikitai", meaning: "Want to go", diff: "standard" },
  { kana: "たべたい", romaji: "tabetai", meaning: "Want to eat", diff: "standard" },
  { kana: "のみたい", romaji: "nomitai", meaning: "Want to drink", diff: "standard" },
  { kana: "かいたい", romaji: "kaitai", meaning: "Want to buy", diff: "standard" },
  { kana: "みたい", romaji: "mitai", meaning: "Want to see", diff: "standard" },
  { kana: "たすけてください", romaji: "tasukete kudasai", meaning: "Please help", diff: "spicy" },
  { kana: "よやくしたい", romaji: "yoyaku shitai", meaning: "Want to book / reserve", diff: "spicy" },

  { kana: "いく", romaji: "iku", meaning: "To go", diff: "easy" },
  { kana: "くる", romaji: "kuru", meaning: "To come", diff: "easy" },
  { kana: "かえる", romaji: "kaeru", meaning: "To return / go home", diff: "standard" },
  { kana: "あるく", romaji: "aruku", meaning: "To walk", diff: "standard" },
  { kana: "のる", romaji: "noru", meaning: "To ride / get on", diff: "standard" },
  { kana: "おりる", romaji: "oriru", meaning: "To get off", diff: "standard" },
  { kana: "たべる", romaji: "taberu", meaning: "To eat", diff: "easy" },
  { kana: "のむ", romaji: "nomu", meaning: "To drink", diff: "easy" },
  { kana: "かう", romaji: "kau", meaning: "To buy", diff: "easy" },
  { kana: "みる", romaji: "miru", meaning: "To see / watch", diff: "easy" },
  { kana: "きく", romaji: "kiku", meaning: "To ask / listen", diff: "standard" },
  { kana: "はなす", romaji: "hanasu", meaning: "To speak", diff: "standard" },
  { kana: "いう", romaji: "iu", meaning: "To say", diff: "standard" },
  { kana: "まつ", romaji: "matsu", meaning: "To wait", diff: "standard" },
  { kana: "わかる", romaji: "wakaru", meaning: "To understand", diff: "standard" },
  { kana: "しる", romaji: "shiru", meaning: "To know", diff: "spicy" },
  { kana: "しぬ", romaji: "shinu", meaning: "To die", diff: "spicy" },
  { kana: "たすける", romaji: "tasukeru", meaning: "To help", diff: "spicy" },
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

  { kana: "スーツケース", romaji: "suutsukeesu", meaning: "Suitcase", diff: "standard" },
  { kana: "マップ", romaji: "mappu", meaning: "Map (loanword)", diff: "standard" },
  { kana: "トイレットペーパー", romaji: "toiretto peepaa", meaning: "Toilet paper", diff: "spicy" },
  { kana: "クーポン", romaji: "kuupon", meaning: "Coupon", diff: "spicy" },
  { kana: "レジ", romaji: "reji", meaning: "Cash register / checkout", diff: "standard" },
  { kana: "エキチカ", romaji: "ekichika", meaning: "Near the station", diff: "spicy" },
  { kana: "チュウシャジョウ", romaji: "chuushajou", meaning: "Parking lot (often written in kana here)", diff: "spicy" },
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
  // Curated words only (no synthetic combinations like "noun of noun")
  const rows = [];
  rows.push(...BASE_WORD_BANK);
  rows.push(...NOUNS);
  rows.push(...ADJECTIVES);
  rows.push(...VERB_PHRASES);
  rows.push(...KATA_LOANWORDS);
  return uniqByKana(rows);
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
   SENTENCES (250) — curated bank
   ----------------------------- */

export const SENT_ITEMS = [
  { type: "sentence", kana: "トイレはどこですか", accepted: ["toire wa doko desu ka"], meaning: "Where is the toilet?", difficulty: "easy", category: "travel", script: "both" },
  { type: "sentence", kana: "えきはどこですか", accepted: ["eki wa doko desu ka"], meaning: "Where is the station?", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "ホテルはどこですか", accepted: ["hoteru wa doko desu ka"], meaning: "Where is the hotel?", difficulty: "easy", category: "travel", script: "both" },
  { type: "sentence", kana: "コンビニはどこですか", accepted: ["konbini wa doko desu ka"], meaning: "Where is the convenience store?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "レストランはどこですか", accepted: ["resutoran wa doko desu ka"], meaning: "Where is the restaurant?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "くうこうはどこですか", accepted: ["kuukou wa doko desu ka"], meaning: "Where is the airport?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "こうえんはどこですか", accepted: ["kouen wa doko desu ka"], meaning: "Where is the park?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "すみません、トイレはどこですか", accepted: ["sumimasen toire wa doko desu ka"], meaning: "Excuse me, where is the toilet?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "すみません、えきはどこですか", accepted: ["sumimasen eki wa doko desu ka"], meaning: "Excuse me, where is the station?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "すみません、ホテルはどこですか", accepted: ["sumimasen hoteru wa doko desu ka"], meaning: "Excuse me, where is the hotel?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "すみません、コンビニはどこですか", accepted: ["sumimasen konbini wa doko desu ka"], meaning: "Excuse me, where is the convenience store?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "すみません、レストランはどこですか", accepted: ["sumimasen resutoran wa doko desu ka"], meaning: "Excuse me, where is the restaurant?", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "すみません、くうこうはどこですか", accepted: ["sumimasen kuukou wa doko desu ka"], meaning: "Excuse me, where is the airport?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "こんにちは", accepted: ["konnichiwa"], meaning: "Hello.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "こんばんは", accepted: ["konbanwa"], meaning: "Good evening.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "ありがとう", accepted: ["arigatou"], meaning: "Thank you.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "ありがとうございます", accepted: ["arigatou gozaimasu"], meaning: "Thank you (polite).", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "すみません", accepted: ["sumimasen"], meaning: "Excuse me / sorry.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "だいじょうぶです、ありがとう", accepted: ["daijoubu desu arigatou"], meaning: "I’m okay, thank you.", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "わかりません", accepted: ["wakarimasen"], meaning: "I don’t understand.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "えいごはできますか", accepted: ["eigo wa dekimasu ka"], meaning: "Do you speak English?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "ゆっくりおねがいします", accepted: ["yukkuri onegaishimasu"], meaning: "Slowly, please.", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "もういちどいってください", accepted: ["mou ichido itte kudasai"], meaning: "Please say it one more time.", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "これをください", accepted: ["kore o kudasai"], meaning: "This, please.", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "てつだってください", accepted: ["tetsudatte kudasai"], meaning: "Please help me.", difficulty: "spicy", category: "travel", script: "hira" },
  { type: "sentence", kana: "これはなんですか", accepted: ["kore wa nan desu ka"], meaning: "What is this?", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "それはなんですか", accepted: ["sore wa nan desu ka"], meaning: "What is that?", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "しゃしんをとってもいいですか", accepted: ["shashin o totte mo ii desu ka"], meaning: "May I take a photo?", difficulty: "spicy", category: "travel", script: "hira" },
  { type: "sentence", kana: "ここでいいですか", accepted: ["koko de ii desu ka"], meaning: "Is it okay here?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "わたしはロンドンからきました", accepted: ["watashi wa rondon kara kimashita"], meaning: "I came from London.", difficulty: "standard", category: "travel", script: "both" },
  { type: "sentence", kana: "にほんごはすこしだけです", accepted: ["nihongo wa sukoshi dake desu"], meaning: "My Japanese is only a little.", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "おすすめはなんですか", accepted: ["osusume wa nan desu ka"], meaning: "What do you recommend?", difficulty: "standard", category: "travel", script: "hira" },
  { type: "sentence", kana: "それはいくらですか", accepted: ["sore wa ikura desu ka"], meaning: "How much is that?", difficulty: "easy", category: "travel", script: "hira" },
  { type: "sentence", kana: "すみません、たすけてください", accepted: ["sumimasen tasukete kudasai"], meaning: "Excuse me, please help.", difficulty: "spicy", category: "travel", script: "hira" },
  { type: "sentence", kana: "すみません、やくきょくはどこですか", accepted: ["sumimasen yakkyoku wa doko desu ka"], meaning: "Excuse me, where is the pharmacy?", difficulty: "spicy", category: "travel", script: "hira" },

  { type: "sentence", kana: "みずをください", accepted: ["mizu o kudasai"], meaning: "Water, please.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おちゃをください", accepted: ["ocha o kudasai"], meaning: "Tea, please.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "コーヒーをください", accepted: ["koohii o kudasai"], meaning: "Coffee, please.", difficulty: "standard", category: "food_drink", script: "both" },
  { type: "sentence", kana: "ごはんをください", accepted: ["gohan o kudasai"], meaning: "Rice / A Meal, please.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "らーめんをください", accepted: ["raamen o kudasai"], meaning: "Ramen, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "すしをください", accepted: ["sushi o kudasai"], meaning: "Sushi, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "てんぷらをください", accepted: ["tenpura o kudasai"], meaning: "Tempura, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "ビールをください", accepted: ["biiru o kudasai"], meaning: "Beer, please.", difficulty: "standard", category: "food_drink", script: "kata" },
  { type: "sentence", kana: "みずをひとつください", accepted: ["mizu o hitotsu kudasai"], meaning: "One water, please.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おにぎりをひとつください", accepted: ["onigiri o hitotsu kudasai"], meaning: "One onigiri, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "みずをふたつください", accepted: ["mizu o futatsu kudasai"], meaning: "Two water, please.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おにぎりをふたつください", accepted: ["onigiri o futatsu kudasai"], meaning: "Two onigiri, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "みずをみっつください", accepted: ["mizu o mittsu kudasai"], meaning: "Three water, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おにぎりをみっつください", accepted: ["onigiri o mittsu kudasai"], meaning: "Three onigiri, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "メニューをください", accepted: ["menyuu o kudasai"], meaning: "Menu, please.", difficulty: "standard", category: "food_drink", script: "kata" },
  { type: "sentence", kana: "おすすめをおしえてください", accepted: ["osusume o oshiete kudasai"], meaning: "Please tell me what you recommend.", difficulty: "spicy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "これにします", accepted: ["kore ni shimasu"], meaning: "I’ll have this.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おいしいです", accepted: ["oishii desu"], meaning: "It’s delicious.", difficulty: "easy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おみずをもういちどください", accepted: ["omizu o mou ichido kudasai"], meaning: "Water again, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "ベジタリアンです", accepted: ["bejitarian desu"], meaning: "I’m vegetarian.", difficulty: "spicy", category: "food_drink", script: "kata" },
  { type: "sentence", kana: "アレルギーがあります", accepted: ["arerugii ga arimasu"], meaning: "I have an allergy.", difficulty: "spicy", category: "food_drink", script: "kata" },
  { type: "sentence", kana: "これはアレルギーがはいっていますか", accepted: ["kore wa arerugii ga haitte imasu ka"], meaning: "Does this contain allergens?", difficulty: "spicy", category: "food_drink", script: "both" },
  { type: "sentence", kana: "からくしないでください", accepted: ["karaku shinaide kudasai"], meaning: "Please don’t make it spicy.", difficulty: "spicy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おかいけいおねがいします", accepted: ["okaikei onegaishimasu"], meaning: "The bill, please.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "ここでたべます", accepted: ["koko de tabemasu"], meaning: "I’ll eat here.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "もちかえりです", accepted: ["mochikaeri desu"], meaning: "To go / takeaway.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "おさけはのみません", accepted: ["osake wa nomimasen"], meaning: "I don’t drink alcohol.", difficulty: "standard", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "コーヒーはありますか", accepted: ["koohii wa arimasu ka"], meaning: "Do you have coffee?", difficulty: "standard", category: "food_drink", script: "both" },
  { type: "sentence", kana: "みずはむりょうですか", accepted: ["mizu wa muryou desu ka"], meaning: "Is water free?", difficulty: "spicy", category: "food_drink", script: "hira" },
  { type: "sentence", kana: "すこしまってください", accepted: ["sukoshi matte kudasai"], meaning: "Please wait a moment.", difficulty: "standard", category: "food_drink", script: "hira" },

  { type: "sentence", kana: "でんしゃはどこですか", accepted: ["densha wa doko desu ka"], meaning: "Where is the train?", difficulty: "easy", category: "transport", script: "hira" },
  { type: "sentence", kana: "バスはどこですか", accepted: ["basu wa doko desu ka"], meaning: "Where is the bus?", difficulty: "standard", category: "transport", script: "kata" },
  { type: "sentence", kana: "タクシーはどこですか", accepted: ["takushii wa doko desu ka"], meaning: "Where is the taxi?", difficulty: "standard", category: "transport", script: "kata" },
  { type: "sentence", kana: "ちかてつはどこですか", accepted: ["chikatetsu wa doko desu ka"], meaning: "Where is the subway?", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "きっぷをください", accepted: ["kippu o kudasai"], meaning: "A ticket, please.", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "このきっぷはどこまでですか", accepted: ["kono kippu wa doko made desu ka"], meaning: "How far is this ticket valid?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "つぎのでんしゃはなんじですか", accepted: ["tsugi no densha wa nanji desu ka"], meaning: "What time is the next train?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "つぎのバスはいつですか", accepted: ["tsugi no basu wa itsu desu ka"], meaning: "When is the next bus?", difficulty: "spicy", category: "transport", script: "both" },
  { type: "sentence", kana: "このでんしゃはとうきょうにいきますか", accepted: ["kono densha wa toukyou ni ikimasu ka"], meaning: "Does this train go to Tokyo?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "ここはホームですか", accepted: ["koko wa hoomu desu ka"], meaning: "Is this the platform?", difficulty: "standard", category: "transport", script: "both" },
  { type: "sentence", kana: "いちばんせんはどこですか", accepted: ["ichiban sen wa doko desu ka"], meaning: "Where is platform 1?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "のりかえはありますか", accepted: ["norikae wa arimasu ka"], meaning: "Do I need to transfer?", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "このせきはあいていますか", accepted: ["kono seki wa aite imasu ka"], meaning: "Is this seat free?", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "すみません、ここにすわってもいいですか", accepted: ["sumimasen koko ni suwatte mo ii desu ka"], meaning: "Excuse me, may I sit here?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "タクシーをよんでください", accepted: ["takushii o yonde kudasai"], meaning: "Please call a taxi.", difficulty: "standard", category: "transport", script: "both" },
  { type: "sentence", kana: "ここでとめてください", accepted: ["koko de tomete kudasai"], meaning: "Please stop here.", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "いくらになりますか", accepted: ["ikura ni narimasu ka"], meaning: "How much will it be?", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "クレジットカードはつかえますか", accepted: ["kurejitto kaado wa tsukaemasu ka"], meaning: "Can I use a credit card?", difficulty: "spicy", category: "transport", script: "both" },
  { type: "sentence", kana: "でんしゃがおくれています", accepted: ["densha ga okurete imasu"], meaning: "The train is delayed.", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "このでんしゃはとまりますか", accepted: ["kono densha wa tomarimasu ka"], meaning: "Does this train stop here?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "このバスはこのえきにいきますか", accepted: ["kono basu wa kono eki ni ikimasu ka"], meaning: "Does this bus go to this station?", difficulty: "spicy", category: "transport", script: "both" },
  { type: "sentence", kana: "スイカはつかえますか", accepted: ["suika wa tsukaemasu ka"], meaning: "Can I use Suica?", difficulty: "spicy", category: "transport", script: "kata" },
  { type: "sentence", kana: "いちにちけんはありますか", accepted: ["ichinichi ken wa arimasu ka"], meaning: "Do you have a day pass?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "こうくうけんをください", accepted: ["koukuuken o kudasai"], meaning: "My boarding pass, please.", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "ここはどこですか", accepted: ["koko wa doko desu ka"], meaning: "Where am I?", difficulty: "easy", category: "transport", script: "hira" },
  { type: "sentence", kana: "なんじですか", accepted: ["nanji desu ka"], meaning: "What time is it?", difficulty: "easy", category: "transport", script: "hira" },
  { type: "sentence", kana: "きっぷうりばはどこですか", accepted: ["kippu uriba wa doko desu ka"], meaning: "Where is the ticket office?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "このきっぷでいいですか", accepted: ["kono kippu de ii desu ka"], meaning: "Is this the right ticket?", difficulty: "standard", category: "transport", script: "hira" },
  { type: "sentence", kana: "しんかんせんのりばはどこですか", accepted: ["shinkansen noriba wa doko desu ka"], meaning: "Where is the Shinkansen platform?", difficulty: "spicy", category: "transport", script: "hira" },
  { type: "sentence", kana: "おりるえきはどこですか", accepted: ["oriru eki wa doko desu ka"], meaning: "Which station should I get off at?", difficulty: "spicy", category: "transport", script: "hira" },

  { type: "sentence", kana: "まっすぐいってください", accepted: ["massugu itte kudasai"], meaning: "Go straight, please.", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "みぎにまがってください", accepted: ["migi ni magatte kudasai"], meaning: "Please turn right.", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "ひだりにまがってください", accepted: ["hidari ni magatte kudasai"], meaning: "Please turn left.", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "ここをみぎですか", accepted: ["koko o migi desu ka"], meaning: "Is it right here?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "ちずはありますか", accepted: ["chizu wa arimasu ka"], meaning: "Do you have a map?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "このみちでいいですか", accepted: ["kono michi de ii desu ka"], meaning: "Is this the right way?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "どのくらいかかりますか", accepted: ["dono kurai kakarimasu ka"], meaning: "How long does it take?", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "あるいていけますか", accepted: ["aruite ikemasu ka"], meaning: "Can I walk there?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "ちかいですか", accepted: ["chikai desu ka"], meaning: "Is it close?", difficulty: "easy", category: "directions", script: "hira" },
  { type: "sentence", kana: "とおいですか", accepted: ["tooi desu ka"], meaning: "Is it far?", difficulty: "easy", category: "directions", script: "hira" },
  { type: "sentence", kana: "つぎのしんごうでみぎです", accepted: ["tsugi no shingou de migi desu"], meaning: "Turn right at the next traffic light.", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "つぎのかどでひだりです", accepted: ["tsugi no kado de hidari desu"], meaning: "Turn left at the next corner.", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "このはしをわたってください", accepted: ["kono hashi o watatte kudasai"], meaning: "Please cross this bridge.", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "えきまであるいてなんぷんですか", accepted: ["eki made aruite nanpun desu ka"], meaning: "How many minutes on foot to the station?", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "タクシーでどのくらいですか", accepted: ["takushii de dono kurai desu ka"], meaning: "How long by taxi?", difficulty: "spicy", category: "directions", script: "both" },
  { type: "sentence", kana: "いりぐちはどこですか", accepted: ["iriguchi wa doko desu ka"], meaning: "Where is the entrance?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "でぐちはどこですか", accepted: ["deguchi wa doko desu ka"], meaning: "Where is the exit?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "エレベーターはどこですか", accepted: ["erebeetaa wa doko desu ka"], meaning: "Where is the elevator?", difficulty: "spicy", category: "directions", script: "kata" },
  { type: "sentence", kana: "エスカレーターはどこですか", accepted: ["esukareetaa wa doko desu ka"], meaning: "Where is the escalator?", difficulty: "spicy", category: "directions", script: "kata" },
  { type: "sentence", kana: "かいだんはどこですか", accepted: ["kaidan wa doko desu ka"], meaning: "Where are the stairs?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "ばんごうはどこですか", accepted: ["bangou wa doko desu ka"], meaning: "Where is the number?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "このへんにトイレはありますか", accepted: ["kono hen ni toire wa arimasu ka"], meaning: "Is there a toilet around here?", difficulty: "spicy", category: "directions", script: "both" },
  { type: "sentence", kana: "このへんにコンビニはありますか", accepted: ["kono hen ni konbini wa arimasu ka"], meaning: "Is there a convenience store around here?", difficulty: "spicy", category: "directions", script: "both" },
  { type: "sentence", kana: "このへんにえきはありますか", accepted: ["kono hen ni eki wa arimasu ka"], meaning: "Is there a station around here?", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "それはどっちですか", accepted: ["sore wa docchi desu ka"], meaning: "Which way is that?", difficulty: "standard", category: "directions", script: "hira" },
  { type: "sentence", kana: "みちにまよいました", accepted: ["michi ni mayoimashita"], meaning: "I’m lost.", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "ここであっていますか", accepted: ["koko de atte imasu ka"], meaning: "Am I in the right place?", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "このビルのなかですか", accepted: ["kono biru no naka desu ka"], meaning: "Is it inside this building?", difficulty: "spicy", category: "directions", script: "both" },
  { type: "sentence", kana: "すみません、みちをおしえてください", accepted: ["sumimasen michi o oshiete kudasai"], meaning: "Excuse me, please tell me the way.", difficulty: "spicy", category: "directions", script: "hira" },
  { type: "sentence", kana: "ついてきてください", accepted: ["tsuite kite kudasai"], meaning: "Please come with me.", difficulty: "standard", category: "directions", script: "hira" },

  { type: "sentence", kana: "よやくしています", accepted: ["yoyaku shite imasu"], meaning: "I have a reservation.", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "チェックインをおねがいします", accepted: ["chekku in o onegaishimasu"], meaning: "Check-in, please.", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "チェックアウトをおねがいします", accepted: ["chekku auto o onegaishimasu"], meaning: "Check-out, please.", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "へやのかぎをください", accepted: ["heya no kagi o kudasai"], meaning: "Room key, please.", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "へやばんごうはなんですか", accepted: ["heya bangou wa nan desu ka"], meaning: "What is the room number?", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "ワイファイはありますか", accepted: ["waifai wa arimasu ka"], meaning: "Do you have Wi-Fi?", difficulty: "spicy", category: "accommodation", script: "kata" },
  { type: "sentence", kana: "ワイファイのパスワードはなんですか", accepted: ["waifai no pasuwaado wa nan desu ka"], meaning: "What’s the Wi-Fi password?", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "あさごはんはなんじからですか", accepted: ["asa gohan wa nanji kara desu ka"], meaning: "What time is breakfast from?", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "たおるをください", accepted: ["taoru o kudasai"], meaning: "Towels, please.", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "もうひとつたおるをください", accepted: ["mou hitotsu taoru o kudasai"], meaning: "One more towel, please.", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "へやをかえてください", accepted: ["heya o kaete kudasai"], meaning: "Please change my room.", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "へやがさむいです", accepted: ["heya ga samui desu"], meaning: "The room is cold.", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "へやがあついです", accepted: ["heya ga atsui desu"], meaning: "The room is hot.", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "エアコンがうごきません", accepted: ["eakon ga ugokimasen"], meaning: "The air conditioner doesn’t work.", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "シャワーがこわれています", accepted: ["shawaa ga kowarete imasu"], meaning: "The shower is broken.", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "おふろはどこですか", accepted: ["ofuro wa doko desu ka"], meaning: "Where is the bath?", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "せんたくはできますか", accepted: ["sentaku wa dekimasu ka"], meaning: "Can I do laundry?", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "にもつをあずけてもいいですか", accepted: ["nimotsu o azukete mo ii desu ka"], meaning: "Can you hold my luggage?", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "よやくのなまえはロナンです", accepted: ["yoyaku no namae wa ronan desu"], meaning: "The reservation name is Ronan.", difficulty: "spicy", category: "accommodation", script: "both" },
  { type: "sentence", kana: "よやくをかくにんしてください", accepted: ["yoyaku o kakunin shite kudasai"], meaning: "Please confirm my reservation.", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "きょうはとまれますか", accepted: ["kyou wa tomaremasu ka"], meaning: "Can I stay tonight?", difficulty: "standard", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "つぎのひのよやくもあります", accepted: ["tsugi no hi no yoyaku mo arimasu"], meaning: "I also have a reservation for the next day.", difficulty: "spicy", category: "accommodation", script: "hira" },
  { type: "sentence", kana: "アーリーチェックインはできますか", accepted: ["aarii chekku in wa dekimasu ka"], meaning: "Can I check in early?", difficulty: "spicy", category: "accommodation", script: "kata" },
  { type: "sentence", kana: "レイトチェックアウトはできますか", accepted: ["reito chekku auto wa dekimasu ka"], meaning: "Can I check out late?", difficulty: "spicy", category: "accommodation", script: "kata" },
  { type: "sentence", kana: "かいけいをおねがいします", accepted: ["kaikei o onegaishimasu"], meaning: "Payment, please.", difficulty: "standard", category: "accommodation", script: "hira" },

  { type: "sentence", kana: "これをみせてください", accepted: ["kore o misete kudasai"], meaning: "Please show me this.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これをください", accepted: ["kore o kudasai"], meaning: "This, please.", difficulty: "easy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "それをください", accepted: ["sore o kudasai"], meaning: "That, please.", difficulty: "easy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これはいくらですか", accepted: ["kore wa ikura desu ka"], meaning: "How much is this?", difficulty: "easy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "たかいです", accepted: ["takai desu"], meaning: "It’s expensive.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "やすいです", accepted: ["yasui desu"], meaning: "It’s cheap.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "もうすこしやすくなりますか", accepted: ["mou sukoshi yasuku narimasu ka"], meaning: "Can it be a little cheaper?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "サイズはありますか", accepted: ["saizu wa arimasu ka"], meaning: "Do you have my size?", difficulty: "standard", category: "shopping", script: "kata" },
  { type: "sentence", kana: "もうひとつありますか", accepted: ["mou hitotsu arimasu ka"], meaning: "Do you have another one?", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "べつのいろはありますか", accepted: ["betsu no iro wa arimasu ka"], meaning: "Do you have another color?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これをためしてもいいですか", accepted: ["kore o tameshite mo ii desu ka"], meaning: "May I try this?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "しちゃくしつはどこですか", accepted: ["shichakushitsu wa doko desu ka"], meaning: "Where is the fitting room?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "レシートをください", accepted: ["reshiito o kudasai"], meaning: "Receipt, please.", difficulty: "standard", category: "shopping", script: "kata" },
  { type: "sentence", kana: "ふくろをください", accepted: ["fukuro o kudasai"], meaning: "A bag, please.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "クレジットカードでいいですか", accepted: ["kurejitto kaado de ii desu ka"], meaning: "Is credit card okay?", difficulty: "spicy", category: "shopping", script: "both" },
  { type: "sentence", kana: "げんきんでしはらいます", accepted: ["genkin de shiharaimasu"], meaning: "I’ll pay in cash.", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これをキャンセルできますか", accepted: ["kyanseru dekimasu ka"], meaning: "Can I cancel this?", difficulty: "spicy", category: "shopping", script: "both" },
  { type: "sentence", kana: "へんぴんできますか", accepted: ["henpin dekimasu ka"], meaning: "Can I return it?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "おみやげをさがしています", accepted: ["omiyage o sagashite imasu"], meaning: "I’m looking for a souvenir.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "なにがおすすめですか", accepted: ["nani ga osusume desu ka"], meaning: "What do you recommend?", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これとおなじものはありますか", accepted: ["kore to onaji mono wa arimasu ka"], meaning: "Do you have the same thing as this?", difficulty: "spicy", category: "shopping", script: "hira" },
  { type: "sentence", kana: "べつのサイズをください", accepted: ["betsu no saizu o kudasai"], meaning: "Another size, please.", difficulty: "spicy", category: "shopping", script: "both" },
  { type: "sentence", kana: "これをふたつください", accepted: ["kore o futatsu kudasai"], meaning: "Two of these, please.", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "このカードはつかえますか", accepted: ["kono kaado wa tsukaemasu ka"], meaning: "Can I use this card?", difficulty: "spicy", category: "shopping", script: "both" },
  { type: "sentence", kana: "しはらいはどこですか", accepted: ["shiharai wa doko desu ka"], meaning: "Where do I pay?", difficulty: "standard", category: "shopping", script: "hira" },
  { type: "sentence", kana: "これをひとつください", accepted: ["kore o hitotsu kudasai"], meaning: "One of these, please.", difficulty: "standard", category: "shopping", script: "hira" },

  { type: "sentence", kana: "はじめまして", accepted: ["hajimemashite"], meaning: "Nice to meet you.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "わたしはロナンです", accepted: ["watashi wa ronan desu"], meaning: "I’m Ronan.", difficulty: "easy", category: "social", script: "both" },
  { type: "sentence", kana: "おなまえはなんですか", accepted: ["onamae wa nan desu ka"], meaning: "What’s your name?", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "よろしくおねがいします", accepted: ["yoroshiku onegaishimasu"], meaning: "Nice to meet you / please be kind to me.", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "おげんきですか", accepted: ["ogenki desu ka"], meaning: "How are you?", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "げんきです", accepted: ["genki desu"], meaning: "I’m good.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "どこからきましたか", accepted: ["doko kara kimashita ka"], meaning: "Where are you from?", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "ロンドンからきました", accepted: ["rondon kara kimashita"], meaning: "I’m from London.", difficulty: "standard", category: "social", script: "both" },
  { type: "sentence", kana: "にほんがだいすきです", accepted: ["nihon ga daisuki desu"], meaning: "I love Japan.", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "いまひまですか", accepted: ["ima hima desu ka"], meaning: "Are you free now?", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "いっしょにのみませんか", accepted: ["issho ni nomimasen ka"], meaning: "Would you like to drink together?", difficulty: "spicy", category: "social", script: "hira" },
  { type: "sentence", kana: "いっしょにたべませんか", accepted: ["issho ni tabemasen ka"], meaning: "Would you like to eat together?", difficulty: "spicy", category: "social", script: "hira" },
  { type: "sentence", kana: "ラインはやっていますか", accepted: ["rain wa yatte imasu ka"], meaning: "Do you use LINE?", difficulty: "spicy", category: "social", script: "both" },
  { type: "sentence", kana: "インスタグラムはやっていますか", accepted: ["insutaguramu wa yatte imasu ka"], meaning: "Do you use Instagram?", difficulty: "spicy", category: "social", script: "kata" },
  { type: "sentence", kana: "またね", accepted: ["matane"], meaning: "See you.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "またあした", accepted: ["mata ashita"], meaning: "See you tomorrow.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "すてきです", accepted: ["suteki desu"], meaning: "That’s lovely.", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "たのしかったです", accepted: ["tanoshikatta desu"], meaning: "It was fun.", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "それはいいですね", accepted: ["sore wa ii desu ne"], meaning: "That sounds good.", difficulty: "standard", category: "social", script: "hira" },
  { type: "sentence", kana: "そうですね", accepted: ["sou desu ne"], meaning: "Yeah, that’s right.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "ほんとうですか", accepted: ["hontou desu ka"], meaning: "Really?", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "ちょっとだけ", accepted: ["chotto dake"], meaning: "Just a little.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "だいじょうぶです", accepted: ["daijoubu desu"], meaning: "It’s okay.", difficulty: "easy", category: "social", script: "hira" },
  { type: "sentence", kana: "すみません、おくれます", accepted: ["sumimasen okuremasu"], meaning: "Sorry, I’ll be late.", difficulty: "spicy", category: "social", script: "hira" },
  { type: "sentence", kana: "いまむかっています", accepted: ["ima mukatte imasu"], meaning: "I’m on my way now.", difficulty: "spicy", category: "social", script: "hira" },

  { type: "sentence", kana: "いまなんじですか", accepted: ["ima nanji desu ka"], meaning: "What time is it now?", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "きょうはなんようびですか", accepted: ["kyou wa nan'youbi desu ka"], meaning: "What day is it today?", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "あしたはひまですか", accepted: ["ashita wa hima desu ka"], meaning: "Are you free tomorrow?", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "きょうはやすみです", accepted: ["kyou wa yasumi desu"], meaning: "I’m off today.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "あとでいきます", accepted: ["atode ikimasu"], meaning: "I’ll go later.", difficulty: "easy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "いまはむりです", accepted: ["ima wa muri desu"], meaning: "I can’t right now.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "もうすこしまってください", accepted: ["mou sukoshi matte kudasai"], meaning: "Please wait a little longer.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "なんぷんですか", accepted: ["nanpun desu ka"], meaning: "How many minutes?", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "なんじにあいますか", accepted: ["nanji ni aimasu ka"], meaning: "What time shall we meet?", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "にじです", accepted: ["niji desu"], meaning: "It’s 2 o’clock.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "ごぜんですか、ごごですか", accepted: ["gozen desu ka gogo desu ka"], meaning: "AM or PM?", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "これでいいですか", accepted: ["kore de ii desu ka"], meaning: "Is this okay?", difficulty: "easy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "おかねがたりません", accepted: ["okane ga tarimasen"], meaning: "I don’t have enough money.", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "おつりをください", accepted: ["otsuri o kudasai"], meaning: "Change, please.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "りょうしゅうしょをください", accepted: ["ryoushuusho o kudasai"], meaning: "Receipt, please.", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "いちまんえんさつはつかえますか", accepted: ["ichiman en satsu wa tsukaemasu ka"], meaning: "Can I use a 10,000-yen bill?", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "これをこわさないでください", accepted: ["kore o kowasanaide kudasai"], meaning: "Please don’t break this.", difficulty: "spicy", category: "time_money", script: "hira" },
  { type: "sentence", kana: "いそいでください", accepted: ["isoide kudasai"], meaning: "Please hurry.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "ゆっくりでいいです", accepted: ["yukkuri de ii desu"], meaning: "Slowly is fine.", difficulty: "standard", category: "time_money", script: "hira" },
  { type: "sentence", kana: "いくらですか", accepted: ["ikura desu ka"], meaning: "How much is it?", difficulty: "easy", category: "time_money", script: "hira" },

  { type: "sentence", kana: "たすけてください", accepted: ["tasukete kudasai"], meaning: "Please help!", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "けいさつをよんでください", accepted: ["keisatsu o yonde kudasai"], meaning: "Please call the police.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "きゅうきゅうしゃをよんでください", accepted: ["kyuukyuusha o yonde kudasai"], meaning: "Please call an ambulance.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "びょういんはどこですか", accepted: ["byouin wa doko desu ka"], meaning: "Where is the hospital?", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "こうばんはどこですか", accepted: ["kouban wa doko desu ka"], meaning: "Where is the police box?", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "やくきょくはどこですか", accepted: ["yakkyoku wa doko desu ka"], meaning: "Where is the pharmacy?", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "きもちわるいです", accepted: ["kimochi warui desu"], meaning: "I feel sick.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "いたいです", accepted: ["itai desu"], meaning: "It hurts.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "あたまがいたいです", accepted: ["atama ga itai desu"], meaning: "I have a headache.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "おなかがいたいです", accepted: ["onaka ga itai desu"], meaning: "I have a stomachache.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "くすりをください", accepted: ["kusuri o kudasai"], meaning: "Medicine, please.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "アレルギーです", accepted: ["arerugii desu"], meaning: "I have an allergy.", difficulty: "spicy", category: "emergencies", script: "kata" },
  { type: "sentence", kana: "これをなくしました", accepted: ["kore o nakushimashita"], meaning: "I lost this.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "さいふをなくしました", accepted: ["saifu o nakushimashita"], meaning: "I lost my wallet.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "スマートフォンをなくしました", accepted: ["sumaato fon o nakushimashita"], meaning: "I lost my smartphone.", difficulty: "spicy", category: "emergencies", script: "kata" },
  { type: "sentence", kana: "パスポートをなくしました", accepted: ["pasupooto o nakushimashita"], meaning: "I lost my passport.", difficulty: "spicy", category: "emergencies", script: "kata" },
  { type: "sentence", kana: "だれかにぬすまれました", accepted: ["dareka ni nusumaremashita"], meaning: "It was stolen.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "ここはあぶないですか", accepted: ["koko wa abunai desu ka"], meaning: "Is it dangerous here?", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "にげましょう", accepted: ["nigemashou"], meaning: "Let’s get away / run.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "おねがいします", accepted: ["onegaishimasu"], meaning: "Please.", difficulty: "easy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "こまっています", accepted: ["komatte imasu"], meaning: "I’m in trouble.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "まよいました", accepted: ["mayoimashita"], meaning: "I’m lost.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "でんわをかしてください", accepted: ["denwa o kashite kudasai"], meaning: "Please lend me a phone.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "でんわばんごうはこれです", accepted: ["denwa bangou wa kore desu"], meaning: "This is my phone number.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "たばこはだめです", accepted: ["tabako wa dame desu"], meaning: "No smoking.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "ここにいかないでください", accepted: ["koko ni ikanaide kudasai"], meaning: "Please don’t go here.", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "さわらないでください", accepted: ["sawaranaide kudasai"], meaning: "Please don’t touch.", difficulty: "standard", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "たちいりきんしですか", accepted: ["tachiiri kinshi desu ka"], meaning: "Is entry prohibited?", difficulty: "spicy", category: "emergencies", script: "hira" },
  { type: "sentence", kana: "しんこきゅうしましょう", accepted: ["shinkokyuu shimashou"], meaning: "Let’s take a deep breath.", difficulty: "spicy", category: "emergencies", script: "hira" },
];

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