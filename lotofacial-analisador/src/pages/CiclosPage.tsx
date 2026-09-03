import { useApp } from '../contexts/AppContext';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export function CiclosPage() {
  const { concursos } = useApp();

  // Calcular estatísticas simples
  const calcularEstatisticas = () => {
    if (concursos.length === 0) return [];

    const freq: Record<number, number> = {};
    const ultimoAtraso: Record<number, number> = {};
    
    for (let i = 1; i <= 25; i++) {
      freq[i] = 0;
      ultimoAtraso[i] = 0;
    }

    const sortedConcursos = [...concursos].sort((a, b) => b.numero - a.numero);
    
    sortedConcursos.forEach((concurso, idx) => {
      concurso.dezenas.forEach(d => {
        freq[d]++;
        if (idx === 0) ultimoAtraso[d] = 0;
      });
      
      for (let i = 1; i <= 25; i++) {
        if (!concurso.dezenas.includes(i)) {
          ultimoAtraso[i]++;
        }
      }
    });

    return Array.from({ length: 25 }, (_, i) => ({
      dezena: i + 1,
      frequencia: freq[i + 1],
      atraso: ultimoAtraso[i + 1],
    })).sort((a, b) => b.frequencia - a.frequencia);
  };

  const estatisticas = calcularEstatisticas();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Ciclos e Movimentação</h1>
        <p className="text-secondary">Ciclo das 25 dezenas, linhas, colunas, moldura × miolo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ciclo das 25 dezenas */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ciclo das 25 Dezenas
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {estatisticas.map((est) => (
              <div
                key={est.dezena}
                className="bg-background rounded-lg p-3 text-center"
              >
                <p className="text-2xl font-bold text-primary">{est.dezena.toString().padStart(2, '0')}</p>
                <p className="text-xs text-secondary mt-1">Freq: {est.frequencia}</p>
                <p className="text-xs text-secondary">Atraso: {est.atraso}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de movimentação */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Tabela de Movimentação</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {estatisticas.slice(0, 15).map((est, idx) => (
              <div
                key={est.dezena}
                className="flex items-center justify-between bg-background rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary text-sm w-6">{idx + 1}º</span>
                  <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {est.dezena.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-text font-medium">{est.frequencia}x</p>
                    <p className="text-xs text-secondary">frequência</p>
                  </div>
                  <div className="text-right">
                    <p className="text-text font-medium">{est.atraso}</p>
                    <p className="text-xs text-secondary">atraso</p>
                  </div>
                  {est.atraso === 0 ? (
                    <ArrowUp className="w-5 h-5 text-success" />
                  ) : est.atraso > 5 ? (
                    <ArrowDown className="w-5 h-5 text-error" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linhas e Colunas */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Distribuição por Linhas e Colunas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-secondary mb-3">Linhas (Padrão Esperado)</h3>
            <div className="space-y-2">
              {[
                { padrao: '(4,3,3,3,2)', desc: 'Mais comum para k=15' },
                { padrao: '(4,4,3,2,2)', desc: 'Alternativa válida' },
                { padrao: '(4,4,3,3,1)', desc: 'Menos frequente' },
              ].map((item, idx) => (
                <div key={idx} className="bg-background rounded-lg p-3 flex justify-between items-center">
                  <span className="text-text font-mono">{item.padrao}</span>
                  <span className="text-sm text-secondary">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-secondary mb-3">Colunas (Padrão Esperado)</h3>
            <div className="space-y-2">
              {[
                { padrao: '(4,3,3,3,2)', desc: 'Equilibrado' },
                { padrao: '(4,4,3,2,2)', desc: 'Concentrado' },
                { padrao: '(3,3,3,3,3)', desc: 'Perfeito (raro)' },
              ].map((item, idx) => (
                <div key={idx} className="bg-background rounded-lg p-3 flex justify-between items-center">
                  <span className="text-text font-mono">{item.padrao}</span>
                  <span className="text-sm text-secondary">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
