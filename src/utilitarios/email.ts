import nodemailer from 'nodemailer';
import registrador from './registrador';

let transportador: nodemailer.Transporter | null = null;

export const obterClienteEmail = async () => {
  if (transportador) return transportador;

  const contaTeste = await nodemailer.createTestAccount();

  transportador = nodemailer.createTransport({
    host: contaTeste.smtp.host,
    port: contaTeste.smtp.port,
    secure: contaTeste.smtp.secure,
    auth: {
      user: contaTeste.user,
      pass: contaTeste.pass,
    },
  });

  registrador.info(`Ethereal Mail configurado: ${contaTeste.user}`);
  return transportador;
};
