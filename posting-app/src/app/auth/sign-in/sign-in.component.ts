import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService} from "angular2-flash-messages";
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public isInvalid:boolean = false;
  public isLoading:boolean = false;
  public form:FormGroup;
  constructor(private authservice: AuthService,
              private router: Router,
              private flashmessage: FlashMessagesService) { }
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.required] }),
      firstname: new FormControl(null, { validators: [] }),
      lastname: new FormControl(null, { validators: [] })
    })
  }
  onloginHandler() {
    if(this.form.invalid)
    {
      return;
    }
    let user = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authservice.Authenticate(user).subscribe(data => {
      if (data.success) {
       // console.log(data.msg);
       // console.log(data);
        const token = data.token;
        const lastname = data.user.lastname;
        const userid =data.user.userid
        if(token)
        {
          this.authservice.authStatusListener.next(true);
          this.authservice.authNamelistener.next(lastname);
          this.authservice.setLastname(lastname);
          this.authservice.setIsAuthenticated(true);
          this.authservice.setUserId(userid);
        }
        const expirationTime = data.expirationTime;
        this.authservice.setAuthTimer(expirationTime);
        const NOW = new Date();
        const expirationDate = new Date(NOW.getTime() + expirationTime * 1000);
        this.authservice.storeUserData(token, expirationDate, lastname, userid);
        this.router.navigate(['posts/create-post'])
      } else {
        this.isInvalid = true;
        let myVar = setTimeout(()=>{
           this.isInvalid = false;
           clearTimeout(myVar);
          }, 1500);
       // console.log(data.msg);
      }
    })

  }
}
