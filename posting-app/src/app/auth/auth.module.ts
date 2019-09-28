import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shareModules.mudule';
import { AuthRoutingModule } from './auth-routing.module';
@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
