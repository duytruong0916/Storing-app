import { CanActivate } from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs'
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate{
  constructor(private authservice: AuthService,
              private router: Router){}
  canActivate(
   route: ActivatedRouteSnapshot,
   state: RouterStateSnapshot):
   boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean |UrlTree> {
     const isAuth = this.authservice.getIsAuthenticated();
     if(!isAuth)
     {
        this.router.navigate(['auth/sign-in']);
     }
    return isAuth;

  }

}
