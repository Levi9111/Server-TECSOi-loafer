
export const startPinger = () => {
  const url = process.env.SERVER_URL;

  if (!url) {
    console.log("[PINGER] SERVER_URL not found in environment variables. Pinger disabled.");
    return;
  }

  console.log(`[PINGER] Starting pinger for ${url}`);

  setInterval(async () => {
    try {
      const response = await fetch(`${url}/api/ping`);
      if (response.ok) {
        console.log(`[PINGER] Ping successful: ${new Date().toISOString()}`);
      } else {
        console.warn(`[PINGER] Ping failed with status ${response.status}: ${new Date().toISOString()}`);
      }
    } catch (error: any) {
      console.error(`[PINGER] Ping error: ${error.message}`);
    }
  }, 14 * 60 * 1000);
};
