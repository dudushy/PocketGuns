import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  title = 'StorageService';

  constructor() {
    console.log(`[${this.title}#constructor]`);
  }

  set(varname: any, value: any, from: any) {
    console.log(`[${this.title}#set--${from}] ${varname}`, value);
    localStorage.setItem(varname, JSON.stringify(value));
  }

  get(varname: any, from: any) {
    console.log(`[${this.title}#get--${from}] ${varname}`, JSON.parse(localStorage.getItem(varname)));
    return JSON.parse(localStorage.getItem(varname));
  }

  clear() {
    console.log(`[${this.title}#clear]`);
    localStorage.clear();
  }
}
