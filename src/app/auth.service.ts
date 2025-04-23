import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = 'http://localhost:8080/garage';

  constructor(private http: HttpClient, private router:Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          const accessToken = response.accessToken;
          const refreshToken = response.refreshToken;

          if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }

        })
      );
  }


  getRoles(): string[] {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || []; 
    } catch (error) {
      return [];
    }
  }

  isAdmin(): boolean {
    //return this.getRoles().includes('ADMIN');
    return this.getRoles().some(role =>
      role === 'ADMIN' || role === 'ROLE_ADMIN'
    );
  }

  isManager(): boolean {
   // return this.getRoles().includes('MANAGER');
   return this.getRoles().some(role =>
    role === 'MANAGER' || role === 'ROLE_MANAGER'
  );
  }

  isUser(): boolean {
    //return this.getRoles().includes('USER');
    return this.getRoles().some(role =>
      role === 'USER' || role === 'ROLE_USER'
    );
  }

  getUserRole(): string | null |undefined {
    if (typeof window === 'undefined' || !localStorage) return null;

    const token = localStorage.getItem('accessToken');
    if (!token) return null;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload?.roles || [];
    // On suppose qu’un seul rôle est présent
    return roles.length > 0 ? roles[0] : null;
  }
  
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>('http://localhost:8080/garage/refresh-token', {
      refreshToken: refreshToken
    });
  }

  logout(): void {
    // Deconnexion = Retirer les tokens de localStorage
    if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    }
    // Puis Redirection vers la page de login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const localStorageStr = localStorage.getItem('accessToken');
      return !!localStorageStr;
    }
    return false;
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
    }
    return null;
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      return !!token;
    }
    return false;
  }

}

  
