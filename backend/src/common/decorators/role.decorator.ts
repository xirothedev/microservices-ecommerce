import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'prisma/generated';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
