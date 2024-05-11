import {Directive, Input, Output, EventEmitter} from '@angular/core';
import {RouterLinkActive, Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[isActiveRoute]'
})

export class IsActiveRoute {
  @Input('isActiveRoute') reference: RouterLinkActive;
  @Output('isActiveRouteEmitter') isActiveEmitter: EventEmitter<RouterLinkActive> = new EventEmitter<RouterLinkActive>();
  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // this.update();
      }
    });
  }

  // ngAfterContentInit(): void {
  //   this.update();
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // private update(): void {
  //   Promise.resolve().then(() => {
  //     if (this.reference.isActiveChange) {
  //       this.isActiveEmitter.emit(this.reference);
  //     }
  //   });
  // }
}