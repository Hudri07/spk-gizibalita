export interface Balita {
  id: number;
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'L' | 'P';
  created_at?: string;
  score?: number;
  status?: string;
}

export interface Criteria {
  id: number;
  code: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface User {
  id: number;
  username: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  avatar: string;
  email: string;
  notifications: {
    giziBurukAlert: boolean;
  };
}
