export default ({date, fineness}: Lume.Data, helpers: Lume.Helpers) => {
  const fuzzyDate = helpers.date(date, finenessToFormat(fineness));
  const timeElem = `<time datetime="${date.toISOString()}">${fuzzyDate}</time>`;
  if((new Date().getTime() - date.getTime()) < years(2)) return timeElem;

  const touji = `当時${Math.floor((date.getTime() - birthday.getTime()) / years(1))}歳`;
  return `${timeElem} <span>${touji} ${grade(date)}</span>`;
}
const years = (year: number) => year * 365 * 24 * 60 * 60 * 1000;
const birthday = new Date('1980-07-24');
function finenessToFormat(fineness: string) {
  switch (fineness) {
    case 'year':
      return 'yyyy';
    case 'month':
      return 'yyyy MMMM';
    default:
      return 'yyyy-MM-dd';
  }
}
function grade(date: Date) {
  const birthApril = new Date(`${birthday.getFullYear()}-04-01`);
  const year = Math.floor((date.getTime() - birthApril.getTime()) / years(1));
  if(6 <= year && year <= 12) return `小学${year - 5}年生`;
  if(13 <= year && year <= 15) return `中学${year - 12}年生`;
  if(16 <= year && year <= 18) return `高校${year - 15}年生`;
  if(19 <= year && year <= 22) return `学部${year - 18}年生`;
  if(23 <= year && year <= 24) return `修士課程${year - 22}年生`;
  return ""
}
