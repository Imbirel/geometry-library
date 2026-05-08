import { describe, it, expect } from 'vitest';
import { BaseError } from '../../src/errors/base.error';
import {
  InvalidShapeArgumentError,
  ShapeAlreadyRegisteredError,
  UnknownShapeTypeError,
} from '../../src/errors/shape.errors';

describe('Custom Errors', () => {
  describe('InvalidShapeArgumentError', () => {
    it('should be instance of BaseError and Error', () => {
      const err = new InvalidShapeArgumentError();
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(BaseError);
      expect(BaseError.isInstance(err)).toBe(true);
    });

    it('should have correct name, code and default message', () => {
      const err = new InvalidShapeArgumentError();
      expect(err.name).toBe('InvalidShapeArgumentError');
      expect(err.code).toBe('INVALID_SHAPE_ARGUMENT');
      expect(err.message).toBe('Invalid arguments provided to shape');
    });

    it('should accept custom message and error options', () => {
      const cause = new Error('Root cause');
      const err = new InvalidShapeArgumentError('Custom message', { cause });
      expect(err.message).toBe('Custom message');
      expect(err.cause).toBe(cause);
    });

    it('toJSON should contain prefixed code, name, message, stack', () => {
      const err = new InvalidShapeArgumentError();
      const json = err.toJSON();
      expect(json.code).toBe('GL:ERR_INVALID_SHAPE_ARGUMENT');
      expect(json.name).toBe('InvalidShapeArgumentError');
      expect(json.message).toBe('Invalid arguments provided to shape');
      expect(typeof json.stack).toBe('string');
    });
  });

  describe('ShapeAlreadyRegisteredError', () => {
    it('should contain type in message and details', () => {
      const err = new ShapeAlreadyRegisteredError('circle');
      expect(err.message).toContain('circle');
      expect(err.type).toBe('circle');
      expect(err.toJSON().details).toEqual({ type: 'circle' });
    });

    it('should have correct code and name', () => {
      const err = new ShapeAlreadyRegisteredError('square');
      expect(err.code).toBe('SHAPE_ALREADY_REGISTERED');
      expect(err.name).toBe('ShapeAlreadyRegisteredError');
      expect(BaseError.isInstance(err)).toBe(true);
    });
  });

  describe('UnknownShapeTypeError', () => {
    it('should contain type in message and details', () => {
      const err = new UnknownShapeTypeError('hexagon');
      expect(err.message).toContain('hexagon');
      expect(err.type).toBe('hexagon');
      expect(err.toJSON().details).toEqual({ type: 'hexagon' });
    });

    it('should have correct code and name', () => {
      const err = new UnknownShapeTypeError('hexagon');
      expect(err.code).toBe('UNKNOWN_SHAPE_TYPE');
      expect(err.name).toBe('UnknownShapeTypeError');
    });
  });

  describe('BaseError utilities', () => {
    it('isInstance should return false for plain objects', () => {
      expect(BaseError.isInstance({})).toBe(false);
      expect(BaseError.isInstance(null)).toBe(false);
      expect(BaseError.isInstance(new Error('plain error'))).toBe(false);
    });

    it('toJSON should handle recursive cause', () => {
      const cause = new InvalidShapeArgumentError();
      const err = new ShapeAlreadyRegisteredError('recursive', { cause });
      const json = err.toJSON();
      expect(json.cause).toBeDefined();
      expect((json.cause as any).code).toBe('GL:ERR_INVALID_SHAPE_ARGUMENT');
    });
  });
});
