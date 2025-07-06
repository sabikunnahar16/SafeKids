# 📧 EmailJS Setup Guide for SafeKids Gmail Notifications

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service (Gmail)

1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail"
4. Follow the OAuth setup to connect your Gmail account
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use this template:

**Subject:** `SafeKids Alert - {{student_name}} Bus Scan Notification`

**Content:**

```
Dear {{to_name}},

🚌 SafeKids Bus Alert 🚌

Your child {{student_name}} has been scanned on the school bus.

📍 Details:
• Student: {{student_name}} (ID: {{student_id}})
• Class: {{student_class}}
• Time: {{scan_time}}
• Location: {{location}}
• Scanned by: {{scanned_by}}

{{message}}

Your child's safety is our priority. For any questions, contact the school.

Best regards,
SafeKids Team

---
This is an automated message from SafeKids School System.
```

4. Save and copy the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to "Account" in your EmailJS dashboard
2. Copy your **Public Key** (e.g., `user_abcdef123456`)

## Step 5: Update Configuration

Open `constants/emailConfig.ts` and update:

```typescript
export const EMAIL_CONFIG = {
  PUBLIC_KEY: "your_actual_public_key_here",
  SERVICE_ID: "your_actual_service_id_here",
  TEMPLATE_ID: "your_actual_template_id_here",
};
```

## Step 6: Test Email Functionality

1. Create a test student with your email
2. Generate QR code for the student
3. Scan the QR code with the bus scanner
4. Check your Gmail inbox for the notification

## 📝 Important Notes:

- EmailJS free plan allows 200 emails per month
- Emails are sent directly from your Gmail account
- The parent will receive emails from your Gmail address
- Make sure to test with different email addresses

## 🔧 Troubleshooting:

- If emails don't arrive, check spam folder
- Verify all credentials are correct
- Check console logs for error messages
- Ensure internet connection is stable

## 🚀 Advanced Features (Optional):

You can enhance this by adding:

- SMS notifications using Twilio
- Push notifications using Expo Notifications
- WhatsApp notifications using WhatsApp Business API
- Email templates with school logos and branding
