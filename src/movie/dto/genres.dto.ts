import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class GenresDto {
	@IsNotEmpty()
	genreIDs: Types.ObjectId[]
}
