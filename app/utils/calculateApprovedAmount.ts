import type { Prisma } from '@prisma/client';

type ExpenseEntry = { amount: number };
type LodgeAmountEntry = {
  paymentType: string;
  _sum?: { amount: number | null } | null;
};
type DrinkSalesEntry = { cash?: number; pos?: number };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isExpenseEntry = (value: unknown): value is ExpenseEntry => {
  if (!isRecord(value)) return false;
  const amount = value['amount'];
  return typeof amount === 'number';
};

const isLodgeAmountEntry = (value: unknown): value is LodgeAmountEntry => {
  if (!isRecord(value)) return false;
  if (typeof value['paymentType'] !== 'string') return false;
  const sum = value['_sum'];
  if (sum === undefined || sum === null) return true;
  if (!isRecord(sum)) return false;
  const amount = sum['amount'];
  return typeof amount === 'number' || amount === null;
};

const isDrinkSalesEntry = (value: unknown): value is DrinkSalesEntry => {
  if (!isRecord(value)) return false;
  const cash = value['cash'];
  const pos = value['pos'];
  return (
    (cash === undefined || typeof cash === 'number') &&
    (pos === undefined || typeof pos === 'number')
  );
};

const getAmountFromSum = (
  sum: { amount: number | null } | null | undefined,
) => sum?.amount ?? 0;

export function calculateApprovedAmount(
  expenses: Prisma.JsonValue[] | null | undefined,
  lodgeAmount: Prisma.JsonValue[] | null | undefined,
  drinkSales: Prisma.JsonValue | null | undefined,
) {
  const normalizedExpenses = Array.isArray(expenses)
    ? expenses.filter(isExpenseEntry)
    : [];
  const normalizedLodgeAmount = Array.isArray(lodgeAmount)
    ? lodgeAmount.filter(isLodgeAmountEntry)
    : [];
  const normalizedDrinkSales = isDrinkSalesEntry(drinkSales)
    ? drinkSales
    : null;

  const totalExpenses = normalizedExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0,
  );

  const lodgeCash = normalizedLodgeAmount.find(
    (lodge) => lodge.paymentType === 'CASH',
  );
  const lodgePos = normalizedLodgeAmount.find(
    (lodge) => lodge.paymentType === 'POS',
  );

  const totalCash =
    getAmountFromSum(lodgeCash?._sum) +
    (normalizedDrinkSales?.cash || 0) -
    totalExpenses;
  const totalPos =
    (normalizedDrinkSales?.pos || 0) + getAmountFromSum(lodgePos?._sum);

  return {
    totalCash,
    totalPos,
  };
}
