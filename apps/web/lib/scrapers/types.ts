export type ScrapedChessPlayer = {
  fideid: number;
  name: string;
  age: number;
  raiting: string; // note: numeric value as string, e.g. "2574.0"
  raitingDiff: number;
  pos_change: string; // e.g. "↑2", "↓3", or "" if unchanged
  pos_change_value: number | null;

  // Live position rankings across different categories (null if not applicable)
  live_pos: number;
  live_standard_pos: number;
  live_rapid_pos: number | null;
  live_blitz_pos: number | null;
  live_juniors_pos: number | null;
  live_girls_pos: number | null;
  live_u16_pos: number | null;
  live_junior_standard_pos: number | null;
  live_junior_blitz_pos: number | null;
  live_junior_rapid_pos: number | null;
  live_u16_standard_pos: number | null;
  live_u16_blitz_pos: number | null;
  live_u16_rapid_pos: number | null;

  flag: string; // country code, e.g. "bg", "us"
  avatar: string; // path, e.g. "/file?id=1211" or "/img/avatar/noavatar.png"
  games_archive: string; // relative URL
  statistic: string; // relative URL
  profile: string; // relative URL
  games_count: number;

  country_name: string;
  birthday: string; // e.g. "25 Oct 1985", can be ""
  birthday_unix: number | null;

  sort_helper: string;
  sort_helper_inv: string;

  best_pos_title: string;
  best_rating_title: string;
  tooltip_text: string;

  live: boolean;
  has_live_standard: boolean;
  has_live_rapid: boolean;
  has_live_blitz: boolean;

  last_update: number | null; // unix timestamp
  type: string; // e.g. "standard"

  year_ago_rating_change: number;
  year_ago_ranking_change: number | null;
  rating_history_sparkline: number[]; // fixed-length array (13 in examples)
  last_updated_gmt: string;

  // Per time-control ratings — usually numeric strings, but can carry
  // suffixes like "i" (inactive) or be "unrat." for unrated
  standard_raiting: string;
  blitz_raiting: string;
  rapid_raiting: string;
  junior_raiting: string;

  standard_tooltip_text: string;
  blitz_tooltip_text: string;
  rapid_tooltip_text: string;
  junior_tooltip_text: string;

  standard_last_update: number | null;
  blitz_last_update: number | null;
  rapid_last_update: number | null;

  standard_games_count: number;
  blitz_games_count: number;
  rapid_games_count: number;

  standard_best_rating_title: string;
  blitz_best_rating_title: string;
  rapid_best_rating_title: string; // can be "" when no rapid history

  rating: string; // duplicate of `raiting`
};

export type ScraperType = "browserbase" | "geonode" | "none";

export type MainTable2700chessResponse = {
  items: ScrapedChessPlayer[];
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
};
