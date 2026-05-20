import { Resend } from 'resend';

// Inicializa o Resend com a sua chave de API
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, code: string) => {
  try {
    const data = await resend.emails.send({
      from: 'estudoswoallex@gmail.com', 
      to: to,
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
    });

    return data;
  } catch (error) {
    console.error("Erro ao enviar e-mail via Resend:", error);
    throw error;
  }
};