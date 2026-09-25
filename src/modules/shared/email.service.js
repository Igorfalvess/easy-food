const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender(process.env.SENDER_EMAIL, process.env.SENDER_NAME);

/**
 * Monta o corpo HTML do e-mail.
 */
function buildHtml({ header, body, footer }) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>${header}</h2>
      <p>${body}</p>
      <p style="color: #888; font-size: 12px;">${footer}</p>
    </div>
  `;
}

/**
 * Serviço genérico de envio de e-mail.
 * Não sabe o propósito — só recebe as partes e envia.
 *
 * @param {Object} params
 * @param {string} params.to       — e-mail do destinatário
 * @param {string} params.toName   — nome do destinatário
 * @param {string} params.subject  — assunto do e-mail
 * @param {string} params.header   — cabeçalho (título dentro do corpo)
 * @param {string} params.body     — corpo (conteúdo principal, aceita HTML)
 * @param {string} params.footer   — encerramento (rodapé)
 */
async function sendEmail({ to, toName, subject, header, body, footer }) {
  const recipients = [new Recipient(to, toName || to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(buildHtml({ header, body, footer }))
    .setText(`${header}\n\n${body}\n\n${footer}`);

  await mailerSend.email.send(emailParams);

  console.log(`[EMAIL] Enviado para ${to} — "${subject}"`);
}

module.exports = { sendEmail };