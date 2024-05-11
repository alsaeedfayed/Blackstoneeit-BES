import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getIcon'
})
export class GetIconPipe implements PipeTransform {

  // extensions that have icons
  // TODO: need to be updated if new icons are added 
  icons: string[] = [
    'png', 'jpg', 'pdf', 'doc', 'txt', 'gif', 'html', 'css', 'js', 'json'
  ];

  //file icon
  boxIconsPrefix = 'bx bxs-file';

  transform(_extension: string): string {
    let extension = _extension.replace('.', '');
    if (!this.icons.includes(extension)) {

      // extensions that don't have icons 
      switch (extension) {

        //images
        case 'jpeg':
        case 'jfif':
          extension = 'image'
          break;

        //documents
        case 'docx':
        case 'xlsx':
          extension = 'doc';
          break;

        //default
        default:
          extension = 'blank';
      }
    }
    return `${this.boxIconsPrefix}-${extension}`;


  }

}
