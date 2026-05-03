import { Shape } from '../core/shape';
import { TriangleParameters } from '../core/types';
import { InvalidShapeArgumentError } from '../errors/invalid-shape-argument.error';

/**
 * Представляет треугольник с заданными длинами сторон.
 *
 * При создании проверяется неравенство треугольника
 * и положительность длин сторон.
 */
export class Triangle extends Shape<TriangleParameters> {
  readonly type = 'triangle' as const;
  readonly sides: readonly [number, number, number];

  /**
   * Создаёт экземпляр треугольника.
   * @param a - Длина первой стороны (положительное число).
   * @param b - Длина второй стороны (положительное число).
   * @param c - Длина третьей стороны (положительное число).
   * @throws {InvalidShapeArgumentError} Если стороны не положительные или нарушено неравенство треугольника.
   */
  constructor(a: number, b: number, c: number) {
    super();
    if (a <= 0 || b <= 0 || c <= 0) {
      throw new InvalidShapeArgumentError('Sides must be positive');
    }
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new InvalidShapeArgumentError('Invalid triangle sides (triangle inequality violated)');
    }
    this.sides = [a, b, c];
  }

  /**
   * Возвращает параметры треугольника.
   * @returns Объект с полями `type` и `sides`.
   */
  public getParameters(): TriangleParameters {
    const [a, b, c] = this.sides;
    return { type: 'triangle', sides: [a, b, c] };
  }

  /**
   * Площадь треугольника по формуле Герона.
   */
  get area(): number {
    const [a, b, c] = this.sides;
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  /**
   * Периметр треугольника — сумма длин сторон.
   */
  get perimeter(): number {
    return this.sides.reduce((sum, side) => sum + side, 0);
  }

  /**
   * Восстанавливает треугольник из объекта параметров.
   * @param params - Параметры треугольника.
   * @returns Новый экземпляр Triangle.
   */
  public static fromParameters(params: TriangleParameters): Triangle {
    const [a, b, c] = params.sides;
    return new Triangle(a, b, c);
  }

  /**
   * Создаёт новый треугольник с возможностью изменить стороны.
   * @param changes - Объект с новым массивом `sides`. Если не указано — используется текущий.
   * @returns Новый экземпляр Triangle.
   */
  public clone(changes: Partial<TriangleParameters> = {}): Triangle {
    const sides = changes.sides ?? this.sides;
    return new Triangle(...sides);
  }
}
