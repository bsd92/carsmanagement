import { Component } from '@angular/core';
import { CarListComponent } from './car-list/car-list.component';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'Gestion des voitures';

  headerMode: 'welcome' | 'menu' = 'welcome';

  constructor(private router:Router, private authService: AuthService){
    this.router.events.pipe(
  
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
   
      // Détermine le type d'entête selon la route
      if (url === '/login' || url === '/register') {
        this.headerMode = 'welcome';
      } else {
        this.headerMode = 'menu';
      }
    });
  }

  logout() {
    // Supprimer le token JWT du localStorage ou sessionStorage
    localStorage.removeItem('accessToken'); // ou sessionStorage selon ton utilisation
    localStorage.removeItem('refreshToken');

    // Rediriger l'utilisateur vers la page de connexion après la déconnexion
    this.router.navigate(['/login']);  // Redirige vers la page de login
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
  
  get isManager(): boolean {
    return this.authService.hasRole('MANAGER');
  }
  
  get isUser(): boolean {
    return this.authService.hasRole('USER');
  }


 
}
