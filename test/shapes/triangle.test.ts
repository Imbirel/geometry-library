import { describe, it, expect } from 'vitest';
import { Triangle } from '../../src/shapes/triangle';
import { InvalidShapeArgumentError } from '../../src/errors/invalid-shape-argument.error';

describe('Triangle', () => {
  it('should create a triangle with valid sides', () => {
    const tri = new Triangle(3, 4, 5);
    expect(tri.sides).toEqual([3, 4, 5]);
    expect(tri.type).toBe('triangle');
  });

  it('should throw for non-positive sides', () => {
    expect(() => new Triangle(0, 4, 5)).toThrow(InvalidShapeArgumentError);
    expect(() => new Triangle(-1, 4, 5)).toThrow(InvalidShapeArgumentError);
  });

  it('should throw if triangle inequality is violated', () => {
    expect(() => new Triangle(1, 2, 3)).toThrow(InvalidShapeArgumentError);
    expect(() => new Triangle(10, 2, 3)).toThrow(InvalidShapeArgumentError);
  });

  it('should return correct parameters', () => {
    const params = new Triangle(3, 4, 5).getParameters();
    expect(params).toEqual({ type: 'triangle', sides: [3, 4, 5] });
  });

  it('should compute area using Heron formula', () => {
    const tri = new Triangle(3, 4, 5);
    expect(tri.area).toBeCloseTo(6);
  });

  it('should compute perimeter', () => {
    const tri = new Triangle(3, 4, 5);
    expect(tri.perimeter).toBe(12);
  });

  it('should deserialize from parameters', () => {
    const original = new Triangle(5, 6, 7);
    const restored = Triangle.fromParameters(original.getParameters());
    expect(restored.sides).toEqual([5, 6, 7]);
  });

  it('should clone with new sides', () => {
    const tri = new Triangle(3, 4, 5);
    const cloned = tri.clone({ sides: [6, 7, 8] });
    expect(cloned.sides).toEqual([6, 7, 8]);
  });
});
