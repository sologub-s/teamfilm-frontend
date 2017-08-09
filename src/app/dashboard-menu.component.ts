import {Component, OnInit, AfterViewChecked} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
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
        private userService : UserService
    ) {}

    public user : any = null;
    public smallAvatarUrl : string;

    ngOnInit() {
        this.user = this.userService.currentUser;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
            if (user) {
                this.smallAvatarUrl = this.userService.getSmallAvatarUrl(user);
            }
        });
    }
}