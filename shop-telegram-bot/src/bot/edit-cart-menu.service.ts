import { Telegraf } from 'telegraf';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { InlineMenu, InlineMenuItem } from '../menus/inlineMenu.service';
import { CartService } from './cart.service';
import { UserService } from './user.service';
import { MyContext } from '../types/my-context';
import { CartRepository } from '../repositories/cart.repository';

export class EditCartMenuService {
	constructor(
		private readonly cartService: CartService,
		private readonly cartRepo: CartRepository,
		private readonly userService: UserService,
		private readonly bot: Telegraf<MyContext>,
	) {}

	public async build(userId: number): Promise<InlineMenu<MyContext>> {
		const variants = await this.cartRepo.findByUser(userId);
		const initial: Array<InlineMenuItem<MyContext>> = [];
		const items = variants.reduce((total, item) => {
			total.push({
				label: `${item.variant.color}/${item.variant.size} — ${item.quantity} × ${item.variant.price.toFixed(2)} ${item.variant.currency} = ${(item.quantity * item.variant.price).toFixed(2)} ${item.variant.currency}`,
				callback: `cartVariant_${item.id}`,
				handler: async (ctx: MyContext): Promise<void> => {
					const message = await this.cartService.addToCart(userId, item.variantId);
					await ctx.answerCbQuery(message);
					await ctx.reply(message);
				},
			});
			total.push({
				label: `🗑️`,
				callback: `deleteCartVariant_${item.id}`,
				handler: async (ctx: MyContext): Promise<void> => {
					const message = await this.cartService.delFromCart(item.id);
					await ctx.answerCbQuery(message);
					await ctx.reply(message);
				},
			});
			return total;
		}, initial);

		const menu = new InlineMenu(`variants_${userId}`, items);
		menu.register(this.bot);
		return menu;
	}
}
