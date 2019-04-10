import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from '../auth/user.service';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private userListenerSubs: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.userService.getUserStatus();
    this.userListenerSubs = this.userService
    .getUserStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.userListenerSubs.unsubscribe();
  }

  onLogout() {
    this.userService.logout();
  }

}
