/**
 * Ошибка, выбрасываемая при попытке создать или использовать
 * незарегистрированный тип геометрической фигуры.
 */
export class UnknownShapeTypeError extends Error {
  /**
   * @param type - Незарегистрированный идентификатор типа фигуры.
   */
  constructor(type: string) {
    const message = `Unknown shape type: "${type}". Please register it before usage.`;
    super(message);

    this.name = 'UnknownShapeTypeError';

    Object.setPrototypeOf(this, UnknownShapeTypeError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownShapeTypeError);
    }
  }
}
