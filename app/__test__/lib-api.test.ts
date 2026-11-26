import {
  getPartsByUniverse,
  getPartDetails,
  getEventDetails,
  getIssueDetails,
  fetchProfileData,
  assertChatResponseOk,
  parseChatStream,
  parseCategorizeResponse,
  SessionExpiredError,
} from '../../lib/api';

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

describe('getPartsByUniverse', () => {
  test('returns the parts on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ data: [{ _id: '1', universe: 'DC', name: 'Part 1' }] }) });

    const parts = await getPartsByUniverse('DC');

    expect(parts).toEqual([{ _id: '1', universe: 'DC', name: 'Part 1' }]);
  });

  test('throws when the response is not ok', async () => {
    mockFetch({ ok: false });

    await expect(getPartsByUniverse('DC')).rejects.toThrow('Could not fetch parts data');
  });

  test('throws when fetch itself rejects', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await expect(getPartsByUniverse('DC')).rejects.toThrow('Could not fetch parts data');
  });
});

describe('getPartDetails', () => {
  test('returns the part details on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ data: { _id: '1', name: 'Part 1' } }) });

    const part = await getPartDetails('DC', '1');

    expect(part).toEqual({ _id: '1', name: 'Part 1' });
  });

  test('throws when the response is not ok', async () => {
    mockFetch({ ok: false });

    await expect(getPartDetails('DC', '1')).rejects.toThrow('Failed to fetch part details');
  });
});

describe('getEventDetails', () => {
  test('returns the event details on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ data: { _id: '1', name: 'Event 1' } }) });

    const event = await getEventDetails('1');

    expect(event).toEqual({ _id: '1', name: 'Event 1' });
  });

  test('throws when the response is not ok', async () => {
    mockFetch({ ok: false });

    await expect(getEventDetails('1')).rejects.toThrow('Failed to fetch event details');
  });
});

describe('getIssueDetails', () => {
  test('returns the issue details on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ data: { _id: '1', name: 'Issue 1' } }) });

    const issue = await getIssueDetails('1');

    expect(issue).toEqual({ _id: '1', name: 'Issue 1' });
  });

  test('throws when the response is not ok', async () => {
    mockFetch({ ok: false });

    await expect(getIssueDetails('1')).rejects.toThrow('Failed to fetch issue details');
  });
});

describe('fetchProfileData', () => {
  test('returns the collection data on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ data: { userId: 'u1', events: [], issues: [] } }) });

    const profile = await fetchProfileData('u1', 'token123');

    expect(profile).toEqual({ userId: 'u1', events: [], issues: [] });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/collections'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token123' } })
    );
  });

  test('falls back to an empty collection when the response has no data', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({}) });

    const profile = await fetchProfileData('u1', 'token123');

    expect(profile).toEqual({ userId: 'u1', issues: [], events: [] });
  });

  test('returns null when the response is not ok', async () => {
    mockFetch({ ok: false });

    const profile = await fetchProfileData('u1', 'token123');

    expect(profile).toBeNull();
  });

  test('throws SessionExpiredError when the access token is expired', async () => {
    mockFetch({ ok: false, status: 401 });

    await expect(fetchProfileData('u1', 'token123')).rejects.toBeInstanceOf(SessionExpiredError);
  });
});

describe('assertChatResponseOk', () => {
  test('resolves without throwing when the response is ok', async () => {
    await expect(assertChatResponseOk({ ok: true } as Response)).resolves.toBeUndefined();
  });

  test('throws a session-expired message on 401', async () => {
    await expect(assertChatResponseOk({ ok: false, status: 401 } as Response)).rejects.toThrow(
      'Your session has expired. Please log in again.'
    );
  });

  test('throws the backend error message on 429', async () => {
    const response = {
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Slow down, try again in 5 minutes.' }),
    } as unknown as Response;

    await expect(assertChatResponseOk(response)).rejects.toThrow('Slow down, try again in 5 minutes.');
  });

  test('falls back to a generic rate-limit message when the 429 body has no error field', async () => {
    const response = {
      ok: false,
      status: 429,
      json: () => Promise.reject(new Error('invalid json')),
    } as unknown as Response;

    await expect(assertChatResponseOk(response)).rejects.toThrow(
      'Too many messages sent. Please wait a moment and try again.'
    );
  });

  test('throws a generic message on other errors', async () => {
    await expect(assertChatResponseOk({ ok: false, status: 500 } as Response)).rejects.toThrow(
      'Failed to get a response from the chat assistant'
    );
  });
});

describe('parseChatStream', () => {
  const encoder = new TextEncoder();

  const fakeStreamResponse = (chunks: string[]): Response => {
    let index = 0;
    const reader = {
      read: jest.fn(() => {
        if (index < chunks.length) {
          const value = encoder.encode(chunks[index]);
          index += 1;
          return Promise.resolve({ done: false, value });
        }
        return Promise.resolve({ done: true, value: undefined });
      }),
    };
    return { body: { getReader: () => reader } } as unknown as Response;
  };

  test('reports each delta and resolves with the sources from the done event', async () => {
    const response = fakeStreamResponse([
      'data: {"type":"delta","text":"Try "}\n\n' +
        'data: {"type":"delta","text":"Secret Wars."}\n\n' +
        'data: {"type":"done","sources":[{"type":"Event","name":"Secret Wars"}]}\n\n',
    ]);
    const onDelta = jest.fn();

    const result = await parseChatStream(response, onDelta);

    expect(onDelta.mock.calls).toEqual([['Try '], ['Secret Wars.']]);
    expect(result).toEqual({ sources: [{ type: 'Event', name: 'Secret Wars' }] });
  });

  test('reassembles an SSE event split across two chunks', async () => {
    const response = fakeStreamResponse(['data: {"type":"delta","text":"Hel', 'lo"}\n\ndata: {"type":"done","sources":[]}\n\n']);
    const onDelta = jest.fn();

    const result = await parseChatStream(response, onDelta);

    expect(onDelta).toHaveBeenCalledWith('Hello');
    expect(result).toEqual({ sources: [] });
  });

  test('throws when the stream emits an error event', async () => {
    const response = fakeStreamResponse(['data: {"type":"error","message":"Something went wrong"}\n\n']);

    await expect(parseChatStream(response, jest.fn())).rejects.toThrow('Something went wrong');
  });
});

describe('parseCategorizeResponse', () => {
  test('returns the suggestion and basedOn matches on success', async () => {
    const suggestion = { universe: 'DC', event: 'Injustice', isNewEvent: false, order: '2', reasoning: 'Follows #1.' };
    const basedOn = [{ name: 'Injustice: Year Zero #1', universe: 'DC', event: 'Injustice' }];
    const response = {
      ok: true,
      json: () => Promise.resolve({ data: { suggestion, basedOn } }),
    } as unknown as Response;

    const result = await parseCategorizeResponse(response);

    expect(result).toEqual({ suggestion, basedOn });
  });

  test('throws a session-expired message on 401', async () => {
    await expect(parseCategorizeResponse({ ok: false, status: 401 } as Response)).rejects.toThrow(
      'Your session has expired. Please log in again.'
    );
  });

  test('throws the backend error message on 429', async () => {
    const response = {
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Slow down, try again in 5 minutes.' }),
    } as unknown as Response;

    await expect(parseCategorizeResponse(response)).rejects.toThrow('Slow down, try again in 5 minutes.');
  });

  test('falls back to a generic rate-limit message when the 429 body has no error field', async () => {
    const response = { ok: false, status: 429, json: () => Promise.reject(new Error('invalid json')) } as unknown as Response;

    await expect(parseCategorizeResponse(response)).rejects.toThrow(
      'Too many requests. Please wait a moment and try again.'
    );
  });

  test('throws the backend error message on 400', async () => {
    const response = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Please provide at least a "name" for the comic to categorize' }),
    } as unknown as Response;

    await expect(parseCategorizeResponse(response)).rejects.toThrow(
      'Please provide at least a "name" for the comic to categorize'
    );
  });

  test('throws a generic message on other errors', async () => {
    await expect(parseCategorizeResponse({ ok: false, status: 500 } as Response)).rejects.toThrow(
      'Failed to get a categorization suggestion'
    );
  });
});
