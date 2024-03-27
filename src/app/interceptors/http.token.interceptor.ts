import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('registration')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('kplctoken') ?? '';
    const basicToken  = 'aVBXZkZTZTI2NkF2eV' + 'ZHc2xpWk45Nl8yTzVzY' + 'Tp3R3lRZEFFa3MzRm9lSk' + 'ZHU0ZZUndFMERUdGNh'

    const request = req.clone({
      setHeaders: {
        Authorization: req.url.includes('token') ? ('Basic ' + basicToken)  : `Bearer ${token}`
      },
    });


    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {

        }
        // const error = err.error.message || err.statusText;
        return throwError(err.error);
      })
    );
  }
}
