import { animate, state, style, transition, trigger } from "@angular/animations";



export const openCloseScaleAnimation = trigger(
  'openCloseScaleAnimation', [
    state('closed', style({ transform: 'scaley(1)', transformOrigin: 'top', height: '0', opacity: 0 })),
    state('open', style({ transform: 'scaley(1)', transformOrigin: 'top', height: '*', opacity: 1 })),
    transition('closed => open', animate('300ms ease-in')),
    transition('open => closed', animate('300ms ease-out'))
  ]
)

