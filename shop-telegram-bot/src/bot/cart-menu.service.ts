import { InlineMenu } from '../menus/inlineMenu.service';
import { Telegraf } from 'telegraf';
import { MyContext } from '../types/my-context';
import { EditCartMenuService } from './edit-cart-menu.service';
import { UserService } from './user.service';

export class CartMenuService {
	constructor(
		private readonly bot: Telegraf<MyContext>,
		private readonly editCartMenuService: EditCartMenuService,
		private readonly userService: UserService,
	) {}

	public async build(): Promise<InlineMenu<MyContext>> {
		const itemsCartMenu = [
			{
				label: '✏️ Редактировать',
				callback: 'editCart',
				handler: async (ctx: MyContext): Promise<void> => {
					const telegramId = ctx.from?.id;
					if (!telegramId) return;

					const userId = await this.userService.getUserIdByTelegramId(String(telegramId));
					if (!userId) return;
					await ctx.answerCbQuery();
					await ctx.reply('переходим в режим редактирования');
					const editCartMenu = await this.editCartMenuService.build(userId);
					await ctx.reply(
						`🔍  можете внести изменения в ваш заказ:
						если нажать на товар, то он добавится в корзину
						если нажать на 🗑️ то товар будет удален из корзины`,
						editCartMenu.getKeyboard(2),
					);
				},
			},
			{
				label: '✅ Оформить',
				callback: 'confirmOrder',
				handler: async (ctx: MyContext): Promise<void> => {
					await ctx.answerCbQuery();
					await ctx.reply('переходим в режим оформления');
					await ctx.scene.enter('checkout-wizard');
				},
			},
		];

		const menu = new InlineMenu('cartMenu', itemsCartMenu);
		menu.register(this.bot);
		return menu;
	}
}
