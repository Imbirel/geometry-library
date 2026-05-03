import { describe, it, expect } from 'vitest';
import { Circle } from '../../src/shapes/circle';
import { InvalidShapeArgumentError } from '../../src/errors/invalid-shape-argument.error';

describe('Circle', () => {
  it('should create a circle with a positive radius', () => {
    const circle = new Circle(5);
    expect(circle.radius).toBe(5);
    expect(circle.type).toBe('circle');
  });

  it('should throw for non-positive radius', () => {
    expect(() => new Circle(0)).toThrow(InvalidShapeArgumentError);
    expect(() => new Circle(-3)).toThrow(InvalidShapeArgumentError);
  });

  it('should return correct parameters', () => {
    const params = new Circle(3).getParameters();
    expect(params).toEqual({ type: 'circle', radius: 3 });
  });

  it('should compute area correctly', () => {
    const circle = new Circle(2);
    expect(circle.area).toBeCloseTo(Math.PI * 4);
  });

  it('should compute perimeter (circumference) correctly', () => {
    const circle = new Circle(2);
    expect(circle.perimeter).toBeCloseTo(2 * Math.PI * 2);
  });

  it('should deserialize from parameters', () => {
    const original = new Circle(7);
    const restored = Circle.fromParameters(original.getParameters());
    expect(restored.radius).toBe(7);
  });

  it('should clone with overrides', () => {
    const circle = new Circle(10);
    const cloned = circle.clone({ radius: 20 });
    expect(cloned.radius).toBe(20);
    expect(cloned).not.toBe(circle);
  });

  it('should clone with default parameters', () => {
    const circle = new Circle(10);
    const cloned = circle.clone();
    expect(cloned.radius).toBe(10);
  });
});
