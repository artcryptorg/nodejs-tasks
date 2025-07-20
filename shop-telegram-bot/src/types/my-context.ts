import { Context, Scenes } from 'telegraf';

export interface FullAddress {
	country: string;
	city: string;
	address: string;
	zipCode: string;
	name: string;
}

export interface MyWizardSession extends Scenes.WizardSessionData {
	myWizardSessionProp: FullAddress;
}

export interface MySession extends Scenes.WizardSession<MyWizardSession> {
	orderData?: FullAddress;
}

export interface MyContext extends Context {
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
	wizard: Scenes.WizardContextWizard<MyContext>;
}
