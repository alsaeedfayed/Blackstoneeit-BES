import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/core/models/Configuration';

@Injectable({
  providedIn: 'root'
})
export class SharedDateServiceService {
 Date:Configuration[]=[];
  constructor() { }
}
