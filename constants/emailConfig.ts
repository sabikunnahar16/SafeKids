// EmailJS Configuration for SafeKids App
// To set up EmailJS for Gmail notifications:

export const EMAIL_CONFIG = {
  // Replace these with your actual EmailJS credentials from https://www.emailjs.com/
  SERVICE_ID: 'service_bxq074s',     // e.g., 'service_abc123'
  TEMPLATE_ID: 'template_xsvh599',   // e.g., 'template_xyz789' 
  PUBLIC_KEY: 'yvfDfk2wG0Iq-DrGV'      // e.g., 'user_abc123def456'
};

/* 
🚀 QUICK SETUP GUIDE FOR GMAIL NOTIFICATIONS:

1. Go to https://www.emailjs.com/ and create a free account

2. ADD EMAIL SERVICE:
   - Click "Email Services" → "Add New Service"
   - Choose "Gmail" 
   - Connect your Gmail account via OAuth
   - Copy the Service ID (e.g., service_abc123)

3. CREATE EMAIL TEMPLATE:
   - Click "Email Templates" → "Create New Template"
   - Template Name: SafeKids Bus Alert
   
   Email Subject: 
   SafeKids Alert - {{student_name}} Bus Scan

   Email Content:
   ---
   Dear {{to_name}},

   🚌 SafeKids Bus Alert 🚌

   Your child {{student_name}} has been scanned on the school bus.

   📍 Scan Details:
   • Student: {{student_name}} (ID: {{student_id}})
   • Class: {{student_class}}
   • Time: {{scan_time}}
   • Location: {{location}}
   • Scanned by: {{scanned_by}}

   {{message}}

   Your child's safety is our priority. For any questions, contact the school.

   Best regards,
   {{from_name}}

   ---
   This is an automated message from SafeKids School System.
   ---

   - Save and copy the Template ID (e.g., template_xyz789)

4. GET PUBLIC KEY:
   - Go to "Account" → Copy your Public Key (e.g., user_abc123def456)

5. UPDATE CONFIGURATION:
   - Open app/(tabs)/bus/scanner/index.tsx
   - Find the lines with YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY
   - Replace them with your actual EmailJS credentials

6. TEST:
   - Create a test student with your email address
   - Generate QR code and scan it with the bus scanner
   - Check your Gmail inbox (and spam folder)

📧 EMAIL TEMPLATE VARIABLES:
The following variables are automatically filled:
- {{to_email}} - Parent's Gmail address
- {{to_name}} - Parent's name  
- {{student_name}} - Student's name
- {{student_id}} - Student ID
- {{student_class}} - Student's class
- {{scan_time}} - When the scan happened
- {{location}} - Where scan happened (School Bus)
- {{scanned_by}} - Who scanned (Bus Driver)
- {{parent_contact}} - Parent's phone number
- {{message}} - Full notification message
- {{subject}} - Email subject line
- {{from_name}} - SafeKids School System

🎯 IMPORTANT NOTES:
- EmailJS free plan: 200 emails/month
- Emails sent from your connected Gmail account
- Parents receive emails from your Gmail address
- Always test with a real email first
- Check spam folders if emails don't arrive

🔧 TROUBLESHOOTING:
- Verify all credentials are correct
- Check EmailJS dashboard for send logs
- Ensure Gmail account has proper permissions
- Test with different email addresses
- Check console logs for error messages

💡 ALTERNATIVE SOLUTIONS:
If EmailJS doesn't work, you can use:
- Firebase Cloud Functions with SendGrid
- Expo Notifications for push notifications
- SMS notifications with Twilio
- WhatsApp Business API
*/
