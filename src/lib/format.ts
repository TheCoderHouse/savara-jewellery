const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export const formatINR = (n: number) => inr.format(n);
export const pctOff = (price: number, compareAt?: number) =>
  compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
