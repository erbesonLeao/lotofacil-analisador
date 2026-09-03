import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Sparkles, Save, ListFilter } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Lote, Jogo } from '../lib/types';

const MODOS_GERACAO = [
  { id: 'forte', nome: 'Forte', desc: 'Máxima cobertura com filtros rigorosos' },
  { id: 'intermediario', nome: 'Intermediário', desc: 'Equilíbrio entre quantidade e qualidade' },
  { id: 'economico', nome: 'Econômico', desc: 'Menos jogos, foco em padrões principais' },
  { id: 'leve', nome: 'Leve', desc: 'Geração rápida com filtros básicos' },
  { id: 'hibrido', nome: 'Híbrido', desc: 'Combinação de estratégias' },
  { id: 'grupos', nome: 'Grupos', desc: 'Divisão por grupos de dezenas' },
];

export function GeracaoPage() {
  const { saveLote } = useApp();
  const [k, setK] = useState(15);
  const [modo, setModo] = useState('forte');
  const [teimosinhas, setTeimosinhas] = useState(0);
  const [pool] = useState<number[]>(Array.from({ length: 25 }, (_, i) => i + 1));
  const [excluidas] = useState<number[]>([]);
  const [jogosGerados, setJogosGerados] = useState<Jogo[]>([]);
  const [gerando, setGerando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  // Simulação de geração de jogos
  const gerarJogos = () => {
    setGerando(true);
    
    setTimeout(() => {
      const novosJogos: Jogo[] = [];
      const quantidadeJogos = modo === 'forte' ? 10 : modo === 'intermediario' ? 6 : 3;

      for (let i = 0; i < quantidadeJogos; i++) {
        const jogoDezenas = [...pool].sort(() => Math.random() - 0.5).slice(0, k).sort((a, b) => a - b);
        novosJogos.push({
          ordem: i + 1,
          dezenas: jogoDezenas,
        });
      }

      setJogosGerados(novosJogos);
      setGerando(false);
    }, 1000);
  };

  const salvarLote = () => {
    if (jogosGerados.length === 0) {
      setMensagem({ tipo: 'erro', texto: 'Gere jogos antes de salvar' });
      return;
    }

    const lote: Lote = {
      concurso_alvo: null,
      k,
      modo,
      pool,
      excluidas,
      fixas: [],
      jogos: jogosGerados,
      status: 'pendente',
    };

    saveLote(lote);
    setMensagem({ tipo: 'sucesso', texto: `Lote com ${jogosGerados.length} jogos salvo com sucesso!` });
    setJogosGerados([]);
    
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Geração (Cérebro 3)</h1>
        <p className="text-secondary">Gerar lotes de jogos com filtros e estratégias</p>
      </div>

      {/* Configurações */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Configurações de Geração</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm text-secondary mb-2">Quantidade de Dezenas (K)</label>
            <div className="flex gap-2">
              {[15, 16, 17, 18].map((valor) => (
                <button
                  key={valor}
                  onClick={() => setK(valor)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    k === valor
                      ? 'bg-primary text-white'
                      : 'bg-background text-secondary hover:text-text'
                  )}
                >
                  {valor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-secondary mb-2">Teimosinhas</label>
            <div className="flex gap-2">
              {[0, 2, 3].map((valor) => (
                <button
                  key={valor}
                  onClick={() => setTeimosinhas(valor)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    teimosinhas === valor
                      ? 'bg-primary text-white'
                      : 'bg-background text-secondary hover:text-text'
                  )}
                >
                  {valor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-secondary mb-2">Pool de Dezenas</label>
            <p className="text-text font-medium">{pool.length} dezenas disponíveis</p>
            <p className="text-xs text-secondary mt-1">{excluidas.length} excluídas</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-secondary mb-3">Modo de Geração</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {MODOS_GERACAO.map((m) => (
              <button
                key={m.id}
                onClick={() => setModo(m.id)}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  modo === m.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                )}
              >
                <p className="text-sm font-medium text-text">{m.nome}</p>
                <p className="text-xs text-secondary mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ações */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ações
            </h3>

            <div className="flex gap-3">
              <button
                onClick={gerarJogos}
                disabled={gerando}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {gerando ? 'Gerando...' : 'Gerar Jogos'}
              </button>

              <button
                onClick={salvarLote}
                disabled={jogosGerados.length === 0}
                className="flex items-center gap-2 bg-success hover:bg-success/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Salvar Lote
              </button>
            </div>

            {mensagem && (
              <div className={cn(
                'mt-4 p-3 rounded-lg text-sm',
                mensagem.tipo === 'sucesso' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              )}>
                {mensagem.texto}
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Resumo do Lote</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary">K (dezenas por jogo)</span>
                <span className="text-text font-medium">{k}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Modo</span>
                <span className="text-text font-medium capitalize">{modo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Teimosinhas</span>
                <span className="text-text font-medium">{teimosinhas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Jogos gerados</span>
                <span className="text-text font-medium">{jogosGerados.length}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-secondary">Pool</span>
                <span className="text-text font-medium">{pool.length} dezenas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de jogos */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text flex items-center gap-2">
              <ListFilter className="w-5 h-5" />
              Jogos Gerados
            </h3>
            {jogosGerados.length > 0 && (
              <span className="text-sm text-secondary">{jogosGerados.length} jogos</span>
            )}
          </div>

          {jogosGerados.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
              <p className="text-secondary">Nenhum jogo gerado ainda</p>
              <p className="text-sm text-secondary mt-1">Clique em "Gerar Jogos" para começar</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jogosGerados.map((jogo) => (
                <div
                  key={jogo.ordem}
                  className="bg-background rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-secondary">Jogo #{jogo.ordem}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {jogo.dezenas.map((d) => (
                      <span
                        key={d}
                        className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs"
                      >
                        {d.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
