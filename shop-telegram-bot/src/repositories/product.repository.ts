import { PrismaService } from '../database/prisma.service';
import { ProductEntity } from '../entities/product.entity';
import { IProductRepository } from './product.repository.interface';

export class ProductRepository implements IProductRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(): Promise<ProductEntity[]> {
		const products = await this.prismaService.client.product.findMany();
		return products.map((p) => ({
			id: p.id,
			name: p.name,
			description: p.description,
			imageUrl: p.imageUrl,
			createdAt: p.createdAt,
		}));
	}

	async findById(id: number): Promise<ProductEntity | null> {
		const p = await this.prismaService.client.product.findUnique({
			where: { id },
		});

		if (!p) return null;

		return {
			id: p.id,
			name: p.name,
			description: p.description,
			imageUrl: p.imageUrl,
			createdAt: p.createdAt,
		};
	}
}
