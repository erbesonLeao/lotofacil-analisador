import { cn } from '../lib/utils';

interface VolanteProps {
  dezenas?: number[];
  selecionadas?: number[];
  resultado?: number[];
  excluidas?: number[];
  onClick?: (dezena: number) => void;
  disabled?: boolean;
  showResult?: boolean;
}

export function Volante({
  dezenas = [],
  selecionadas = [],
  resultado = [],
  excluidas = [],
  onClick,
  disabled = false,
  showResult = false,
}: VolanteProps) {
  const allDezenas = dezenas.length > 0 ? dezenas : Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-2 w-fit">
      {allDezenas.map((dezena) => {
        const isSelected = selecionadas.includes(dezena);
        const isResultado = resultado.includes(dezena);
        const isExcluida = excluidas.includes(dezena);
        
        let bgColor = 'bg-card';
        let textColor = 'text-text';
        let borderColor = 'border-border';

        if (showResult && isResultado) {
          bgColor = 'bg-success';
          textColor = 'text-white';
        } else if (isExcluida && isResultado) {
          bgColor = 'bg-error';
          textColor = 'text-white';
        } else if (isExcluida && !isResultado) {
          bgColor = 'bg-success/20';
          textColor = 'text-success';
          borderColor = 'border-success';
        } else if (isSelected) {
          bgColor = 'bg-primary';
          textColor = 'text-white';
        }

        return (
          <button
            key={dezena}
            onClick={() => !disabled && onClick?.(dezena)}
            disabled={disabled}
            className={cn(
              'w-10 h-10 rounded-lg border font-semibold text-sm transition-all',
              bgColor,
              textColor,
              borderColor,
              !disabled && 'hover:border-primary cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {dezena.toString().padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
}
