import { renderHook, act } from '@testing-library/react';
import { UserProvider, useUser, UserContext } from './UserContext';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';

// Mock `react-hot-toast`
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock `localStorage` for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('UserProvider', () => {
  // A helper function to wrap the hook in the provider
  const wrapper = ({ children }: { children: ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  // Test Case 1: Initial state (logged out)
  it('should have an initial state of logged out if localStorage is empty', () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userName).toBe('Guest');
  });

  // Test Case 2: Initial state (logged in)
  it('should have an initial state of logged in if localStorage has data', () => {
    localStorageMock.setItem('isLoggedIn', 'true');
    localStorageMock.setItem('userName', 'TestUser');
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userName).toBe('TestUser');
  });

  // Test Case 3: Login functionality
  it('should set isLoggedIn to true and update username on login', () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    act(() => {
      result.current.login('LoggedInUser');
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userName).toBe('LoggedInUser');
    expect(toast.success).toHaveBeenCalledWith('Welcome, LoggedInUser! You are logged in.');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userName', 'LoggedInUser');
  });

  // Test Case 4: Logout functionality
  it('should set isLoggedIn to false and reset username on logout', () => {
    localStorageMock.setItem('isLoggedIn', 'true');
    localStorageMock.setItem('userName', 'TestUser');
    const { result } = renderHook(() => useUser(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userName).toBe('Guest');
    expect(toast.success).toHaveBeenCalledWith('You have been logged out.');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isLoggedIn', 'false');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userName', 'Guest');
  });

  // Test Case 5: Logout with a callback
  it('should call the provided callback on logout', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useUser(), { wrapper });

    act(() => {
      result.current.logout(mockCallback);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  // Test Case 6: `useUser` hook without a provider (uncovered branch)
  it('should throw an error if used outside of a UserProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      // Intentionally render outside the provider
      renderHook(() => useUser());
    }).toThrow('useUser must be used within a UserProvider');
    
    console.error = originalError;
  });

  // Test Case 7: `localStorage` read errors (uncovered branch)
  it('should handle localStorage get errors gracefully', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage read error');
    });
    console.error = jest.fn();

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userName).toBe('Guest');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to access localStorage for isLoggedIn:',
      expect.any(Error)
    );
  });

  // Test Case 8: `localStorage` write errors (uncovered branch)
  it('should handle localStorage set errors gracefully', () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    
    act(() => {
      // Mock setItem to throw an error on the next call
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage write error');
      });
      console.error = jest.fn();
      
      result.current.login('ErrorUser');
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userName).toBe('ErrorUser');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to write to localStorage:',
      expect.any(Error)
    );
  });
});