import { Shape } from './shape';

/**
 * Событие, возникающее при успешном создании фигуры.
 */
export class ShapeCreatedEvent extends Event {
  constructor(public readonly shape: Shape<any>) {
    super('shapecreated');
  }
}

/**
 * Событие, возникающее при успешном вычислении площади.
 */
export class AreaCalculatedEvent extends Event {
  constructor(public readonly area: number) {
    super('areacalculated');
  }
}

/**
 * Событие, возникающее при успешном вычислении периметра.
 */
export class PerimeterCalculatedEvent extends Event {
  constructor(public readonly perimeter: number) {
    super('perimetercalculated');
  }
}
