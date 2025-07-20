import { PrismaService } from '../database/prisma.service';
import { CartItemEntity } from '../entities/cart-item.entity';
import { ICartRepository } from './cart-repository.interface';

export class CartRepository implements ICartRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async addItem(userId: number, variantId: number): Promise<void> {
		const existing = await this.prismaService.client.cartItem.findFirst({
			where: { userId, variantId }, //в этом месте возможно нужно поставить id и не файндфест а уникальный поиск
		});

		if (existing) {
			await this.prismaService.client.cartItem.update({
				where: { id: existing.id },
				data: { quantity: { increment: 1 } },
			});
		} else {
			await this.prismaService.client.cartItem.create({
				data: { userId, variantId, quantity: 1 },
			});
		}
	}

	async findByUser(userId: number): Promise<CartItemEntity[]> {
		const items = await this.prismaService.client.cartItem.findMany({
			where: { userId },
			include: { variant: true },
		});

		return items.map((i) => ({
			id: i.id,
			userId: i.userId,
			variantId: i.variantId,
			quantity: i.quantity,
			variant: i.variant,
		}));
	}

	// этот метод удаляет этот вариант товара полностью из карзины
	// и вощвразает quantiy и variantId для того чтобы это количество вернуть
	// в базу обратно ProductVariant

	async delCartItem(itemId: number): Promise<{ variantId: number; quantity: number } | null> {
		const item = await this.prismaService.client.cartItem.findUnique({
			where: { id: itemId },
			select: { variantId: true, quantity: true },
		});
		if (!item) return null;
		await this.prismaService.client.cartItem.delete({
			where: { id: itemId },
		});
		return {
			variantId: item.variantId,
			quantity: item.quantity,
		};
	}

	async findById(itemId: number): Promise<CartItemEntity | null> {
		const i = await this.prismaService.client.cartItem.findUnique({
			where: { id: itemId },
			include: { variant: true },
		});
		if (!i) return null;
		return {
			id: i.id,
			userId: i.userId,
			variantId: i.variantId,
			quantity: i.quantity,
			variant: i.variant,
		};
	}
}
