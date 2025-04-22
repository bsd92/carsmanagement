import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };
  

  availableRoles = ['USER','MANAGER', 'ADMIN'];
  availablePermissions = [
    'CAN_VIEW_CARS',
    'CAN_CREATE_CARS',
    'CAN_UPDATE_CARS',
    'CAN_DELETE_CARS'
  ];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}



  registerUser() {
    this.http.post('http://localhost:8080/garage/register', this.user).subscribe({
      next: (response) => {
        this.successMessage = (response as any).message || 'Utilisateur créé avec succès';
        this.errorMessage = null;
      },
      error: (err) => {
        this.successMessage = null;
        this.errorMessage = "Erreur lors de la création: " + (err.error?.message || err.message);
      }
    });
  }
}
