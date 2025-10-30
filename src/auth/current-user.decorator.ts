import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// for returning the current user by auth
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as { userId: string; email: string };
  },
);
