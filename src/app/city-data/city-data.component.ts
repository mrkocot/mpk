import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from '../city';
import { DbService } from '../db.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Import AngularFireAuth

@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.css']
})
export class CityDataComponent implements OnInit {
  cities$: Observable<City[]> = of([]);
  selectedCity$: Observable<City | undefined> = of(undefined);
  selectedCityData$: Observable<any[]> = of([]);
  editForm: FormGroup;
  userName: string | null = null;
  userProfilePic: string | null = null;
  errorMessage: string = '';
  public userEmail: string | null = null;


  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    public afAuth: AngularFireAuth, // Inject AngularFireAuth
    private router: Router
  ) {
    this.editForm = this.fb.group({
      content: ['']
    });
  }

  ngOnInit(): void {
    this.loadCities();
    this.subscribeToUser();
  }

  subscribeToUser(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // If user is logged in, set userName and userProfilePic
        this.userName = user.displayName;
        this.userProfilePic = user.photoURL;
        this.userEmail = user.email; // Storing user's email for authorization checks
      } else {
        // If user is not logged in, redirect to login page
        this.userEmail = null;
        this.router.navigate(['/login']);
      }
    });
  }

  loadCities(): void {
    // Loads cities from the database
    this.cities$ = from(this.dbService.getCities()).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading cities.';
        return of([]);
      })
    );
  }

  selectCity(cityId: string): void {
    // Selects a city and loads its data
    this.selectedCity$ = this.cities$.pipe(
      map(cities => cities.find(city => city.id === cityId))
    );
    
    this.selectedCityData$ = from(this.dbService.getData(cityId)).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading city data.';
        return of([]);
      })
    );
  }

  updateContent(paragraphId: string, newContent: string): void {
    // Updates content for a selected city's paragraph
    // Implementation depends on your dbService's methods
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Redirect to login on logout
    });
  }
}
