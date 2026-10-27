import { initBotId } from "botid/client/core";

// Vercel BotID, Basic level (free on Hobby, no keys). Every path listed here
// must call checkBotId() on the server, and every checkBotId() route must be
// listed here, or real visitors are refused as bots.
initBotId({
  protect: [
    { path: "/api/demo", method: "POST" },
    { path: "/api/create-checkout-session", method: "POST" },
  ],
});
