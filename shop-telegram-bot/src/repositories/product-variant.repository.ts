import { PrismaService } from '../database/prisma.service';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { IProductVariantRepository } from './product-variant.repository.interface';

export class ProductVariantRepository implements IProductVariantRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findByProductId(productId: number): Promise<ProductVariantEntity[]> {
		const variants = await this.prismaService.client.productVariant.findMany({
			where: { productId },
		});

		return variants.map((v) => ({
			id: v.id,
			productId: v.productId,
			size: v.size,
			color: v.color,
			price: v.price,
			currency: v.currency,
			imageUrl: v.imageUrl,
			stock: v.stock,
		}));
	}

	async findAvailableByProductId(productId: number): Promise<ProductVariantEntity[]> {
		const variants = await this.prismaService.client.productVariant.findMany({
			where: {
				productId,
				stock: { gt: 0 },
			},
		});

		return variants.map((v) => ({
			id: v.id,
			productId: v.productId,
			size: v.size,
			color: v.color,
			price: v.price,
			currency: v.currency,
			imageUrl: v.imageUrl,
			stock: v.stock,
		}));
	}

	async findById(variantId: number): Promise<ProductVariantEntity | null> {
		const v = await this.prismaService.client.productVariant.findUnique({
			where: { id: variantId },
		});
		if (!v) return null;
		return {
			id: v.id,
			productId: v.productId,
			size: v.size,
			color: v.color,
			price: v.price,
			currency: v.currency,
			imageUrl: v.imageUrl,
			stock: v.stock,
		};
	}

	async decreaseStock(variantId: number): Promise<void> {
		await this.prismaService.client.productVariant.update({
			where: { id: variantId },
			data: {
				stock: { decrement: 1 },
			},
		});
	}

	async increaseStock(variantId: number, quantity: number): Promise<void> {
		await this.prismaService.client.productVariant.update({
			where: { id: variantId },
			data: {
				stock: { increment: quantity },
			},
		});
	}

	async findBasicById(variantId: number): Promise<{ color: string; size: string } | null> {
		const variant = await this.prismaService.client.productVariant.findUnique({
			where: { id: variantId },
			select: { color: true, size: true },
		});
		return variant;
	}
}
