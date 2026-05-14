import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport(<SMTPTransport.Options>{
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout:10000,
  greetingTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, code: string) => {
  const mailOption = {
    from: `"Portal do Feedback" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Seu código de acesso - Portal do Feedback",
    text: `Seu código de verificação é: ${code}. Ele é válido apenas para o acesso de hoje.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Olá!</h2>
        <p>Você solicitou acesso ao <strong>Portal do Feedback</strong>.</p>
        <p>Seu código de verificação é:</p>
        <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
        <p>Este código é válido para as validações realizadas hoje.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOption);
};
