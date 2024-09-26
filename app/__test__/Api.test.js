import {
    getPartsByUniverse,
    getPartDetails,
    getEventDetails,
    getIssueDetails,
    toggleIssueReadStatus,
    fetchProfileData,
  } from '../../lib/api';
  
  // Mock the fetch function globally
  global.fetch = jest.fn();
  
  describe('API functions', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    describe('getPartsByUniverse', () => {
      it('should return parts data for a given universe', async () => {
        const mockData = { data: ['part1', 'part2'] };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const result = await getPartsByUniverse('DC');
        expect(result).toEqual(mockData.data);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/parts/DC`, {"cache": "no-store"});
      });
  
      it('should throw an error when the fetch fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        await expect(getPartsByUniverse('DC')).rejects.toThrow('Could not fetch parts data');
      });
    });
  
    describe('getPartDetails', () => {
      it('should return part details for a given id', async () => {
        const mockData = { data: { id: '123', name: 'Part Name' } };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const result = await getPartDetails('DC', '123');
        expect(result).toEqual(mockData.data);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/parts/DC/123`, {"cache": "no-store"});
      });
  
      it('should throw an error when the fetch fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        await expect(getPartDetails('DC', '123')).rejects.toThrow('Failed to fetch part details');
      });
    });
  
    describe('getEventDetails', () => {
      it('should return event details for a given id', async () => {
        const mockData = { data: { id: 'event1', name: 'Event Name' } };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const result = await getEventDetails('event1');
        expect(result).toEqual(mockData.data);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/events/event1`, {"cache": "no-store"});
      });
  
      it('should throw an error when the fetch fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        await expect(getEventDetails('event1')).rejects.toThrow('Failed to fetch event details');
      });
    });
  
    describe('getIssueDetails', () => {
      it('should return issue details for a given id', async () => {
        const mockData = { data: { id: 'issue1', name: 'Issue Name' } };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const result = await getIssueDetails('issue1');
        expect(result).toEqual(mockData.data);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/issues/issue1`);
      });
  
      it('should throw an error when the fetch fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        await expect(getIssueDetails('issue1')).rejects.toThrow('Failed to fetch issue details');
      });
    });
  
    describe('toggleIssueReadStatus', () => {
      it('should toggle the read status of an issue', async () => {
        const mockData = { isRead: true };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const token = 'test-token';
        const result = await toggleIssueReadStatus('issue1', token);
        expect(result).toBe(mockData.isRead);
        expect(fetch).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_API_URL}/readStatuses/toggle-read/issue1`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
  
      it('should throw an error when toggling read status fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        await expect(toggleIssueReadStatus('issue1', 'test-token')).rejects.toThrow('Failed to toggle read status');
      });
    });
  
    describe('fetchProfileData', () => {
      it('should return user profile data if the request is successful', async () => {
        const mockData = { data: { userId: '123', issues: [], events: [] } };
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });
  
        const token = 'test-token';
        const result = await fetchProfileData('123', token);
        expect(result).toEqual(mockData.data);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });
  
      it('should return null if the request fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
  
        const token = 'test-token';
        const result = await fetchProfileData('123', token);
        expect(result).toBeNull();
      });
    });
  });
  