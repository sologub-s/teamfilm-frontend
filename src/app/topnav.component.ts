import {Component, Input, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Component({
    selector: 'my-topnav',
    templateUrl: './topnav.component.html'
})
export class TopnavComponent implements OnInit {

    constructor(
        private configService : ConfigService,
        private userService : UserService,
    ) {}

    public user : any = null;
    public smallAvatarUrl : string;

    ngOnInit() {
        this.user = this.userService.currentUser;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
            this.smallAvatarUrl = this.userService.getSmallAvatarUrl(user);
        });
    }

}