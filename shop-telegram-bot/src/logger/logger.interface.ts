import { ILogObj } from 'tslog';
import { Logger } from 'tslog';

export interface ILogger {
	logger: unknown; // Logger<ILogObj>;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
