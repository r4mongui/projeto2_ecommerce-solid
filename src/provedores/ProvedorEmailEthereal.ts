import { injectable } from 'inversify';
import { TYPES } from '../container/types';
import nodemailer from 'nodemailer';
import { obterClienteEmail } from '../utilitarios/email';
import registrador from '../utilitarios/registrador';
import { IProvedorEmail, ResultadoEmail, DadosEnvioEmail } from './IProvedorEmail';

@injectable()
export class EtherealMailProvider implements IProvedorEmail {
  async enviarEmail(dados: DadosEnvioEmail): Promise<ResultadoEmail> {
    const clienteEmail = await obterClienteEmail();

    const informacoes = await clienteEmail.sendMail({
      from: '"Loja Virtual" <naoresponda@loja.exemplo>',
      to: dados.destinatario,
      subject: dados.assunto,
      text: dados.texto,
      html: dados.html,
    });

    const urlVisualizacao = nodemailer.getTestMessageUrl(informacoes) || null;
    registrador.info(`Email enviado: ${urlVisualizacao ?? 'sem URL de visualização'}`);

    return { urlVisualizacao };
  }
}

export { EtherealMailProvider as ProvedorEmailEthereal };
