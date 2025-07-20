import { Context, MiddlewareFn, Telegraf } from 'telegraf';
import { Markup } from 'telegraf';
import 'reflect-metadata';

export interface InlineMenuItem<T extends Context = Context> {
	label: string;
	callback: string;
	handler: MiddlewareFn<T>;
}

export class InlineMenu<T extends Context = Context> {
	public name: string;
	public items: InlineMenuItem<T>[];

	constructor(name: string, items: InlineMenuItem<T>[]) {
		this.name = name;
		this.items = items;
	}

	getLabels(): string[] {
		return this.items.map((item) => item.label);
	}

	getRows(columns = 2): ReturnType<typeof Markup.button.callback>[][] {
		const rows: ReturnType<typeof Markup.button.callback>[][] = [];
		for (let i = 0; i < this.items.length; i += columns) {
			rows.push(
				this.items
					.slice(i, i + columns)
					.map((item) => Markup.button.callback(item.label, item.callback)),
			);
		}
		return rows;
	}

	getKeyboard(columns = 2): ReturnType<typeof Markup.inlineKeyboard> {
		return Markup.inlineKeyboard(this.getRows(columns));
	}

	register(bot: Telegraf<T>): void {
		this.items.forEach((item) => {
			bot.action(item.callback, item.handler as unknown as MiddlewareFn<Context>); // вот это вот костыль конкретный
		});
	}
}
