/**
 * Интерфейс сериализованной ошибки.
 */
export interface SerializedError<D = Record<string, unknown>> {
  readonly name: string;
  readonly code: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: unknown;
  readonly details?: D;
}

/**
 * Базовый класс ошибки.
 */
export abstract class BaseError<
  D extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
  abstract readonly code: string;

  static readonly ERROR_NAME: string = 'BaseError';

  protected static readonly PREFIX = 'GL';

  private static readonly _instances = new WeakSet<object>();

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    const constructor = this.constructor as typeof BaseError;
    this.name = constructor.ERROR_NAME;

    BaseError._instances.add(this);

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Type Guard для проверки типа ошибки.
   */
  static isInstance(err: unknown): err is BaseError {
    return typeof err === 'object' && err !== null && BaseError._instances.has(err);
  }

  /**
   * Сериализует ошибку в плоский объект для JSON/логов.
   */
  toJSON(): SerializedError<D> {
    const prefix = (this.constructor as typeof BaseError).PREFIX;

    return {
      name: this.name,
      code: `${prefix}:ERR_${this.code}`,
      message: this.message,
      stack: this.stack,
      cause: this.serializeRecursive(this.cause),
      details: this.serializeRecursive(this.getDetails()) as D,
    };
  }

  /**
   * Рекурсивная сериализация с защитой от циклов и глубокой вложенности.
   * @param data     Данные для сериализации
   * @param depth    Текущая глубина (ограничение 4 уровня)
   * @param visited  Множество уже посещённых объектов (предотвращает бесконечную рекурсию)
   */
  private serializeRecursive(data: unknown, depth = 0, visited = new WeakSet<object>()): unknown {
    if (depth > 3) return '[Max Depth]';
    if (data === null || typeof data !== 'object') return data;

    // Проверка на циклическую ссылку
    if (visited.has(data)) return '[Circular]';
    visited.add(data);

    if (typeof (data as any).toJSON === 'function') {
      return (data as any).toJSON();
    }

    if (data instanceof Error) {
      return {
        name: data.name,
        message: data.message,
        stack: data.stack,
        cause: data.cause ? this.serializeRecursive(data.cause, depth + 1, visited) : undefined,
      };
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.serializeRecursive(item, depth + 1, visited));
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = this.serializeRecursive(value, depth + 1, visited);
    }
    return result;
  }

  /**
   * Метод для переопределения в наследниках.
   * Реализует принцип "Белого списка" данных для логов.
   */
  protected getDetails(): D {
    return {} as D;
  }
}
