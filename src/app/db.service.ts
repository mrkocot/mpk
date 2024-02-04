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
      new City("krakow", "PL", "Kraków", "albert@mpk.pl"),
      new City("frankfurt-ab-main", "DE", "Frankfurt", "admin@frgh.de"),
      new City("tokyo", "JP", "Tokyo", "blob@glon.jp"),
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
