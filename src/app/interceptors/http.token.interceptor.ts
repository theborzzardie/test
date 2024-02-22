import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root',
} )
export class HttpTokenInterceptor implements HttpInterceptor
{
  constructor ( private router: Router ) { }
  intercept (
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>>
  {
    if ( req.url.includes( 'registration' ) ) {
      return next.handle( req );
    }

    const token = 'e8310c64b6554d501c33a466490ead2f';

    const request = req.clone( {
      setHeaders: {
        Authorization: `Bearer ${ token }`,
      },
    } );

    return next.handle( request ).pipe(
      catchError( ( err ) =>
      {
        if ( err.status === 401 || err.status === 403 ) {
        }
        // const error = err.error.message || err.statusText;
        return throwError( err.error );
      } )
    );
  }
}
