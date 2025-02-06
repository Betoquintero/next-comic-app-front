import '@testing-library/jest-dom';


// global fetch mock
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),  // default response
    })
  );
