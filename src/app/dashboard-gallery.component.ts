import {Component, OnInit, EventEmitter, Input, Output, ViewChild, AfterViewChecked} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';

import 'rxjs/add/operator/switchMap';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-dashboard-gallery',
    templateUrl: './dashboard-gallery.component.html'
})
export class DashboardgalleryComponent implements OnInit {

    public user;

    public uploader: FileUploader = null;
    public hasBaseDropZoneOver : boolean = false;

    constructor(
        private configService : ConfigService,
        private userService : UserService,
        private apiService: ApiService,
        private domSanitizer: DomSanitizer
    ) {}

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }

    public uploadForm: FormGroup;
    public control_file: FormControl;

    ngOnInit() {
        this.control_file = new FormControl('', [Validators.required]);
        this.uploadForm = new FormGroup({
            file: this.control_file
        });

        this.user = this.userService.currentUser;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
            if (user) {
                this.uploader = new FileUploader({
                    url: `${this.configService.g()['apiUrl']}/user/${user.id}/images`,
                    headers: [{name: 'X-Auth', value: this.userService.getAccessToken()}],
                    itemAlias: 'image[]',
                    queueLimit: this.configService.g()['maxImages'] - (user.images.length > this.configService.g()['maxImages'] ? this.configService.g()['maxImages'] : user.images.length)
                });
                this.uploader.onCompleteAll = () => {
                    this.uploader.clearQueue();
                    this.userService.loadUser(this.userService.currentUser.value.id);
                };
                this.uploader.onAfterAddingFile = (file: any) => {
                    file.withCredentials = false;
                }
            }
        });
    }

    public cancelUploading() {
        this.uploader.clearQueue();
    }

    public removeImage(identity : string) {
        console.log(`data-image-identity='${identity}'`);
        $(`[data-image-identity='${identity}'] i`).hide();
        return this.apiService
            .delete(`${this.userService.currentUser}/${this.user.id}/image/${identity}`)
            .then(res => {
                this.userService.loadUser(this.user.id);
            });
    }

    percentToRotationLeft(percent : any) : any {
        return percent > 50 ? 180 : 180 * percent / 50;
    }

}