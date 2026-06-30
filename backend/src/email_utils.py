from email.message import EmailMessage
import aiosmtplib
from src.config import settings

async def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: str | None = None,
) -> None:
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD.get_secret_value():
        print(f"Email delivery skipped for local dev. Subject: {subject}. To: {to_email}")
        return

    message = EmailMessage()
    message["From"] = settings.MAIL_FROM
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(plain_text)

    if html_content:
        message.add_alternative(html_content, subtype="html")
    
    await aiosmtplib.send(
        message,
        hostname=settings.MAIL_SERVER,
        port=settings.MAIL_PORT,
        username=settings.MAIL_USERNAME if settings.MAIL_USERNAME else None,
        password=settings.MAIL_PASSWORD.get_secret_value() if settings.MAIL_PASSWORD.get_secret_value() else None,
        start_tls=settings.MAIL_USE_TLS,
    )

async def send_password_reset_email(to_email: str, username: str, token: str) -> None:
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <style>
            body {{ margin: 0; background: #f6f3ed; color: #1f252b; font-family: Arial, Helvetica, sans-serif; }}
            .wrap {{ max-width: 560px; margin: 0 auto; padding: 32px 18px; }}
            .card {{ background: #fbfaf7; border: 1px solid #e8e2d9; border-radius: 28px; padding: 34px; }}
            .brand {{ font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #8a8175; }}
            h1 {{ margin: 18px 0 10px; font-size: 30px; line-height: 1.1; color: #1f252b; }}
            p {{ margin: 0 0 18px; font-size: 15px; line-height: 1.7; color: #505852; }}
            .button {{ display: inline-block; background: #1f252b; color: #ffffff !important; padding: 14px 24px; border-radius: 999px; text-decoration: none; font-weight: 800; }}
            .link {{ word-break: break-all; color: #1f252b; }}
            .footer {{ margin-top: 24px; font-size: 12px; line-height: 1.6; color: #8a8175; }}
        </style>
    </head>
    <body>
        <div class="wrap">
          <div class="card">
            <div class="brand">Nepfluence</div>
            <h1>Reset your password</h1>
            <p>Hi {username},</p>
            <p>We received a request to reset your Nepfluence password. Use the private link below to create a new password.</p>
            <p>
                <a href="{reset_url}" class="button">Reset Password</a>
            </p>
            <p>Or copy this link:<br><a class="link" href="{reset_url}">{reset_url}</a></p>
            <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
            <div class="footer">
                Nepfluence account security
            </div>
          </div>
        </div>
    </body>
    </html>
    """
    
    plain_text = f"""Hi {username},

We received a request to reset your Nepfluence password. Use this private link to create a new password:

{reset_url}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best regards,
The Nepfluence Team
"""

    await send_email(
        to_email=to_email,
        subject="Reset Your Password - Nepfluence",
        plain_text=plain_text,
        html_content=html_content,
    )
