import { PrismaService } from '../database/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { FullAddress } from '../types/my-context';

export class UserRepository implements IUserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findByTelegramId(telegramId: string): Promise<UserEntity | null> {
		const user = await this.prismaService.client.user.findUnique({
			where: { telegramId },
		});
		return user
			? {
					id: user.id,
					telegramId: user.telegramId,
					city: user.city,
					address: user.address,
					zipCode: user.zipCode,
					country: user.country,
					name: user.name,
					createdAt: user.createdAt,
				}
			: null;
	}

	async create(telegramId: string): Promise<UserEntity> {
		const user = await this.prismaService.client.user.create({
			data: {
				telegramId,
				city: '',
				address: '',
				zipCode: '',
				country: '',
				name: '',
			},
		});
		return {
			id: user.id,
			telegramId: user.telegramId,
			city: user.city,
			address: user.address,
			zipCode: user.zipCode,
			country: user.country,
			name: user.name,
			createdAt: user.createdAt,
		};
	}
	async update(userId: number, data: FullAddress): Promise<void> {
		await this.prismaService.client.user.update({
			where: { id: userId },
			data,
		});
	}
}
