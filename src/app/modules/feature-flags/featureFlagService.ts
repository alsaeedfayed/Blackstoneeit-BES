import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFeature } from './iFeature';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable()
export class FeatureFlagService {

    private features: Array<IFeature> = []; // A list of all features turned ON

    constructor(private http: HttpHandlerService) { }

    // This method is called once and a list of features is stored in memory
    checkAsync(featureName: string, service: string) {
        let feature = this.features.find(f => f.name == featureName)
        if (feature)
            return from([feature.enabled]);

        let url = "/FeatureManager/Check/" + featureName;
        if (service)
            url = `/${service}` + url; 

        return this.http.get(url)
            .pipe(map(res => {
                if (res === true)
                    this.features.push({ name: featureName, enabled: res } as IFeature);
                return res;
            }));
    }
} 
