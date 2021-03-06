import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { RESTService } from '../entity/rest.service';
import { Integration, Integrations } from '@syndesis/ui/platform';

@Injectable()
export class IntegrationService extends RESTService<Integration, Integrations> {
  constructor(restangular: Restangular) {
    super(restangular.service('integrations'), 'integration');
  }
}
