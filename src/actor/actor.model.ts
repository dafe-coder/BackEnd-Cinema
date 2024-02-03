import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

export type ActorModel = HydratedDocument<Actor>

@Schema()
export class Actor extends Document {
	@Prop()
	name: string

	@Prop({ unique: true })
	slug: string

	@Prop()
	photo: string
}

export const ActorSchema = SchemaFactory.createForClass(Actor)
