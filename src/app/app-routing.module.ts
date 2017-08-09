import { NgModule }      from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { HeroDetailComponent } from './hero-detail.component';
//import { HeroesComponent } from "./heroes.component";
//import { DashboardComponent } from "./dashboard.component";

import { DashboardmainComponent } from './dashboard-main.component';
import { DashboardavatarComponent } from './dashboard-avatar.component';
import { DashboardgalleryComponent } from './dashboard-gallery.component';
import { ProjectsComponent } from './projects.component';
import { SignComponent } from './sign.component';

const routes: Routes = [
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'my/profile',  component: DashboardmainComponent },
    { path: 'my/avatar',  component: DashboardavatarComponent },
    { path: 'my/gallery',  component: DashboardgalleryComponent },
    { path: 'my',  redirectTo: '/my/profile' },
    { path: 'projects',  component: ProjectsComponent },
    { path: 'signin',  component: SignComponent },
    { path: 'signup',     component: SignComponent },
    { path: 'resetpasswordrequest',     component: SignComponent },
    { path: 'resetpasswordverification',     component: SignComponent },
    { path: 'resetpasswordverification/:token',     component: SignComponent },
    { path: 'activation',     component: SignComponent },
    { path: 'activation/:token',     component: SignComponent }
    //{ path: 'detail/:id', component: HeroDetailComponent },
    //{ path: 'heroes',     component: HeroesComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
