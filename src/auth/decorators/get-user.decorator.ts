import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si pasas un argumento (ej: @GetUser('id')), retorna solo esa propiedad.
    // Si no pasas nada (ej: @GetUser()), retorna todo el objeto user.
    return data ? user?.[data] : user;
  },
);