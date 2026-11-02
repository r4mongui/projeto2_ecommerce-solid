export class ErroAplicacao extends Error {
  constructor(
    mensagem: string,
    public readonly codigoStatus = 400
  ) {
    super(mensagem);
    this.name = 'ErroAplicacao';
  }
}
