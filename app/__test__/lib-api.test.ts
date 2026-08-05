import {
  getPartsByUniverse,
  getPartDetails,
  getEventDetails,
  getIssueDetails,
  fetchProfileData,
  sendChatMessage,
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
});

describe('sendChatMessage', () => {
  const messages = [{ role: 'user' as const, content: 'What should I read next?' }];

  test('returns the reply and sources on success', async () => {
    mockFetch({
      ok: true,
      json: () => Promise.resolve({ data: { reply: 'Try Secret Wars.', sources: [{ type: 'Event', name: 'Secret Wars' }] } }),
    });

    const result = await sendChatMessage(messages, 'token123');

    expect(result).toEqual({ reply: 'Try Secret Wars.', sources: [{ type: 'Event', name: 'Secret Wars' }] });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/chat'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token123' }),
        body: JSON.stringify({ messages }),
      })
    );
  });

  test('throws a session-expired message on 401', async () => {
    mockFetch({ ok: false, status: 401 });

    await expect(sendChatMessage(messages, 'token123')).rejects.toThrow('Your session has expired. Please log in again.');
  });

  test('throws the backend error message on 429', async () => {
    mockFetch({ ok: false, status: 429, json: () => Promise.resolve({ error: 'Slow down, try again in 5 minutes.' }) });

    await expect(sendChatMessage(messages, 'token123')).rejects.toThrow('Slow down, try again in 5 minutes.');
  });

  test('falls back to a generic rate-limit message when the 429 body has no error field', async () => {
    mockFetch({ ok: false, status: 429, json: () => Promise.reject(new Error('invalid json')) });

    await expect(sendChatMessage(messages, 'token123')).rejects.toThrow(
      'Too many messages sent. Please wait a moment and try again.'
    );
  });

  test('throws a generic message on other errors', async () => {
    mockFetch({ ok: false, status: 500 });

    await expect(sendChatMessage(messages, 'token123')).rejects.toThrow('Failed to get a response from the chat assistant');
  });
});
