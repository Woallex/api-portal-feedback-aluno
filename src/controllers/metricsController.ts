import { Request, Response } from "express";
import prisma from "../libs/prisma";
import PDFDocument from "pdfkit-table";

export const generateMonitoringPDF = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const logs = await prisma.routeLog.findMany({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });

    if (logs.length === 0) {
      return res.status(404).json({ message: "Nenhum dado de monitoramento encontrado para este mês." });
    }

    const routeCounts: { [key: string]: number } = {};
    const hourCounts: { [key: number]: number } = {};

    logs.forEach(log => {
      const key = `${log.method} ${log.route}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;

      const hour = new Date(log.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let peakHour = 0;
    let maxVisits = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxVisits) {
        maxVisits = count;
        peakHour = parseInt(hour);
      }
    });

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio_monitoramento_${now.getMonth() + 1}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Portal do Feedback - Relatório de Monitoramento", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Período: 01/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} até hoje.`, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(14).text("📊 Resumo de Uso do Sistema", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`• Total de requisições no mês: ${logs.length}`);
    doc.text(`• Horário de Pico (Maior Volume): Às ${String(peakHour).padStart(2, '0')}:00h (${maxVisits} acessos nesse horário).`);
    doc.moveDown(2);

    doc.fontSize(14).text("📈 Detalhamento de Acessos por Rota", { underline: true });
    doc.moveDown();

    const tableRows = Object.entries(routeCounts).map(([route, count]) => {
      return [route, count.toString()];
    });

    const table = {
      title: "Uso das Rotas da API",
      headers: ["Rota / Método", "Quantidade de Acessos"],
      rows: tableRows,
    };

    await doc.table(table, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: () => doc.font("Helvetica").fontSize(10),
    });

    doc.end();

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return res.status(500).json({ message: "Erro interno ao gerar o PDF." });
  }
};