import { Shape } from '../core/shape';
import { CircleParameters } from '../core/types';
import { InvalidShapeArgumentError } from '../errors/shape.errors';

/**
 * Представляет круг с заданным радиусом.
 */
export class Circle extends Shape<CircleParameters> {
  readonly type = 'circle' as const;

  /**
   * Создаёт экземпляр круга.
   * @param radius - Радиус круга (положительное число).
   * @throws {InvalidShapeArgumentError} Если радиус <= 0.
   */
  constructor(public readonly radius: number) {
    super();
    if (radius <= 0) {
      throw new InvalidShapeArgumentError('Radius must be positive');
    }
  }

  /**
   * Возвращает параметры круга.
   * @returns Объект с полями `type` и `radius`.
   */
  public getParameters(): CircleParameters {
    return { type: 'circle', radius: this.radius };
  }

  /** Площадь круга */
  get area(): number {
    return Math.PI * this.radius ** 2;
  }

  /** Периметр (длина окружности) */
  get perimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  /**
   * Восстанавливает круг из объекта параметров.
   * @param params - Параметры круга.
   * @returns Новый экземпляр Circle.
   */
  public static fromParameters(params: CircleParameters): Circle {
    return new Circle(params.radius);
  }

  /**
   * Создаёт новый круг с возможностью изменить радиус.
   * @param changes - Объект с новым значением `radius`. Если не указан, используется текущий.
   * @returns Новый экземпляр Circle.
   */
  public clone(changes: Partial<CircleParameters> = {}): Circle {
    return new Circle(changes.radius ?? this.radius);
  }
}
