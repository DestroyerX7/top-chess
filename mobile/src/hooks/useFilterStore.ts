import { create } from "zustand";

type FilterOption = "all" | "live" | "rated-above-2700";

export type SortOption =
  | "rating-descending"
  | "rating-ascending"
  | "rating-change-descending"
  | "rating-change-ascending"
  | "ranking-change-descending"
  | "ranking-change-ascending"
  | "age-descending"
  | "age-ascending"
  | "country"
  | "name";

type FilterState = {
  filterOption: FilterOption;
  sortOption: SortOption;
  setFilterOption: (filterOption: FilterOption) => void;
  setSortOption: (sortOption: SortOption) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filterOption: "all",
  sortOption: "rating-descending",
  setFilterOption: (filterBy) => set({ filterOption: filterBy }),
  setSortOption: (sortBy) => set({ sortOption: sortBy }),
}));
