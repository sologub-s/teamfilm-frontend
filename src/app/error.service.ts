import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ErrorService {

    public handleError (...theArgs : any[]) {
        console.error('ERROR SERVICE:', theArgs);
    }
}