import { UserRepository } from '../repositories/user.repository';
import { FullAddress } from '../types/my-context';

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	public async ensureUserExists(telegramId: string): Promise<void> {
		const user = await this.userRepo.findByTelegramId(telegramId);
		if (!user) {
			await this.userRepo.create(telegramId);
		}
	}

	public async getUserIdByTelegramId(telegramId: string): Promise<number | null> {
		const user = await this.userRepo.findByTelegramId(telegramId);
		return user ? user.id : null;
	}

	public async updateDeliveryInfo(telegramId: string, data: FullAddress): Promise<void> {
		const user = await this.userRepo.findByTelegramId(telegramId);
		if (!user) return;

		await this.userRepo.update(user.id, data);
	}
}
