import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiHttpService } from '@syndesis/ui/platform';
import {
  ApiConnectors,
  ApiConnectorData, CustomConnectorRequest
} from './api-connector.models';

@Injectable()
export class ApiConnectorService {
  constructor(private apiHttpService: ApiHttpService) { }

  getCustomConnector(id: string): Observable<ApiConnectorData> {
    return this.apiHttpService
      .setEndpointUrl('selectApiConnector', { id })
      .get<ApiConnectorData>();
  }

  getCustomConnectorList(): Observable<ApiConnectors> {
    return this.apiHttpService
      .setEndpointUrl('getApiConnectorList', { template: 'swagger-connector-template' })
      .get<{ items: ApiConnectors }>() // TODO: Provide a better <T> typing here
      .map(response => response.items);
  }

  submitCustomConnectorInfo(customConnectorRequest: CustomConnectorRequest): Observable<ApiConnectorData> {
    const apiHttpService = this.apiHttpService.setEndpointUrl('submitCustomConnectorInfo');
    const { file, connectorTemplateId } = customConnectorRequest;
    if (file) {
      return apiHttpService.upload<ApiConnectorData>({
        swaggerSpecification: file
      }, {
        connectorSettings: { connectorTemplateId }
      });
    } else {
      return apiHttpService.post<ApiConnectorData>(customConnectorRequest);
    }
  }

  createCustomConnector(customConnectorRequest: CustomConnectorRequest): Observable<any> {
    const apiHttpService = this.apiHttpService.setEndpointUrl('submitCustomConnector');
    const [icon, connectorSettings] = [customConnectorRequest.file, customConnectorRequest];

    if (icon) {
      return apiHttpService.upload({ icon }, { connectorSettings });
    } else {
      return apiHttpService.post(connectorSettings);
    }
  }

  deleteCustomConnector(id: string): Observable<any> {
    return this.apiHttpService
      .setEndpointUrl('selectApiConnector', { id })
      .delete<any>();
  }
}
