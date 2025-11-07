export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserList {
  users: User[];
}
