import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from '../city';
import { DbService } from '../db.service';
import { AuthenticationService } from '../authentication.service';

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
  currentUsername: string | null = null;
  errorMessage: string = '';

  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
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
    this.authService.currentUser$.subscribe(username => {
      this.currentUsername = username;
      if (!username) {
        this.router.navigate(['/login']); // Przekierowanie do logowania, jeśli nie ma użytkownika
      }
    });
  }

  loadCities(): void {
    this.cities$ = from(this.dbService.getCities()).pipe(
      catchError(error => {
        this.errorMessage = 'Wystąpił błąd podczas ładowania miast.';
        return of([]);
      })
    );
  }

  selectCity(cityId: string): void {
    this.selectedCity$ = this.cities$.pipe(
      map(cities => cities.find(city => city.id === cityId))
    );
    
    this.selectedCityData$ = from(this.dbService.getData(cityId)).pipe(
      catchError(error => {
        this.errorMessage = 'Wystąpił błąd podczas ładowania danych miasta.';
        return of([]);
      })
    );
  }

  updateContent(paragraphId: string, newContent: string): void {
    this.selectedCity$.subscribe(city => {
      if (!city) {
        this.errorMessage = 'Nie wybrano miasta.';
        return;
      }
  
      if (this.currentUsername && city.editor === this.currentUsername) {
        this.dbService.updateParagraph(city.id, paragraphId, newContent)
          .then(() => {
            console.log('Treść zaktualizowana pomyślnie');
            // Zaktualizuj lokalne dane paragrafu
            this.selectedCityData$ = this.selectedCityData$.pipe(
              map(paragraphs => {
                const index = paragraphs.findIndex(p => p.id === paragraphId);
                if (index !== -1) {
                  paragraphs[index].body = newContent;
                }
                return paragraphs;
              })
            );
          })
          .catch(error => {
            console.error('Błąd podczas aktualizacji treści:', error);
            this.errorMessage = 'Wystąpił błąd podczas aktualizacji treści.';
          });
      } else {
        this.errorMessage = 'Nie masz uprawnień do edycji tej treści.';
      }
    });
  }
  
  
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Przekierowanie do logowania
  }
}
