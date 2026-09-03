import { BookOpen } from 'lucide-react';

export function RegrasPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Regras e Filtros (Cérebro 1)</h1>
        <p className="text-secondary">Padrões de validação aplicados na geração de jogos</p>
      </div>

      <div className="space-y-6">
        {/* K = 15 */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Regras para K = 15
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-secondary mb-3">Padrões de Linhas/Colunas</h3>
              <div className="space-y-2">
                {[
                  { padrao: '(4,3,3,3,2)', desc: 'Mais comum' },
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
              <h3 className="text-sm font-medium text-secondary mb-3">Filtros Numéricos</h3>
              <div className="space-y-3">
                <div className="bg-background rounded-lg p-3">
                  <p className="text-text font-medium">Pares</p>
                  <p className="text-sm text-secondary mt-1">7 a 8 números pares por jogo</p>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-text font-medium">Soma</p>
                  <p className="text-sm text-secondary mt-1">180 a 210 (pool 22: 175–215)</p>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-text font-medium">Sequência</p>
                  <p className="text-sm text-secondary mt-1">3 a 6 sequências consecutivas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background rounded-lg p-4">
                <p className="text-text font-medium mb-1">Repetição</p>
                <p className="text-sm text-secondary">8 a 10 dezenas repetidas do concurso anterior</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-text font-medium mb-1">Moldura</p>
                <p className="text-sm text-secondary">9 a 10 dezenas na moldura externa</p>
              </div>
            </div>
          </div>
        </div>

        {/* K = 16, 17, 18 */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Regras para K = 16, 17, 18 (Cobertura)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">K</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Padrão Principal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Exclusões Máx.</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Pool Resultante</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text font-bold">16</td>
                  <td className="py-3 px-4 text-text font-mono">(4,4,3,3,2)</td>
                  <td className="py-3 px-4 text-text">0 a 2</td>
                  <td className="py-3 px-4 text-secondary">23 a 25 dezenas</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-text font-bold">17</td>
                  <td className="py-3 px-4 text-text font-mono">(4,4,3,3,3)</td>
                  <td className="py-3 px-4 text-text">0 a 2</td>
                  <td className="py-3 px-4 text-secondary">23 a 25 dezenas</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-text font-bold">18</td>
                  <td className="py-3 px-4 text-text font-mono">(4,4,4,3,3)</td>
                  <td className="py-3 px-4 text-text">0 a 2</td>
                  <td className="py-3 px-4 text-secondary">23 a 25 dezenas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-sm text-warning">
              <strong>Nota:</strong> Linha com 5 dezenas é permitida apenas como secundária. 
              Evitar padrões (5,5,...) e linha 0 na regra principal.
            </p>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Como Funciona o Cérebro 1</h2>
          
          <div className="space-y-4 text-secondary">
            <p>
              O <strong className="text-text">Cérebro 1</strong> é responsável apenas pela validação de jogos. 
              Ele não gera nem exclui dezenas — apenas verifica se um jogo atende aos padrões estatísticos 
              observados nos concursos históricos da Lotofácil.
            </p>
            
            <div className="bg-background rounded-lg p-4">
              <p className="text-text font-medium mb-2">Fluxo de Validação:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>O Cérebro 3 gera um jogo dentro do pool definido</li>
                <li>O Cérebro 1 valida se o jogo passa pelos filtros</li>
                <li>Jogos inválidos são descartados ou regenerados</li>
                <li>Apenas jogos válidos compõem o lote final</li>
              </ol>
            </div>

            <p>
              Esta abordagem garante que todos os jogos gerados tenham estrutura estatisticamente 
              consistente com os resultados históricos, aumentando as chances de acerto sem 
              prometer prêmios ou garantir resultados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
