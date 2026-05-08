import { Shape } from './shape';
import { ShapeConstructor, ShapeParameters, ShapeType } from './types';
import { ShapeCreatedEvent } from './events';
import { ShapeAlreadyRegisteredError, UnknownShapeTypeError } from '../errors/shape.errors';

/**
 * Асинхронная фабрика для создания экземпляров геометрических фигур.
 *
 * Позволяет регистрировать новые типы фигур, создавать их
 * по имени и параметрам, а также восстанавливать из сохранённых
 * параметров (десериализация).
 *
 * Наследует {@link EventTarget} и генерирует событие {@link ShapeCreatedEvent}
 * при успешном создании фигуры.
 */
export class ShapeFactory extends EventTarget {
  private readonly registry: Map<string, ShapeConstructor> = new Map();

  /**
   * Возвращает массив всех зарегистрированных типов фигур.
   */
  public get registeredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Регистрирует новый тип фигуры.
   *
   * @param type - Уникальный строковый идентификатор типа фигуры.
   * @param constructor - Класс-конструктор, соответствующий интерфейсу {@link ShapeConstructor}.
   * @throws {ShapeAlreadyRegisteredError} Если указанный тип уже зарегистрирован.
   */
  public register(type: ShapeType, constructor: ShapeConstructor): void {
    if (this.registry.has(type)) {
      throw new ShapeAlreadyRegisteredError(type);
    }
    this.registry.set(type, constructor);
  }

  /**
   * Асинхронно создаёт экземпляр фигуры по имени типа и аргументам конструктора.
   *
   * @typeParam T - Конкретный тип фигуры (выводится автоматически или указывается явно).
   * @param type - Идентификатор зарегистрированного типа фигуры.
   * @param args - Аргументы, передаваемые в конструктор фигуры.
   * @returns Promise с новым экземпляром фигуры.
   * @throws {UnknownShapeTypeError} Если тип не зарегистрирован.
   */
  public async create<T extends Shape<any>>(type: ShapeType, ...args: any[]): Promise<T> {
    const Constructor = this.registry.get(type);

    if (!Constructor) {
      throw new UnknownShapeTypeError(type);
    }

    await Promise.resolve();

    const shape = new Constructor(...args) as T;
    this.dispatchEvent(new ShapeCreatedEvent(shape));

    return shape;
  }

  /**
   * Восстанавливает фигуру из объекта параметров (десериализация).
   *
   * @typeParam T - Конкретный тип фигуры.
   * @param params - Параметры фигуры, обычно полученные через `getParameters()`.
   * @returns Promise с новым экземпляром фигуры.
   * @throws {UnknownShapeTypeError} Если тип из `params.type` не зарегистрирован.
   */
  public async createFromParameters<T extends Shape<any>>(params: ShapeParameters): Promise<T> {
    const Constructor = this.registry.get(params.type);

    if (!Constructor) {
      throw new UnknownShapeTypeError(params.type);
    }

    await Promise.resolve();

    const shape = Constructor.fromParameters(params) as T;
    this.dispatchEvent(new ShapeCreatedEvent(shape));

    return shape;
  }

  /**
   * Подписка на событие `shapecreated` с типизированным обработчиком.
   */
  override addEventListener(
    type: 'shapecreated',
    callback: ((ev: ShapeCreatedEvent) => void) | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  /**
   * Базовая реализация подписки, совместимая с {@link EventTarget}.
   */
  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, callback, options);
  }

  /**
   * Отписка от события `shapecreated`.
   */
  override removeEventListener(
    type: 'shapecreated',
    callback: ((ev: ShapeCreatedEvent) => void) | EventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void;

  /**
   * Базовая реализация отписки, совместимая с {@link EventTarget}.
   */
  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type, callback, options);
  }
}
