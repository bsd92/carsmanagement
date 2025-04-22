import { Component, OnInit } from '@angular/core';
import { Car } from '../car';
import { ActivatedRoute } from '@angular/router';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-update-car',
  standalone: false,
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.css'
})
export class UpdateCarComponent implements OnInit {

  car: Car = new Car()
  immatriculation!: string
  constructor(private carService: CarsService,private route: ActivatedRoute, private router:Router) {

  }
  ngOnInit(): void {
    this.immatriculation = this.route.snapshot.params['immatriculation'];
    this.carService.getCarById(this.immatriculation).subscribe(data => {
      this.car = data
    }, error => console.log(error)
    )
  }

  onSubmit() {
    /*
    this.carService.updateCar(this.immatriculation, this.car).subscribe(data => {
      this.goToCarList()
    }, error => console.log(error)
    );
    */
    this.carService.updateCar(this.immatriculation, this.car)
    .pipe(
      tap(() => this.goToCarList()),
      catchError(error => {
        console.log(error);
        return of(null); 
      })
    )
    .subscribe();
    this.goToCarList()
  }

  goToCarList() {
    return this.router.navigate(['/cars'])
  }
}
