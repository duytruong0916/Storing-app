import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isToggled = false;
  isLoggedIn:boolean = false;
  public user_lastname:string;
  public authListenerSubs: Subscription;
  constructor(private authservice:AuthService) { }
  logOut(){
    this.authservice.logOut();
  }
  ngOnInit() {
    this.user_lastname = this.authservice.getUserlastname().toUpperCase();
    this.isLoggedIn = this.authservice.getIsAuthenticated();
    this.authListenerSubs = this.authservice.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    })
    this.authListenerSubs = this.authservice.getAuthNameListener().subscribe(lastname => {
      if(lastname){
      this.user_lastname = lastname.toUpperCase();
      console.log(this.user_lastname)
      }
      else
      this.user_lastname ='unknown'
    })
  }
  onToggle(){
    this.isToggled =!this.isToggled;
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
