import { API } from '@/api';
import { Category, Flower } from '@/shared/types/Flower';

export type FiltersResponse = {
  colors: { value: string, count: number }[],
  prices: [number, number],
  categories: Category[]
}

export class FlowersService {
  static getFlowers() {
    return API.get<Flower[]>('flowers');
  }

  static getFlowersWithFilters(query = '') {
    return API.get<{ items: Flower[], filters: FiltersResponse }>(
      `flowers/with-filters${query ? `?${query}` : ''}`,
    );
  }

  static getFlowersCategories() {
    return API.get<Category[]>('flowers/categories');
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
