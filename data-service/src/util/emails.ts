export const INTRO_EMAIL = ({
  name,
}: {
  name: string;
}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to AddyAI</title>
    </head>
    <body
        style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f6f8; color: #333;"
    >
        <table
        align="center"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;"
        >
        <tr>
            <td style="text-align: center; padding: 30px 20px; background: linear-gradient(90deg, #22c55e, #fbbf24);">
            <img
                src="https://www.addyai.net/src/assets/logo.png"
                alt="AddyAI Logo"
                width="80"
                height="80"
                style="display: block; margin: 0 auto 10px auto;"
            />
            <h1
                style="font-size: 28px; font-weight: bold; margin: 0; background: linear-gradient(to right, #22c55e, #fbbf24); -webkit-background-clip: text; color: transparent;"
            >
                AddyAI
            </h1>
            </td>
        </tr>

        <tr>
            <td style="padding: 30px 20px;">
            <h2 style="font-size: 22px; margin-top: 0;">Welcome to AddyAI 👋</h2>
            <p style="font-size: 16px; line-height: 1.6;">
                Hi ${name || "there"},
                <br /><br />
                Thanks for joining <strong>AddyAI</strong> — we’re thrilled to have you on board!
                <br /><br />
                Your account has been successfully created, and you’re now ready to explore
                how AI can make your Google Ads account much more productive.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a
                href="https://www.addyai.net/chat"
                style="background: linear-gradient(90deg, #22c55e, #fbbf24); color: white; padding: 14px 26px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;"
                >
                Go to Dashboard
                </a>
            </div>

            <p style="font-size: 15px; line-height: 1.6;">
                Need help getting started? Check out our documentation or reach out to our
                support team anytime.
            </p>

            <p style="font-size: 15px; color: #666;">
                – The <strong>AddyAI</strong> Team
            </p>
            </td>
        </tr>

        <tr>
            <td
            style="text-align: center; padding: 20px; background-color: #f5f6f8; font-size: 13px; color: #999;"
            >
            © 2025 AddyAI. All rights reserved.<br />
            <a
                href="https://www.addyai.net/unsubscribe"
                style="color: #999; text-decoration: underline;"
            >
                Unsubscribe
            </a>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;

export const DEACTIVATION_EMAIL = ({
  name,
}: {
  name: string;
}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AddyAI Deactivation</title>
    </head>
    <body
        style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f6f8; color: #333;"
    >
        <table
        align="center"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;"
        >
        <tr>
            <td style="text-align: center; padding: 30px 20px; background: linear-gradient(90deg, #22c55e, #fbbf24);">
            <img
                src="https://www.addyai.net/src/assets/logo.png"
                alt="AddyAI Logo"
                width="80"
                height="80"
                style="display: block; margin: 0 auto 10px auto;"
            />
            <h1
                style="font-size: 28px; font-weight: bold; margin: 0; background: linear-gradient(to right, #22c55e, #fbbf24); -webkit-background-clip: text; color: transparent;"
            >
                AddyAI
            </h1>
            </td>
        </tr>

        <tr>
            <td style="padding: 30px 20px;">
            <h2 style="font-size: 22px; margin-top: 0;">Welcome to AddyAI 👋</h2>
            <p style="font-size: 16px; line-height: 1.6;">
                Hi ${name || "there"},
                <br /><br />
                Thanks for trying <strong>AddyAI</strong> — we are sorry to see you go!
                <br />
                Feel free to come back anytime and give us another try.
                <br /><br />
                Your account has been deactivated. <br />
                If this was a mistake or you change your mind, you can reactivate your account by logging back in. <br />
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a
                href="https://www.addyai.net/chat"
                style="background: linear-gradient(90deg, #22c55e, #fbbf24); color: white; padding: 14px 26px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;"
                >
                Go to Dashboard
                </a>
            </div>

            <p style="font-size: 15px; line-height: 1.6;">
                Need help getting started? Check out our documentation or reach out to our
                support team anytime.
            </p>

            <p style="font-size: 15px; color: #666;">
                – The <strong>AddyAI</strong> Team
            </p>
            </td>
        </tr>

        <tr>
            <td
            style="text-align: center; padding: 20px; background-color: #f5f6f8; font-size: 13px; color: #999;"
            >
            © 2025 AddyAI. All rights reserved.<br />
            <a
                href="https://www.addyai.net/unsubscribe"
                style="color: #999; text-decoration: underline;"
            >
                Unsubscribe
            </a>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;
