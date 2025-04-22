import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-management',
  standalone: false,
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit{

  users: any[] = [];
  availableRoles = ['USER', 'MANAGER', 'ADMIN'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers() 
  }
  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/garage/admin/users').subscribe(data => {
      this.users = data;
    });
  }

  updateUserRoles(user: any) {
    this.http.put(`http://localhost:8080/garage/admin/users/${user.id}/roles`, user.roles).subscribe(() => {
      alert(`Rôles de ${user.username} mis à jour !`);
    });
  }

  toggleRole(user: any, role: string) {
    const index = user.roles.indexOf(role);
    if (index === -1) {
      user.roles.push(role);
    } else {
      user.roles.splice(index, 1);
    }
  }
}
