import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Action,
         Connection,
         Activity,
         Integration,
         IntegrationDeployment,
         IntegrationDeployments,
         IntegrationSupportService,
         ApiHttpService } from '@syndesis/ui/platform';

import { EventsService } from '@syndesis/ui/store';
import { integrationSupportEndpoints } from './integration-support.api';
import { RequestMethod, ResponseContentType } from '@angular/http';

@Injectable()
export class IntegrationSupportProviderService extends IntegrationSupportService {

  constructor(private apiHttpService: ApiHttpService, private eventsService: EventsService) {
    super();
  }

  getFilterOptions(dataShape: any): Observable<any> {
    return this.apiHttpService.post(integrationSupportEndpoints.filterOptions, dataShape);
  }

  getHistory(id: string): Observable<any> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.history, { id }).get();
  }

  getDeployments(id: string): Observable<IntegrationDeployments> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.deployments, { id }).get();
  }

  watchDeployments(id: string): Observable<any> {
    return Observable.merge(
      this.getDeployments(id),
      this.eventsService.changeEvents
        .filter(event => event.kind === 'integration-deployment')
        // TODO it would obviously be better to just fetch one, not all of 'em
        .flatMap(event => this.getDeployments(id)));
  }

  getDeployment(id: string, version: string): Observable<IntegrationDeployment> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.deployment, { id, version }).get();
  }

  requestPom(integration: Integration): Observable<any> {
    return this.apiHttpService.post(integrationSupportEndpoints.pom, integration);
  }

  fetchMetadata(
    connection: Connection,
    action: Action,
    configuredProperties: any
  ): Observable<any> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.metadata, {
      connectionId: connection.id,
      actionId: action.id
    }).post(configuredProperties);
  }

  requestJavaInspection(
    connectorId: String,
    type: String
  ): Observable<Response> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.javaInspection, { connectorId, type }).get();
  }

  exportIntegration(...ids: string[]): Observable<Blob> {
    const url = integrationSupportEndpoints.export + '?' + ids.map(id => 'id=' + id).join('&');
    return this.apiHttpService.get<Blob>(url, { responseType: 'blob' });
  }

  importIntegrationURL(): string {
    return this.apiHttpService.getEndpointUrl(integrationSupportEndpoints.import);
  }

  requestIntegrationActivityFeatureEnabled(): Observable<boolean> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.activityFeature).get().map(res => {
      return res['enabled'];
    });
  }

  requestIntegrationActivity(id: string): Observable<Activity[]> {
    return this.apiHttpService.setEndpointUrl(integrationSupportEndpoints.activity, {
      integrationId: id,
    }).get().map(res => {
      const transactions = res as Activity[];
      return transactions;
    });
  }

  downloadSupportData(data: Array<any>): Observable<Blob>  {
    const url = integrationSupportEndpoints.supportData;
    return this.apiHttpService.setEndpointUrl(url).post<Blob>(data,  {responseType : 'blob'} );
  }

}
