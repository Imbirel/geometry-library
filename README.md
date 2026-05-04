# Geometry Library

Библиотека для работы с геометрическими фигурами (прямоугольник, треугольник, круг), написанная на TypeScript. Предоставляет единый API для создания фигур, расчёта площади и периметра, а также возможность расширения новыми типами фигур.


## Архитектурные особенности

* **Web API стандарты:** Наследование от `EventTarget` и расширение класса `Event`.
* **Принцип DRY:** Вся логика асинхронного кэширования и генерации событий инкапсулирована в базовом классе `Shape`. Конкретные фигуры описывают только чистую математику.
* **Принцип Open/Closed (SOLID):** Фабрика не имеет жестких ветвлений `if/else`. Любая новая фигура регистрируется извне и инстанцируется через статический метод десериализации.
* **Иммутабельность:** Свойства фигур доступны только для чтения (`readonly`). Для изменения параметров используется метод `clone`.


## Быстрый старт

```ts
import { ShapeFactory, Rectangle, Circle, Triangle } from 'geometry-library';

// 1. Создаём фабрику
const factory = new ShapeFactory();

// 2. Регистрируем нужные фигуры вручную
factory.register('rectangle', Rectangle);
factory.register('circle', Circle);
factory.register('triangle', Triangle);

// 3. Асинхронное создание
const rect = await factory.create<Rectangle>('rectangle', 5, 10);
const circ = await factory.create<Circle>('circle', 7);
const tri  = await factory.create<Triangle>('triangle', 3, 4, 5);

// Расчёт площади и периметра
console.log(await rect.getArea());       // 50
console.log(await rect.getPerimeter());  // 30
```


## Основные возможности

### 1. Создание фигур через фабрику

Фабрика регистрирует типы фигур и создаёт их асинхронно:

```ts
const factory = new ShapeFactory();
factory.register('square', Square); // ваш класс Square
const square = await factory.create('square', 10);
```

При создании фабрика генерирует событие `shapecreated`, на которое можно подписаться (ДО вызова создания):

```ts
factory.addEventListener('shapecreated', (e) => {
  console.log('Создана фигура:', e.shape.getParameters());
});
```


### 2. Параметры фигур

Каждая фигура возвращает свои параметры через метод `getParameters()`, что удобно для сериализации:

```ts
const par = rect.getParameters();
// { type: 'rectangle', width: 5, height: 10 }
```

По этим параметрам можно восстановить фигуру:

```ts
const restored = await factory.createFromParameters(par);
```


### 3. Асинхронный расчёт площади и периметра

Методы `getArea()` и `getPerimeter()` возвращают `Promise<number>`. При первом вызове результат кэшируется и генерирует события `areacalculated` / `perimetercalculated`:

```ts
rect.addEventListener('areacalculated', (e) => {
  console.log(`Площадь: ${e.area}`);
});

const area = await rect.getArea();
```


### 4. Клонирование с изменениями

Метод `clone()` позволяет создать копию фигуры с изменёнными параметрами:

```ts
const newRect = rect.clone({ width: 15 }); // высота останется 10
```


### 5. Расширение новыми фигурами

Чтобы добавить новую фигуру, необходимо:

1. Унаследовать абстрактный класс `Shape<T>`.
2. Реализовать геттеры `type`, `area`, `perimeter`, метод `getParameters()`, статический метод `fromParameters()` и метод `clone()`.
3. Зарегистрировать класс в фабрике.

Пример (квадрат):

```ts
import { Shape, ShapeConstructor } from 'geometry-library';

interface SquareParameters extends ShapeParameters {
  type: 'square';
  side: number;
}

class Square extends Shape<SquareParameters> {
  readonly type = 'square' as const;

  constructor(public readonly side: number) {
    super();
    if (side <= 0) throw new InvalidShapeArgumentError('Side must be positive');
  }

  get area() { return this.side ** 2; }
  get perimeter() { return this.side * 4; }

  getParameters(): SquareParameters {
    return { type: 'square', side: this.side };
  }

  static fromParameters(params: SquareParameters): Square {
    return new Square(params.side);
  }

  clone(changes: Partial<SquareParameters> = {}): Square {
    return new Square(changes.side ?? this.side);
  }
}

// Регистрируем
factory.register('square', Square);
```


## Обработка ошибок

Библиотека экспортирует ряд ошибок:

- `InvalidShapeArgumentError` — некорректные аргументы конструктора.
- `UnknownShapeTypeError` — попытка создать незарегистрированный тип.
- `ShapeAlreadyRegisteredError` — попытка зарегистрировать уже существующий тип.

Все ошибки наследуют стандартный Error.


## Требования к окружению

Код использует глобальные типы Event и EventTarget. Для компиляции TypeScript необходимо добавить "DOM" в lib вашего tsconfig.json:

```ts
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "allowJs": false
  }
}
```

Если вы работаете в среде, где `Event` и `EventTarget` недоступны (например, Node.js < 15 без полного DOM), рекомендуется либо обновить Node.js, либо предоставить полифилл.


## Тесты покрывают:

- создание и валидацию всех трёх фигур;
- вычисление площади и периметра;
- сериализацию / десериализацию (getParameters / fromParameters);
- клонирование с частичным изменением;
- кэширование расчётов и генерацию событий (getArea / getPerimeter);
- фабрику: регистрацию, дубликаты, создание, события;
- кастомные типы фигур;
- ошибки.






