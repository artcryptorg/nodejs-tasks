import { Markup, Scenes } from 'telegraf';
import { MyContext } from '../types/my-context';
import { UserService } from '../bot/user.service';
import { CheckoutService } from '../bot/checkout.service';

export function createCheckoutScene(
	checkoutService: CheckoutService,
): Scenes.WizardScene<MyContext> {
	return new Scenes.WizardScene<MyContext>(
		'checkout-wizard',

		async (ctx) => {
			ctx.scene.session.myWizardSessionProp = {
				country: '',
				city: '',
				address: '',
				zipCode: '',
				name: '',
			};
			await ctx.reply('Укажите адрес доставки:');
			await ctx.reply('Укажите country:');
			return ctx.wizard.next();
		},

		async (ctx) => {
			if (!ctx.message || !('text' in ctx.message)) {
				await ctx.reply('Пожалуйста, введите страну текстом.');
				return;
			}
			ctx.scene.session.myWizardSessionProp.country = ctx.message.text.trim();
			await ctx.reply('Укажите city:');
			return ctx.wizard.next();
		},

		async (ctx) => {
			if (!ctx.message || !('text' in ctx.message)) {
				await ctx.reply('Пожалуйста, введите город текстом.');
				return;
			}
			ctx.scene.session.myWizardSessionProp.city = ctx.message.text.trim();
			await ctx.reply('Укажите address:');
			return ctx.wizard.next();
		},

		async (ctx) => {
			if (!ctx.message || !('text' in ctx.message)) {
				await ctx.reply('Пожалуйста, введите адрес текстом.');
				return;
			}
			ctx.scene.session.myWizardSessionProp.address = ctx.message.text.trim();
			await ctx.reply('Укажите zip code:');
			return ctx.wizard.next();
		},

		async (ctx) => {
			if (!ctx.message || !('text' in ctx.message)) {
				await ctx.reply('Пожалуйста, введите zip code текстом.');
				return;
			}
			ctx.scene.session.myWizardSessionProp.zipCode = ctx.message.text.trim();
			await ctx.reply('Укажите name:');
			return ctx.wizard.next();
		},

		async (ctx) => {
			if (!ctx.message || !('text' in ctx.message)) {
				await ctx.reply('Пожалуйста, введите имя текстом.');
				return;
			}
			ctx.scene.session.myWizardSessionProp.name = ctx.message.text.trim();

			const data = ctx.scene.session.myWizardSessionProp;

			await ctx.reply(
				`✅ Спасибо! Проверьте введённые данные:\n\n` +
					` Country: ${data.country}\n` +
					` City: ${data.city}\n` +
					` Address: ${data.address}\n` +
					` Zip Code: ${data.zipCode}\n` +
					` Name: ${data.name}`,
			);
			await ctx.reply(
				'Выбери',
				Markup.inlineKeyboard([
					Markup.button.callback('✅  Все верно', 'verify'),
					Markup.button.callback('✏️ Исправить', 'edit'),
				]),
			);
			return ctx.wizard.next();
		},
		async (ctx) => {
			if ('callback_query' in ctx.update && 'data' in ctx.update.callback_query) {
				const action = ctx.update.callback_query.data;

				if (action === 'edit') {
					await ctx.answerCbQuery();
					await ctx.reply('Хорошо, давайте начнём заново.\nУкажите country:');
					ctx.wizard.selectStep(1); // переходим к шагу ввода страны
					return;
				}

				if (action === 'verify') {
					const telegramId = String(ctx.from?.id);
					const data = ctx.scene.session.myWizardSessionProp;
					await checkoutService.saveUserAddress(telegramId, data);
					await ctx.answerCbQuery('Данные подтверждены.');
					await ctx.reply('Спасибо! Данные о доставке подтверждены ✅');
					ctx.session.orderData = ctx.scene.session.myWizardSessionProp;
					return ctx.scene.leave();
				}
			}

			await ctx.reply('Пожалуйста, подтвердите адресс.');
		},
	);
}
