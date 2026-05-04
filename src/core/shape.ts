import { ShapeParameters } from './types';
import { AreaCalculatedEvent, PerimeterCalculatedEvent } from './events';

/**
 * Абстрактный базовый класс для всех геометрических фигур.
 *
 * Наследует {@link EventTarget}, позволяя подписываться на события
 * `areacalculated` и `perimetercalculated`.
 *
 * @typeParam T - Тип параметров фигуры, расширяющий {@link ShapeParameters}
 */
export abstract class Shape<T extends ShapeParameters> extends EventTarget {
  abstract readonly type: string;

  /**
   * Возвращает объект параметров фигуры.
   * @returns Параметры фигуры, включающие обязательное поле `type`.
   */
  abstract getParameters(): T;

  /**
   * Площадь фигуры.
   */
  abstract get area(): number;

  /**
   * Периметр фигуры.
   */
  abstract get perimeter(): number;

  #cachedArea: number | undefined;
  #cachedPerimeter: number | undefined;

  #areaPromise: Promise<number> | undefined;
  #perimeterPromise: Promise<number> | undefined;

  /**
   * Асинхронно вычисляет площадь фигуры.
   *
   * При первом вызове результат кэшируется и порождает событие {@link AreaCalculatedEvent}.
   * Повторные вызовы возвращают закэшированное значение.
   * 
   * Архитектура асинхронна для потенциального выноса расчетов в Web Workers.
   *
   * @returns Promise, разрешающийся значением площади.
   */
  public async getArea(): Promise<number> {
    if (this.#cachedArea !== undefined) {
      return this.#cachedArea;
    }

    if (!this.#areaPromise) {
      this.#areaPromise = (async () => {
        this.#cachedArea = this.area;
        this.dispatchEvent(new AreaCalculatedEvent(this.#cachedArea));
        return this.#cachedArea;
      })();
    }

    return this.#areaPromise;
  }

  /**
   * Асинхронно вычисляет периметр фигуры.
   *
   * При первом вызове результат кэшируется и порождает событие {@link PerimeterCalculatedEvent}.
   * Повторные вызовы возвращают закэшированное значение.
   *
   * Архитектура асинхронна для потенциального выноса расчетов в Web Workers.
   *
   * @returns Promise, разрешающийся значением периметра.
   */
  public async getPerimeter(): Promise<number> {
    if (this.#cachedPerimeter !== undefined) {
      return this.#cachedPerimeter;
    }

    if (!this.#perimeterPromise) {
      this.#perimeterPromise = (async () => {
        this.#cachedPerimeter = this.perimeter;
        this.dispatchEvent(new PerimeterCalculatedEvent(this.#cachedPerimeter));
        return this.#cachedPerimeter;
      })();
    }

    return this.#perimeterPromise;
  }

  /**
   * Создаёт новый экземпляр фигуры с возможностью частичного изменения параметров.
   *
   * @param changes - Объект с полями, которые требуется изменить.
   * @returns Новый экземпляр фигуры того же типа с изменёнными параметрами.
   */
  abstract clone(changes?: Partial<T>): Shape<T>;

  /**
   * Регистрирует обработчик события `areacalculated`.
   */
  override addEventListener(
    type: 'areacalculated',
    callback: ((ev: AreaCalculatedEvent) => void) | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  /**
   * Регистрирует обработчик события `perimetercalculated`.
   */
  override addEventListener(
    type: 'perimetercalculated',
    callback: ((ev: PerimeterCalculatedEvent) => void) | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  /**
   * Переопределённый метод подписки на события, совместимый с {@link EventTarget}.
   */
  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, callback, options);
  }

  override removeEventListener(
    type: 'areacalculated',
    callback: ((ev: AreaCalculatedEvent) => void) | EventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void;

  override removeEventListener(
    type: 'perimetercalculated',
    callback: ((ev: PerimeterCalculatedEvent) => void) | EventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void;

  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type, callback, options);
  }
}
