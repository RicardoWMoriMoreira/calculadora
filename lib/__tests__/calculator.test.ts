import {
  calcularInterno,
  formatarResultado,
  parseDisplayNumero,
} from "../calculator";

describe("parseDisplayNumero", () => {
  it("deve converter string com ponto para número", () => {
    expect(parseDisplayNumero("2.3")).toBe(2.3);
    expect(parseDisplayNumero("0.5")).toBe(0.5);
    expect(parseDisplayNumero("10.25")).toBe(10.25);
  });

  it("deve converter string com vírgula para número", () => {
    expect(parseDisplayNumero("2,3")).toBe(2.3);
    expect(parseDisplayNumero("0,5")).toBe(0.5);
    expect(parseDisplayNumero("2,3")).toBe(2.3);
  });

  it("deve converter números inteiros", () => {
    expect(parseDisplayNumero("0")).toBe(0);
    expect(parseDisplayNumero("5")).toBe(5);
    expect(parseDisplayNumero("123")).toBe(123);
  });

  it("deve retornar 0 para strings inválidas", () => {
    expect(parseDisplayNumero("")).toBe(0);
    expect(parseDisplayNumero("abc")).toBe(0);
    expect(parseDisplayNumero("   ")).toBe(0);
  });

  it("deve ignorar espaços", () => {
    expect(parseDisplayNumero("  2.3  ")).toBe(2.3);
    expect(parseDisplayNumero(" 5 ")).toBe(5);
  });

  it("deve retornar 0 para entrada null/undefined", () => {
    expect(parseDisplayNumero(null as unknown as string)).toBe(0);
    expect(parseDisplayNumero(undefined as unknown as string)).toBe(0);
  });
});

describe("formatarResultado", () => {
  it("deve formatar números inteiros", () => {
    expect(formatarResultado(0)).toBe("0");
    expect(formatarResultado(5)).toBe("5");
    expect(formatarResultado(123)).toBe("123");
  });

  it("deve formatar números decimais", () => {
    expect(formatarResultado(2.3)).toBe("2.3");
    expect(formatarResultado(7.3)).toBe("7.3");
    expect(formatarResultado(10.5)).toBe("10.5");
  });

  it("deve retornar Erro para NaN e Infinity", () => {
    expect(formatarResultado(NaN)).toBe("Erro");
    expect(formatarResultado(Infinity)).toBe("Erro");
    expect(formatarResultado(-Infinity)).toBe("Erro");
  });

  it("deve evitar imprecisão de ponto flutuante", () => {
    expect(formatarResultado(0.1 + 0.2)).toBe("0.3");
    expect(formatarResultado(2.3 + 5)).toBe("7.3");
  });
});

describe("calcularInterno", () => {
  it("deve somar corretamente", () => {
    expect(calcularInterno(2, 3, "+")).toBe(5);
    expect(calcularInterno(2.3, 5, "+")).toBeCloseTo(7.3);
    expect(calcularInterno(0, 0, "+")).toBe(0);
  });

  it("deve subtrair corretamente", () => {
    expect(calcularInterno(5, 3, "-")).toBe(2);
    expect(calcularInterno(2.3, 1, "-")).toBeCloseTo(1.3);
  });

  it("deve multiplicar corretamente", () => {
    expect(calcularInterno(4, 5, "*")).toBe(20);
    expect(calcularInterno(2.5, 2, "*")).toBeCloseTo(5);
  });

  it("deve dividir corretamente", () => {
    expect(calcularInterno(10, 2, "/")).toBe(5);
    expect(calcularInterno(7, 2, "/")).toBeCloseTo(3.5);
  });

  it("deve retornar NaN na divisão por zero", () => {
    expect(calcularInterno(10, 0, "/")).toBe(NaN);
  });

  it("deve retornar n2 quando operação é null", () => {
    expect(calcularInterno(5, 3, null)).toBe(3);
  });
});

describe("fluxo completo (2,3 + 5)", () => {
  it("deve calcular corretamente 2,3 + 5 = 7,3", () => {
    const n1 = parseDisplayNumero("2,3");
    const n2 = parseDisplayNumero("5");
    const resultado = calcularInterno(n1, n2, "+");
    const formatado = formatarResultado(resultado);
    expect(n1).toBeCloseTo(2.3);
    expect(n2).toBe(5);
    expect(resultado).toBeCloseTo(7.3);
    expect(formatado).toBe("7.3");
  });

  it("deve calcular corretamente 2.3 + 5 = 7.3", () => {
    const n1 = parseDisplayNumero("2.3");
    const n2 = parseDisplayNumero("5");
    const resultado = calcularInterno(n1, n2, "+");
    const formatado = formatarResultado(resultado);
    expect(formatado).toBe("7.3");
  });
});
