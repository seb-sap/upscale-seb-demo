import { ActiveConfiguration } from "@caas/service-client-angular";
import { Observable } from "rxjs";

export abstract class PaymentConfigurationService {
    abstract getAllPaymentConfigurations(): Observable<Array<ActiveConfiguration>>;

	abstract getAlternatePaymentMethodConfig(): Observable<Array<ActiveConfiguration>>;

	abstract getGatewayConfig(): Observable<ActiveConfiguration | undefined>;

	abstract manualFetchPaymentConfigs(): Observable<Array<ActiveConfiguration>>;
}
