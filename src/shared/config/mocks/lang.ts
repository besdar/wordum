jest.mock('../../lib/i18n', () => ({
  translate: (key: string) => key,
}));
