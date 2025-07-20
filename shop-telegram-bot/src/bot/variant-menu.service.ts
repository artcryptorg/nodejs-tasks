import { Telegraf } from 'telegraf';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { InlineMenu } from '../menus/inlineMenu.service';
import { CartService } from './cart.service';
import { UserService } from './user.service';
import { MyContext } from '../types/my-context';

export class VariantMenuService {
	constructor(
		private readonly cartService: CartService,
		private readonly variantRepo: ProductVariantRepository,
		private readonly userService: UserService,
		private readonly bot: Telegraf<MyContext>,
	) {}

	public async build(productId: number): Promise<InlineMenu<MyContext>> {
		const variants = await this.variantRepo.findAvailableByProductId(productId);

		const items = variants.map((v) => ({
			label: `${v.color} / ${v.size} — ${v.price} ${v.currency}`,
			callback: `variant_${v.id}`,
			handler: async (ctx: MyContext): Promise<void> => {
				const telegramId = ctx.from?.id;
				if (!telegramId) return;

				const userId = await this.userService.getUserIdByTelegramId(String(telegramId));
				if (!userId) return;

				const message = await this.cartService.addToCart(userId, v.id);
				await ctx.answerCbQuery(message);
				await ctx.reply(message);
			},
		}));

		const menu = new InlineMenu(`variants_${productId}`, items);
		menu.register(this.bot);
		return menu;
	}
}
