import { Observable } from 'rxjs';

import { AltExperienceData, AppData } from '../app-data.model';

/**
 * Contract for service that retrieves alternative experiences from various sources
 * and modifies AppData appropriately.
 */
export interface AltExperienceHandler {
	/**
	 * Clients should expect this to be called multiple times without any preceding 'getAppData'.
	 */
	cleanup(): void;

	/**
	 * @returns the alternative experience ID or nothing if the conditions do not allow for another experience.
	 */
	getExperienceId(): Observable<string | null>;

	/**
	 * NOTE: This method is not designed to be side-effect free. For the time being, this is how individual clients
	 *   modify the state of the application ex. adding stylesheets. Individual clients are expected
	 *   to clean up appropriately.
	 * @param original AppData that is made of the typical application associations.
	 * @returns the new AppData.
	 */
	getAppData(original: AppData, altExperience: AltExperienceData): AppData;
}
