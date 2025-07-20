import { Telegraf } from 'telegraf';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { LoggerService } from './logger/logger.service';
import { PrismaService } from './database/prisma.service';
import { ProductRepository } from './repositories/product.repository';
import { MyContext } from './types/my-context';

async function bootstrap(): Promise<void> {
	const logger = new LoggerService();
	const prismaService = new PrismaService(logger);
	const config = new ConfigService(logger);
	const token = config.get('TOKEN');
	const productRepository = new ProductRepository(prismaService);
	const bot = new Telegraf<MyContext>(token);
	const app = new App(logger, config, bot, prismaService, productRepository);
	await app.init();
}

bootstrap();
