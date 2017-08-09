import {Component, Input, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Component({
    selector: 'my-topnav',
    templateUrl: './topnav.component.html'
})
export class TopnavComponent implements OnInit {

    constructor(
        private configService : ConfigService,
        private authService : AuthService,
    ) {}

    public user : any = null;
    public smallAvatarUrl : string;

    ngOnInit() {
        this.user = this.authService.user;
        this.authService.user.subscribe(user => {
            this.user = user;
            this.smallAvatarUrl = this.getSmallAvatarUrl();
        });
    }

    getSmallAvatarUrl() : string {
        if (this.user && this.user['avatar_cropped']) {
            return `${this.configService.g()['storageUrl']}${this.user['avatar_cropped'].url}`;
        }
        if (this.user && this.user['avatar']) {
            return `${this.configService.g()['storageUrl']}${this.user['avatar'].url}`;
        }
        return 'assets/images/defaultAvatar.png';
    }

}