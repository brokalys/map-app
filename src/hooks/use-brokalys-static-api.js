import { useMemo } from "react";
import useAxios from "axios-hooks";
import parse from "csv-parse/lib/sync";

export default function useBrokalysStaticApi(category, type, location) {
  const [{ loading, error, data: csvString }] = useAxios(
    `https://raw.githubusercontent.com/brokalys/data/master/data/${category}/${type}-monthly-riga.csv`
  );

  const data = useMemo(() => {
    if (!csvString) {
      return [];
    }

    const csv = parse(csvString);
    const header = csv.shift();
    const priceIndex = header.findIndex((row) => row === location);

    return csv.map((row) => ({
      start: row[0],
      end: row[1],
      price: row[priceIndex],
    }));
  }, [location, csvString]);

  return [{ loading, error, data }];
}
