import { atom } from "recoil";

export const filterState = atom({
  key: "filters",
  default: {
    category: "apartment",
    type: "sell",
    location: "Centrs",
  },
});
