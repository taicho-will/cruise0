/**
 * Post-Login Action — Account Linking
 *
 * Runs on Auth0 (not in this app) after every successful login.
 * When a user logs in with a social provider (e.g. Google) and an
 * email/password account with the same email already exists, this
 * action links the social identity into that existing account,
 * resulting in one user profile with multiple identities.
 *
 * Required secrets: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
 * (M2M app with read:users / update:users on the Management API)
 *
 * Note: this file is a copy for review purposes — the source of truth
 * is the Action deployed in the Auth0 tenant.
 */
exports.onExecutePostLogin = async (event, api) => {
  if (event.connection.strategy === 'auth0') return;

  try {
    const body = {
      grant_type: 'client_credentials',
      client_id: event.secrets.AUTH0_CLIENT_ID,
      client_secret: event.secrets.AUTH0_CLIENT_SECRET,
      audience: `https://${event.secrets.AUTH0_DOMAIN}/api/v2/`
    };

    // デバッグ：シークレットが読めているか確認
    console.log('domain:', event.secrets.AUTH0_DOMAIN);
    console.log('client_id length:', event.secrets.AUTH0_CLIENT_ID?.length);
    console.log('client_secret length:', event.secrets.AUTH0_CLIENT_SECRET?.length);

    const tokenRes = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const tokenData = await tokenRes.json();
    console.log('token response:', JSON.stringify(tokenData));

    if (!tokenData.access_token) return;

    const usersRes = await fetch(
      `https://${event.secrets.AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(event.user.email)}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const users = await usersRes.json();

    const primaryUser = users.find(u =>
      u.user_id !== event.user.user_id &&
      u.identities.some(i => i.provider === 'auth0')
    );

    if (!primaryUser) return;

    const secondaryUserId = event.user.user_id.split('|')[1];
    const linkRes = await fetch(
      `https://${event.secrets.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(primaryUser.user_id)}/identities`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: event.user.identities[0].provider, user_id: secondaryUserId })
      }
    );
    const linkResult = await linkRes.json();
    console.log('link result:', JSON.stringify(linkResult));

  } catch (err) {
    console.log('error:', err.message);
  }
};
