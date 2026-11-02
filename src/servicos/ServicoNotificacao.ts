import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';
import { IProvedorEmail } from '../provedores/IProvedorEmail';
import { IServicoNotificacao, DadosNotificacaoPedido } from './IServicoNotificacao';

@injectable()
export class ServicoNotificacao implements IServicoNotificacao {
  constructor(@inject(TYPES.MailProvider) private readonly provedorEmail: IProvedorEmail) {}

  async enviarConfirmacaoPedido(dados: DadosNotificacaoPedido): Promise<string | null> {
    const resultado = await this.provedorEmail.enviarEmail({
      destinatario: dados.cliente,
      assunto: `Confirmação do Pedido #${dados.idPedido}`,
      texto: `Olá, seu pedido #${dados.idPedido} no valor de R$ ${dados.valorTotal.toFixed(2)} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${dados.idPedido}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${dados.valorTotal.toFixed(2)}</strong></p>
        <ul>
          ${dados.nomesProdutos.map((nome) => `<li>${nome}</li>`).join('')}
        </ul>
      `,
    });

    return resultado.urlVisualizacao;
  }
}
