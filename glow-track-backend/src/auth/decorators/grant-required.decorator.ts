import { SetMetadata } from '@nestjs/common';

export const IS_GRANT_REQUIRED_KEY = 'isGrantRequired';
export const GrantRequired = () => SetMetadata(IS_GRANT_REQUIRED_KEY, true);
