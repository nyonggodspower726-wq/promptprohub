exports.handler = async function (event) {
  try {
    const params = new URLSearchParams(event.rawQuery || "");

    const code = params.get("code");
    const returnedState = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: `
          <html>
            <head>
              <title>TikTok Connection Failed</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family:Arial;text-align:center;padding:50px;">
              <h2>❌ TikTok connection failed</h2>
              <p>${escapeHtml(errorDescription || error)}</p>
              <a href="https://promptprohub00.netlify.app/">
                Return to PromptPro Hub
              </a>
            </body>
          </html>
        `
      };
    }

    if (!code) {
      return {
        statusCode: 400,
        body: "Missing authorization code."
      };
    }

    const cookies = event.headers.cookie || "";
    const savedState = getCookie(cookies, "tiktok_oauth_state");

    if (!returnedState || !savedState || returnedState !== savedState) {
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: `
          <h2>❌ Security check failed</h2>
          <p>The TikTok authorization state did not match.</p>
        `
      };
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: `
          <h2>❌ TikTok configuration error</h2>
          <p>TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET is missing.</p>
        `
      };
    }

    const redirectUri =
      "https://promptprohub00.netlify.app/.netlify/functions/tiktok-callback";

    const tokenBody = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri
    });

    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache"
        },
        body: tokenBody.toString()
      }
    );

    const tokenData = await tokenResponse.json();

    console.log("TikTok token response:", {
      ok: tokenResponse.ok,
      hasAccessToken: Boolean(tokenData.access_token),
      hasRefreshToken: Boolean(tokenData.refresh_token),
      openId: tokenData.open_id,
      scope: tokenData.scope,
      error: tokenData.error
    });

    if (!tokenResponse.ok || !tokenData.access_token) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: `
          <html>
            <head>
              <title>TikTok Connection Error</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family:Arial;text-align:center;padding:40px;">
              <h2>❌ TikTok connection failed</h2>
              <p>${escapeHtml(
                tokenData.error_description ||
                tokenData.error ||
                "TikTok did not return an access token."
              )}</p>
              <br>
              <a href="https://promptprohub00.netlify.app/">
                Return to PromptPro Hub
              </a>
            </body>
          </html>
        `
      };
    }

    /*
      IMPORTANT:
      We do NOT put the access token in the browser URL.

      TikTok recommends keeping access/refresh tokens
      on the server side.
    */

    return {
      statusCode: 302,
      headers: {
        Location:
          "https://promptprohub00.netlify.app/?tiktok=connected",
        "Set-Cookie":
          "tiktok_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
      },
      body: ""
    };

  } catch (error) {
    console.error("TikTok callback error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body: `
        <html>
          <head>
            <title>TikTok Error</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>❌ Something went wrong</h2>
            <p>Please try connecting TikTok again.</p>
            <a href="https://promptprohub00.netlify.app/">
              Return to PromptPro Hub
            </a>
          </body>
        </html>
      `
    };
  }
};


function getCookie(cookieHeader, name) {
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
        }
