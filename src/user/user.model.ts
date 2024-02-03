import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Document } from 'mongoose'
export type UserModel = HydratedDocument<User>

@Schema()
export class User extends Document {
	@Prop({ unique: true })
	email: string

	@Prop()
	password: string

	@Prop({ default: false })
	isAdmin?: boolean

	@Prop({ type: Types.ObjectId, ref: 'Movie', default: [] })
	favorites?: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
