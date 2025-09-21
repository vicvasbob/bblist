import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  isLoggedIn: boolean;
  created_at?: Date;
  token?: string;
}

interface UserStore {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  login: (userData: Omit<User, 'isLoggedIn'>) => void;
  setHydrated: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      
      setUser: (user: User) => {
        user.isLoggedIn = true;
        set({ user });
      },
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      logout: () => set({ user: null }),
      
      login: (userData: Omit<User, 'isLoggedIn'>) => {
        set({ 
          user: { 
            ...userData, 
            isLoggedIn: true 
          } 
        });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'baby-list-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// Hook to check if the store has been hydrated
export const useHydration = () => {
  const isHydrated = useUserStore((state) => state.isHydrated);
  return isHydrated;
};
