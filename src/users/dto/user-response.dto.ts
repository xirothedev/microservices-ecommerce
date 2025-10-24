import { User } from 'generated/prisma';

export type UserResponseDto = Omit<User, 'password'>;
