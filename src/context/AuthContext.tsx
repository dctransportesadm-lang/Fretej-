import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string; // In a real app, never store plain passwords
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, avatar?: string) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'app_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Email ou senha inválidos');
    }
  };

  const register = async (name: string, email: string, password: string, avatar?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some(u => u.email === email)) {
      throw new Error('Este email já está cadastrado');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatar
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Auto login after register
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  };

  const updateAvatar = async (avatar: string) => {
    if (!user) return;

    const updatedUser = { ...user, avatar };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Update in users list
    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      const updatedUsers = users.map(u => u.id === user.id ? { ...u, avatar } : u);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const recoverPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const exists = users.some(u => u.email === email);
    
    if (!exists) {
      throw new Error('Email não encontrado');
    }
    
    // In a real app, send email here. For local demo:
    alert(`Simulação: Um link de recuperação foi enviado para ${email}`);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, recoverPassword, updateAvatar, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
