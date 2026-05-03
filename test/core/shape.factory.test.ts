import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShapeFactory } from '../../src/core/shape.factory';
import { ShapeCreatedEvent } from '../../src/core/events';
import { Circle } from '../../src/shapes/circle';
import { Rectangle } from '../../src/shapes/rectangle';
import { ShapeAlreadyRegisteredError } from '../../src/errors/shape-already-registered.error';
import { UnknownShapeTypeError } from '../../src/errors/unknown-shape-type.error';
import { Shape } from '../../src/core/shape';

let factory: ShapeFactory;
beforeEach(() => {
  factory = new ShapeFactory();
});

describe('ShapeFactory', () => {
  it('should pre-register circle, rectangle, triangle', () => {
    expect(factory.registeredTypes).toEqual(
      expect.arrayContaining(['circle', 'rectangle', 'triangle']),
    );
  });

  it('should throw when registering duplicate type', () => {
    expect(() => factory.register('circle', Circle)).toThrow(ShapeAlreadyRegisteredError);
  });

  it('should register a custom shape', () => {
    class Square extends Shape<{ type: 'square'; side: number }> {
      readonly type = 'square' as const;
      constructor(public side: number) {
        super();
      }
      getParameters(): { type: 'square'; side: number } {
        return { type: 'square', side: this.side };
      }
      get area(): number {
        return this.side ** 2;
      }
      get perimeter(): number {
        return 4 * this.side;
      }
      clone(changes?: Partial<{ type: 'square'; side: number }>): this {
        return new (this.constructor as any)(changes?.side ?? this.side) as this;
      }
      static fromParameters(params: { type: 'square'; side: number }): Square {
        return new Square(params.side);
      }
    }

    factory.register('square', Square);
    expect(factory.registeredTypes).toContain('square');

    return factory.create<Square>('square', 5).then((sq) => {
      expect(sq.area).toBe(25);
    });
  });

  it('should create a circle asynchronously and fire event', async () => {
    const handler = vi.fn();
    factory.addEventListener('shapecreated', handler);

    const circle = await factory.create<Circle>('circle', 10);
    expect(circle).toBeInstanceOf(Circle);
    expect(circle.radius).toBe(10);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toBeInstanceOf(ShapeCreatedEvent);
    expect((handler.mock.calls[0][0] as ShapeCreatedEvent).shape).toBe(circle);
  });

  it('should throw UnknownShapeTypeError for unregistered type', async () => {
    await expect(factory.create('hexagon', 5)).rejects.toThrow(UnknownShapeTypeError);
  });

  it('should create from parameters', async () => {
    const params = { type: 'rectangle', width: 7, height: 8 };
    const rect = await factory.createFromParameters<Rectangle>(params);
    expect(rect).toBeInstanceOf(Rectangle);
    expect(rect.width).toBe(7);
    expect(rect.height).toBe(8);
  });

  it('createFromParameters should throw for unknown type', async () => {
    await expect(factory.createFromParameters({ type: 'ellipse' } as any)).rejects.toThrow(
      UnknownShapeTypeError,
    );
  });
});
