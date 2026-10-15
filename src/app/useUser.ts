import { User } from '@/shared/types/User';
import {
  createContext,
  Dispatch,
  SetStateAction, useEffect, useState
} from 'react';

export const UserContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}>({ user: null, setUser: () => { } });

export function useUser() {
  const storedUser = localStorage.getItem('user');
  const userObject = storedUser ? JSON.parse(atob(storedUser)) : null;
  const [user, setUser] = useState<User | null>(userObject);
  const value = { user, setUser };
  useEffect(() => {
    if (user?.phone) {
      localStorage.setItem('user', btoa(JSON.stringify(user)));
    }
  }, [user]);

  return value;
}
