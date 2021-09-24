import { NavigationBehaviorOptions, NavigationExtras, Router } from "@angular/router";
import { Observable } from "rxjs";

export abstract class LocaleRoutingService {
    abstract get url(): string;
    abstract get events(): Observable<Event>;
    abstract get internalRouter(): Router;
    abstract navigate(path: Array<string>, extras?: NavigationExtras): Promise<boolean>;
    abstract navigateByUrl(url: string, extras?: NavigationBehaviorOptions): Promise<boolean>;
    abstract fullRedirect(path: string): Observable<void>;
    abstract create(path: Array<any>): Observable<Array<any>>;
}
