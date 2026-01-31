globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  } as unknown as Response),
);
