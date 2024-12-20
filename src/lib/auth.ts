import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};