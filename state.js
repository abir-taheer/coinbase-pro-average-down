const calculateTargetPrice = require("./calculateTargetPrice");
const chalk = require("chalk");

let highestPrice = 0;
let targetPrice = 0;
let isProcessing = false;

const setHighestPrice = (num) => {
  const percentDiff = highestPrice ? (num - highestPrice) / highestPrice : 1;
  highestPrice = num;
  targetPrice = calculateTargetPrice(num);

  if (percentDiff > 0.01) {
    console.log(
      `New high price set to:`,
      chalk.green(num.toFixed(2)),
      "\tTarget price: ",
      chalk.red(targetPrice.toFixed(2))
    );
  }
};

const getHighestPrice = () => highestPrice;
const getTargetPrice = () => targetPrice;
const getIsProcessing = () => isProcessing;
const setIsProcessing = (val) => (isProcessing = val);

module.exports = {
  setHighestPrice,
  getHighestPrice,
  getTargetPrice,
  getIsProcessing,
  setIsProcessing,
};
