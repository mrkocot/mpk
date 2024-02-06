import { Component } from '@angular/core';
import { LoginService } from '../login.service'; // Updated import
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
  <div *ngIf="!loggedIn" class="login-container">
    <img src="assets/bus.png" alt="Bus Image" class="bus-image">
    <div *ngIf="!loggedIn" class="login-form">
      <button class="login-btn" (click)="login()">Zaloguj z Google</button>
    </div>
  </div>`,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loggedIn: boolean = false;

  constructor(
    private loginService: LoginService, // Updated to use LoginService
    private router: Router
  ) { }

  login() {
    // Initiates Google Authentication
    this.loginService.GoogleAuth().then(() => {
      this.loggedIn = true; // Update loggedIn status based on auth state
      // Navigate to CityDataComponent or other component as necessary
      this.router.navigate(['/city-data']);
    }).catch((error) => {
      console.error('Login failed:', error);
    });
  }
}
