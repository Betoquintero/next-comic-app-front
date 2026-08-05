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
  
  export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }

  export interface ChatSource {
    type: 'Issue' | 'Event' | 'Part';
    name?: string;
  }

  export interface ChatReply {
    reply: string;
    sources: ChatSource[];
  }

  export async function sendChatMessage(messages: ChatMessage[], token: string): Promise<ChatReply> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Too many messages sent. Please wait a moment and try again.');
      }
      throw new Error('Failed to get a response from the chat assistant');
    }

    const data = await response.json();
    return data.data as ChatReply;
  }

  export const fetchProfileData = async (userId: string, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
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
  
  