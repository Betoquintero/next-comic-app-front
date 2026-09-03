import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom doesn't implement these — parseChatStream (lib/api.ts) needs them
// to decode the chat endpoint's SSE stream, both in production (real
// browsers have them natively) and in tests that fake a streaming Response.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// global fetch mock
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),  // default response
    })
  );
