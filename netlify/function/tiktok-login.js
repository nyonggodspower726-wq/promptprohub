exports.handler = async function () {
  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;

    if (!clientKey) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: "<h2>Missing TIKTOK_CLIENT_KEY</h2><p>Add it to Netlify Environment Variables.</p>"
      };
    }

    const redirectUri =
      "https://promptprohub00.netlify.app/.netlify/functions/tiktok-callback";

    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: "user.info.basic,video.upload",
      redirect_uri: redirectUri,
      state: state
    });

    const tiktokUrl =
      "https://www.tiktok.com/v2/auth/authorize/?" +
      params.toString();

    return {
      statusCode: 302,
      headers: {
        Location: tiktokUrl,
        "Set-Cookie": `tiktok_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
      },
      body: ""
    };

  } catch (error) {
    console.error("TikTok login error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body: "<h2>TikTok login error</h2>"
    };
  }
};
