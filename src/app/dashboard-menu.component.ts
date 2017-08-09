import {Component, OnInit, AfterViewChecked} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ValidatorsService } from './validators.service';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-dashboard-menu',
    templateUrl: './dashboard-menu.component.html'
})
export class DashboardmenuComponent implements OnInit {

    constructor(
        private configService : ConfigService,
        private authService : AuthService
    ) {}

    public user : any = null;
    public smallAvatarUrl : string;

    ngOnInit() {
        this.user = this.authService.user;
        this.authService.user.subscribe(user => {
            this.user = user;
            if (user) {
                this.smallAvatarUrl = this.getSmallAvatarUrl();
            }
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