import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Volante } from '../components/Volante';
import { cn } from '../lib/utils';
import { CheckCircle, AlertCircle, Trophy, Filter } from 'lucide-react';
import type { Concurso, Lote } from '../lib/types';

export function ConferenciaPage() {
  const { lotes, saveConcurso, updateLote } = useApp();
  
  // Estado para entrada do resultado
  const [numeroConcurso, setNumeroConcurso] = useState('');
  const [dataConcurso, setDataConcurso] = useState('');
  const [dezenasResultado, setDezenasResultado] = useState<number[]>([]);
  
  // Estado para conferência
  const [concursoSelecionado, setConcursoSelecionado] = useState<Concurso | null>(null);
  const [lotesConferidos, setLotesConferidos] = useState<Lote[]>([]);
  const [filtroAcertos, setFiltroAcertos] = useState(11);

  const handleToggleDezenaResultado = (dezena: number) => {
    if (dezenasResultado.includes(dezena)) {
      setDezenasResultado(dezenasResultado.filter(d => d !== dezena));
    } else if (dezenasResultado.length < 15) {
      setDezenasResultado([...dezenasResultado, dezena]);
    }
  };

  const salvarResultado = () => {
    if (!numeroConcurso || !dataConcurso || dezenasResultado.length !== 15) {
      alert('Preencha todos os campos e selecione 15 dezenas');
      return;
    }

    const concurso: Concurso = {
      numero: parseInt(numeroConcurso),
      data: dataConcurso,
      dezenas: dezenasResultado.sort((a, b) => a - b),
    };

    saveConcurso(concurso);
    setConcursoSelecionado(concurso);
    setNumeroConcurso('');
    setDataConcurso('');
    setDezenasResultado([]);
  };

  const conferirLotes = () => {
    if (!concursoSelecionado) return;

    const lotesPendentes = lotes.filter(l => l.status === 'pendente');
    
    const conferidos = lotesPendentes.map(lote => {
      const jogosComAcertos = lote.jogos.map(jogo => {
        const acertos = jogo.dezenas.filter(d => concursoSelecionado.dezenas.includes(d)).length;
        return { ...jogo, acertos };
      });

      const excluidasSairam = lote.excluidas.filter(d => concursoSelecionado.dezenas.includes(d));
      const excluidasFicaram = lote.excluidas.filter(d => !concursoSelecionado.dezenas.includes(d));
      const poolAcertos = concursoSelecionado.dezenas.filter(d => lote.pool.includes(d)).length;

      const qtdPorFaixa = {
        qtd_15: jogosComAcertos.filter(j => j.acertos === 15).length,
        qtd_14: jogosComAcertos.filter(j => j.acertos === 14).length,
        qtd_13: jogosComAcertos.filter(j => j.acertos === 13).length,
        qtd_12: jogosComAcertos.filter(j => j.acertos === 12).length,
        qtd_11: jogosComAcertos.filter(j => j.acertos === 11).length,
      };

      const melhorAcerto = Math.max(...jogosComAcertos.map(j => j.acertos));

      const loteAtualizado: Lote = {
        ...lote,
        status: 'conferido',
        jogos: jogosComAcertos,
        resultado_conferencia: {
          id: Date.now(),
          lote_id: lote.id!,
          concurso_id: concursoSelecionado!.id!,
          melhor_acerto: melhorAcerto,
          ...qtdPorFaixa,
          excluidas_sairam: excluidasSairam,
          excluidas_ficaram: excluidasFicaram,
          pool_acertos: poolAcertos,
          created_at: new Date().toISOString(),
        },
      };

      return loteAtualizado;
    });

    conferidos.forEach(lote => updateLote(lote));
    setLotesConferidos(conferidos);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Conferência de Resultados</h1>
        <p className="text-secondary">Informar resultado oficial, conferir lotes e analisar exclusões</p>
      </div>

      {/* Entrada do resultado */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Informar Resultado Oficial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-secondary mb-2">Número do Concurso</label>
            <input
              type="number"
              value={numeroConcurso}
              onChange={(e) => setNumeroConcurso(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
              placeholder="Ex: 3000"
            />
          </div>
          
          <div>
            <label className="block text-sm text-secondary mb-2">Data do Sorteio</label>
            <input
              type="date"
              value={dataConcurso}
              onChange={(e) => setDataConcurso(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-secondary mb-2">
            Selecione as 15 dezenas do resultado ({dezenasResultado.length}/15)
          </label>
          <Volante
            selecionadas={dezenasResultado}
            onClick={handleToggleDezenaResultado}
          />
        </div>

        <button
          onClick={salvarResultado}
          disabled={dezenasResultado.length !== 15}
          className="flex items-center gap-2 bg-success hover:bg-success/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          Salvar Resultado e Atualizar Histórico
        </button>
      </div>

      {/* Resultado salvo */}
      {concursoSelecionado && (
        <>
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-text mb-4">Resultado do Concurso {concursoSelecionado.numero}</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <Volante
                resultado={concursoSelecionado.dezenas}
                showResult
                disabled
              />
              
              <div className="ml-4">
                <p className="text-sm text-secondary">Data: {new Date(concursoSelecionado.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-secondary mt-1">Pool acertou {concursoSelecionado.dezenas.length} de 15 dezenas</p>
              </div>
            </div>

            <button
              onClick={conferirLotes}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Conferir Lotes Pendentes
            </button>
          </div>

          {/* Lotes conferidos */}
          {lotesConferidos.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text">Resultados da Conferência</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary" />
                  <select
                    value={filtroAcertos}
                    onChange={(e) => setFiltroAcertos(Number(e.target.value))}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-primary"
                  >
                    <option value={11}>≥ 11 acertos</option>
                    <option value={13}>≥ 13 acertos</option>
                    <option value={14}>≥ 14 acertos</option>
                    <option value={15}>Apenas 15</option>
                  </select>
                </div>
              </div>

              {lotesConferidos.map((lote, idx) => (
                <div key={lote.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text">
                      Lote #{idx + 1} - {lote.k} dezenas ({lote.modo})
                    </h3>
                    {lote.resultado_conferencia && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        lote.resultado_conferencia.melhor_acerto >= 14
                          ? 'bg-success/10 text-success'
                          : lote.resultado_conferencia.melhor_acerto >= 13
                          ? 'bg-warning/10 text-warning'
                          : 'bg-background text-secondary'
                      )}>
                        Melhor: {lote.resultado_conferencia.melhor_acerto} pontos
                      </span>
                    )}
                  </div>

                  {/* Análise das exclusões */}
                  {lote.resultado_conferencia && (
                    <div className="mb-6 p-4 bg-background rounded-lg">
                      <h4 className="text-sm font-medium text-secondary mb-3">Análise das Exclusões</h4>
                      
                      <div className="flex items-center gap-6 mb-4">
                        <div>
                          <p className="text-xs text-secondary mb-2">Excluídas que ficaram fora (✓)</p>
                          <div className="flex flex-wrap gap-2">
                            {lote.resultado_conferencia.excluidas_ficaram.length === 0 ? (
                              <span className="text-secondary text-sm">Nenhuma</span>
                            ) : (
                              lote.resultado_conferencia.excluidas_ficaram.map(d => (
                                <span
                                  key={d}
                                  className="w-8 h-8 rounded-lg bg-success/20 text-success flex items-center justify-center font-bold text-sm"
                                >
                                  {d.toString().padStart(2, '0')}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-secondary mb-2">Excluídas que saíram no sorteio (✗)</p>
                          <div className="flex flex-wrap gap-2">
                            {lote.resultado_conferencia.excluidas_sairam.length === 0 ? (
                              <span className="text-secondary text-sm">Nenhuma</span>
                            ) : (
                              lote.resultado_conferencia.excluidas_sairam.map(d => (
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
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={cn(
                            'w-5 h-5',
                            lote.resultado_conferencia.excluidas_sairam.length === 0
                              ? 'text-success'
                              : 'text-error'
                          )} />
                          <span className="text-sm text-secondary">
                            Erros de exclusão: {lote.resultado_conferencia.excluidas_sairam.length}
                          </span>
                        </div>
                        <div className="text-sm text-secondary">
                          Pool acertou {lote.resultado_conferencia.pool_acertos} de 15
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Jogos ordenados por acertos */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary mb-3">Jogos por Pontuação</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[...lote.jogos]
                        .sort((a, b) => (b.acertos || 0) - (a.acertos || 0))
                        .filter(j => (j.acertos || 0) >= filtroAcertos)
                        .map((jogo, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'flex items-center justify-between bg-background rounded-lg p-3',
                              (jogo.acertos || 0) >= 14 && 'border border-success/50',
                              (jogo.acertos || 0) === 13 && 'border border-warning/50',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                                (jogo.acertos || 0) >= 14
                                  ? 'bg-success/20 text-success'
                                  : (jogo.acertos || 0) === 13
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-primary/10 text-primary'
                              )}>
                                {jogo.acertos}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {jogo.dezenas.map(d => (
                                  <span
                                    key={d}
                                    className={cn(
                                      'w-6 h-6 rounded flex items-center justify-center text-xs font-semibold',
                                      concursoSelecionado.dezenas.includes(d)
                                        ? 'bg-success text-white'
                                        : 'bg-primary/10 text-primary'
                                    )}
                                  >
                                    {d.toString().padStart(2, '0')}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className={cn(
                              'text-sm font-medium',
                              (jogo.acertos || 0) >= 14
                                ? 'text-success'
                                : (jogo.acertos || 0) === 13
                                ? 'text-warning'
                                : 'text-secondary'
                            )}>
                              {(jogo.acertos || 0)} pts
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
