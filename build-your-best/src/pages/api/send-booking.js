import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message, package: packageName } = req.body;

  try {
    // Send to admin
    await resend.emails.send({
      from: 'Bookings <info@buildyourbestselfblog.com>',
      to: 'admin@buildyourbestselfblog.com',
      subject: `New Booking Request: ${packageName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Build Your Best Self <info@buildyourbestselfblog>',
      to: email,
      subject: `Booking Request Received: ${packageName}`,
      html: `
        <h2>Thank you for your booking request!</h2>
        <p>We've received your request for <strong>${packageName}</strong> and will contact you shortly to confirm your session details.</p>
        
        <h3>Your Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Additional Information:</strong> ${message || 'None'}</p>
        
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br/>Your Coaching Team</p>
      `
    });

    return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ message: 'Error sending emails' });
  }
}