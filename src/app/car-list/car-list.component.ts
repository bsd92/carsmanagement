import { Component, OnInit } from '@angular/core';
import { Car } from '../car';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-car-list',
  standalone: false,
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent implements OnInit {

  cars!:Car[]

  constructor(private carsService: CarsService, private router:Router, private authService:AuthService){}

  ngOnInit(): void {
   this.getCars()
  }
  
  getCars(){
    this.carsService.getCartList().subscribe(
      data=>{this.cars=data}
    )
  }


  updateCar(immatriculation:string ){
    this.router.navigate(['/update', immatriculation])
  }

  deleteCar(immatriculation:string){
    this.carsService.deleteCar(immatriculation).subscribe(
      data=>{
        console.log(data)
        this.getCars()
      }
    )
  }

  canUpdate(): boolean{
    return this.authService.isAdmin()  || this.authService.isManager()
  }
  canDelete():boolean{
    return this.authService.isAdmin()
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
