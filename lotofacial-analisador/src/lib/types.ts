export interface Concurso {
  id?: number;
  numero: number;
  data: string;
  dezenas: number[];
  created_at?: string;
  updated_at?: string;
}

export interface Lote {
  id?: number;
  concurso_alvo: number | null;
  k: number;
  modo: string;
  pool: number[];
  excluidas: number[];
  fixas: number[];
  jogos: Jogo[];
  status: 'pendente' | 'conferido';
  created_at?: string;
  updated_at?: string;
  resultado_conferencia?: ResultadoConferencia;
}

export interface Jogo {
  id?: number;
  lote_id?: number;
  ordem: number;
  dezenas: number[];
  acertos?: number;
}

export interface ResultadoConferencia {
  id?: number;
  lote_id: number;
  concurso_id: number;
  melhor_acerto: number;
  qtd_15: number;
  qtd_14: number;
  qtd_13: number;
  qtd_12: number;
  qtd_11: number;
  excluidas_sairam: number[];
  excluidas_ficaram: number[];
  pool_acertos: number;
  created_at?: string;
}

export interface CicloInfo {
  tipo: '25_dezenas' | 'linhas' | 'colunas' | 'moldura_miolo';
  faltam: number;
  aberto_ha: number;
  lista?: number[];
}

export interface EstatisticaDezena {
  dezena: number;
  frequencia: number;
  atraso: number;
  ciclo_hits?: number;
}
