// 📁 services/checkout.service.ts
import { FullAddress } from '../types/my-context';
import { UserService } from './user.service';

export class CheckoutService {
	constructor(private readonly userService: UserService) {}

	public async saveUserAddress(telegramId: string, data: FullAddress): Promise<void> {
		const userId = await this.userService.getUserIdByTelegramId(telegramId);
		if (!userId) throw new Error('Пользователь не найден');

		await this.userService.updateDeliveryInfo(telegramId, data);
	}
}
