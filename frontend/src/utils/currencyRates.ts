import { Currency } from "lucide-react";

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  KRW: '₩',
  RUB: '₽',
  TRY: '₺',
  VND: '₫',
};

export const currencyRates: Record<string, number> = {
  USD: 1,     // Base
  EUR: 0.91,
  GBP: 0.78,
  INR: 83.2,
  JPY: 156.78,
  KRW: 1392.56,
  RUB: 90.45,
  TRY: 32.45,
  VND: 24000,
};
export const getCurrencySymbol = (currency: string): string => {
  return currencySymbols[currency] || '$';
};
export const getCurrencyRate = (currency: string): number => {
  return currencyRates[currency] || 1;
};
export const convertToCurrency = (amount: number, currency: string): string => {
  const rate = getCurrencyRate(currency);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${(amount * rate).toFixed(2)}`;
};

export default currencySymbols;
