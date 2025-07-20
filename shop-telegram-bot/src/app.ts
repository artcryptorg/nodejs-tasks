import { session, Telegraf, Scenes } from 'telegraf';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';
import { IProductRepository } from './repositories/product.repository.interface';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { CartRepository } from './repositories/cart.repository';
import { CatalogController } from './commands/catalog.controller';
import { createMainMenu } from './bot/createMainMenu';
import { Menu } from './menus/replyMenuBuilder.service';
import { StartController } from './commands/start.controller';
import { ProductMenuService } from './bot/product-menu.service';
import { VariantMenuService } from './bot/variant-menu.service';
import { CartService } from './bot/cart.service';
import { UserService } from './bot/user.service';
import { UserRepository } from './repositories/user.repository';
import { CartController } from './commands/cart.controller';
import { CartMenuService } from './bot/cart-menu.service';
import { CheckoutController } from './commands/checkout.controller';
import { createCheckoutScene } from './scenes/address.scene';
import { MyContext } from './types/my-context';
import { CheckoutService } from './bot/checkout.service';
import { EditCartMenuService } from './bot/edit-cart-menu.service';

export class App {
	private readonly bot: Telegraf<MyContext>;
	private readonly logger: ILogger;
	private readonly config: IConfigService;
	private readonly prismaService: PrismaService;
	private readonly productRepository: IProductRepository;
	private readonly variantRepository: ProductVariantRepository;
	private readonly cartRepository: CartRepository;

	private mainMenu!: Menu;

	constructor(
		logger: LoggerService,
		config: ConfigService,
		bot: Telegraf<MyContext>,
		prismaService: PrismaService,
		productRepository: IProductRepository,
	) {
		this.logger = logger;
		this.config = config;
		this.bot = bot;
		this.prismaService = prismaService;
		this.productRepository = productRepository;
		this.variantRepository = new ProductVariantRepository(prismaService);
		this.cartRepository = new CartRepository(prismaService);
	}

	public async init(): Promise<void> {
		await this.prismaService.connect();
		this.bot.use(session());
		const userRepository = new UserRepository(this.prismaService);
		const userService = new UserService(userRepository);
		const checkoutService = new CheckoutService(userService);
		const checkoutScene = createCheckoutScene(checkoutService);
		const stage = new Scenes.Stage<MyContext>([checkoutScene]);
		this.bot.use(stage.middleware());

		const cartService = new CartService(this.cartRepository, this.variantRepository);
		const variantMenuService = new VariantMenuService(
			cartService,
			this.variantRepository,
			userService,
			this.bot,
		);

		const productMenuService = new ProductMenuService(
			this.productRepository,
			variantMenuService,
			this.bot,
		);
		const editCartMenuService = new EditCartMenuService(
			cartService,
			this.cartRepository,
			userService,
			this.bot,
		);
		const cartMenuService = new CartMenuService(this.bot, editCartMenuService, userService);

		const productMenu = await productMenuService.build();
		const cartMenu = await cartMenuService.build();
		const cartController = new CartController(cartService, userService, cartMenu);
		const catalogController = new CatalogController(productMenu);
		const checkoutController = new CheckoutController(userService);
		this.mainMenu = createMainMenu(catalogController, cartController, checkoutController);
		this.mainMenu.register(this.bot);

		const start = new StartController(this.mainMenu, userService);

		this.bot.start((ctx) => start.handle(ctx));
		this.bot.launch();
		this.logger.log('Бот запущен');
	}
}
