import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { filter } from 'rxjs/operators';
import 'rxjs/add/operator/do';

import { RoutingConsts } from "../enums/routing-consts.enum";
import { Router, NavigationError, NavigationStart } from '@angular/router';
import { Utils } from '../utils';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let isNavigationStart = false;
    let sub = this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(e => isNavigationStart = true);
    return next.handle(req).do(
      (event: HttpEvent<any>) => {
        return next.handle(req);
      },
      (error: any) => {
        if (isNavigationStart)
          return next.handle(req);

        let httpErrors = [
          { error: 404, route: RoutingConsts.pageNotFound },
          { error: 500, route: RoutingConsts.internalServerError }
        ];

        let httpError = Utils.Array.WhereFirst(httpErrors, he => he.error == error.status);
        if (!Utils.IsNullOrUndefined(httpError)) {
          this._router.navigateByUrl(httpError.route);
          return Promise.reject(null);
        }
        else
          return next.handle(req);
      },
      () => { sub.unsubscribe(); }
    );
  }
}
