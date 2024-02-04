import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  // TODO - create concrete implementation
  async accountId(): Promise<string> {
    return new Promise(() => "mock")
  }
}
