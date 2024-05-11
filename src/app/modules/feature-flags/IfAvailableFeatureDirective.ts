import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { FeatureFlagService } from "./featureFlagService";

@Directive({
  selector: '[ifAvailableFeature]'
})
export class IfAvailableFeatureDirective implements OnInit {
  @Input('ifAvailableFeature')
  featureName: string = "";

  @Input('service')
  type: string;

  constructor(private el: ElementRef,
    private featureFlagService: FeatureFlagService) {
  }

  ngOnInit() {
    this.featureFlagService.checkAsync(this.featureName, this.type).subscribe(res => {
      if (res)
        this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    });
  }
}