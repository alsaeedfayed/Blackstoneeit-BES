import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextDirectionsService {

  constructor() { }

  addDirections(text): string {
    const rtlDir = text.replace(/text-align:\s*right;/g, 'text-align: right !important; direction: rtl !important;');
    const ltrDir = rtlDir.replace(/text-align:\s*left;/g, 'text-align: left !important; direction: ltr !important;');
    const rtlDirBody = ltrDir.replace(/dir="rtl"/g, 'style="text-align: right !important; direction: rtl !important;"');
    const ltrDirBody = rtlDirBody.replace(/dir="ltr"/g, 'style="text-align: left !important; direction: ltr !important;"');
    return ltrDirBody;
  }
}
