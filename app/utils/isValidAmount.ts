import { MAX_AMOUNT, MIN_AMOUNT } from './const';

export default function validAmount(
  validStayType: { stay?: string } | null | undefined,
  validRoom: { price?: number } | null | undefined,
  amount: number
) {
  if (validStayType?.stay === 'FULL-TIME') {
    return amount >= (validRoom?.price ?? Infinity);
  }
  if (validStayType?.stay === 'SHORT-REST') {
    return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  }
}
