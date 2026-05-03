import { Shape } from './shape';

/**
 * Базовый интерфейс параметров фигуры.
 */
export interface ShapeParameters {
  type: string;
}

/**
 * Параметры прямоугольника.
 */
export interface RectangleParameters extends ShapeParameters {
  type: 'rectangle';
  /** Ширина прямоугольника */
  width: number;
  /** Высота прямоугольника */
  height: number;
}

/**
 * Параметры треугольника.
 */
export interface TriangleParameters extends ShapeParameters {
  type: 'triangle';
  /** Длины сторон треугольника [a, b, c] */
  sides: [number, number, number];
}

/**
 * Параметры круга.
 */
export interface CircleParameters extends ShapeParameters {
  type: 'circle';
  /** Радиус круга */
  radius: number;
}

/**
 * Конструктор класса фигуры.
 * Используется для регистрации новых фигур в фабрике {@link ShapeFactory}.
 * @typeParam T - Тип параметров фигуры, наследующий {@link ShapeParameters}
 */
export interface ShapeConstructor<T extends ShapeParameters = ShapeParameters> {
  /**
   * Конструктор экземпляра фигуры.
   * @param args - Параметры, передаваемые в конструктор конкретной фигуры.
   */
  new (...args: any[]): Shape<T>;
  /**
   * Восстанавливает фигуру из объекта параметров.
   * @param params - Параметры фигуры.
   */
  fromParameters(params: T): Shape<T>;
}

/**
 * Строковый литерал или произвольная строка для идентификации типа фигуры.
 */
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | string;
