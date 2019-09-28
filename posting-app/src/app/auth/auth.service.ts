import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {User} from '../auth/user.model';
import {environment} from "../../environments/environment.prod";
const Backend_URL = environment.apiURL + '/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userid:string;
  public isDone;
  private tokenTimer;
  private authtoken: string;
  private isAuthenticated = false;
  private lastname: string;
  authStatusListener = new Subject<boolean>();
  authNamelistener = new Subject<string>();
  user: User;
  constructor(private http: HttpClient,
              private router: Router) { }
  signUp(user:User){
    return this.http.post<{msg:string, success:Boolean}>(Backend_URL+ '/register',user)
  }
  Authenticate(userinfo): Observable<{user: any, success: boolean, token: string, msg: string, expirationTime: number }>{
    return this.http.post<{user: any, success: boolean, token: string, msg: string, expirationTime: number }>(Backend_URL+'/authenticate', userinfo);
  }
  logOut() {
    this.isAuthenticated = false;
    this.authtoken = null;
    this.user = null;
    this.userid=null;
    this.authStatusListener.next(false);
    this.authNamelistener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearUserData()
    this.router.navigate(['/home'])

  }
  setUserId(id:string){
    this.userid = id;
  }
  getUserId(){
    return this.userid;
  }
  getToken() {
    return this.authtoken;
  }
  setIsAuthenticated(params){
    this.isAuthenticated = params;
  }
  setLastname(params){
    this.lastname = params;
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getUserlastname() {
    if (!this.lastname) {
      return 'Unknown';
    }
    return this.lastname;
  }
  getAuthNameListener(){
    return this.authNamelistener.asObservable();
  }
  storeUserData(token: string, expirationTime: Date, lastname: string, userid:string) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('userid', userid);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('expiration', expirationTime.toISOString());
    this.authtoken = token;
  }
  clearUserData() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userid');
    localStorage.removeItem('lastname');
  }
  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiredIn = authInfo.expirationDate.getTime() - now.getTime();
    //console.log(expiredIn)
    if (expiredIn > 0) {
      this.lastname = authInfo.lastname;
      this.authtoken = authInfo.token;
      this.userid = authInfo.userid;
      this.setAuthTimer(expiredIn / 1000);
      this.authStatusListener.next(true);
      this.authNamelistener.next(this.lastname);
      this.isAuthenticated = true;
    }
  }
  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000)
  }
  getAuthData() {
    const lastname = localStorage.getItem('lastname');
    const token = localStorage.getItem('id_token');
    const userid = localStorage.getItem('userid');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate || !lastname||!userid) {
      return;
    }
    return {
      lastname: lastname,
      token: token,
      userid:userid,
      expirationDate: new Date(expirationDate)
    };
  }
}
