import { MAX_AMOUNT, MIN_AMOUNT } from './const';

export default function validAmount(
  validStayType: any,
  validRoom: any,
  amount: number
) {
  if (validStayType?.stay === 'FULL-TIME') {
    return amount >= validRoom?.price;
  }
  if (validStayType?.stay === 'SHORT-REST') {
    return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  }
}
