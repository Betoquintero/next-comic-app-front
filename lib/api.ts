export async function getPartsByUniverse(universe: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${universe}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch parts for universe: ${universe}`);
      }
  
      const data = await response.json();
      return data.data;
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to fetch issue details');
    }
  }
  
  export async function toggleIssueReadStatus(issueId: string, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readStatuses/toggle-read/${issueId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle read status');
    }
    const data = await response.json();
    return data.isRead;
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
  
  
  
  
  
  
  