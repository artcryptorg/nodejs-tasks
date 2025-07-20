import { OrderItemEntity } from './order-item.entity';

export interface OrderEntity {
	id: number;
	userId: number;
	totalPrice: number;
	currency: string;
	status: string;
	paymentType: string;
	paymentRef: string;
	createdAt: Date;
	items?: OrderItemEntity[];
}
