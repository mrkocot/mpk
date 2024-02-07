import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from '../city';
import { DbService } from '../db.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.css']
})
export class CityDataComponent implements OnInit {
  cities$: Observable<City[]> = of([]);
  selectedCity$: Observable<City | undefined> = of(undefined);
  selectedCityData$: Observable<any[]> = of([]);
  editForms: Map<string, FormGroup> = new Map(); // Mapa formularzy
  userName: string | null = null;
  userProfilePic: string | null = null;
  errorMessage: string = '';
  public userEmail: string | null = null;

  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.subscribeToUser();
  }

  subscribeToUser(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userName = user.displayName;
        this.userProfilePic = user.photoURL;
        this.userEmail = user.email;
      } else {
        this.userEmail = null;
        this.router.navigate(['/login']);
      }
    });
  }

  loadCities(): void {
    this.cities$ = from(this.dbService.getCities()).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading cities.';
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
        this.errorMessage = 'Error loading city data.';
        return of([]);
      })
    );

    this.selectedCityData$.subscribe(paragraphs => {
      paragraphs.forEach(paragraph => {
        if (!this.editForms.has(paragraph.id)) {
          this.editForms.set(paragraph.id, this.fb.group({
            content: ['']
          }));
        }
      });
    });
  }

  getForm(paragraphId: string): FormGroup {
    return this.editForms.get(paragraphId) || this.fb.group({ content: [''] });
  }

  updateContent(paragraphId: string, newContent: string): void {
    if (!this.editForms.has(paragraphId)) {
      console.error('Formularz nie został znaleziony dla id:', paragraphId);
      return;
    }
  
    const form = this.editForms.get(paragraphId);
    if (form) {
      this.selectedCity$.subscribe(city => {
        if (!city) {
          this.errorMessage = 'Nie wybrano miasta.';
          return;
        }
        if (this.userEmail && city.editor === this.userEmail) {
          this.dbService.updateParagraph(city.id, paragraphId, newContent)
            .then(() => {
              console.log('Treść zaktualizowana pomyślnie');
              // Zaktualizuj treść i nagłówek paragrafu
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
  }
  
  

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
