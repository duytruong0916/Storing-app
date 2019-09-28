import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { SharedModule } from '../shareModules.mudule';
import { RouterModule } from '@angular/router';
import { PostRoutingModule } from './post-routing.module';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    PostRoutingModule
  ]

})
export class PostsModule { }
