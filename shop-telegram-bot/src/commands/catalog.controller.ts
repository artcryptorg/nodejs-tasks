import { InlineMenu } from '../menus/inlineMenu.service';
import { MyContext } from '../types/my-context';

export class CatalogController {
	menu: InlineMenu<MyContext>;
	constructor(menu: InlineMenu<MyContext>) {
		this.menu = menu;
	}
	public handler = async (ctx: MyContext): Promise<void> => {
		await ctx.reply('🧸 Выберите товар', this.menu.getKeyboard());
	};
}
