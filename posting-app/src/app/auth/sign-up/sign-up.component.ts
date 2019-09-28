import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public message:string;
  public form: FormGroup;
  public isCreated: boolean = true;
  public NotMatched:boolean = false;
  isLoading: boolean = false;
  constructor(private authservice: AuthService,
              private route: Router) { }
  onSignUp() {
    if(this.form.get('password').value!==this.form.get('password_confirm').value)
    {
      this.NotMatched = true;
      let myVar = setTimeout(()=>{
         this.NotMatched = false;
         clearTimeout(myVar);
        }, 1500);
        this.form.patchValue({password: null, password_confirm: null});
        return;
    }
    const user: User = {
      firstname: this.form.get('firstname').value,
      lastname: this.form.get('lastname').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.authservice.signUp(user).subscribe(response => {
      if (response.success) {
        console.log(response.msg);
        this.route.navigate(['sign-in'])

      }else{
        this.message= response.msg;
        this.isCreated=false;
        let myVar = setTimeout(()=>{
          this.isCreated = true;
          clearTimeout(myVar);
         }, 1500)
      }
    })

  }
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, myValidation] }),
      password: new FormControl(null, { validators: [Validators.required] }),
      password_confirm: new FormControl(null, { validators: [Validators.required] }),
      firstname: new FormControl(null, { validators: [] }),
      lastname: new FormControl(null, { validators: [] })
    })
  }
}

/* custom vlidator */
function myValidation(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = re.test(String(email).toLowerCase());
  if (result === true) {
    return null;
  }
  else {
    return { 'myValidation': true };
  }
}
