import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from './config.service.interface';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvDto } from '../dto/env.dto';

export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует');
			process.exit(1);
		} else {
			this.logger.log('[ConfigService] Конфигурация .env загружена, начинаем валидацию...');
		}

		const validatedConfig = plainToInstance(EnvDto, result.parsed, {
			enableImplicitConversion: true,
		});
		const errors = validateSync(validatedConfig, {
			skipMissingProperties: false,
		});

		if (errors.length > 0) {
			this.logger.error('[ConfigService]  Ошибка валидации .env:');
			console.error(errors);
			process.exit(1);
		} else {
			this.logger.log('[ConfigService] Конфигурация .env прошла валидацию');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
