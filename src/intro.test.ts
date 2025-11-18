import { intro } from './intro';

describe('Example test', () => {
  const testCases = [
    {
      original: 'Test string',
      reference: 'Test string',
    },
    {
      original: '123',
      reference: '123',
    },
    {
      original: '',
      reference: '',
    },
    {
      original: null,
      reference: 'null',
    },
    {
      original: 123,
      reference: '123',
    },
  ];

  testCases.forEach(({ original, reference }) => {
    it(`Example string: ${original}`, () => {
      expect(intro(`${original}`)).toBe(reference);
    });
  });
});

describe('Arithmetic test', () => {
  it('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });

  it('2 * 2 equals 4', () => {
    expect(2 * 2).toBe(4);
  });
});
