---
title: Resetting a Windows Password
description: >-
  Step-by-step guide for IT staff to reset local and domain Windows account
  passwords.
tags:
  - windows
  - passwords
  - accounts
  - active-directory
---
This article covers the most common scenarios for resetting a Windows user password, including local accounts, Microsoft accounts, and Active Directory (domain) accounts. Choose the section that matches the account type.

## Before You Begin

- Confirm the **account type**: local, Microsoft, or domain (Active Directory).
- Verify the user's identity per your organization's help-desk policy (e.g., callback, ID check, manager approval).
- Make sure the user has a way to receive the new temporary password securely.
- Check whether the account is **locked out** as well as forgotten — a reset alone won't clear a lockout.

---

## 1. Resetting a Local Account Password

Use this when the account exists only on the local machine (not joined to a domain, not a Microsoft account).

### Option A: From another admin account (GUI)

1. Sign in to the PC with a local administrator account.
2. Press `Win + R`, type `lusrmgr.msc`, and press **Enter**.
3. Expand **Users**, right-click the target account, and choose **Set Password…**
4. Click **Proceed**, enter the new password twice, and click **OK**.

> ⚠️ Setting a password this way will cause the user to lose access to any EFS-encrypted files, saved web/credential-manager passwords, and personal certificates.

### Option B: From an elevated Command Prompt or PowerShell

```powershell
# List local users
Get-LocalUser

# Reset a password
$NewPwd = Read-Host "New password" -AsSecureString
Set-LocalUser -Name "jdoe" -Password $NewPwd
```

Or with `net user`:

```cmd
net user jdoe NewP@ssw0rd!
```

### Option C: No admin access — use installation media

1. Boot the PC from Windows installation media (USB/DVD).
2. At the setup screen press `Shift + F10` to open a command prompt.
3. Identify the Windows drive letter (often `D:` in WinRE), then run:

   ```cmd
   move D:\Windows\System32\utilman.exe D:\Windows\System32\utilman.exe.bak
   copy D:\Windows\System32\cmd.exe D:\Windows\System32\utilman.exe
   ```

4. Reboot into Windows. At the sign-in screen click the **Ease of Access** icon — this now launches Command Prompt as `SYSTEM`.
5. Reset the password:

   ```cmd
   net user jdoe NewP@ssw0rd!
   ```

6. **Important:** boot back into the installation media and restore the original `utilman.exe`:

   ```cmd
   del D:\Windows\System32\utilman.exe
   move D:\Windows\System32\utilman.exe.bak D:\Windows\System32\utilman.exe
   ```

> 🔒 This technique should only be used on machines your organization owns. Document its use and re-secure the device afterward.

---

## 2. Resetting a Microsoft Account Password

If the user signs in with an `@outlook.com`, `@hotmail.com`, or other Microsoft account, the password is managed online and cannot be reset locally.

1. Have the user visit <https://account.live.com/password/reset>.
2. They enter the account email/phone and complete identity verification (alternate email, SMS code, or authenticator app).
3. After setting a new password, they sign in to the PC **while connected to the internet** so the cached credential updates.

If the user can't get online at the sign-in screen, connect a network cable or use the Wi-Fi icon in the lower-right of the lock screen first.

---

## 3. Resetting an Active Directory (Domain) Password

### Option A: Active Directory Users and Computers (ADUC)

1. Open **Active Directory Users and Computers** on a machine with RSAT installed.
2. Find the user (use **Find** — `Ctrl + F` — if needed).
3. Right-click the account → **Reset Password…**
4. Enter a new password, tick **User must change password at next logon**, and click **OK**.
5. If the account is locked, open the **Account** tab and clear **Unlock account**.

### Option B: PowerShell (ActiveDirectory module)

```powershell
# Reset password and force change at next logon
$NewPwd = Read-Host "New password" -AsSecureString
Set-ADAccountPassword -Identity jdoe -NewPassword $NewPwd -Reset
Set-ADUser -Identity jdoe -ChangePasswordAtLogon $true

# Unlock the account if necessary
Unlock-ADAccount -Identity jdoe
```

### Option C: Self-service (SSPR)

If your organization uses **Azure AD / Entra ID Self-Service Password Reset**, direct the user to:

- <https://passwordreset.microsoftonline.com>

They will need a registered authentication method (phone, email, or authenticator app).

---

## Post-Reset Checklist

- [ ] Confirm the user can sign in successfully.
- [ ] Have them update saved credentials in Outlook, mapped drives, VPN clients, and mobile devices.
- [ ] Force a password change at next logon for any admin-set temporary password.
- [ ] Log the reset in your ticketing system, including who authorized it.
- [ ] If the reset was due to suspected compromise, also revoke active sessions and review MFA/registered devices.

---

## Common Issues

| Symptom | Likely Cause | Fix |
|---|---|---|
| "The user name or password is incorrect" right after reset | Cached credentials on a domain-joined PC offline | Connect to the corporate network / VPN and retry |
| Account still locked after password reset | Lockout not cleared | Run `Unlock-ADAccount` or untick **Account is locked out** in ADUC |
| EFS-encrypted files unreadable | Local admin-forced reset destroyed the DPAPI master key | Restore from a backup of the user's certificates, or recover via the EFS recovery agent |
| Outlook keeps prompting for password | Stored credential is stale | Clear entries in **Credential Manager** → **Windows Credentials** |

---

## Related Articles

- Unlocking an Active Directory account
- Configuring Azure AD Self-Service Password Reset
- Recovering BitLocker keys
