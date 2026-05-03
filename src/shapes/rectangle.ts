import { Shape } from '../core/shape';
import { RectangleParameters } from '../core/types';
import { InvalidShapeArgumentError } from '../errors/invalid-shape-argument.error';

/**
 * Представляет прямоугольник с заданными шириной и высотой.
 */
export class Rectangle extends Shape<RectangleParameters> {
  readonly type = 'rectangle' as const;

  /**
   * Создаёт экземпляр прямоугольника.
   * @param width - Ширина прямоугольника (положительное число).
   * @param height - Высота прямоугольника (положительное число).
   * @throws {InvalidShapeArgumentError} Если ширина или высота <= 0.
   */
  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {
    super();
    if (width <= 0 || height <= 0) {
      throw new InvalidShapeArgumentError('Width and height must be positive');
    }
  }

  /**
   * Возвращает параметры прямоугольника.
   * @returns Объект с полями `type`, `width` и `height`.
   */
  public getParameters(): RectangleParameters {
    return { type: 'rectangle', width: this.width, height: this.height };
  }

  /** Площадь прямоугольника */
  get area(): number {
    return this.width * this.height;
  }

  /** Периметр прямоугольника */
  get perimeter(): number {
    return 2 * (this.width + this.height);
  }

  /**
   * Восстанавливает прямоугольник из объекта параметров.
   * @param params - Параметры прямоугольника.
   * @returns Новый экземпляр Rectangle.
   */
  public static fromParameters(params: RectangleParameters): Rectangle {
    return new Rectangle(params.width, params.height);
  }

  /**
   * Создаёт новый прямоугольник с возможностью частичного изменения размеров.
   * @param changes - Объект с новыми значениями `width` и/или `height`. Если не указано — используется текущее.
   * @returns Новый экземпляр Rectangle.
   */
  public clone(changes: Partial<RectangleParameters> = {}): Rectangle {
    return new Rectangle(changes.width ?? this.width, changes.height ?? this.height);
  }
}
