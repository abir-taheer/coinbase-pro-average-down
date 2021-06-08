require("dotenv").config();

const { CoinbasePro } = require("coinbase-pro-node");
const auth = {
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  passphrase: process.env.API_PASSPHRASE,
  useSandbox: false,
};

const client = new CoinbasePro(auth);

module.exports = client;
