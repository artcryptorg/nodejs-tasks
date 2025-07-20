import { CartRepository } from '../repositories/cart.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';

export class CartService {
	constructor(
		private readonly cartRepo: CartRepository,
		private readonly variantRepo: ProductVariantRepository,
	) {}

	public async addToCart(userId: number, variantId: number): Promise<string> {
		const variant = await this.variantRepo.findById(variantId);
		if (!variant || variant.stock <= 0) {
			return 'Данный вариант товара закончился';
		}
		console.log(`${userId}`);
		await this.cartRepo.addItem(userId, variantId);
		await this.variantRepo.decreaseStock(variantId);

		return `🧺 ${variant.color}/${variant.size} — добавлено! Осталось: ${variant.stock - 1}`;
	}

	public async showCart(userId: number): Promise<string> {
		const cartItems = await this.cartRepo.findByUser(userId);
		if (!cartItems || cartItems.length === 0) {
			return '🛒 Ваша корзина пуста';
		} else {
			let total = 0;
			const lines = cartItems.map((item) => {
				const lineTotal = item.quantity * item.variant.price;
				total += lineTotal;
				return `${item.variant.color}/${item.variant.size} — ${item.quantity} × ${item.variant.price.toFixed(2)} ${item.variant.currency} = ${lineTotal.toFixed(2)} ${item.variant.currency}`;
			});

			lines.push('----------------');
			lines.push(`Итого: ${total.toFixed(2)} ${cartItems[0].variant.currency}`);

			return lines.join('\n');
		}
	}
	public async delFromCart(itemId: number): Promise<string> {
		const deleted = await this.cartRepo.delCartItem(itemId);
		if (!deleted) {
			return ' Товар не найден в корзине.';
		}
		const variant = await this.variantRepo.findBasicById(deleted.variantId);
		if (!variant) {
			return ' Вариант товара не найден, но товар удалён из корзины.';
		}
		await this.variantRepo.increaseStock(deleted.variantId, deleted.quantity);
		return `🧺 ${variant.color}/${variant.size} — удалено ${deleted.quantity} единиц!`;
	}
}
