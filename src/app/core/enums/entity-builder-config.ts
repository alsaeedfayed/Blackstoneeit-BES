import { InjectionToken } from '@angular/core';

export enum EntityBuilderMode {
  Editable = 0,
  View = 1,
  Preview = 2
}

export interface EntityBuilderConfig {
  mode: EntityBuilderMode;
}

export const ENTITY_BUILDER_CONFIG = new InjectionToken<EntityBuilderConfig>(
  'ENTITY_BUILDER_CONFIG'
);
