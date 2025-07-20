import { Logger, ILogObj } from 'tslog';
// import { injectable } from 'inversify';
// import 'reflect-metadata';
import { ILogger } from './logger.interface';

// @injectable()
export class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		const loggerTemplate = '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}}: ';

		this.logger = new Logger({
			prettyLogTemplate: loggerTemplate,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
