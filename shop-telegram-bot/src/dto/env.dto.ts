import { IsString, IsNotEmpty } from 'class-validator';

export class EnvDto {
	@IsString()
	@IsNotEmpty()
	TOKEN!: string;

	@IsString()
	@IsNotEmpty()
	DATABASE_URL!: string;
}
