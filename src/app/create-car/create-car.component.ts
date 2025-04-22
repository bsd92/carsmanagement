import { Component, OnInit } from '@angular/core';
import { Car } from '../car';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-car',
  standalone: false,
  templateUrl: './create-car.component.html',
  styleUrl: './create-car.component.css'
})
export class CreateCarComponent  implements OnInit{

  car:Car=new Car();

  constructor(private carService:CarsService, private router:Router){

  }

  ngOnInit(): void {
    
  }

  onSubmit(){
    console.log(this.car)
    this.createCar()
  }

  createCar(){
    this.carService.addCar(this.car).subscribe(data=>{
      console.log(data)
      this.goToCarList()
    },
    error=>console.log(error))
  }
  
  goToCarList(){
    return this.router.navigate(['/cars'])
  }
}
