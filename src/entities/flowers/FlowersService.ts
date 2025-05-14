import { API } from '@/api';
import { Flower } from '@/shared/types/Flower';

export class FlowersService {
  static getFlowers() {
    return API.get<Flower[]>('flowers');
  }

  static deleteFlower(id: string | number) {
    return API.delete('flowers/' + id)
  }

  static async addFlower(prevState: any, formData: FormData) {
    try {
      const response = await API.post<Flower>('flowers', formData);
      return { data: response, error: null };
    } catch (error: unknown) {
      return { ...prevState, error: error };
    }
  }
  static editFlower(id: number) {
    return async (prevState: any, formData: FormData) => {
      try {
        const response = await API.patch<Flower>('flowers/' + id, formData);
        return { data: response, error: null };
      } catch (error: unknown) {
        return { ...prevState, error: error };
      }
    };
  }
}
