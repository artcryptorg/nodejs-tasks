import { UserEntity } from '../entities/user.entity';
import { FullAddress } from '../types/my-context';

export interface IUserRepository {
	findByTelegramId(telegramId: string): Promise<UserEntity | null>;
	create(telegramId: string): Promise<UserEntity>;
	update(userId: number, data: FullAddress): Promise<void>;
}
