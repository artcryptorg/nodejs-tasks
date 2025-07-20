import { MiddlewareFn, Telegraf } from 'telegraf';
import { Markup } from 'telegraf';
import { MyContext } from '../types/my-context';
export interface MenuCommand {
	label: string;
	handler: MiddlewareFn<MyContext>;
}

export class Menu {
	public name: string;
	public commands: MenuCommand[];

	constructor(name: string, commands: MenuCommand[]) {
		this.name = name;
		this.commands = commands;
	}

	getLabels(): string[] {
		return this.commands.map((c) => c.label);
	}

	getRows(columns = 2): string[][] {
		const rows: string[][] = [];
		for (let i = 0; i < this.commands.length; i += columns) {
			rows.push(this.commands.slice(i, i + columns).map((c) => c.label));
		}
		return rows;
	}

	getKeyboard(columns = 2): ReturnType<typeof Markup.keyboard> {
		return Markup.keyboard(this.getRows(columns)).resize().persistent();
	}

	register(bot: Telegraf<MyContext>): void {
		this.commands.forEach((cmd) => {
			bot.hears(cmd.label, cmd.handler);
		});
	}
}
