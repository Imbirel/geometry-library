import { describe, it, expect } from 'vitest';
import { InvalidShapeArgumentError } from '../../src/errors/invalid-shape-argument.error';
import { ShapeAlreadyRegisteredError } from '../../src/errors/shape-already-registered.error';
import { UnknownShapeTypeError } from '../../src/errors/unknown-shape-type.error';

describe('Custom Errors', () => {
  it('InvalidShapeArgumentError should be an instance of Error', () => {
    const err = new InvalidShapeArgumentError('test');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('InvalidShapeArgumentError');
  });

  it('ShapeAlreadyRegisteredError should contain type', () => {
    const err = new ShapeAlreadyRegisteredError('circle');
    expect(err.message).toContain('circle');
  });

  it('UnknownShapeTypeError should contain type', () => {
    const err = new UnknownShapeTypeError('hexagon');
    expect(err.message).toContain('hexagon');
  });
});
