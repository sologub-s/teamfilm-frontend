import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import { ApiService } from './api.service';
import { UserService } from './user.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        private apiService: ApiService,
        private userService: UserService
    ) {}

    ngOnInit () {
        this.userService.initSession();
    }

    ngOnDestroy(): void {
        /**
         * Kostyl to fix 'The selector "my-app" did not match any elements' on HMR reload
         * @see https://github.com/aspnet/JavaScriptServices/issues/643
         */
        document.body.appendChild(document.createElement('my-app'));
    }

    /*
    private installAuthority (value : any) {
        this.userService.setAuthorizedNext(true);
        localStorage.setItem('authority', JSON.stringify(value));
        this.apiService.setAccessToken(value.access_token);
    }

    private uninstallAuthority() {
        this.userService.setAuthorizedNext(false);
        localStorage.removeItem('authority');
        this.apiService.setAccessToken(null);
        this.userService.getUser().next(null);
    }
    */

}