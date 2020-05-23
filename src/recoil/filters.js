import { atom } from "recoil";

export default atom({
  key: "filters",
  default: {
    category: "apartment",
    type: "sell",
    location: "Centrs",
  },
});
