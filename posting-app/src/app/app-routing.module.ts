import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'posts', loadChildren: './posts/posts.module#PostsModule'},
  {path: '',redirectTo: '/home',pathMatch: 'full' },
  {path: '**', component: PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
