export function calculateBreadPrice(bread: { price: number, promotionPrice?: number | null }, quantity: number) {
  if (bread.promotionPrice && quantity >= 2) {
    const pairs = Math.floor(quantity / 2);
    const remainder = quantity % 2;
    const unitPromoPrice = bread.promotionPrice / 2;
    return (pairs * bread.promotionPrice) + (remainder * unitPromoPrice);
  }
  return bread.price * quantity;
}

export function calculateOrderTotal(items: { bread: { price: number, promotionPrice?: number | null }, quantity: number }[]) {
  if (!items || items.length === 0) return 0;

  const promoGroups: Record<number, { price: number, quantity: number }[]> = {};
  let total = 0;

  for (const item of items) {
    if (item.bread.promotionPrice) {
      if (!promoGroups[item.bread.promotionPrice]) {
        promoGroups[item.bread.promotionPrice] = [];
      }
      promoGroups[item.bread.promotionPrice].push({ price: item.bread.price, quantity: item.quantity });
    } else {
      total += item.bread.price * item.quantity;
    }
  }

  for (const promoPriceStr in promoGroups) {
    const promoPrice = Number(promoPriceStr);
    const groupItems = promoGroups[promoPrice];
    const totalQty = groupItems.reduce((sum, item) => sum + item.quantity, 0);
    const pairs = Math.floor(totalQty / 2);
    const remainder = totalQty % 2;
    total += pairs * promoPrice;
    if (remainder > 0) {
      const unitPromoPrice = promoPrice / 2;
      total += unitPromoPrice * remainder;
    }
  }

  return total;
}
