/* global process */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendRegistrationEmail = async (student) => {
  const mailOptions = {
    from: `"CamPlace Administration" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Welcome to CamPlace - Registration Received',
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${student.firstName},</p>
      <p>Thank you for registering on the CamPlace platform. We have successfully received your profile details.</p>
      <p>To maintain the integrity of our placement process, all new student accounts must be verified by the administration team. Your profile is currently under review. We will notify you via email as soon as your academic details and documents have been checked and your account is fully activated.</p>
      <p>In the meantime, no further action is required on your part. If we need any additional information, we will reach out to you directly.</p>
      <br>
      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">The CamPlace Administration Team</strong></p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated message from the CamPlace Placement Portal. Please do not reply directly to this email.</p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${student.email}`);
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
};

export const sendShortlistedEmail = async (student, job) => {
  const mailOptions = {
    from: `"CamPlace Administration" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `Interview Shortlist: ${job.title} at ${job.company}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${student.firstName},</p>
      <p>We are writing to confirm that your application for the <strong>${job.title}</strong> position at <strong>${job.company}</strong> has been successfully processed.</p>
      <p>We are pleased to inform you that you have been shortlisted for the interview round. Please make a note of your scheduled interview details below:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px;"><strong>Company:</strong> ${job.company}</li>
          <li style="margin-bottom: 10px;"><strong>Role:</strong> ${job.title}</li>
          <li style="margin-bottom: 10px;"><strong>Date:</strong> ${new Date(job.interviewDate).toLocaleDateString()}</li>
          <li style="margin-bottom: 10px;"><strong>Time:</strong> ${job.interviewTime}</li>
          <li><strong>Location:</strong> ${job.location}</li>
        </ul>
      </div>

      <p>Please ensure you arrive (or log in) at least 10 minutes prior to your scheduled time. We recommend reviewing your resume and the job description thoroughly before the interview.</p>
      <p>We wish you the best of luck.</p>
      <br>
      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">The CamPlace Administration Team</strong></p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated message from the CamPlace Placement Portal.</p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Shortlisted email sent to ${student.email}`);
  } catch (error) {
    console.error('Error sending shortlisted email:', error);
  }
};

export const sendSelectedEmail = async (student, job) => {
  const mailOptions = {
    from: `"CamPlace Administration" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `Congratulations! Selection for ${job.title} at ${job.company}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${student.firstName},</p>
      <p>We are pleased to share an update regarding your recent interview for the <strong>${job.title}</strong> position at <strong>${job.company}</strong>.</p>
      <p>The placement team has been notified that you have been successfully <strong>selected</strong> for this role! The company was highly impressed with your profile and interview performance.</p>
      <p>Further details regarding your formal offer letter, onboarding process, and next steps will be communicated to you shortly by either the company's HR department or the placement cell.</p>
      <p>Thank you for representing our institution so well, and we wish you massive success in this new role.</p>
      <br>
      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">The CamPlace Administration Team</strong></p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated message from the CamPlace Placement Portal.</p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Selected email sent to ${student.email}`);
  } catch (error) {
    console.error('Error sending selected email:', error);
  }
};

export const sendRejectedEmail = async (student, job) => {
  const mailOptions = {
    from: `"CamPlace Administration" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `Application Update: ${job.title} at ${job.company}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${student.firstName},</p>
      <p>Thank you for your interest and for taking the time to interview for the <strong>${job.title}</strong> position at <strong>${job.company}</strong>.</p>
      <p>The selection process for this role was highly competitive. We are writing to inform you that the company has decided to move forward with other candidates at this time, and your application for this specific role has been closed.</p>
      <p>Please do not let this discourage you. The placement cell is continuously partnering with new companies, and we strongly encourage you to keep your profile updated and apply for other upcoming opportunities on the CamPlace platform.</p>
      <br>
      <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">The CamPlace Administration Team</strong></p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated message from the CamPlace Placement Portal.</p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Rejected email sent to ${student.email}`);
  } catch (error) {
    console.error('Error sending rejected email:', error);
  }
};

export const sendQueryConfirmationEmail = async (query) => {
  const mailOptions = {
    from: `"CamPlace Support" <${process.env.EMAIL_USER}>`,
    to: query.email,
    subject: 'We have received your query - CamPlace Support',
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${query.firstName},</p>
      <p>Thank you for contacting the CamPlace team. We have received your query and our support team is currently reviewing it.</p>
      <p>We will get back to you with an update or resolution shortly. Thank you for your patience!</p>
      <br>
      <p style="margin-bottom: 0;">
        Best regards,<br>
        <strong style="color: #111827;">The CamPlace Administration Team</strong>
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        This is an automated message confirming receipt of your inquiry.
      </p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Query confirmation email sent to ${query.email}`);
  } catch (error) {
    console.error('Error sending query confirmation email:', error);
  }
};

export const sendQueryReplyEmail = async (query, reply) => {
  const mailOptions = {
    from: `"CamPlace Support" <${process.env.EMAIL_USER}>`,
    to: query.email,
    subject: `Re: ${query.subject} - CamPlace Support`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">CamPlace</h1>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px;">
      <p style="margin-top: 0; font-weight: 600; color: #111827;">Dear ${query.firstName},</p>
      <p>Our support team has responded to your query regarding "<strong>${query.subject}</strong>".</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin-top: 0; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Your Message:</p>
        <p style="font-style: italic; color: #475569;">"${query.message}"</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="margin-top: 0; font-weight: 600; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Admin Response:</p>
        <p style="color: #1e293b; white-space: pre-wrap;">${reply}</p>
      </div>
      <p>If you have any further questions, please feel free to reach out to us again.</p>
      <br>
      <p style="margin-bottom: 0;">
        Best regards,<br>
        <strong style="color: #111827;">The CamPlace Administration Team</strong>
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        This is an automated message from the CamPlace Placement Portal.
      </p>
    </div>
  </div>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Query reply email sent to ${query.email}`);
  } catch (error) {
    console.error('Error sending query reply email:', error);
  }
};
