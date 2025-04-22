import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
}


