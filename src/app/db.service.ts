import { Injectable } from '@angular/core';
import { City } from './city';
import { Paragraph } from './paragraph';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private pHeadRef: AngularFirestoreCollection<TechParagraphHeader>;
  private pBodyRef: AngularFirestoreCollection<TechParagraphBody>;
  private cityRef: AngularFirestoreCollection<City>;

  constructor(private db: AngularFirestore) {
    this.pHeadRef = this.db.collection('/head')
    this.pBodyRef = this.db.collection('/body')
    this.cityRef = this.db.collection('/city')
  }

  async getCities(): Promise<City[]> {
    return this.getValueFromObservable<City[]>(this.cityRef.valueChanges())
  }

  private async getHeads(): Promise<{[key in string]: string}> {
    let heads = await this.getValueFromObservable(this.pHeadRef.valueChanges());
    let ret: {[key in string]: string} = {};
    for (let h of heads) {
      ret[h.headerId] = h.name;
    }
    return ret;
  }

  private getBodyCollection(
    cityId: string,
    headerId: string | null = null,
  ): AngularFirestoreCollection<TechParagraphBody> {
    if (headerId != null) {
      return this.db.collection<TechParagraphBody>(
        '/body',
        x =>
          x.where('city', '==', cityId).where('headerId', '==', headerId)
      );
    } else {
      return this.db.collection<TechParagraphBody>(
        '/body',
        x => x.where('city', '==', cityId)
      );
    }
  }

  private async getBodies(cityId: string): Promise<{[key in string]: string}> {
    let bodies = await this.getValueFromObservable(this.getBodyCollection(cityId).valueChanges());
    let ret: {[key in string]: string} = {};
    for (let b of bodies) {
      ret[b.headerId] = b.body;
    }
    return ret;
  }

  async getData(cityId: string): Promise<Paragraph[]> {
    let heads = await this.getHeads();
    let bodies = await this.getBodies(cityId);

    return Object.keys(heads).map(hid => new Paragraph(
      hid,
      heads[hid],
      bodies[hid] ? bodies[hid] : null
    ));
  }

  async updateParagraph(cityId: string, paragraphId: string, newBody: string): Promise<void> {
    let presentHeaders = Object.keys(this.getBodies(cityId));
    let newTechBody = new TechParagraphBody(cityId, paragraphId, newBody);

    if (paragraphId in presentHeaders) {
      await this.update(newTechBody);
    } else {
      await this.create(newTechBody);
    }
    return;
  }

  private async create(body: TechParagraphBody): Promise<void> {
    let collection = this.db.collection<object>(
      '/body',
      x => x.where('city', '==', body.city)
    );
    await collection.add(body.toObject());
  }

  private async update(newBody: TechParagraphBody): Promise<void> {
    this.getBodyCollection(newBody.city, newBody.headerId)
      .get()
      .subscribe((querySnapshot) => {
        if (querySnapshot.size <= 0) console.error('Trying to update something nonexistent');
        this.pBodyRef.doc(querySnapshot.docs[0].id).update(newBody)
      });
  }

  private getValueFromObservable<T>(observable: Observable<T | undefined>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        observable
          .pipe(take(1))
          .subscribe(value => {
            if (value) resolve(value as T);
            else reject('Value is missing');
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}

class TechParagraphHeader {
  headerId: string = "";
  name: string = "";
}

class TechParagraphBody {
  constructor(city: string, headerId: string, body: string) {
    this.city = city;
    this.headerId = headerId;
    this.body = body;
  }

  city: string = "";
  headerId: string = "";
  body: string = "";

  toObject(): object {
    return {city: this.city, headerId: this.headerId, body: this.body};
  }
}
