import { Menu } from '../menus/replyMenuBuilder.service';
import { UserService } from '../bot/user.service';
import { MyContext } from '../types/my-context';

export class StartController {
	constructor(
		private readonly mainMenu: Menu,
		private readonly userService: UserService,
	) {}

	public async handle(ctx: MyContext): Promise<void> {
		const userId = ctx.from?.id;
		if (userId) {
			await this.userService.ensureUserExists(String(userId));
		}

		await ctx.reply('Добро пожаловать! ✨', this.mainMenu.getKeyboard());
	}
}
