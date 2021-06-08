const delta = Number(process.env.ORDER_DELTA);

function calculateTargetPrice(currentPrice) {
  const approx = currentPrice * (1 - delta);

  return Math.round(approx * 100) / 100;
}

module.exports = calculateTargetPrice;
