import { Injectable } from '@angular/core';
import { City } from './city';
import { Paragraph } from './paragraph';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  // TODO - create concrete implementation
  async getCities(): Promise<City[]> {
    let mock = [
      new City("krakow", "Kraków", "PL", "albert@mpk.pl"),
      new City("frankfurt-ab-main", "Frankfurt", "DE", "admin@frgh.de"),
      new City("tokyo", "Tokyo", "JP", "karas.patryk@gmail.com"),
      new City("new-york", "New York", "US", "nyadmin@nyc.gov"),
      new City("paris", "Paris", "FR", "parisadmin@paris.fr"),
      new City("london", "London", "GB", "londonadmin@london.uk"),
      new City("sydney", "Sydney", "AU", "sydneyadmin@sydney.au"),
      new City("berlin", "Berlin", "DE", "berlinadmin@berlin.de"),
      new City("rome", "Rome", "IT", "romeadmin@rome.it")      
    ];
    return mock;
  }

  // TODO - create concrete implementation
  async getData(cityId: string): Promise<Paragraph[]> {
    let mock = [
      new Paragraph("tickets", "Tickets", "Tickets are <b>very important</b><br><i>really...</i>"),
      new Paragraph("timetables", "Schedules and timetables", "Not that important")
    ];
    return mock;
  }

  // TODO - create concrete implementation
  async updateParagraph(cityId: string, paragraphId: string, newBody: string): Promise<void> {
    return;
  }

  // TODO - create concrete implementation
  /** Returns an image path for a city relative to `src/assets/cities` */
  async getImage(cityId: string): Promise<string | null> {
    return cityId == "frankfurt-ab-main" ? "frankfurt_panorama.jpg" : null;
  }
}
