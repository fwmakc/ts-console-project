import { intro } from './intro';

describe('Тестовая проверка', () => {
  const testCases = ['Test string', '123', 123];

  testCases.forEach((value) => {
    value = String(value);
    it(`Входящая строка: ${value}`, () => {
      expect(intro(value)).toBe(value);
    });
  });
});
