import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { City } from '../city';

@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.css']
})
export class CityDataComponent implements OnInit {
  cities$: Observable<City[]> = of([]);
  selectedCity$: Observable<City | undefined> = of(undefined);
  editForm: FormGroup;
  user$: Observable<any>;
  errorMessage: string = '';

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      content: ['']
    });
    this.user$ = user(auth);
  }

  ngOnInit(): void {
    const citiesCollection = collection(this.firestore, 'cities');
    this.cities$ = collectionData(citiesCollection, { idField: 'id' })
      .pipe(
        map((data: any[]) => {
          // Mapowanie danych z Firestore na obiekty City
          return data.map(item => ({
            id: item.id,
            name: item.name,
            country: item.country,
            editor: item.editor
          }));
        }),
        catchError(error => {
          console.error('Error loading cities:', error);
          this.errorMessage = 'Wystąpił błąd podczas ładowania miast.';
          return of([]);
        })
      ) as Observable<City[]>;
  }

  selectCity(cityId: string) {
    const cityDocRef = doc(this.firestore, `cities/${cityId}`);
    this.selectedCity$ = docData(cityDocRef, { idField: 'id' })
      .pipe(
        map((data: any) => {
          if (!data) {
            return undefined; // Jeśli dane są undefined, zwróć undefined
          }

          // Przekształć dane z Firestore na obiekt City
          return {
            id: data.id,
            name: data.name,
            country: data.country,
            editor: data.editor
          };
        }),
        catchError(error => {
          console.error('Error loading city details:', error);
          this.errorMessage = 'Wystąpił błąd podczas ładowania szczegółów miasta.';
          return of(undefined);
        })
      ) as Observable<City | undefined>;
  }

  async updateContent(city: City) {
    if (!city.id) return;
    const cityDocRef = doc(this.firestore, `cities/${city.id}`);
    this.user$.pipe(
      switchMap(async (currentUser) => {
        if (currentUser && currentUser.email === city.editor) {
          try {
            await updateDoc(cityDocRef, {
              content: this.editForm.value.content
            });
            console.log('Content updated successfully');
          } catch (error) {
            console.error('Error updating content:', error);
            this.errorMessage = 'Wystąpił błąd podczas aktualizacji treści.';
          }
        }
      }),
      catchError(error => {
        console.error('Error updating content:', error);
        this.errorMessage = 'Wystąpił błąd podczas aktualizacji treści.';
        return of(undefined);
      })
    ).subscribe();
  }
}
