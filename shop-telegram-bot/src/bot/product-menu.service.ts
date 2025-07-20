import { Telegraf } from 'telegraf';
import { InlineMenu } from '../menus/inlineMenu.service';
import { IProductRepository } from '../repositories/product.repository.interface';
import { VariantMenuService } from './variant-menu.service';
import { MyContext } from '../types/my-context';

export class ProductMenuService {
	private menu!: InlineMenu<MyContext>;

	constructor(
		private readonly productRepository: IProductRepository,
		private readonly variantMenuService: VariantMenuService,
		private readonly bot: Telegraf<MyContext>,
	) {}

	public async build(): Promise<InlineMenu<MyContext>> {
		const products = await this.productRepository.findAll();

		const items = products.map((p) => ({
			label: p.name,
			callback: `product_${p.id}`,
			handler: async (ctx: MyContext): Promise<void> => {
				await ctx.answerCbQuery();
				const variantMenu = await this.variantMenuService.build(p.id);
				await ctx.reply(`🔍 Варианты для "${p.name}"`, variantMenu.getKeyboard(1));
			},
		}));

		this.menu = new InlineMenu<MyContext>('catalog', items);
		this.menu.register(this.bot);
		return this.menu;
	}
}
