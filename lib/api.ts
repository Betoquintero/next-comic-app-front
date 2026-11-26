 export interface Part {
  _id: string;
  universe: string;
  name: string;
  order?: string;
  years?: string;
  events?: string[];
  issues?: string[];
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
      return null;
    }
  
    const userData = await res.json();
  
    return userData?.data || {
      userId: userId,
      issues: [],
      events: [],
    };
  };

  export interface CategorizationSuggestion {
    universe: 'DC' | 'MARVEL';
    event: string;
    isNewEvent: boolean;
    order: string;
    reasoning: string;
  }

  export interface CategorizationMatch {
    name?: string;
    universe?: string;
    event?: string;
  }

  export interface CategorizeResult {
    suggestion: CategorizationSuggestion;
    basedOn: CategorizationMatch[];
  }

  export async function parseCategorizeResponse(response: Response): Promise<CategorizeResult> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Too many requests. Please wait a moment and try again.');
      }
      if (response.status === 400) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Please provide at least a name for the comic.');
      }
      throw new Error('Failed to get a categorization suggestion');
    }

    const data = await response.json();
    return data.data as CategorizeResult;
  }

  