import { Menu } from '../menus/replyMenuBuilder.service';
import { CatalogController } from '../commands/catalog.controller';
import { CartController } from '../commands/cart.controller';
import { CheckoutController } from '../commands/checkout.controller';
import { MyContext } from '../types/my-context';

export function createMainMenu(
	catalogController: CatalogController,
	cartController: CartController,
	checkoutController: CheckoutController,
): Menu {
	return new Menu('main', [
		{
			label: '🧸 Товары',
			handler: catalogController.handler,
		},
		{
			label: '🛒 Корзина',
			handler: cartController.handler,
		},
		{
			label: '📦 Оформить заказ',
			handler: checkoutController.handler,
		},
		{
			label: '📇 Контакты',
			handler: async (ctx: MyContext): Promise<void> => {
				await ctx.reply('✉️ Контакты: @yourshop');
			},
		},
	]);
}
