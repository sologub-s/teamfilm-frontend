import {Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";

import { UserService } from './user.service';
import { ProjectService } from './project.service';

import {PaginationComponent} from "./pagination.component";
import { ProjectnewComponent } from "./projectnew.component";
import {ProjecteditComponent} from "./projectedit.component";

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

    @ViewChildren('editor')
    private editors : QueryList<ProjecteditComponent>;

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

        this.editors.changes.subscribe(value => {
            value.toArray().forEach(v => {
                v.onSubmitEmitter.subscribe(message => {
                    if(message.status == 200) {
                        this.loadProjectsList(this.criteria.value.page);
                    }
                });
            });
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