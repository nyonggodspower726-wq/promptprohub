exports.handler = async (event) => {
  const params = event.queryStringParameters || {};

  if (params.error) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/html"
      },
      body: `
        <html>
        <body style="font-family:Arial;text-align:center;padding:60px">
          <h1>❌ TikTok Connection Failed</h1>
          <p>${params.error_description || params.error}</p>
          <a href="/">Return to PromptPro Hub</a>
        </body>
        </html>
      `
    };
  }

  if (!params.code) {
    return {
      statusCode: 400,
      body: "No TikTok authorization code received."
    };
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  const redirectUri =
    "https://promptprohub00.netlify.app/auth/callback";

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code: params.code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/html"
        },
        body: `
          <html>
          <body style="font-family:Arial;text-align:center;padding:60px">
            <h1>❌ TikTok Authorization Failed</h1>
            <p>${data.error_description || "Unknown error"}</p>
            <a href="/">Return to PromptPro Hub</a>
          </body>
          </html>
        `
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: `
        <html>
        <body style="font-family:Arial;text-align:center;padding:60px">
          <h1>✅ TikTok Connected!</h1>
          <p>Your TikTok Sandbox account has been successfully connected to PromptPro Hub.</p>
          <p>Open PromptPro Hub to continue.</p>
          <a href="/">Return to PromptPro Hub</a>
        </body>
        </html>
      `
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: "TikTok connection error."
    };
  }
};
