import { Pipe, PipeTransform } from '@angular/core';
import { IValidation } from 'src/app/core/models/form-builder.interfaces';

@Pipe({
  name: 'getMassage'
})
export class GetMassagePipe implements PipeTransform {

  transform(controlRequired: IValidation, leng: string): any {


    if (!!controlRequired && leng == 'en') {
      return controlRequired.message
    } else if (!!controlRequired && !!controlRequired?.messageAr) {
      return controlRequired.messageAr
    }
    return null;
  }


}
