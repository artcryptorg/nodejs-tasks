import { ProductVariantEntity } from './product-variant.entity';

export interface CartItemEntity {
	id: number;
	userId: number;
	variantId: number;
	quantity: number;
	variant: ProductVariantEntity;
}
