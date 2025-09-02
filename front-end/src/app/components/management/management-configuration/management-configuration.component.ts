import { NgModule, Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { MaterialModule } from 'src/app/material';
import { Testbed, TestbedSettings } from './../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'management-configuration',
  styleUrls: [ 'management-configuration.component.css' ],
  templateUrl: 'management-configuration.component.html'
})
export class ManagementConfigurationComponent implements OnChanges {
  @Input() public testbedSettings: TestbedSettings;
  @Input() public selectedTestbed: Testbed;

  @Output() public sortOrderSave: EventEmitter<number>;
  @Output() public testbedSettingsSave: EventEmitter<TestbedSettings>;

  public currentTestbedSettings: TestbedSettings;
  public sortOrder: number;

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('clear', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear.svg'));

    this.sortOrderSave = new EventEmitter<number>();
    this.testbedSettingsSave = new EventEmitter<TestbedSettings>();
  }

  public ngOnChanges(): void {
    this.currentTestbedSettings = {
      ...this.testbedSettings
    };

    if (this.currentTestbedSettings && this.currentTestbedSettings.autoRefreshInterval === 0) {
      this.currentTestbedSettings.autoRefreshInterval = null;
    }

    this.sortOrder = this.selectedTestbed.sortOrder;
  }

  public onSubmit(): void {
    if (this.currentTestbedSettings.autoRefreshInterval != null) {
      this.currentTestbedSettings.autoRefreshInterval = Math.floor(this.currentTestbedSettings.autoRefreshInterval);
    }

    this.testbedSettingsSave.emit(this.currentTestbedSettings);

    if (this.sortOrder !== this.selectedTestbed.sortOrder) {
      this.sortOrderSave.emit(this.sortOrder);
    }
  }
}

@NgModule({
  declarations: [
    ManagementConfigurationComponent
  ],
  exports: [
    ManagementConfigurationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class ManagementConfigurationModule {}
