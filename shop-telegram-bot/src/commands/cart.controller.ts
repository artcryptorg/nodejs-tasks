import { CartService } from '../bot/cart.service';
import { UserService } from '../bot/user.service';
import { InlineMenu } from '../menus/inlineMenu.service';
import { MyContext } from '../types/my-context';

export class CartController {
	constructor(
		private readonly cartService: CartService,
		private readonly userService: UserService,
		private readonly menu: InlineMenu<MyContext>,
	) {
		this.menu = menu;
	}

	public handler = async (ctx: MyContext): Promise<void> => {
		const telegramId = ctx.from?.id;
		if (!telegramId) return;

		const userId = await this.userService.getUserIdByTelegramId(String(telegramId));
		if (!userId) return;

		const message = await this.cartService.showCart(userId);
		await ctx.reply(message, this.menu.getKeyboard(1));
	};
}
