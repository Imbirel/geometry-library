/**
 * Ошибка, выбрасываемая при попытке повторно зарегистрировать
 * уже зарегистрированный тип фигуры в {@link ShapeFactory}.
 */
export class ShapeAlreadyRegisteredError extends Error {
  /**
   * @param type - Идентификатор типа фигуры, который уже зарегистрирован.
   */
  constructor(type: string) {
    super(`Shape type "${type}" is already registered.`);

    this.name = 'ShapeAlreadyRegisteredError';

    Object.setPrototypeOf(this, ShapeAlreadyRegisteredError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShapeAlreadyRegisteredError);
    }
  }
}
