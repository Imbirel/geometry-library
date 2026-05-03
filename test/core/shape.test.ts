import { describe, it, expect, vi } from 'vitest';
import { Rectangle } from '../../src/shapes/rectangle';
import { AreaCalculatedEvent, PerimeterCalculatedEvent } from '../../src/core/events';

// тестирование абстрактного Shape через Rectangle

describe('Shape (via Rectangle)', () => {
  it('should dispatch areacalculated event on first getArea() call', async () => {
    const rect = new Rectangle(2, 3);
    const handler = vi.fn();
    rect.addEventListener('areacalculated', handler);

    const area = await rect.getArea();
    expect(area).toBe(6);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toBeInstanceOf(AreaCalculatedEvent);
    expect((handler.mock.calls[0][0] as AreaCalculatedEvent).area).toBe(6);
  });

  it('should cache area and not dispatch event on subsequent calls', async () => {
    const rect = new Rectangle(2, 3);
    const handler = vi.fn();
    rect.addEventListener('areacalculated', handler);

    await rect.getArea();
    await rect.getArea();
    await rect.getArea();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should dispatch perimetercalculated event on first getPerimeter() call', async () => {
    const rect = new Rectangle(2, 3);
    const handler = vi.fn();
    rect.addEventListener('perimetercalculated', handler);

    const perimeter = await rect.getPerimeter();
    expect(perimeter).toBe(10);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toBeInstanceOf(PerimeterCalculatedEvent);
    expect((handler.mock.calls[0][0] as PerimeterCalculatedEvent).perimeter).toBe(10);
  });

  it('should cache perimeter', async () => {
    const rect = new Rectangle(2, 3);
    const handler = vi.fn();
    rect.addEventListener('perimetercalculated', handler);

    await rect.getPerimeter();
    await rect.getPerimeter();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
