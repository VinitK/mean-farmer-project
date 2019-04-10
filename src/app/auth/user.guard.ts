import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    constructor(private userService: UserService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.userService.getUserStatus();
        if (!isAuth) {
            this.router.navigate(['/login']);
        }
        return isAuth;
    }
}