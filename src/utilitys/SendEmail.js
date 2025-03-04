import nodemailer from "nodemailer";
export default async function SendEmail(to, subject, html) { 
  try {
      const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, 
          auth: {
              user: process.env.SENDER_EMAIL,
              pass: process.env.SENDER_PASS,
          },
      });

      const info = await transporter.sendMail({
          from: `"ECommerce" <${process.env.SENDER_EMAIL}>`,
          to, 
          subject,
          html,
      });

      console.log("Email sent: ", info.messageId);
      return info;
  } catch (error) {
      console.error("Email sending error: ", error);
  }
}
