---
title: Reset Your Password with Microsoft 365 Self-Service Password Reset (SSPR)
description: >-
  Step-by-step guide for end users to reset or unlock their Microsoft 365
  account password using self-service password reset.
tags:
  - microsoft-365
  - password
  - sspr
  - end-user
  - azure-ad
---
# Reset Your Password with Microsoft 365 Self-Service Password Reset (SSPR)

If you've forgotten your Microsoft 365 password, or your account is locked out, you can reset it yourself using **Self-Service Password Reset (SSPR)** — no need to call the helpdesk.

This guide walks you through the process from start to finish.

## Before You Begin

To use SSPR you must have **registered authentication methods** beforehand (for example phone number, alternate email, or the Microsoft Authenticator app). If you have never registered, contact the IT helpdesk — they will need to reset your password manually or trigger a registration link.

You will need:

- Your full Microsoft 365 username (e.g. `jane.doe@yourcompany.com`)
- Access to **at least one** of the authentication methods you previously registered:
  - Mobile phone (SMS or voice call)
  - Alternate (personal) email address
  - Microsoft Authenticator app notification or code
  - Security questions (if enabled by your organisation)
- A device with internet access and a modern web browser

## Step 1: Open the Password Reset Page

Go to the Microsoft password reset portal:

```
https://passwordreset.microsoftonline.com
```

> Tip: You can also click **"Can't access your account?"** or **"Forgot my password"** on any Microsoft 365 sign-in screen.

## Step 2: Enter Your Account Details

1. In the **Email or Username** field, type your full work email address.
2. Type the **CAPTCHA characters** shown on the screen.
3. Click **Next**.

## Step 3: Choose Why You Can't Sign In

Select the option that fits your situation:

- **I forgot my password** — you know your username but not your password.
- **I know my password, but still can't sign in** — usually means your account is locked. SSPR can unlock it without changing the password.

Click **Next**.

## Step 4: Verify Your Identity

You will be asked to verify yourself using one (or more, depending on your organisation's policy) of the methods you registered.

Pick a method from the list and follow the prompt:

| Method | What to do |
| --- | --- |
| Text my mobile phone | Enter your mobile number, then enter the 6-digit code you receive by SMS. |
| Call my mobile phone | Answer the call and press **#** when prompted. |
| Email my alternate email | Open your personal mailbox and enter the verification code. |
| Approve a notification on my authenticator app | Tap **Approve** in the Microsoft Authenticator app. |
| Enter a code from my authenticator app | Open the app and type the current 6-digit code. |
| Answer my security questions | Type the answers exactly as you set them up. |

> If your organisation requires **two verification steps**, repeat this step using a second method.

## Step 5: Create a New Password

1. Type a **new password** that meets your organisation's complexity requirements. Typical rules:
   - At least **8–14 characters**
   - A mix of **uppercase, lowercase, numbers, and symbols**
   - **Cannot** match any of your recent passwords
   - **Cannot** contain your name or username
2. Re-type the password to confirm.
3. Click **Finish**.

You should see a confirmation message: **"Your password has been reset."**

## Step 6: Sign In with Your New Password

1. Go to <https://www.office.com> (or your usual Microsoft 365 sign-in page).
2. Enter your username and the **new** password.
3. If prompted, complete multi-factor authentication.

### Don't Forget to Update Other Devices

After resetting your password, update it everywhere your old password was saved, otherwise your account may lock out again:

- **Outlook / Mail apps** on your phone and computer
- **Windows sign-in** (sign out and back in once connected to the corporate network or VPN)
- **Teams**, **OneDrive**, **OneNote**, and any other Microsoft 365 desktop or mobile apps
- **Wi-Fi profiles** that authenticate with your work account
- **Saved browser passwords**

## Register or Update Your SSPR Methods

To avoid issues in the future, keep your authentication methods up to date:

```
https://aka.ms/setupsecurityinfo
```

From there you can add or remove phone numbers, alternate emails, and authenticator app entries.

## Troubleshooting

- **"We couldn't verify your account"** — Your account may not be enabled for SSPR, or you haven't registered any methods. Contact the IT helpdesk.
- **No verification code received** — Check signal/spam, wait a minute, then click **"resend"**. Try a different method if available.
- **"Password doesn't meet requirements"** — Re-read the on-screen rules. Avoid recently used passwords and anything containing your name.
- **Account still locked after reset** — A device or app is still trying the old password. Sign out of mobile mail apps and update saved passwords, then wait 15–30 minutes.
- **Can't access any of your verification methods** — You must contact the IT helpdesk for a manual reset; SSPR cannot proceed without verification.

## Need More Help?

If you get stuck at any step, contact the IT helpdesk with:

- Your username
- The exact error message (a screenshot is ideal)
- The step where the problem occurred
