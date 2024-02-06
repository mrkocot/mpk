import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Adjust the path as necessary
import { CityDataComponent } from './city-data/city-data.component'; // Adjust the path as necessary

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'city-data', component: CityDataComponent },
  // ... other routes ...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
