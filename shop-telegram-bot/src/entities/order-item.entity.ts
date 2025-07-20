import { ProductVariantEntity } from './product-variant.entity';

export interface OrderItemEntity {
	id: number;
	orderId: number;
	variantId: number;
	quantity: number;
	variant?: ProductVariantEntity;
}
