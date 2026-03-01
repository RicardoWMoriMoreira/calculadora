import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Operacao = '+' | '-' | '*' | '/' | null;

export default function HomeScreen() {
  const [display, setDisplay] = useState('0');
  const [numero1, setNumero1] = useState<string | null>(null);
  const [operacao, setOperacao] = useState<Operacao>(null);

  const stateRef = useRef({ display, numero1, operacao, replaceNext: false });
  stateRef.current = { display, numero1, operacao, replaceNext: stateRef.current.replaceNext };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const apertarNumero = useCallback((valor: string) => {
    const { display, replaceNext } = stateRef.current;
    if (replaceNext) {
      stateRef.current.replaceNext = false;
      setDisplay(valor === '.' ? '0.' : valor);
      return;
    }
    if (display === '0' && valor !== '.') {
      setDisplay(valor);
    } else if (valor === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display + valor);
    }
  }, []);

  const apertarOperacao = useCallback((op: Operacao) => {
    const { display } = stateRef.current;
    setNumero1(display);
    setOperacao(op);
    setDisplay('0');
  }, []);

  const calcular = useCallback(() => {
    const { display, numero1, operacao } = stateRef.current;
    if (numero1 === null || operacao === null) return;

    const n1 = parseFloat(numero1);
    const n2 = parseFloat(display);

    let resultado: number;
    switch (operacao) {
      case '+':
        resultado = n1 + n2;
        break;
      case '-':
        resultado = n1 - n2;
        break;
      case '*':
        resultado = n1 * n2;
        break;
      case '/':
        resultado = n2 === 0 ? 0 : n1 / n2;
        break;
      default:
        return;
    }

    setDisplay(String(resultado));
    setNumero1(null);
    setOperacao(null);
    stateRef.current.replaceNext = true;
  }, []);

  const limpar = useCallback(() => {
    setDisplay('0');
    setNumero1(null);
    setOperacao(null);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        apertarNumero(key);
      } else if (key === '.') {
        apertarNumero('.');
      } else if (key === '+') {
        apertarOperacao('+');
      } else if (key === '-') {
        apertarOperacao('-');
      } else if (key === '*') {
        apertarOperacao('*');
      } else if (key === '/') {
        apertarOperacao('/');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calcular();
      } else if (key === 'c' || key === 'C' || key === 'Escape' || key === 'Backspace') {
        e.preventDefault();
        limpar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apertarNumero, apertarOperacao, calcular, limpar]);

  const renderBotao = (
    label: string,
    onPress: () => void,
    variant: 'number' | 'operator' | 'clear' | 'decimal'
  ) => (
    <Pressable
      key={label}
      style={({ pressed }) => [
        styles.botao,
        variant === 'operator' && styles.botaoOp,
        variant === 'clear' && styles.botaoClear,
        variant === 'decimal' && styles.botaoDecimal,
        pressed && styles.botaoPressed,
      ]}
      onPress={onPress}>
      <ThemedText style={styles.botaoTexto}>{label}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.display}>
        <ThemedText style={[styles.displayText, { color: textColor }]} numberOfLines={1}>
          {display}
        </ThemedText>
      </View>
      <View style={styles.teclado}>
        <View style={styles.linha}>
          {renderBotao('C', limpar, 'clear')}
          {renderBotao('/', () => apertarOperacao('/'), 'operator')}
          {renderBotao('*', () => apertarOperacao('*'), 'operator')}
          {renderBotao('-', () => apertarOperacao('-'), 'operator')}
        </View>
        <View style={styles.linha}>
          {renderBotao('7', () => apertarNumero('7'), 'number')}
          {renderBotao('8', () => apertarNumero('8'), 'number')}
          {renderBotao('9', () => apertarNumero('9'), 'number')}
          {renderBotao('+', () => apertarOperacao('+'), 'operator')}
        </View>
        <View style={styles.linha}>
          {renderBotao('4', () => apertarNumero('4'), 'number')}
          {renderBotao('5', () => apertarNumero('5'), 'number')}
          {renderBotao('6', () => apertarNumero('6'), 'number')}
          {renderBotao('=', calcular, 'operator')}
        </View>
        <View style={styles.linha}>
          {renderBotao('1', () => apertarNumero('1'), 'number')}
          {renderBotao('2', () => apertarNumero('2'), 'number')}
          {renderBotao('3', () => apertarNumero('3'), 'number')}
          {renderBotao('0', () => apertarNumero('0'), 'number')}
        </View>
        <View style={styles.linhaDecimal}>
          {renderBotao('.', () => apertarNumero('.'), 'decimal')}
        </View>
      </View>
    </ThemedView>
  );
}

const BOTAO_SIZE = 72;
const GAP = 12;
const COR_NUMERO = '#34495E';
const COR_OPERADOR = '#1ABC9C';
const COR_CLEAR = '#B03A2E';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  display: {
    marginBottom: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  displayText: {
    fontSize: 48,
    fontWeight: '300',
    fontFamily: 'monospace',
    color: '#fff',
  },
  teclado: {
    gap: GAP,
    alignItems: 'center',
  },
  linha: {
    flexDirection: 'row',
    gap: GAP,
  },
  linhaDecimal: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: BOTAO_SIZE * 2 + GAP,
  },
  botao: {
    width: BOTAO_SIZE,
    height: BOTAO_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: COR_NUMERO,
  },
  botaoOp: {
    backgroundColor: COR_OPERADOR,
  },
  botaoClear: {
    backgroundColor: COR_CLEAR,
  },
  botaoDecimal: {
    width: BOTAO_SIZE * 2 + GAP,
    height: BOTAO_SIZE,
    backgroundColor: COR_NUMERO,
  },
  botaoPressed: {
    opacity: 0.8,
  },
  botaoTexto: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
