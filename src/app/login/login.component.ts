import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  /*
  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.errorMessage = null;
        this.router.navigate(['/cars']); 
      },
      error: err => {
        console.error('Erreur de login:', err);
        this.errorMessage = 'Nom d’utilisateur ou mot de passe invalide';
        alert("username or password incorrect!")
      }
    });
  }
    */

  onSubmit(): void {
    // Vérifie d'abord que les champs ne sont pas vides
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
     // alert('Veuillez entrer un nom d’utilisateur et un mot de passe.');
      return;
    }
  
    // Ensuite, tente de se connecter
    
    this.authService.login(this.credentials).pipe(
      catchError((err) => {
        console.error('Erreur captée dans catchError:', err);
        this.errorMessage = 'Nom d’utilisateur ou mot de passe invalide';
        return throwError(() => err); // Repropager si besoin
      })
    ).subscribe({
      next: () => {
        this.errorMessage = null;
        this.router.navigate(['/cars']);
      }
    });
    
  }
 
}


