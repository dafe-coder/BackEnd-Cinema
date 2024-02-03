import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileService } from './file.service'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FileController {
	constructor(private readonly FileServices: FileService) {}

	@Post()
	@Auth('admin')
	@HttpCode(200)
	@UseInterceptors(FileInterceptor(' '))
	async uploadFiles(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.FileServices.saveFiles([file], folder)
	}
}
