export function formatAmount(amount: number) {
  return new Intl.NumberFormat().format(amount);
}

export function formateInputAmount(...num: Array<any>) {
  const hasLetters = /[a-zA-Z]/;
  if (hasLetters.test(num.join(''))) return '';
  if (num.join('').length === 0) return '';
  const formatNum = num.join('').replaceAll(',', '');
  return formatAmount(+formatNum);
}

export function removeCommaAmount(num: string) {
  return +num.replaceAll(',', '');
}
