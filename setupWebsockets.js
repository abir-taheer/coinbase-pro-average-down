const client = require("./client");
const tickerMessageHandler = require("./tickerMessageHandler");
const { WebSocketEvent, WebSocketChannelName } = require("coinbase-pro-node");

async function setupWebsockets() {
  const productId = process.env.CRYPTO + "-USD";

  const channel = {
    name: WebSocketChannelName.TICKER,
    product_ids: [productId],
  };

  // 3. Wait for open WebSocket to send messages
  client.ws.on(WebSocketEvent.ON_OPEN, () => {
    // 7. Subscribe to WebSocket channel
    client.ws.subscribe([channel]);
  });

  // 4. Listen to WebSocket subscription updates
  client.ws.on(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, (subscriptions) => {
    // When there are no more subscriptions...
    if (subscriptions.channels.length === 0) {
      // 10. Disconnect WebSocket (and end program)
      client.ws.disconnect();
    }
  });

  // 5. Listen to WebSocket channel updates
  client.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, tickerMessageHandler);

  client.ws.connect({ debug: process.env.DEBUG_WS === "true" });
}

module.exports = setupWebsockets;
