import { CartItemEntity } from '../entities/cart-item.entity';

export interface ICartRepository {
	addItem(userId: number, variantId: number): Promise<void>;
	findByUser(userId: number): Promise<CartItemEntity[]>;
	delCartItem(itemId: number): Promise<{ variantId: number; quantity: number } | null>;
	findById(itemId: number): Promise<CartItemEntity | null>;
}
