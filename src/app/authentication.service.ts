import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private usernameSource = new BehaviorSubject<string | null>(null);
  currentUser$ = this.usernameSource.asObservable();

  constructor() { }

  login(username: string) {
    this.usernameSource.next(username);
  }

  logout() {
    this.usernameSource.next(null);
  }
}
