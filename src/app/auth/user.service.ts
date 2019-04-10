import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from './user.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl+'/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private userId: string;
  private userStatusListener = new Subject<boolean>();
  private userIsAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  // creating function to get private token
  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserStatus() {
    return this.userIsAuthenticated;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  addUser(userName: string, userCountry: string, userLanguage: string, userEmail: string, userPassword: string) {
    const user: User = { 
      userId: null, 
      userName: userName, 
      userCountry: userCountry, 
      userLanguage: userLanguage, 
      userEmail: userEmail, 
      userPassword: userPassword 
    };
    this.http
    .post<{ message:string, user: User }>(BACKEND_URL+'signup', user)
    .subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      this.userStatusListener.next(false);
    });
  }

  login( userEmail: string, userPassword: string ) {
    const user: User = { userId: null, userName: null, userCountry: null, userLanguage: null, userEmail: userEmail, userPassword: userPassword };
    this.http
    .post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL+'login', user)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.userIsAuthenticated = true;
        this.userId = response.userId;
        this.userStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
        const userId = response.userId;
        this.saveUserData(token, expirationDate, userId);
        this.router.navigate(["/farmers"]);
      }
    }, error => {
      this.userStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const userInformation = this.getUserData();
    if (!userInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = userInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {

      this.userId = userInformation.userId;
      this.token = userInformation.token;
      
      this.userIsAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.userStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userIsAuthenticated = false;
    this.userStatusListener.next(false);
    // Clears token timeout because being logged out manually
    clearTimeout(this.tokenTimer);
    this.clearUserData();
    this.userId = null; // set null when logging out
    this.router.navigate(["/user/login"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveUserData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getUserData() {
    
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
