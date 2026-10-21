import { API } from '@/api';
import type { User } from '@/shared/types/User';

export class UsersService {
  static getUsers() {
    return API.get<User[]>('users');
  }

  static getUser(id: string | number) {
    return API.get<User>(`users/${id}`);
  }

  static deleteUser(id: string | number) {
    return API.delete(`users/${id}`);
  }
}