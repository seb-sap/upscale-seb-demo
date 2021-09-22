import { Observable } from 'rxjs';

/** Observable constant that emits null and then completes. */
export const NULL = new Observable<null>(observer => {
	observer.next(null);
	observer.complete();
});
