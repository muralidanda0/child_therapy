const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

exports.postContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      req.flash('error', 'Please fill in all required fields.');
      return res.redirect('/contact');
    }

    await Contact.create({ name, email, phone: phone || '', subject, message });

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || 'info@littleheartstherapy.com',
          subject: `[Contact Form] ${subject}`,
          text: `From: ${name} (${email})\nPhone: ${phone || 'N/A'}\n\n${message}`
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    req.flash('success', 'Thank you! Your message has been sent. We will respond within 1 business day.');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not send message. Please try again.');
    res.redirect('/contact');
  }
};
