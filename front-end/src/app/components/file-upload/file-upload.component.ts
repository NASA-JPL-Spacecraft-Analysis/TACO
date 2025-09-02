import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: [ 'file-upload.component.css' ]
})
export class FileUploadComponent {
  @ViewChild('fileUpload') public fileUpload: ElementRef;

  @Output() public fileOutput: EventEmitter<File>;

  public file: File;

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('clear', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear.svg'));

    this.fileOutput = new EventEmitter<File>();
  }

  public onFileUpload(fileEvent: Event): void {
    this.file = (fileEvent.target as HTMLInputElement).files[0];

    if (!this.file) {
      return;
    }

    this.fileOutput.emit(this.file);
  }

  public onChooseFile(event: Event): void {
    // Stop this button click from closing the dialog it's inside.
    event.preventDefault();

    this.fileUpload.nativeElement.value = null;
    this.fileUpload.nativeElement.click();
  }

  // Clear out the uploaded file, and also emit that we've cleared it.
  public clearFile(): void {
    this.file = null;
    this.fileUpload.nativeElement.value = null;

    this.fileOutput.emit(null);
  }
}
