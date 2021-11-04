import { CustomComponentFormStatusEventStatus } from "@caas/service-client-angular";

/** Event passed from custom component to application */
export interface OutputEvent {
	type: string;
	data: {[k: string]: any};
}

export interface InitializedEvent extends OutputEvent {
	type: 'initialized';
	data: any;
}

export interface SizeEvent extends OutputEvent {
	type: 'sizeChange';
	data: {
		height: number;
	};
}

export interface FormStatus extends OutputEvent {
	type: 'formStatus';
	status: CustomComponentFormStatusEventStatus; // INVALID
}
