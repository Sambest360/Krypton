interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  balance: number;
  isVerified: boolean;
  role: 'user' | 'admin';
}

// Mock database
const users: User[] = [];

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return users.find(user => user.email === email) || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return users.find(user => user.id === id) || null;
};

export const getUserBalance = async (id: string): Promise<number> => {
  const user = await getUserById(id);
  return user?.balance || 0;
};

export const createUser = async (userData: Omit<User, 'id' | 'balance' | 'isVerified'>): Promise<User> => {
  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    balance: 0,
    isVerified: false
  };
  users.push(newUser);
  return newUser;
};

export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
  return user.password === password; // In a real app, use proper password hashing
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  return users[index];
};
