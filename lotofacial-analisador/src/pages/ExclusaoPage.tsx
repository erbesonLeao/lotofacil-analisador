import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Volante } from '../components/Volante';
import { cn } from '../lib/utils';
import { Filter, Target, AlertCircle } from 'lucide-react';

export function ExclusaoPage() {
  useApp();
  const [k, setK] = useState(15);
  const [fixas, setFixas] = useState<number[]>([]);
  const [excluidas, setExcluidas] = useState<number[]>([]);

  const maxExclusoes = k === 15 ? 5 : 2;
  const pool = Array.from({ length: 25 }, (_, i) => i + 1)
    .filter(d => !excluidas.includes(d));

  const handleToggleFixa = (dezena: number) => {
    if (fixas.includes(dezena)) {
      setFixas(fixas.filter(d => d !== dezena));
    } else if (fixas.length < 3) {
      setFixas([...fixas, dezena]);
    }
  };

  const handleToggleExcluida = (dezena: number) => {
    if (excluidas.includes(dezena)) {
      setExcluidas(excluidas.filter(d => d !== dezena));
    } else if (excluidas.length < maxExclusoes && !fixas.includes(dezena)) {
      setExcluidas([...excluidas, dezena]);
    }
  };

  const handleLimpar = () => {
    setFixas([]);
    setExcluidas([]);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Exclusão (Cérebro 2)</h1>
        <p className="text-secondary">Defina o pool de dezenas através de exclusões estratégicas</p>
      </div>

      {/* Seletor K */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quantidade de Dezenas (K)
          </h2>
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

        <div className="bg-background/50 rounded-lg p-4">
          <p className="text-sm text-secondary">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Para K={k}: máximo de {maxExclusoes} exclusões → Pool de {25 - excluidas.length} dezenas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa de calor */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Mapa de Calor e Seleção
          </h2>
          
          <div className="mb-4">
            <p className="text-sm text-secondary mb-3">
              Clique para marcar como Fixa (roxo) ou Excluída (vermelho)
            </p>
            <Volante
              selecionadas={fixas}
              excluidas={excluidas}
              onClick={(dezena) => {
                if (fixas.includes(dezena)) {
                  handleToggleFixa(dezena);
                } else if (excluidas.includes(dezena)) {
                  handleToggleExcluida(dezena);
                } else if (fixas.length < 3) {
                  handleToggleFixa(dezena);
                } else if (excluidas.length < maxExclusoes) {
                  handleToggleExcluida(dezena);
                }
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLimpar}
              className="flex items-center gap-2 bg-border hover:bg-border/80 text-text px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Limpar Seleções
            </button>
          </div>
        </div>

        {/* Resumo do Pool */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Resumo da Estratégia</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary mb-2">Dezenas Fixas ({fixas.length}/3)</p>
                <div className="flex flex-wrap gap-2">
                  {fixas.length === 0 ? (
                    <span className="text-secondary text-sm">Nenhuma fixa selecionada</span>
                  ) : (
                    fixas.map(d => (
                      <span
                        key={d}
                        className="w-8 h-8 rounded-lg bg-fixa/20 text-fixa flex items-center justify-center font-bold text-sm"
                      >
                        {d.toString().padStart(2, '0')}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-secondary mb-2">Dezenas Excluídas ({excluidas.length}/{maxExclusoes})</p>
                <div className="flex flex-wrap gap-2">
                  {excluidas.length === 0 ? (
                    <span className="text-secondary text-sm">Nenhuma exclusão</span>
                  ) : (
                    excluidas.map(d => (
                      <span
                        key={d}
                        className="w-8 h-8 rounded-lg bg-error/20 text-error flex items-center justify-center font-bold text-sm"
                      >
                        {d.toString().padStart(2, '0')}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-secondary mb-2">Pool Resultante ({pool.length} dezenas)</p>
                <div className="flex flex-wrap gap-1">
                  {pool.map(d => (
                    <span
                      key={d}
                      className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs"
                    >
                      {d.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text mb-3">Legenda</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-fixa/20 border border-fixa"></div>
                <span className="text-secondary">Fixa (Teimosinha)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-error/20 border border-error"></div>
                <span className="text-secondary">Excluída</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary/10 border border-primary"></div>
                <span className="text-secondary">No Pool</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
