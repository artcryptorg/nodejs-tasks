import { UserService } from '../bot/user.service';
import { MyContext } from '../types/my-context';

export class CheckoutController {
	constructor(private readonly userService: UserService) {}

	public handler = async (ctx: MyContext): Promise<void> => {
		const telegramId = ctx.from?.id;
		if (!telegramId) return;

		const userId = await this.userService.getUserIdByTelegramId(String(telegramId));
		if (!userId) return;

		await ctx.scene.enter('checkout-wizard');
	};
}
