import { injectable } from 'inversify';
import type { DadosEnvioEmail, IProvedorEmail, ResultadoEmail } from './IProvedorEmail';
@injectable()
export class ConsoleMailProvider implements IProvedorEmail {
  async enviarEmail(dados: DadosEnvioEmail): Promise<ResultadoEmail> {
    console.log('[ConsoleMailProvider]', dados);
    return { urlVisualizacao: null };
  }
}
