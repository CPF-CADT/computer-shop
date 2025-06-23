import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const PORT = 5000;

const BOT_USERNAME = '@techhelpperBot'; 

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to parse tg_user cookie JSON safely
function getTelegramUserData(req: Request): any | false {
  const tgUserCookie = req.cookies['tg_user'];
  if (!tgUserCookie) return false;

  try {
    // The cookie is expected to be URL encoded JSON
    const decoded = decodeURIComponent(tgUserCookie);
    return JSON.parse(decoded);
  } catch (err) {
    return false;
  }
}

app.get('/', (req: Request, res: Response) => {
  // Handle logout query param
  if (req.query.logout) {
    res.clearCookie('tg_user');
    return res.redirect('/');
  }

  const tgUser = getTelegramUserData(req);

  let html = '';

  if (tgUser) {
    const firstName = escapeHtml(tgUser.first_name);
    const lastName = escapeHtml(tgUser.last_name);
    let usernamePart = '';
    if (tgUser.username) {
      const username = escapeHtml(tgUser.username);
      usernamePart = `<a href="https://t.me/${username}">${firstName} ${lastName}</a>`;
    } else {
      usernamePart = `${firstName} ${lastName}`;
    }

    html = `<h1>Hello, ${usernamePart}!</h1>`;

    if (tgUser.photo_url) {
      const photoUrl = escapeHtml(tgUser.photo_url);
      html += `<img src="${photoUrl}" alt="User photo" />`;
    }

    html += `<p><a href="/?logout=1">Log out</a></p>`;
  } else {
    html = `
      <h1>Hello, anonymous!</h1>
      <script async src="https://telegram.org/js/telegram-widget.js?15"
        data-telegram-login="${BOT_USERNAME}"
        data-size="large"
        data-userpic="false"
        data-auth-url="/check_authorization"
      ></script>
    `;
  }

  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Login Widget Example</title>
  </head>
  <body>
    <center>${html}</center>
  </body>
</html>`);
});

// Endpoint to receive Telegram login data from widget
app.post('/check_authorization', (req: Request, res: Response) => {
  const userData = req.body;

  // Here you should verify the data hash from Telegram for security
  // For demo, we skip verification - IMPORTANT: Do verify in production

  // Set cookie with URL encoded JSON user data (expires in 1 day)
  res.cookie('tg_user', encodeURIComponent(JSON.stringify(userData)), {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false, // allow JS access if needed
    secure: false, // set to true if HTTPS
    sameSite: 'lax',
  });

  // Respond with some message or redirect to home
  res.send(`
    <script>
      window.opener.location.reload();
      window.close();
    </script>
  `);
});

// Helper function to escape HTML (basic)
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
