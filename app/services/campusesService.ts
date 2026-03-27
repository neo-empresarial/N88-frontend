import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface Campus {
  id: number;
  name: string;
}

export const campusesService = {
  async getCampuses(): Promise<Campus[]> {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}campus`);
    
    if (!response.ok) {
      throw new Error('Falha ao carregar campi');
    }
    
    return response.json();
  },
};
