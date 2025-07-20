export interface ProductVariantEntity {
	id: number;
	productId: number;
	size: string;
	color: string;
	price: number;
	currency: string;
	imageUrl: string;
	stock: number;
}
