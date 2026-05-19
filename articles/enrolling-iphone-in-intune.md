---
title: Enrolling Your iPhone in Microsoft Intune
description: >-
  Step-by-step guide for end users to enroll a personal or company iPhone in
  Microsoft Intune using the Company Portal app.
tags:
  - intune
  - iphone
  - mdm
  - end-user
  - mobile
---
This guide walks you through enrolling your iPhone in Microsoft Intune so you can securely access company email, files, and apps. The process takes about 10–15 minutes.

## Before you start

Make sure you have:

- Your iPhone with at least **20% battery** (or plugged in)
- A reliable **Wi‑Fi connection**
- Your **work email address** and **password**
- Your method for **multi-factor authentication** (MFA) — usually the Microsoft Authenticator app or a text message code
- About **15 minutes** of uninterrupted time

> 💡 **Tip:** If you have not yet set up MFA, do that first before continuing.

## What to expect

During enrollment your iPhone will:

1. Install the **Intune Company Portal** app.
2. Install a **management profile** that lets IT enforce security policies (like requiring a passcode).
3. Optionally install company apps such as Outlook, Teams, and OneDrive.

Your personal photos, messages, and apps remain private. IT cannot see them.

---

## Step 1 — Install the Company Portal app

1. Open the **App Store** on your iPhone.
2. Search for **Intune Company Portal**.
3. Tap **Get**, then **Install**. You may need to confirm with Face ID, Touch ID, or your Apple ID password.
4. Once installed, tap **Open**.

## Step 2 — Sign in

1. In the Company Portal app, tap **Sign In**.
2. Enter your **work email address** (for example, `jane.doe@company.com`) and tap **Next**.
3. Enter your **password**.
4. Complete the **MFA prompt** (approve the notification in Authenticator, or enter the code sent by text).

## Step 3 — Begin enrollment

1. On the welcome screen, tap **Begin**.
2. Review the privacy information that explains what your organization **can** and **cannot** see, then tap **Continue**.
3. On the "What's next?" screen, tap **Continue** again.

## Step 4 — Download the management profile

1. When prompted, tap **Allow** to let the Company Portal download the configuration profile.
2. You will see a message that says **"Profile Downloaded."** Tap **Close**.

## Step 5 — Install the management profile

1. Open the **Settings** app on your iPhone (leave Company Portal — you'll come back to it).
2. At the top of Settings, tap **Profile Downloaded**.
   - If you don't see it, go to **Settings → General → VPN & Device Management**.
3. Tap **Install** in the upper-right corner.
4. Enter your iPhone **passcode**.
5. Tap **Install** again on the warning screens, then **Trust** when asked to remotely manage the iPhone.
6. When the profile finishes installing, tap **Done**.

## Step 6 — Finish in Company Portal

1. Return to the **Company Portal** app.
2. Wait while it checks your device. You may see "Confirming device settings…" for a minute or two.
3. When you see **"You're all set!"**, tap **Done**.

Your iPhone is now enrolled. 🎉

---

## Step 7 — Install company apps (optional)

From the Company Portal home screen, browse or search the **Apps** section to install company-approved apps such as:

- Microsoft Outlook
- Microsoft Teams
- OneDrive
- Any line-of-business apps your organization provides

Tap an app, then tap **Install**.

## Step 8 — Set up email

If Outlook didn't auto-configure:

1. Open **Outlook**.
2. Enter your work email and password.
3. Approve the MFA prompt.

---

## Common issues

### "Profile Downloaded" never appears in Settings
- Make sure you tapped **Allow** in Safari when prompted.
- Restart your iPhone and try **Step 4** again from the Company Portal app.

### Stuck on "Confirming device settings…"
- Wait a full 5 minutes — the first sync can be slow.
- Force-close Company Portal and reopen it.
- Make sure you're on Wi-Fi or have a strong cellular signal.

### "Your device is not compliant"
- Check that your iPhone is running a **supported version of iOS** (generally iOS 15 or newer).
- Make sure you have a **passcode** set (Settings → Face ID & Passcode).
- In Company Portal, tap **Check status** to retry.

### Can't sign in / password not accepted
- Reset your work password using the self-service password reset portal.
- Make sure you're using your **work** email, not a personal one.

---

## What your IT team can and cannot see

**IT can see:**
- Device model, serial number, and OS version
- Whether your device has a passcode and is encrypted
- Company-installed apps
- Your work email address and phone number

**IT cannot see:**
- Personal photos, texts, or calls
- Personal email or browsing history
- Personal apps you installed yourself
- Passwords stored on your device

---

## Need help?

If you get stuck, contact the IT Help Desk and include:

- The step number where you got stuck
- A description or screenshot of any error message
- Your iPhone model and iOS version (Settings → General → About)
