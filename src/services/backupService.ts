import cron from "node-cron";
import { Resend } from "resend";
import prisma from "../libs/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateAndSendBackup = async () => {
  try {
    console.log("INCIANDO BACKUO DIÁRIO ÁS 17H...");

    const feedbacks = await prisma.publication.findMany({
      include: {
        author: {
          select: { login: true },
        },
      },
    });

    if (!feedbacks || feedbacks.length === 0) {
      console.log("Nenhum dado encontrado para backup.");
      return;
    }

    const csvHeaders = [
      "ID",
      "Titulo",
      "Descricao",
      "Autor",
      "Data de Criacao",
    ].join(";");
    const csvRows = feedbacks.map((item) => {
      const title = item.title.replace(/[\n\r;]/g, " ");
      const description = item.description.replace(/[\n\r;]/g, " ");
      const author = item.author?.login || "Anonimo";
      const date = new Date(item.createdAt).toLocaleDateString("pt-BR");
      return `${item.id};${title};${description};${author};${date}`;
    });

    const csvContent = "\uFEFF" + [csvHeaders, ...csvRows].join("\n");
    const csvBuffer = Buffer.from(csvContent, "utf-8");

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "estudoswoallex@gmail.com",
      subject: `📊 Backup Diário - Portal do Feedback - ${new Date().toLocaleDateString("pt-BR")}`,
      html: `<p>Segue em anexo o backup automático do banco de dados gerado hoje.</p>`,
      attachments: [
        {
          filename: `backup_portal_${new Date().toISOString().split("T")[0]}.csv`,
          content: csvBuffer,
        },
      ],
    });

    console.log("Backup enviado para e-mail!");
  } catch (error) {
    console.log(`Erro ao fazer bacckup diário: ${error}`);
  }
};

export const initBackupSchedule = () => {
  cron.schedule("0 17 * * *", () => {
    generateAndSendBackup();
  });
  console.log("⏰ Agendador de tarefas iniciado: Backup configurado para as 17:00.")
};
