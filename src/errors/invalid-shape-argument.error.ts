/**
 * Ошибка, выбрасываемая при передаче некорректных аргументов в конструктор фигуры.
 */
export class InvalidShapeArgumentError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'InvalidShapeArgumentError';

    Object.setPrototypeOf(this, InvalidShapeArgumentError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidShapeArgumentError);
    }
  }
}
