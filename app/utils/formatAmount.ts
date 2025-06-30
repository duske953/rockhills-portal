export function formatAmount(amount: number) {
  return new Intl.NumberFormat().format(amount);
}

export function formateInputAmount(...num: Array<any>) {
  const formatNum = num.join('').replaceAll(',', '');
  console.log(num);
  return formatAmount(+formatNum);
}

export function removeCommaAmount(num: string) {
  return +num.replaceAll(',', '');
}
