import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CarListComponent } from './car-list/car-list.component';
import { CreateCarComponent } from './create-car/create-car.component';
import { UpdateCarComponent } from './update-car/update-car.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { authGuard } from './auth.guard';
import { RoleManagementComponent } from './admin/role-management/role-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes protégées
  { path: 'profile', component: NavbarComponent, canActivate: [authGuard] },
  { path: 'create', component: CreateCarComponent, canActivate: [authGuard] },
  { path: 'update/:immatriculation', component: UpdateCarComponent, canActivate: [authGuard] },
  { path: 'cars', component: CarListComponent, canActivate: [authGuard] },
  { path: 'admin/roles', component: RoleManagementComponent, canActivate: [authGuard],data: { roles: ['ADMIN'] } },
  
  // Route 404
  { path: '**', component: PagenotfoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
