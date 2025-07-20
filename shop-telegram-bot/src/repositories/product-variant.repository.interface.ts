import { ProductVariantEntity } from '../entities/product-variant.entity';

export interface IProductVariantRepository {
	findByProductId(id: number): Promise<ProductVariantEntity[]>;
	findAvailableByProductId(id: number): Promise<ProductVariantEntity[]>;
	findById(id: number): Promise<ProductVariantEntity | null>;
	findByProductId(id: number): Promise<ProductVariantEntity[]>;
	decreaseStock(variantId: number): Promise<void>;
	increaseStock(variantId: number, quantity: number): Promise<void>;
	findBasicById(variantId: number): Promise<{ color: string; size: string } | null>;
}
