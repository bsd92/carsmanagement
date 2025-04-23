import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject:  BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    let clonedRequest = req;
    if (token) {
      clonedRequest = this.addTokenHeader(req, token);
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        /*
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        */
        if (error.status === 401) {
            const refreshToken = this.authService.getRefreshToken();
            if (refreshToken) {
              return this.handle401Error(req, next);
            } 
        }
          
        // Aucun refreshToken => probablement une vraie erreur de login
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // reset avant nouveau token

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          const newAccessToken = response.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addTokenHeader(req, newAccessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // On attend que le refresh en cours se termine
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addTokenHeader(req, token!)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}

