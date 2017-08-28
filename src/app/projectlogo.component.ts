import {Component, OnInit, EventEmitter, Input, Output, AfterViewChecked} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors, AbstractControl} from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from "rxjs";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-projectlogo',
    templateUrl: './projectlogo.component.html'
})
export class ProjectlogoComponent implements OnInit {

    constructor(private router: Router,
                private configService : ConfigService,
                private userService: UserService,
                private apiService: ApiService,
                private projectService: ProjectService,
                private validatorsService: ValidatorsService) {
    }

    @Input() projectId = null;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    public uploader: FileUploader = null;
    public display_mode = 'current';
    public project = new BehaviorSubject(null);
    public uploadForm: FormGroup;
    public control_file: FormControl;


    ngOnInit() {
        this.control_file = new FormControl('', [Validators.required]);
        this.uploadForm = new FormGroup({
            file: this.control_file
        });
        this.project.subscribe(project => {
            if (project) {
                this.uploader = new FileUploader({
                    url: `${this.configService.g()['apiUrl']}/project/${project.id}/logo`,
                    headers: [{name: 'X-Auth', value: this.userService.getAccessToken()}],
                    itemAlias: 'logo[]',
                    queueLimit: 1
                });
                this.uploader.onCompleteAll = () => {
                    this.uploader.clearQueue();
                    this.onSubmitEmitter.emit({action:'uploaded'});
                };
                this.uploader.onAfterAddingFile = (file: any) => {
                    file.withCredentials = false;
                }
            }
        });

        this.projectService.get(this.projectId)
            .then(res => {
                this.project.next(res.json().project);
            });
    }

    public cancelUploading() {
        this.uploader.clearQueue();
        this.display_mode = 'current';
    }

}