import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
	const products = [
		{
			name: 'Acrylic Eyes',
			description: 'Acrylic eyes for toys',
			sizes: ['10mm', '12mm', '14mm'],
			colors: ['Blue', 'Green', 'Hazel'],
			prices: [5, 6.5, 8],
			currency: 'EUR',
			imageUrl: 'url1',
		},
		{
			name: 'Glass Eyes',
			description: 'Premium-quality handmade glass eyes',
			sizes: ['12mm', '14mm', '16mm'],
			colors: ['Blue', 'Green', 'Violet', 'Gray'],
			prices: [6, 7.5, 9],
			currency: 'EUR',
			imageUrl: 'url2',
		},
	];

	for (const productData of products) {
		const product = await prisma.product.create({
			data: {
				name: productData.name,
				description: productData.description,
				imageUrl: productData.imageUrl,
			},
		});

		const variants = [];

		for (let i = 0; i < productData.sizes.length; i++) {
			const size = productData.sizes[i];
			const price = productData.prices[i];
			const stock: number = 2 + i;
			for (const color of productData.colors) {
				variants.push({
					productId: product.id,
					size,
					color,
					price,
					currency: productData.currency,
					imageUrl: productData.imageUrl,
					stock,
				});
			}
		}

		await prisma.productVariant.createMany({
			data: variants,
		});
	}

	console.log(' Seed  completed.');
}

main()
	.then(() => prisma.$disconnect())
	.catch((e) => {
		console.error(e);
		prisma.$disconnect();
	});
