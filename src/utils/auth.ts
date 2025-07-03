import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

// // Simulate API calls - replace with actual backend calls
// export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   // Simple validation (replace with actual API call)
//   if (credentials.email && credentials.password.length >= 6) {
//     const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
//     const user: User = {
//       id: '1',
//       email: credentials.email,
//       firstName: 'John',
//       lastName: 'Doe'
//     };
    
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
    
//     return {
//       success: true,
//       token,
//       user
//     };
//   }
  
//   return {
//     success: false,
//     message: 'Invalid email or password'
//   };
// };

const API_BASE_URL =  '192.168.3.103:8080';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const token = await response.text(); // because backend returns plain JWT

    if (!response.ok) {
      throw new Error(token); // token here contains error message if login failed
    }

    // Optionally decode token to extract user info
    const user = parseJwt(token);

    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

// Helper function to decode JWT payload (assuming user info is encoded)
function parseJwt(token: string): User | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || 0,
      email: payload.email,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
    };
  } catch {
    return undefined;
  }
}

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation (replace with actual API call)
  if (credentials.email && credentials.password.length >= 6 && credentials.firstName && credentials.lastName) {
    const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
    const user: User = {
      id: '1',
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      success: true,
      token,
      user
    };
  }
  
  return {
    success: false,
    message: 'Please fill in all fields. Password must be at least 6 characters.'
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { token, user };
};