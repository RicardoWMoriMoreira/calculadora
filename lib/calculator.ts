export type Operacao = "+" | "-" | "*" | "/" | null;

export const parseDisplayNumero = (str: string): number => {
  if (!str || typeof str !== "string") return 0;
  const normalizado = str.trim().replace(/,/g, ".");
  const num = parseFloat(normalizado);
  return Number.isNaN(num) ? 0 : num;
};

export const formatarResultado = (valor: number): string => {
  if (!Number.isFinite(valor)) return "Erro";
  if (Number.isInteger(valor)) return String(valor);
  const rounded = Math.round(valor * 1e12) / 1e12;
  return String(rounded);
};

export const calcularInterno = (
  n1: number,
  n2: number,
  op: Operacao
): number => {
  switch (op) {
    case "+":
      return n1 + n2;
    case "-":
      return n1 - n2;
    case "*":
      return n1 * n2;
    case "/":
      return n2 === 0 ? NaN : n1 / n2;
    default:
      return n2;
  }
};
