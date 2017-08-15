import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute }   from '@angular/router';

import { SigninformComponent } from './signinform.component';
import { SignupformComponent } from './signupform.component';
import { ActivationformComponent } from './activationform.component';
import { ResetpasswordrequestformComponent } from "./resetpasswordrequestform.component";
import { ResetpasswordverificationformComponent } from "./resetpasswordverificationform.component";
import { ProjectnewComponent } from "./projectnew.component";

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import {BehaviorSubject} from "rxjs";
import {PaginationComponent} from "./pagination.component";

@Component({
    selector: 'my-dashboard-projects',
    templateUrl: './dashboard-projects.component.html'
})
export class DashboardprojectsComponent implements OnInit, AfterViewInit {

    public user;
    public projects = [];
    public openEditors = [];
    public criteria = new BehaviorSubject(null);
    public pagesArray = [];

    @ViewChild(ProjectnewComponent)
    private projectnewComponent: ProjectnewComponent;

    @ViewChild(PaginationComponent)
    private paginationComponent: PaginationComponent;

    constructor(
        private userService : UserService,
        private projectService : ProjectService,
    ) { }

    ngOnInit() {
        this.user = this.userService.currentUser;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
            if (user) {
                this.loadProjectsList();
            }
        });
        this.criteria.subscribe(criteria => {
            if(criteria) {
                this.pagesArray = Array(criteria.totalPages).fill(0);
            }
        });
    }

    ngAfterViewInit() {
        console.log('afterViewInit');
        this.userService.currentUser.subscribe(user => {
            if(user) {
                setTimeout(() => {
                    this.projectnewComponent.onSubmitEmitter.subscribe((message) => {
                        if (message.status == '200') {
                            this.loadProjectsList();
                        }
                    });
                    this.paginationComponent.onActionEmitter.subscribe((message) => {
                        if (message.hasOwnProperty('page')) {
                            this.loadProjectsList(message.page);
                        }
                    });
                }, 0);
            }
        });
    }

    loadProjectsList(page : string = '1') : void {
        this.projectService.list(this.user.id, page)
            .then(res => {
                this.projects = res.json().projects;
                this.criteria.next(res.json().criteria);
            });
    }
}