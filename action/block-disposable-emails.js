/**
 * Pre User Registration Action — Block Disposable Emails
 *
 * 目的: mailinator.com のような使い捨て/バーナーメールドメインでの
 *       新規登録をブロックし、分析データの汚染とメール配信コストを防ぐ。
 *
 * Note: this file is a copy for review purposes — the source of truth
 * is the Action deployed in the Auth0 tenant.
 *
 * @param {Event} event - サインアップしようとしているユーザーの情報
 * @param {PreUserRegistrationAPI} api - 登録を許可/拒否するための操作
 */
exports.onExecutePreUserRegistration = async (event, api) => {

  // --- 1. ブロックリストの定義 ---
  // 既定の使い捨てメールドメイン。Secret "DISPOSABLE_DOMAINS"（カンマ区切り）が
  // 設定されていれば、それを使ってリストを動的に上書き・拡張できる。
  const DEFAULT_BLOCKLIST = [
    'mailinator.com',
    'guerrillamail.com',
    'guerrillamail.info',
    'sharklasers.com',
    '10minutemail.com',
    'tempmail.com',
    'temp-mail.org',
    'throwawaymail.com',
    'yopmail.com',
    'trashmail.com',
    'getnada.com',
    'dispostable.com',
    'maildrop.cc',
    'fakeinbox.com',
    'mintemail.com'
  ];

  // Secret から追加ドメインを読み込む（設定されていなければ空）
  const secretDomains = (event.secrets.DISPOSABLE_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.length > 0);

  // 既定リストと Secret のリストを結合し、重複を排除
  const blocklist = new Set([...DEFAULT_BLOCKLIST, ...secretDomains]);

  // --- 2. ユーザーのメールからドメインを抽出 ---
  const email = (event.user.email || '').toLowerCase().trim();

  // メールが取得できない/形式が不正な場合は念のため通す（このActionの責務外）
  if (!email || !email.includes('@')) {
    return;
  }

  const domain = email.split('@').pop();

  // --- 3. 判定とブロック ---
  if (blocklist.has(domain)) {
    // ログに残す（モニタリングで確認できる）
    console.log(`Blocked disposable email signup: ${email} (domain: ${domain})`);

    // api.access.deny(reason, userMessage)
    //  - 第1引数: ログ用の理由（管理者向け）
    //  - 第2引数: エンドユーザーに表示されるメッセージ
    api.access.deny(
      `disposable_email_blocked:${domain}`,
      'Please sign up using a permanent email address. Disposable or temporary email providers are not allowed.'
    );
  }

  // ブロックリストに該当しなければ何もしない = 登録が続行される
};
