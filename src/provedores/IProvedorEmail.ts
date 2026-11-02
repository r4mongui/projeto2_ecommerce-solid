export interface DadosEnvioEmail {
  destinatario: string;
  assunto: string;
  texto: string;
  html: string;
}

export interface ResultadoEmail {
  urlVisualizacao: string | null;
}

export interface IProvedorEmail {
  enviarEmail(dados: DadosEnvioEmail): Promise<ResultadoEmail>;
}
