import { API } from '@/api';
import { User } from '@/shared/types/User';
import { setCookie } from 'react-use-cookie';

type LoginResponse = {
  accessToken: string;
  user: User
}
export class AuthService {
  static async register(prevState: any, formData: any) {
    const email = formData.get('email');
    const password = formData.get('password');
    const password2 = formData.get('password2');
    const name = formData.get('name');
    if (password !== password2) {
      return { ...prevState, error: 'Passwords do not match' };
    }
    try {
      await API.post('auth/register', { email, password, name });
      return { data: "User created!", error: null };
    } catch (error: unknown) {
      return { ...prevState, error: error };
    }
  }
  static async login(prevState: any, formData: any) {
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const response = await API.post<LoginResponse>('auth/login', { email, password });
      if (response.accessToken) {
        setCookie('API_TOKEN', response.accessToken);
      }

      const uncodedUser = btoa(JSON.stringify(response.user));
      localStorage.setItem('user', uncodedUser);

      return { data: response.user, error: null };
    } catch (error: unknown) {
      return { ...prevState, error: error };
    }
  }
}
