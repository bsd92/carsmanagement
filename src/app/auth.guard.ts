import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService); // Injecter le service d'authentification
  const router = inject(Router); // Injecter le router pour rediriger en cas de non-authentification
  
  // Vérifie si l'utilisateur est authentifié
  if (authService.isAuthenticated()) {
    return true;  // Autorise l'accès à la route
  } else {
    router.navigate(['/login']);  // Redirige vers la page de login
    return false;  // Bloque l'accès à la route
  }
};
