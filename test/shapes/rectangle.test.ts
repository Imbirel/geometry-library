import { describe, it, expect } from 'vitest';
import { Rectangle } from '../../src/shapes/rectangle';
import { InvalidShapeArgumentError } from '../../src/errors/shape.errors';

describe('Rectangle', () => {
  it('should create a rectangle with positive sides', () => {
    const rect = new Rectangle(4, 5);
    expect(rect.width).toBe(4);
    expect(rect.height).toBe(5);
    expect(rect.type).toBe('rectangle');
  });

  it('should throw for non-positive dimensions', () => {
    expect(() => new Rectangle(0, 5)).toThrow(InvalidShapeArgumentError);
    expect(() => new Rectangle(4, -1)).toThrow(InvalidShapeArgumentError);
  });

  it('should return correct parameters', () => {
    const params = new Rectangle(6, 7).getParameters();
    expect(params).toEqual({ type: 'rectangle', width: 6, height: 7 });
  });

  it('should compute area', () => {
    const rect = new Rectangle(3, 4);
    expect(rect.area).toBe(12);
  });

  it('should compute perimeter', () => {
    const rect = new Rectangle(3, 4);
    expect(rect.perimeter).toBe(14);
  });

  it('should deserialize from parameters', () => {
    const original = new Rectangle(8, 9);
    const restored = Rectangle.fromParameters(original.getParameters());
    expect(restored.width).toBe(8);
    expect(restored.height).toBe(9);
  });

  it('should clone with partial changes', () => {
    const rect = new Rectangle(2, 3);
    const clone1 = rect.clone({ width: 10 });
    expect(clone1.width).toBe(10);
    expect(clone1.height).toBe(3);

    const clone2 = rect.clone({ height: 20 });
    expect(clone2.width).toBe(2);
    expect(clone2.height).toBe(20);
  });
});
