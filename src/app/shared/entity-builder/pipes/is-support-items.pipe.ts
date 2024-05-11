import { Pipe, PipeTransform } from '@angular/core';
import { ControlTypeMode } from 'src/app/core/enums/control-type.enums';

@Pipe({
  name: 'isSupportItems'
})
export class IsSupportItemsPipe implements PipeTransform {

  transform(type: number): unknown {

    if (type == ControlTypeMode.Checkbox || type == ControlTypeMode.RadioButton || type == ControlTypeMode.MultipleSelect || type == ControlTypeMode.SingleSelect) {
      return true;
    }
    return false

  }

}
