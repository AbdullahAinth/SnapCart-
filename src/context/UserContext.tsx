import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
  } from 'react';
  import toast from 'react-hot-toast';
  import users from '../data/users.json'; // Import the mock user database
  
  // We need a way to add new users, so we'll store a mutable copy of our mock data.
  // In a real app, this would be a server-side operation.
  let mockUsers = users;
  
  interface UserContextType {
    isLoggedIn: boolean;
    userName: string;
    login: (username: string, password: string) => boolean;
    logout: (onLogoutCallback?: () => void) => void;
    register: (username: string, name: string, password: string) => boolean;
  }
  
  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  
  interface UserProviderProps {
    children: ReactNode;
  }
  
  export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const getInitialLoginState = (): boolean => {
      try {
        return localStorage.getItem('isLoggedIn') === 'true';
      } catch (err) {
        console.error('Failed to access localStorage for isLoggedIn:', err);
        return false;
      }
    };
  
    const getInitialUserName = (): string => {
      try {
        return localStorage.getItem('userName') || 'Guest';
      } catch (err) {
        console.error('Failed to access localStorage for userName:', err);
        return 'Guest';
      }
    };
  
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getInitialLoginState);
    const [userName, setUserName] = useState<string>(getInitialUserName);
  
    useEffect(() => {
      try {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        localStorage.setItem('userName', userName);
      } catch (err) {
        console.error('Failed to write to localStorage:', err);
      }
    }, [isLoggedIn, userName]);
  
    const login = (username: string, password: string): boolean => {
      const user = mockUsers.find(u => u.username === username && u.password === password);
  
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.username);
        toast.success(`Welcome back, ${user.name}!`); // Note: We now use `user.name` here
        return true;
      } else {
        toast.error('Invalid username or password.');
        return false;
      }
    };
  
    const logout = (onLogoutCallback?: () => void) => {
      setIsLoggedIn(false);
      setUserName('Guest');
      toast.success('You have been logged out.');
      if (onLogoutCallback) {
        onLogoutCallback();
      }
    };
  
    const register = (username: string, name: string, password: string): boolean => {
      const userExists = mockUsers.some(u => u.username === username);
      if (userExists) {
        toast.error('This username is already taken. Please choose another.');
        return false;
      }
  
      const newUser = { username, name, password };
      mockUsers.push(newUser);
      
      toast.success('Registration successful! You can now log in.');
      
      // Log the user in immediately after registration for convenience.
      login(username, password);
  
      return true;
    };
  
    return (
      <UserContext.Provider
        value={{
          isLoggedIn,
          userName,
          login,
          logout,
          register
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };