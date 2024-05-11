import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="ag-overlay-loading-center">
      <div
        style="width: 100px; height: 100px; background: url(https://ag-grid.com/images/ag-grid-loading-spinner.svg) center / contain no-repeat; margin: 0 auto;"
        aria-label="loading"
      ></div>
      <div>{{ params.loadingMessage }}</div>
    </div>
  `,
})
export class LoadingComponent implements ILoadingOverlayAngularComp {
  public params!: ILoadingOverlayParams & { loadingMessage: string };

  agInit(params: ILoadingOverlayParams & { loadingMessage: string }): void {
    this.params = params;
  }
}
