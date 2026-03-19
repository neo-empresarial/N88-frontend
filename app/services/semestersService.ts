import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface Semester {
  id: number;
  semester: string;
  createdAt: string;
}

export const semestersService = {
  async getSemesters(): Promise<Semester[]> {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}semesters`);
    
    if (!response.ok) {
      throw new Error('Falha ao carregar semestres');
    }
    
    return response.json();
  },
};