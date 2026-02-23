// Content pools + item builders (ES module)
import { KANA_MAP } from "./kana-map.js";

const WORDS_BASE = [
["こんにちは","konnichiwa","Hello / good afternoon"],
    ["おはよう","ohayou","Good morning (casual)"],
    ["おはようございます","ohayou gozaimasu","Good morning (polite)"],
    ["こんばんは","konbanwa","Good evening"],
    ["ありがとう","arigatou","Thank you"],
    ["ありがとうございます","arigatou gozaimasu","Thank you (polite)"],
    ["すみません","sumimasen","Excuse me / sorry"],
    ["ごめんなさい","gomen nasai","I’m sorry"],
    ["はい","hai","Yes"],
    ["いいえ","iie","No"],
    ["だいじょうぶ","daijoubu","It’s okay / all right"],
    ["おねがいします","onegaishimasu","Please (polite request)"],
    ["ください","kudasai","Please (request)"],
    ["どうぞ","douzo","Here you go / please"],
    ["わかりました","wakarimashita","I understand"],
    ["わかりません","wakarimasen","I don’t understand"],
    ["もういちど","mou ichido","One more time"],
    ["ゆっくり","yukkuri","Slowly"],
    ["ちょっと","chotto","A bit / a moment"],
    ["いま","ima","Now"],
    ["あとで","atode","Later"],
    ["なまえ","namae","Name"],
    ["ともだち","tomodachi","Friend"],
    ["かぞく","kazoku","Family"],
    ["ひと","hito","Person"],
    ["こども","kodomo","Child"],
    ["せんせい","sensei","Teacher"],
    ["がくせい","gakusei","Student"],
    ["ほん","hon","Book"],
    ["かみ","kami","Paper"],
    ["みず","mizu","Water"],
    ["おちゃ","ocha","Tea"],
    ["ごはん","gohan","Meal / cooked rice"],
    ["ぱん","pan","Bread"],
    ["おにぎり","onigiri","Rice ball"],
    ["すし","sushi","Sushi"],
    ["てんぷら","tenpura","Tempura"],
    ["らーめん","raamen","Ramen"],
    ["うどん","udon","Udon noodles"],
    ["そば","soba","Soba noodles"],
    ["やさい","yasai","Vegetables"],
    ["くだもの","kudamono","Fruit"],
    ["にく","niku","Meat"],
    ["たまご","tamago","Egg"],
    ["おいしい","oishii","Delicious"],
    ["たのしい","tanoshii","Fun"],
    ["つかれた","tsukareta","I’m tired"],
    ["ねむい","nemui","Sleepy"],
    ["あつい","atsui","Hot"],
    ["さむい","samui","Cold"],
    ["えき","eki","Station"],
    ["でんしゃ","densha","Train"],
    ["くうこう","kuukou","Airport"],
    ["みぎ","migi","Right"],
    ["ひだり","hidari","Left"],
    ["まっすぐ","massugu","Straight ahead"],
    ["おかね","okane","Money"],
    ["いくら","ikura","How much"],
    ["ホテル","hoteru","Hotel"],
    ["レストラン","resutoran","Restaurant"],
    ["コーヒー","koohii","Coffee"],
    ["アイスクリーム","aisukuriimu","Ice cream"],
    ["タクシー","takushii","Taxi"],
    ["コンビニ","konbini","Convenience store"],
    ["チケット","chiketto","Ticket"],
    ["パスポート","pasupooto","Passport"],
    ["トイレ","toire","Toilet / restroom"],
    ["スマホ","sumaho","Smartphone"],
    ["ワイファイ","waifai","Wi-Fi"],
];

const WORDS_EXTRA = [
["これ","kore","This"],["それ","sore","That (near you)"],["あれ","are","That (over there)"],
    ["ここ","koko","Here"],["そこ","soko","There (near you)"],["あそこ","asoko","Over there"],
    ["どこ","doko","Where"],["なに","nani","What"],["いつ","itsu","When"],["だれ","dare","Who"],
    ["きょう","kyou","Today"],["あした","ashita","Tomorrow"],["きのう","kinou","Yesterday"],
    ["げんき","genki","Well / healthy"],["いそがしい","isogashii","Busy"],["ひま","hima","Free time"],
    ["すき","suki","Like"],["きらい","kirai","Dislike"],["だいすき","daisuki","Love / really like"],
    ["かんたん","kantan","Easy / simple"],["むずかしい","muzukashii","Difficult"],["だいじ","daiji","Important"],
    ["たぶん","tabun","Maybe"],["ぜんぶ","zenbu","All / everything"],
    ["まだ","mada","Not yet"],["もう","mou","Already"],
    ["はじめまして","hajimemashite","Nice to meet you"],
    ["よろしく","yoroshiku","Nice to meet you / please be kind"],
    ["もしもし","moshimoshi","Hello (on the phone)"],
    ["あさ","asa","Morning"],["ひる","hiru","Daytime"],["よる","yoru","Night"],
    ["はる","haru","Spring"],["なつ","natsu","Summer"],["あき","aki","Autumn"],["ふゆ","fuyu","Winter"],
    ["くるま","kuruma","Car"],["じてんしゃ","jitensha","Bicycle"],
    ["ねこ","neko","Cat"],["いぬ","inu","Dog"],["とり","tori","Bird"],
    ["いえ","ie","House"],["へや","heya","Room"],["まど","mado","Window"],["とびら","tobira","Door"],
    ["かばん","kaban","Bag"],["くつ","kutsu","Shoes"],["かさ","kasa","Umbrella"],
    ["アプリ","apuri","App"],["バッテリー","batterii","Battery"],["マップ","mappu","Map"],
    ["サンドイッチ","sandoicchi","Sandwich"],["エレベーター","erebeetaa","Elevator"],
];

export const WORD_ITEMS = [...WORDS_BASE, ...WORDS_EXTRA].map(([kana, romaji, meaning]) => ({
  type: "word",
  kana,
  accepted: [romaji],
  meaning,
  script: /[ァ-ヶー]/.test(kana) ? "kata" : "hira",
}));

export const SENT_ITEMS = [
["なまえはなんですか","namae wa nan desu ka","What is your name?"],
    ["わたしはがくせいです","watashi wa gakusei desu","I am a student."],
    ["すみません、えきはどこですか","sumimasen eki wa doko desu ka","Excuse me, where is the station?"],
    ["これください","kore kudasai","This, please."],
    ["みずをください","mizu o kudasai","Water, please."],
    ["ここでたべます","koko de tabemasu","I’ll eat here."],
    ["もちかえりです","mochikaeri desu","It’s takeaway."],
    ["いくらですか","ikura desu ka","How much is it?"],
    ["だいじょうぶです","daijoubu desu","It’s okay."],
    ["おいしいです","oishii desu","It’s delicious."],
    ["もういちどいってください","mou ichido itte kudasai","Please say it one more time."],
    ["ゆっくりはなしてください","yukkuri hanashite kudasai","Please speak slowly."],
    ["まっすぐいってください","massugu itte kudasai","Please go straight."],
    ["みぎにまがってください","migi ni magatte kudasai","Please turn right."],
    ["ひだりにまがってください","hidari ni magatte kudasai","Please turn left."],
    ["トイレはどこですか","toire wa doko desu ka","Where is the toilet?"],
    ["ホテルはどこですか","hoteru wa doko desu ka","Where is the hotel?"],
    ["コーヒーをください","koohii o kudasai","Coffee, please."],
    ["コンビニはどこですか","konbini wa doko desu ka","Where is the convenience store?"],
    ["タクシーをよんでください","takushii o yonde kudasai","Please call a taxi."],
].map(([kana, romaji, meaning]) => ({
  type: "sentence",
  kana,
  accepted: [romaji],
  meaning,
  script: /[ァ-ヶー]/.test(kana) ? "kata" : "hira",
}));

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
    const { mixChars, mixWords, mixSentences, script, difficulty } = settings;
    const items = [];
    if (mixChars) items.push(...buildCharItems(script, difficulty));

    if (mixWords){
      for (const w of WORD_ITEMS){
        if (script === "hira" && w.script === "kata") continue;
        if (script === "kata" && w.script === "hira") continue;
        items.push(w);
      }
    }

    if (mixSentences){
      for (const s of SENT_ITEMS){
        if (script === "hira" && /[ァ-ヶー]/.test(s.kana)) continue;
        if (script === "kata" && /[ぁ-ゖゔ]/.test(s.kana)) continue;
        items.push(s);
      }
    }

    return items.length ? items : buildCharItems(script, difficulty);
  }

export { buildCharItems, buildItems };