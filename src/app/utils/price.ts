export function calculateBreadPrice(bread: { price: number, promotionPrice?: number | null }, quantity: number) {
  if (bread.promotionPrice && quantity >= 2) {
    const pairs = Math.floor(quantity / 2);
    const remainder = quantity % 2;
    return (pairs * bread.promotionPrice) + (remainder * bread.price);
  }
  return bread.price * quantity;
}
