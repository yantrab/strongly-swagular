import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class InterceptorsService implements HttpInterceptor {
  constructor(
    private router: Router //, private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.handleError(error, request)));
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>): Observable<any> {
    if (error.status === 401) {
      console.log(request.url);
      if (!request.url.endsWith('/auth/login')) {
        this.router.navigate(['auth/login']);
        return new Observable<any>();
      } else throw error;
    }
    // this.snackBar.open(error.message, '', { duration: 5000 });
    alert(error.error?.message);
    throw error;
    return new Observable<any>();
  }
}
