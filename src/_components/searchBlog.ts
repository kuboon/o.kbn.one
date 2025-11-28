export default function ({ search }: Lume.Data) {
  const datas = search.pages("type=blog", "date=desc");
  const map = new Map<string, typeof datas>();
  for (const data of datas) {
    const year = data.date.getFullYear().toString();
    const yearPages = map.get(year) || [];
    map.set(year, [...yearPages, data]);
  }
  return [...map.entries()];
}
