import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from '../auth/auth.guard';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

const routes: Routes = [

      {path: 'view-post', component:  PostListComponent, canActivate: [AuthGaurd]},
      {path: 'create-post', component: PostCreateComponent, canActivate: [AuthGaurd]},
      {path: 'edit-post/:postid', component:  PostCreateComponent, canActivate: [AuthGaurd]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class PostRoutingModule { }
