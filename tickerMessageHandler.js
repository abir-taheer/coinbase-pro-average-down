const state = require("./state");
const client = require("./client");
const chalk = require("chalk");
const fs = require("fs").promises;
const productId = process.env.CRYPTO + "-USD";
const sizeAccuracy = parseInt(process.env.SIZE_FRACTIONAL_ACCURACY);
const amountOfBase = Number(process.env.ORDER_AMOUNT);

let numErrors = 0;

async function tickerMessageHandler(ticker) {
  const price = Number(ticker.price);

  if (price > state.getHighestPrice()) {
    state.setHighestPrice(price);
  }

  const target = state.getTargetPrice();

  if (price < target && !state.getIsProcessing()) {
    // It fell below the threshold, trigger a buy order
    const buffer = 1 + Number(process.env.PRICE_BUFFER);
    const bufferedPrice = price * buffer;
    const approx = Math.round(bufferedPrice * 100) / 100;
    const limitPrice = approx.toFixed(2);

    const approxSize =
      Math.round((amountOfBase * Math.pow(10, sizeAccuracy)) / limitPrice) /
      Math.pow(10, sizeAccuracy);
    const size = approxSize.toFixed(sizeAccuracy);

    try {
      console.log(
        chalk.yellow("Attempting to buy ") +
          chalk.blue(size + " " + process.env.CRYPTO) +
          chalk.yellow(" at a price of ") +
          chalk.green(limitPrice)
      );

      let order = await client.rest.order.placeOrder({
        price,
        size,
        product_id: productId,
        side: "buy",
        type: "limit",
      });

      console.log(order);

      console.log(
        chalk.cyan("Resetting highest price to current order price...")
      );

      state.setHighestPrice(approx);
    } catch (e) {
      console.log(
        chalk.red(
          `There was an error placing the order. Full log in error-${numErrors}.log`
        )
      );

      console.error(e);
      await fs.writeFile("error-" + numErrors + ".log", e.toString());
      numErrors++;
      process.exit(1);
    }

    state.setIsProcessing(false);
  }
}

module.exports = tickerMessageHandler;
