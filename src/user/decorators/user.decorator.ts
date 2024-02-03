import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User as UserM } from '../user.model'

type TypeData = keyof UserM

export const User = createParamDecorator(
	(data: TypeData, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		return data ? user[data] : user
	}
)
