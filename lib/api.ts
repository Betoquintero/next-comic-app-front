 export interface Part {
  _id: string;
  universe: string;
  name: string;
  order?: string;
  years?: string;
  events?: string[]; // events Ids
  issues?: string[]; // Issues Ids
  description?: string;
}

export async function getPartsByUniverse(universe: string): Promise<Part[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${universe}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch parts for universe: ${universe}`);
    }

    const data = await response.json();
    return data.data as Part[];
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw new Error('Could not fetch parts data');
  }
}

  export async function getPartDetails(universe: string, id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${universe}/${id}`, {
        cache:'no-store',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch part details');
      }
  
      const data = await response.json();
      return data.data;
    } catch {
      throw new Error('Failed to fetch part details');
    }
  }

  export async function getEventDetails(id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        cache: 'no-store',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
  
      const data = await response.json();
      return data.data;
    } catch {
      throw new Error('Failed to fetch event details');
    }
  }

  export async function getIssueDetails(id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/issues/${id}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch issue details');
      }
  
      const data = await response.json();
      return data.data;
    } catch {
      throw new Error('Failed to fetch issue details');
    }
  }
  
  export async function refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.authToken ?? null;
    } catch {
      return null;
    }
  }

  export async function logout(): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Best-effort: local logout must proceed even if this fails.
    }
  }

  export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

  export interface ChatSource {
    type: 'Issue' | 'Event' | 'Part';
    name?: string;
  }

  // Throws with a user-facing message when the initial POST /chat response
  // (before any streaming starts) is a non-2xx — 400/401/429 all arrive as
  // plain JSON, same as before the endpoint became SSE on success.
  export async function assertChatResponseOk(response: Response): Promise<void> {
    if (response.ok) {
      return;
    }

    if (response.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    }
    if (response.status === 429) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Too many messages sent. Please wait a moment and try again.');
    }
    throw new Error('Failed to get a response from the chat assistant');
  }

  // Parses the SSE body of a successful POST /chat response: a `delta` event
  // per text chunk (reported via onDelta as it arrives) and a final `done`
  // event carrying `sources`. Takes an already-fetched Response so it stays
  // a pure parser, easy to unit-test with a fake reader.
  export async function parseChatStream(
    response: Response,
    onDelta: (text: string) => void
  ): Promise<{ sources: ChatSource[] }> {
    if (!response.body) {
      throw new Error('Failed to get a response from the chat assistant');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let sources: ChatSource[] = [];

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let separatorIndex = buffer.indexOf('\n\n');
      while (separatorIndex !== -1) {
        const rawEvent = buffer.slice(0, separatorIndex).trim();
        buffer = buffer.slice(separatorIndex + 2);

        if (rawEvent.startsWith('data:')) {
          const payload = JSON.parse(rawEvent.slice(5).trim());

          if (payload.type === 'delta') {
            onDelta(payload.text);
          } else if (payload.type === 'done') {
            sources = payload.sources ?? [];
          } else if (payload.type === 'error') {
            throw new Error(payload.message || 'Failed to get a response from the chat assistant');
          }
        }

        separatorIndex = buffer.indexOf('\n\n');
      }
    }

    return { sources };
  }

  export class SessionExpiredError extends Error {}

  export const fetchProfileData = async (userId: string, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      throw new SessionExpiredError();
    }

    if (!res.ok) {
      return null; // If the request fails, return null
    }
  
    const userData = await res.json();
  
    // Ensure that the userData is at least an empty object if no collections are found
    return userData?.data || {
      userId: userId,
      issues: [],
      events: [],
    };
  };
  
  