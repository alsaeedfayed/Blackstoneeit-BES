import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { IAttachmentFile } from './iAttachmentFile';

@Component({
  selector: 'uploaded-attachments-files',
  templateUrl: './uploaded-attachments-files.component.html',
  styleUrls: ['./uploaded-attachments-files.component.scss'],
})
export class UploadedAttachmentsFilesComponent implements OnInit {

  @Input() files: any = [];
  @Input() maxSize?: number;
  @Input() supportedTypes?: string;
  @Input() showHint?: boolean = true;
  @Input() canDeleted?: boolean = true;
  @Input() old?: boolean = false;
  @Input() isRequired?: boolean = false;

  @Output() deleteFile = new EventEmitter();

  deletingFileIndex: number;
  downloadingFileIndex: number;

  constructor(private attachmentService: AtachmentService) { }

  ngOnInit(): void { }

  onDeleteFile(fileIndex: number) {
    this.deleteFile.emit(fileIndex);
  }

  onViewLocalFile(uploadedFile: IAttachmentFile, index: number) {
    this.downloadingFileIndex = index;
    let fileName = '';

    // preview new file
    if (!!uploadedFile.size) {
      fileName = uploadedFile.name;
      const downloadFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const link = document.createElement("a");
          link.href = e.target.result.toString();
          link.download = fileName;
          link.click();
          link.remove();
          this.downloadingFileIndex = null;
        }
      };
      downloadFile(uploadedFile.file);

      // preview old file
    } else {
      fileName = uploadedFile.fileName;
      this.attachmentService.getAttachmentURLs(fileName)
        .pipe(finalize(() => { this.files[index].isLoading = false; this.downloadingFileIndex = null }))
        .subscribe(r => {
          window.location.href = r[0].fileUrl;
        })
    }
  }
}
