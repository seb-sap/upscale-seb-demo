import { Component, HostBinding, Input } from '@angular/core';
import { OneOfExperienceComponent, UpscaleComponent } from '@caas/service-client-angular';
import { AppData } from '../core/app-data.model';

@Component({
	template: '',
})
export class ComponentComponent<T extends UpscaleComponent | OneOfExperienceComponent = UpscaleComponent> {
	@Input() @HostBinding('attr.hidden') hideComponent: boolean;

	@Input() component: T;

	@Input() appData: AppData;

	@HostBinding('attr.data-component-id') get componentId(): string {
		return this.component ? this.component.id : null;
	}

	@HostBinding('attr.data-component-type') get componentType(): string {
		return this.component ? this.component.type : null;
	}
}
