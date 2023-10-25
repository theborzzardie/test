import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

    const token = '8ef8cb17043480e5b91932072f3e449e';

    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
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
