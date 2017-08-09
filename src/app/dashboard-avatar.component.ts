import {Component, OnInit, EventEmitter, Input, Output, ViewChild, AfterViewChecked} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';

import 'rxjs/add/operator/switchMap';
import {CroppieOptions} from "croppie";
import {CroppieDirective} from "angular-croppie-module";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-dashboard-avatar',
    templateUrl: './dashboard-avatar.component.html'
})
export class DashboardavatarComponent implements OnInit, AfterViewChecked {

    public user;
    public smallAvatarUrl : string;
    public avatarUrl : string;

    public uploader: FileUploader = null;
    public hasBaseDropZoneOver : boolean = false;

    constructor(
        private configService : ConfigService,
        private userService : UserService,
        private apiService : ApiService
    ) {}

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }

    public croppie_mode : string = 'current';

    public croppieOptions: CroppieOptions = {
        // https://foliotek.github.io/Croppie/#documentation Options
        boundary: {
            width: $( window ).width() > 512 ? 512 : $( window ).width(),
            height: $( window ).width() > 512 ? 512 : $( window ).width(),
        },
        //customClass: 'zxc',
        viewport: { width: 128, height: 128, type: 'circle' },
        showZoomer: true,
        enableOrientation: false,
        enforceBoundary: true
    };

    public uploadForm: FormGroup;
    public control_file: FormControl;

    @ViewChild('croppie')
    public croppieDirective: CroppieDirective;

    ngOnInit() {
        this.control_file = new FormControl('', [Validators.required]);
        this.uploadForm = new FormGroup({
            file: this.control_file
        });

        this.user = this.userService.currentUser;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
            this.smallAvatarUrl = this.userService.getSmallAvatarUrl(user);
            this.avatarUrl = this.userService.getAvatarUrl(user);
            if (user) {
                this.uploader = new FileUploader({
                    url: `${this.configService.g()['apiUrl']}/user/${user.id}/avatar`,
                    headers: [{name: 'X-Auth', value: this.userService.getAccessToken()}],
                    itemAlias: 'avatar[]',
                    queueLimit: 1
                });
                this.uploader.onCompleteAll = () => {
                    this.uploader.clearQueue();
                    this.userService.loadUser(this.userService.currentUser.value.id);
                    this.croppie_mode = 'current';
                };
                this.uploader.onAfterAddingFile = (file: any) => {
                    file.withCredentials = false;
                }
            }
        });
    }

    public cancelUploading() {
        this.uploader.clearQueue();
        this.croppie_mode = 'current';
    }

    public ngAfterViewChecked() {
        // https://foliotek.github.io/Croppie/#documentation Methods
        //this.croppieDirective.croppie...
        /*
        if (this.croppie_mode == 'crop') {
            this.croppieDirective.croppie['setZoom'](0);
        }
        */
    }

    public handleUpdate(data) {
        // https://foliotek.github.io/Croppie/#documentation Events update
        //data // -> { points: number[], zoom: number }
        //console.log('croppie data', data);
    }

    public onCrop() {
        this.apiService.post(`/user/${this.userService.currentUser.value.id}/avatar/crop`, {
            crop: {
                x: this.croppieDirective.croppie['get']().points[0],
                y: this.croppieDirective.croppie['get']().points[1],
                w: this.croppieDirective.croppie['get']().points[2] - this.croppieDirective.croppie['get']().points[0],
                h: this.croppieDirective.croppie['get']().points[3] - this.croppieDirective.croppie['get']().points[1]
            }
        }).then(res => {
            this.userService.loadUser(this.userService.currentUser.value.id);
            this.croppie_mode = 'current';
        })
    }

}