import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserService } from './user.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next) {
        const userToken = this.userService.getToken();
        const userRequest = req.clone({
            headers: req.headers.set('authorization', "Bearer " + userToken)
        });
        return next.handle(userRequest);
    }
}