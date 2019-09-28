import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from '../auth/auth.guard';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
const auth_routes: Routes = [
  {path: 'sign-up', component:  SignUpComponent},
  {path: 'sign-in', component:  SignInComponent}
];

@NgModule({
  imports: [RouterModule.forChild(auth_routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AuthRoutingModule { }
