import { IsNumber, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class SetRatingDto {
	@IsString()
	movieId: Types.ObjectId

	@IsNumber()
	value: number
}
