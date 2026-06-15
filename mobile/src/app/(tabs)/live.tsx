import { colors } from "@/constants/colors";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Result = {
  text: string;
  url: string;
};

type Game = {
  player_1: string;
  player_2: string;
  result: Result;
  player_1_fide_id: number;
  player_2_fide_id: number;
  player_1_display: string;
  player_2_display: string;
  id?: number; // optional — not present on unplayed games
};

type Round = Record<string, Game[]>;

type Tournament = {
  web_url: string;
  rounds: Round;
};

type DaySchedule = Record<string, Tournament>;

type ChessSchedule = Record<string, DaySchedule>;

const chessSchedule: ChessSchedule = {
  "2026-06-14": {
    "3rd Uzchess Cup, Masters 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 8 starts at 10:15 GMT": [
          {
            player_1: "Nepomniachtchi, Ian",
            player_2: "Niemann, Hans Moke",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 4168119,
            player_2_fide_id: 2093596,
            player_1_display: "Nepomniachtchi",
            player_2_display: "Niemann",
          },
          {
            player_1: "Madaminov, Mukhiddin",
            player_2: "Erigaisi Arjun",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 14210703,
            player_2_fide_id: 35009192,
            player_1_display: "Madaminov",
            player_2_display: "Erigaisi",
          },
          {
            player_1: "Theodorou, Nikolas",
            player_2: "Abdusattorov, Nodirbek",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 4262875,
            player_2_fide_id: 14204118,
            player_1_display: "Theodorou",
            player_2_display: "Abdusattorov",
          },
          {
            player_1: "Vokhidov, Shamsiddin",
            player_2: "Vidit, Santosh Gujrathi",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 14204223,
            player_2_fide_id: 5029465,
            player_1_display: "Vokhidov",
            player_2_display: "Vidit",
          },
          {
            player_1: "Yakubboev, Nodirbek",
            player_2: "Mamedyarov, Shakhriyar",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 14203987,
            player_2_fide_id: 13401319,
            player_1_display: "Yakubboev",
            player_2_display: "Mamedyarov",
          },
        ],
      },
    },
    "3rd Uzchess Cup, Challengers 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 8 starts at 10:15 GMT": [
          {
            player_1: "Abdisalimov, Abdimalik",
            player_2: "Kuzubov, Yuriy",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 14206323,
            player_2_fide_id: 14112906,
            player_1_display: "Abdisalimov",
            player_2_display: "Kuzubov",
          },
          {
            player_1: "Jacobson, Brandon",
            player_2: "Suyarov, Mukhammadzokhid",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 30901561,
            player_2_fide_id: 14210495,
            player_1_display: "Jacobson",
            player_2_display: "Suyarov",
          },
          {
            player_1: "Deac, Bogdan-Daniel",
            player_2: "Aditya Mittal",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 1226380,
            player_2_fide_id: 35042025,
            player_1_display: "Deac",
            player_2_display: "Aditya Mittal",
          },
          {
            player_1: "Safarli, Eltaj",
            player_2: "Vakhidov, Jakhongir",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 13402129,
            player_2_fide_id: 14201801,
            player_1_display: "Safarli",
            player_2_display: "Vakhidov",
          },
          {
            player_1: "Muradli, Mahammad",
            player_2: "Atabayev, Saparmyrat",
            result: {
              text: "",
              url: "",
            },
            player_1_fide_id: 13409301,
            player_2_fide_id: 14000571,
            player_1_display: "Muradli",
            player_2_display: "Atabayev",
          },
        ],
      },
    },
  },
  "2026-06-13": {
    "3rd Uzchess Cup, Masters 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 7 starts at 10:15 GMT": [
          {
            player_1: "Yakubboev, Nodirbek",
            player_2: "Nepomniachtchi, Ian",
            result: {
              text: "½ : ½",
              url: "/games/yakubboev-nepomniachtchi-r7-tashkent-2026-06-13",
            },
            id: 10672003,
            player_1_fide_id: 14203987,
            player_2_fide_id: 4168119,
            player_1_display: "Yakubboev",
            player_2_display: "Nepomniachtchi",
          },
          {
            player_1: "Mamedyarov, Shakhriyar",
            player_2: "Vokhidov, Shamsiddin",
            result: {
              text: "½ : ½",
              url: "/games/mamedyarov-vokhidov-r7-tashkent-2026-06-13",
            },
            id: 10672001,
            player_1_fide_id: 13401319,
            player_2_fide_id: 14204223,
            player_1_display: "Mamedyarov",
            player_2_display: "Vokhidov",
          },
          {
            player_1: "Vidit, Santosh Gujrathi",
            player_2: "Theodorou, Nikolas",
            result: {
              text: "1 : 0",
              url: "/games/vidit-theodorou-r7-tashkent-2026-06-13",
            },
            id: 10672021,
            player_1_fide_id: 5029465,
            player_2_fide_id: 4262875,
            player_1_display: "Vidit",
            player_2_display: "Theodorou",
          },
          {
            player_1: "Abdusattorov, Nodirbek",
            player_2: "Madaminov, Mukhiddin",
            result: {
              text: "½ : ½",
              url: "/games/abdusattorov-madaminov-r7-tashkent-2026-06-13",
            },
            id: 10672029,
            player_1_fide_id: 14204118,
            player_2_fide_id: 14210703,
            player_1_display: "Abdusattorov",
            player_2_display: "Madaminov",
          },
          {
            player_1: "Erigaisi Arjun",
            player_2: "Niemann, Hans Moke",
            result: {
              text: "½ : ½",
              url: "/games/erigaisi-niemann-r7-tashkent-2026-06-13",
            },
            id: 10672023,
            player_1_fide_id: 35009192,
            player_2_fide_id: 2093596,
            player_1_display: "Erigaisi",
            player_2_display: "Niemann",
          },
        ],
      },
    },
    "3rd Uzchess Cup, Challengers 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 7 starts at 10:15 GMT": [
          {
            player_1: "Muradli, Mahammad",
            player_2: "Abdisalimov, Abdimalik",
            result: {
              text: "1 : 0",
              url: "/games/muradli-abdisalimov-r7-tashkent-2026-06-13",
            },
            id: 10672018,
            player_1_fide_id: 13409301,
            player_2_fide_id: 14206323,
            player_1_display: "Muradli",
            player_2_display: "Abdisalimov",
          },
          {
            player_1: "Atabayev, Saparmyrat",
            player_2: "Safarli, Eltaj",
            result: {
              text: "0 : 1",
              url: "/games/atabayev-safarli-r7-tashkent-2026-06-13",
            },
            id: 10672009,
            player_1_fide_id: 14000571,
            player_2_fide_id: 13402129,
            player_1_display: "Atabayev",
            player_2_display: "Safarli",
          },
          {
            player_1: "Vakhidov, Jakhongir",
            player_2: "Deac, Bogdan-Daniel",
            result: {
              text: "0 : 1",
              url: "/games/vakhidov-deac-r7-tashkent-2026-06-13",
            },
            id: 10672011,
            player_1_fide_id: 14201801,
            player_2_fide_id: 1226380,
            player_1_display: "Vakhidov",
            player_2_display: "Deac",
          },
          {
            player_1: "Aditya Mittal",
            player_2: "Jacobson, Brandon",
            result: {
              text: "1 : 0",
              url: "/games/aditya-jacobson-r7-tashkent-2026-06-13",
            },
            id: 10672010,
            player_1_fide_id: 35042025,
            player_2_fide_id: 30901561,
            player_1_display: "Aditya Mittal",
            player_2_display: "Jacobson",
          },
          {
            player_1: "Suyarov, Mukhammadzokhid",
            player_2: "Kuzubov, Yuriy",
            result: {
              text: "½ : ½",
              url: "/games/suyarov-kuzubov-r7-tashkent-2026-06-13",
            },
            id: 10672008,
            player_1_fide_id: 14210495,
            player_2_fide_id: 14112906,
            player_1_display: "Suyarov",
            player_2_display: "Kuzubov",
          },
        ],
      },
    },
    "Navara - Blohberger, match 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474854",
      rounds: {
        "Round 6 starts at 13:00 GMT": [
          {
            player_1: "Navara, David",
            player_2: "Blohberger, Felix",
            result: {
              text: "½ : ½",
              url: "/games/navara-blohberger-r6-vienna-2026-06-13",
            },
            id: 10672072,
            player_1_fide_id: 309095,
            player_2_fide_id: 1632051,
            player_1_display: "Navara",
            player_2_display: "Blohberger",
          },
        ],
      },
    },
    "French Top 16 Teams, High Pool 2026": {
      web_url: "https://chartres2026.ffechecs.org/",
      rounds: {
        "Round 3 starts at 12:15 GMT": [
          {
            player_1: "Harikrishna, Pentala",
            player_2: "Ivanchuk, Vasyl",
            result: {
              text: "½ : ½",
              url: "/games/harikrishna-ivanchuk-r3-chartres-2026-06-13",
            },
            id: 10672028,
            player_1_fide_id: 5007003,
            player_2_fide_id: 14100010,
            player_1_display: "Harikrishna",
            player_2_display: "Ivanchuk",
          },
          {
            player_1: "Dardha, Daniel",
            player_2: "Martirosyan, Haik M.",
            result: {
              text: "1 : 0",
              url: "/games/dardha-martirosyan-r3-chartres-2026-06-13",
            },
            id: 10672039,
            player_1_fide_id: 240990,
            player_2_fide_id: 13306553,
            player_1_display: "Dardha",
            player_2_display: "Martirosyan",
          },
          {
            player_1: "Maghsoodloo, Parham",
            player_2: "Fressinet, Laurent",
            result: {
              text: "½ : ½",
              url: "/games/maghsoodloo-fressinet-r3-chartres-2026-06-13",
            },
            id: 10672053,
            player_1_fide_id: 12539929,
            player_2_fide_id: 608742,
            player_1_display: "Maghsoodloo",
            player_2_display: "Fressinet",
          },
          {
            player_1: "Sadhwani, Raunak",
            player_2: "Vachier-Lagrave, Maxime",
            result: {
              text: "½ : ½",
              url: "/games/sadhwani-vachier-lagrave-r3-chartres-2026-06-13",
            },
            id: 10672004,
            player_1_fide_id: 35093487,
            player_2_fide_id: 623539,
            player_1_display: "Sadhwani",
            player_2_display: "Vachier-Lagrave",
          },
          {
            player_1: "Van Foreest, Jorden",
            player_2: "Suleymanli, Aydin",
            result: {
              text: "1 : 0",
              url: "/games/van-foreest-suleymanli-r3-chartres-2026-06-13",
            },
            id: 10672070,
            player_1_fide_id: 1039784,
            player_2_fide_id: 13413937,
            player_1_display: "Van Foreest",
            player_2_display: "Suleymanli",
          },
          {
            player_1: "Idani, Pouya",
            player_2: "Cheparinov, Ivan",
            result: {
              text: "0 : 1",
              url: "/games/idani-cheparinov-r3-chartres-2026-06-13",
            },
            id: 10672056,
            player_1_fide_id: 12510130,
            player_2_fide_id: 2905540,
            player_1_display: "Idani",
            player_2_display: "Cheparinov",
          },
          {
            player_1: "Eljanov, Pavel",
            player_2: "Santos Latasa, Jaime",
            result: {
              text: "½ : ½",
              url: "/games/eljanov-santos-r3-chartres-2026-06-13",
            },
            id: 10672032,
            player_1_fide_id: 14102951,
            player_2_fide_id: 2293307,
            player_1_display: "Eljanov",
            player_2_display: "Santos Latasa",
          },
          {
            player_1: "Vlachos, Anatole",
            player_2: "Pranav, V",
            result: {
              text: "½ : ½",
              url: "/games/vlachos-pranav-r3-chartres-2026-06-13",
            },
            id: 10672052,
            player_1_fide_id: 26093189,
            player_2_fide_id: 25060783,
            player_1_display: "Vlachos",
            player_2_display: "Pranav",
          },
          {
            player_1: "Pranesh M",
            player_2: "Nihal Sarin",
            result: {
              text: "1 : 0",
              url: "/games/pranesh-nihal-r3-chartres-2026-06-13",
            },
            id: 10672064,
            player_1_fide_id: 35028600,
            player_2_fide_id: 25092340,
            player_1_display: "Pranesh M",
            player_2_display: "Nihal Sarin",
          },
          {
            player_1: "Puranik, Abhimanyu",
            player_2: "Karthikeyan, Murali",
            result: {
              text: "1 : 0",
              url: "/games/puranik-karthikeyan-r3-chartres-2026-06-13",
            },
            id: 10672041,
            player_1_fide_id: 5061245,
            player_2_fide_id: 5074452,
            player_1_display: "Puranik",
            player_2_display: "Karthikeyan",
          },
        ],
      },
    },
    "French Top 16 Teams, Low Pool 2026": {
      web_url: "https://chartres2026.ffechecs.org/",
      rounds: {
        "Round 3 starts at 12:15 GMT": [
          {
            player_1: "Fridman, Daniel",
            player_2: "Gurel, Ediz",
            result: {
              text: "½ : ½",
              url: "/games/fridman-gurel-r3-chartres-2026-06-13",
            },
            id: 10672019,
            player_1_fide_id: 11600454,
            player_2_fide_id: 44507356,
            player_1_display: "Fridman",
            player_2_display: "Gurel",
          },
          {
            player_1: "Amin, Bassem",
            player_2: "Donchenko, Alexander",
            result: {
              text: "½ : ½",
              url: "/games/amin-donchenko-r3-chartres-2026-06-13",
            },
            id: 10672024,
            player_1_fide_id: 10601457,
            player_2_fide_id: 24603295,
            player_1_display: "Amin",
            player_2_display: "Donchenko",
          },
          {
            player_1: "Decuigniere, Tom",
            player_2: "Van Wely, Loek",
            result: {
              text: "½ : ½",
              url: "/games/decuigniere-van-wely-r3-chartres-2026-06-13",
            },
            id: 10672050,
            player_1_fide_id: 26093820,
            player_2_fide_id: 1000268,
            player_1_display: "Decuigniere",
            player_2_display: "Van Wely",
          },
          {
            player_1: "Korobov, Anton",
            player_2: "Tabatabaei, M. Amin",
            result: {
              text: "0 : 1",
              url: "/games/korobov-tabatabaei-r3-chartres-2026-06-13",
            },
            id: 10672066,
            player_1_fide_id: 14105730,
            player_2_fide_id: 12521213,
            player_1_display: "Korobov",
            player_2_display: "Tabatabaei",
          },
        ],
      },
    },
  },
  "2026-06-12": {
    "3rd Uzchess Cup, Masters 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 6 starts at 10:15 GMT": [
          {
            player_1: "Nepomniachtchi, Ian",
            player_2: "Erigaisi Arjun",
            result: {
              text: "1 : 0",
              url: "/games/nepomniachtchi-erigaisi-r6-tashkent-2026-06-12",
            },
            id: 10671877,
            player_1_fide_id: 4168119,
            player_2_fide_id: 35009192,
            player_1_display: "Nepomniachtchi",
            player_2_display: "Erigaisi",
          },
          {
            player_1: "Niemann, Hans Moke",
            player_2: "Abdusattorov, Nodirbek",
            result: {
              text: "½ : ½",
              url: "/games/niemann-abdusattorov-r6-tashkent-2026-06-12",
            },
            id: 10671878,
            player_1_fide_id: 2093596,
            player_2_fide_id: 14204118,
            player_1_display: "Niemann",
            player_2_display: "Abdusattorov",
          },
          {
            player_1: "Madaminov, Mukhiddin",
            player_2: "Vidit, Santosh Gujrathi",
            result: {
              text: "1 : 0",
              url: "/games/madaminov-vidit-r6-tashkent-2026-06-12",
            },
            id: 10671879,
            player_1_fide_id: 14210703,
            player_2_fide_id: 5029465,
            player_1_display: "Madaminov",
            player_2_display: "Vidit",
          },
          {
            player_1: "Theodorou, Nikolas",
            player_2: "Mamedyarov, Shakhriyar",
            result: {
              text: "0 : 1",
              url: "/games/theodorou-mamedyarov-r6-tashkent-2026-06-12",
            },
            id: 10671871,
            player_1_fide_id: 4262875,
            player_2_fide_id: 13401319,
            player_1_display: "Theodorou",
            player_2_display: "Mamedyarov",
          },
          {
            player_1: "Vokhidov, Shamsiddin",
            player_2: "Yakubboev, Nodirbek",
            result: {
              text: "½ : ½",
              url: "/games/vokhidov-yakubboev-r6-tashkent-2026-06-12",
            },
            id: 10671863,
            player_1_fide_id: 14204223,
            player_2_fide_id: 14203987,
            player_1_display: "Vokhidov",
            player_2_display: "Yakubboev",
          },
        ],
      },
    },
    "3rd Uzchess Cup, Challengers 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474277",
      rounds: {
        "Round 6 starts at 10:15 GMT": [
          {
            player_1: "Abdisalimov, Abdimalik",
            player_2: "Suyarov, Mukhammadzokhid",
            result: {
              text: "1 : 0",
              url: "/games/abdisalimov-suyarov-r6-tashkent-2026-06-12",
            },
            id: 10671872,
            player_1_fide_id: 14206323,
            player_2_fide_id: 14210495,
            player_1_display: "Abdisalimov",
            player_2_display: "Suyarov",
          },
          {
            player_1: "Kuzubov, Yuriy",
            player_2: "Aditya Mittal",
            result: {
              text: "½ : ½",
              url: "/games/kuzubov-aditya-r6-tashkent-2026-06-12",
            },
            id: 10671870,
            player_1_fide_id: 14112906,
            player_2_fide_id: 35042025,
            player_1_display: "Kuzubov",
            player_2_display: "Aditya Mittal",
          },
          {
            player_1: "Jacobson, Brandon",
            player_2: "Vakhidov, Jakhongir",
            result: {
              text: "1 : 0",
              url: "/games/jacobson-vakhidov-r6-tashkent-2026-06-12",
            },
            id: 10671864,
            player_1_fide_id: 30901561,
            player_2_fide_id: 14201801,
            player_1_display: "Jacobson",
            player_2_display: "Vakhidov",
          },
          {
            player_1: "Deac, Bogdan-Daniel",
            player_2: "Atabayev, Saparmyrat",
            result: {
              text: "½ : ½",
              url: "/games/deac-atabayev-r6-tashkent-2026-06-12",
            },
            id: 10671883,
            player_1_fide_id: 1226380,
            player_2_fide_id: 14000571,
            player_1_display: "Deac",
            player_2_display: "Atabayev",
          },
          {
            player_1: "Safarli, Eltaj",
            player_2: "Muradli, Mahammad",
            result: {
              text: "½ : ½",
              url: "/games/safarli-muradli-r6-tashkent-2026-06-12",
            },
            id: 10671862,
            player_1_fide_id: 13402129,
            player_2_fide_id: 13409301,
            player_1_display: "Safarli",
            player_2_display: "Muradli",
          },
        ],
      },
    },
    "Navara - Blohberger, match 2026": {
      web_url:
        "https://ratings.fide.com/tournament_information.phtml?event=474854",
      rounds: {
        "Round 5 starts at 13:00 GMT": [
          {
            player_1: "Blohberger, Felix",
            player_2: "Navara, David",
            result: {
              text: "½ : ½",
              url: "/games/blohberger-navara-r5-vienna-2026-06-12",
            },
            id: 10671898,
            player_1_fide_id: 1632051,
            player_2_fide_id: 309095,
            player_1_display: "Blohberger",
            player_2_display: "Navara",
          },
        ],
      },
    },
    "French Top 16 Teams, High Pool 2026": {
      web_url: "https://chartres2026.ffechecs.org/",
      rounds: {
        "Round 2 starts at 12:15 GMT": [
          {
            player_1: "Nihal Sarin",
            player_2: "Van Foreest, Jorden",
            result: {
              text: "½ : ½",
              url: "/games/nihal-van-foreest-r2-chartres-2026-06-12",
            },
            id: 10671900,
            player_1_fide_id: 25092340,
            player_2_fide_id: 1039784,
            player_1_display: "Nihal Sarin",
            player_2_display: "Van Foreest",
          },
          {
            player_1: "Svane, Frederik",
            player_2: "Puranik, Abhimanyu",
            result: {
              text: "½ : ½",
              url: "/games/svane-puranik-r2-chartres-2026-06-12",
            },
            id: 10671919,
            player_1_fide_id: 12923044,
            player_2_fide_id: 5061245,
            player_1_display: "Svane F",
            player_2_display: "Puranik",
          },
          {
            player_1: "Mendonca, Leon Luke",
            player_2: "Eljanov, Pavel",
            result: {
              text: "½ : ½",
              url: "/games/mendonca-eljanov-r2-chartres-2026-06-12",
            },
            id: 10671886,
            player_1_fide_id: 35028561,
            player_2_fide_id: 14102951,
            player_1_display: "Mendonca",
            player_2_display: "Eljanov",
          },
          {
            player_1: "Suleymanli, Aydin",
            player_2: "Karthikeyan, Murali",
            result: {
              text: "½ : ½",
              url: "/games/suleymanli-karthikeyan-r2-chartres-2026-06-12",
            },
            id: 10671935,
            player_1_fide_id: 13413937,
            player_2_fide_id: 5074452,
            player_1_display: "Suleymanli",
            player_2_display: "Karthikeyan",
          },
          {
            player_1: "Pranesh M",
            player_2: "Idani, Pouya",
            result: {
              text: "½ : ½",
              url: "/games/pranesh-idani-r2-chartres-2026-06-12",
            },
            id: 10671911,
            player_1_fide_id: 35028600,
            player_2_fide_id: 12510130,
            player_1_display: "Pranesh M",
            player_2_display: "Idani",
          },
          {
            player_1: "Brunello, Sabino",
            player_2: "Maghsoodloo, Parham",
            result: {
              text: "½ : ½",
              url: "/games/brunello-maghsoodloo-r2-chartres-2026-06-12",
            },
            id: 10671874,
            player_1_fide_id: 813613,
            player_2_fide_id: 12539929,
            player_1_display: "Brunello",
            player_2_display: "Maghsoodloo",
          },
          {
            player_1: "Vachier-Lagrave, Maxime",
            player_2: "Cheng, Bobby",
            result: {
              text: "1 : 0",
              url: "/games/vachier-lagrave-cheng-r2-chartres-2026-06-12",
            },
            id: 10671909,
            player_1_fide_id: 623539,
            player_2_fide_id: 4300033,
            player_1_display: "Vachier-Lagrave",
            player_2_display: "Cheng",
          },
          {
            player_1: "Harikrishna, Pentala",
            player_2: "Neiksans, Arturs",
            result: {
              text: "½ : ½",
              url: "/games/harikrishna-neiksans-r2-chartres-2026-06-12",
            },
            id: 10671925,
            player_1_fide_id: 5007003,
            player_2_fide_id: 11601388,
            player_1_display: "Harikrishna",
            player_2_display: "Neiksans",
          },
          {
            player_1: "Martirosyan, Haik M.",
            player_2: "Marcelin, Cyril",
            result: {
              text: "½ : ½",
              url: "/games/martirosyan-marcelin-r2-chartres-2026-06-12",
            },
            id: 10671882,
            player_1_fide_id: 13306553,
            player_2_fide_id: 607274,
            player_1_display: "Martirosyan",
            player_2_display: "Marcelin",
          },
          {
            player_1: "Mamedov, Rauf",
            player_2: "Lupulescu, Constantin",
            result: {
              text: "½ : ½",
              url: "/games/mamedov-lupulescu-r2-chartres-2026-06-12",
            },
            id: 10671875,
            player_1_fide_id: 13401653,
            player_2_fide_id: 1207822,
            player_1_display: "Mamedov",
            player_2_display: "Lupulescu",
          },
          {
            player_1: "Ivanchuk, Vasyl",
            player_2: "Barbot, Pierre",
            result: {
              text: "1 : 0",
              url: "/games/ivanchuk-barbot-r2-chartres-2026-06-12",
            },
            id: 10671933,
            player_1_fide_id: 14100010,
            player_2_fide_id: 663727,
            player_1_display: "Ivanchuk",
            player_2_display: "Barbot",
          },
        ],
      },
    },
    "French Top 16 Teams, Low Pool 2026": {
      web_url: "https://chartres2026.ffechecs.org/",
      rounds: {
        "Round 2 starts at 12:15 GMT": [
          {
            player_1: "Tabatabaei, M. Amin",
            player_2: "Baklan, Vladimir",
            result: {
              text: "1 : 0",
              url: "/games/tabatabaei-baklan-r2-chartres-2026-06-12",
            },
            id: 10671913,
            player_1_fide_id: 12521213,
            player_2_fide_id: 14102196,
            player_1_display: "Tabatabaei",
            player_2_display: "Baklan",
          },
          {
            player_1: "Grandelius, Nils",
            player_2: "Vedmediuc, Serghei",
            result: {
              text: "1 : 0",
              url: "/games/grandelius-vedmediuc-r2-chartres-2026-06-12",
            },
            id: 10671927,
            player_1_fide_id: 1710400,
            player_2_fide_id: 13908570,
            player_1_display: "Grandelius",
            player_2_display: "Vedmediuc",
          },
          {
            player_1: "Nijboer, Friso",
            player_2: "Anton Guijarro, David",
            result: {
              text: "½ : ½",
              url: "/games/nijboer-anton-guijarro-r2-chartres-2026-06-12",
            },
            id: 10671897,
            player_1_fide_id: 1000063,
            player_2_fide_id: 2285525,
            player_1_display: "Nijboer",
            player_2_display: "Anton Guijarro",
          },
          {
            player_1: "Donchenko, Alexander",
            player_2: "Chigaev, Maksim",
            result: {
              text: "½ : ½",
              url: "/games/donchenko-chigaev-r2-chartres-2026-06-12",
            },
            id: 10671873,
            player_1_fide_id: 24603295,
            player_2_fide_id: 4108116,
            player_1_display: "Donchenko",
            player_2_display: "Chigaev",
          },
        ],
      },
    },
  },
};

export default function Live() {
  const insets = useSafeAreaInsets();

  return (
    // <View
    //   collapsable={false}
    //   style={{
    //     flex: 1,
    //     backgroundColor: colors.background,
    //     paddingTop: insets.top,
    //     paddingBottom: insets.bottom,
    //   }}
    // >
    <ScrollView
      // style={{ paddingTop: insets.top /*, paddingBottom: insets.bottom*/ }}
      contentContainerStyle={{
        paddingTop: insets.top,
        gap: 16,
        padding: 16,
        overflow: "hidden",
      }}
    >
      {Object.entries(chessSchedule).map(([date, daySchedule]) => (
        <View key={date}>
          <Text style={{ color: colors.foreground, marginBottom: 16 }}>
            {date}
          </Text>

          <View style={{ gap: 16 }}>
            {Object.entries(daySchedule).map(([tournamentName, tournament]) => (
              <View
                key={tournamentName}
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 18,
                    fontWeight: "700",
                    marginBottom: 4,
                  }}
                >
                  {tournamentName}
                </Text>

                {Object.entries(tournament.rounds).map(([roundName, games]) => (
                  <View key={roundName}>
                    <Text
                      style={{
                        color: colors.mutedForeground,
                        fontStyle: "italic",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {roundName}
                    </Text>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.border,
                        marginVertical: 16,
                      }}
                    />

                    <View style={{ gap: 16 }}>
                      {games.map((game, index) => (
                        <View
                          key={game.id ?? index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              color: colors.cardForeground,
                              flex: 2,
                            }}
                          >
                            {game.player_1_display}
                          </Text>

                          <Text
                            style={{
                              color: colors.primary,
                              flex: 1,
                              textAlign: "center",
                            }}
                          >
                            {game.result.text.length > 0
                              ? game.result.text
                              : "vs"}
                          </Text>

                          <Text
                            style={{
                              color: colors.cardForeground,
                              flex: 2,
                              textAlign: "right",
                            }}
                          >
                            {game.player_2_display}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
    // </View>
  );
}
