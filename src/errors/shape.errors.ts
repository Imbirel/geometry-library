import { BaseError } from './base.error';

type BaseErrorConstructor = {
  new (...args: any[]): BaseError<any>;
  ERROR_NAME: string;
};

/**
 * Декоратор для сохранения имени класса после минификации. Stage 3 Decorators.
 */
function NamedError(name: string) {
  return function <T extends BaseErrorConstructor>(target: T, _context: ClassDecoratorContext<T>) {
    target.ERROR_NAME = name;
    return target;
  };
}

/**
 * Ошибка, выбрасываемая при передаче некорректных аргументов в конструктор фигуры.
 */
@NamedError('InvalidShapeArgumentError')
export class InvalidShapeArgumentError extends BaseError {
  readonly code = 'INVALID_SHAPE_ARGUMENT';

  constructor(message = 'Invalid arguments provided to shape', options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * Ошибка, выбрасываемая при попытке повторно зарегистрировать
 * уже зарегистрированный тип фигуры в {@link ShapeFactory}.
 */
@NamedError('ShapeAlreadyRegisteredError')
export class ShapeAlreadyRegisteredError extends BaseError {
  readonly code = 'SHAPE_ALREADY_REGISTERED';

  /**
   * @param type - Идентификатор типа фигуры, который уже зарегистрирован.
   */
  constructor(
    public readonly type: string,
    options?: ErrorOptions,
  ) {
    super(`Shape type "${type}" is already registered.`, options);
  }

  protected override getDetails() {
    return { type: this.type };
  }
}

/**
 * Ошибка, выбрасываемая при попытке создать или использовать
 * незарегистрированный тип геометрической фигуры.
 */
@NamedError('UnknownShapeTypeError')
export class UnknownShapeTypeError extends BaseError {
  readonly code = 'UNKNOWN_SHAPE_TYPE';

  /**
   * @param type - Незарегистрированный идентификатор типа фигуры.
   */
  constructor(
    public readonly type: string,
    options?: ErrorOptions,
  ) {
    super(`Unknown shape type: "${type}". Please register it before usage.`, options);
  }

  protected override getDetails() {
    return { type: this.type };
  }
}
