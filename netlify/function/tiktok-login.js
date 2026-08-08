exports.handler = async () => {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;

  if (!clientKey) {
    return {
      statusCode: 500,
      body: "TikTok Client Key is not configured."
    };
  }

  const redirectUri =
    "https://promptprohub00.netlify.app/auth/callback";

  const state =
    Math.random().toString(36).substring(2) +
    Date.now().toString(36);

  const scope = "user.info.basic,user.info.stats,video.upload,video.publish";

  const url =
    "https://www.tiktok.com/v2/auth/authorize/?" +
    new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }).toString();

  return {
    statusCode: 302,
    headers: {
      Location: url,
      "Set-Cookie":
        `tiktok_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    }
  };
};
