import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  // isLoading on/off START

  isLoading = false;
  private userStatusSub: Subscription;

  constructor( public userService: UserService ) { }

  ngOnInit() {
    this.userStatusSub = this.userService.getUserStatusListener().subscribe(
      userStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.userStatusSub.unsubscribe();
  }

  // isLoading on/off END

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // spinner
    this.isLoading = true;
    
    this.userService.login(
      form.value.userEmail, 
      form.value.userPassword
    );
  }

}
