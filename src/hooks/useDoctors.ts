
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  category_id: string;
  experience: string;
  rating: number;
  image_url: string;
  location: string;
  phone: string;
  email: string;
  about: string;
  education: string[];
  consultation_fee: number;
  created_at: string;
  categories?: {
    name: string;
    icon: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const useDoctors = (categoryId?: string) => {
  return useQuery({
    queryKey: ['doctors', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `);

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Doctor[];
    }
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Doctor;
    }
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    }
  });
};

export const useAvailableSlots = (doctorId: string) => {
  return useQuery({
    queryKey: ['available-slots', doctorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_available', true)
        .gte('slot_date', new Date().toISOString().split('T')[0])
        .order('slot_date')
        .order('slot_time');
      
      if (error) throw error;
      return data;
    }
  });
};
