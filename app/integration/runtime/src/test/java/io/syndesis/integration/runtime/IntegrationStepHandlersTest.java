/*
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.integration.runtime;

import java.util.Collections;

import io.syndesis.integration.runtime.handlers.ConnectorStepHandler;
import io.syndesis.integration.runtime.handlers.EndpointStepHandler;
import io.syndesis.integration.runtime.handlers.SimpleEndpointStepHandler;
import io.syndesis.model.action.ConnectorAction;
import io.syndesis.model.action.ConnectorDescriptor;
import io.syndesis.model.connection.Connection;
import io.syndesis.model.connection.Connector;
import io.syndesis.model.integration.Step;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class IntegrationStepHandlersTest {

    @Test
    public void testHandlerLookup() {
        IntegrationRouteBuilder builder = new IntegrationRouteBuilder("", Collections.emptyList());

        assertThat(
            builder.findHandler(
                new Step.Builder()
                    .stepKind("endpoint")
                    .action(new ConnectorAction.Builder()
                        .descriptor(new ConnectorDescriptor.Builder()
                            .componentScheme("file")
                            .build())
                        .build())
                    .connection(new Connection.Builder()
                        .connector(new Connector.Builder()
                            .build())
                        .build())
                    .build()))
            .isInstanceOf(ConnectorStepHandler.class);

        assertThat(
            builder.findHandler(
                new Step.Builder()
                    .stepKind("endpoint")
                    .action(new ConnectorAction.Builder()
                        .descriptor(new ConnectorDescriptor.Builder()
                            .build())
                        .build())
                    .connection(new Connection.Builder()
                        .connector(new Connector.Builder()
                            .componentScheme("file").build())
                        .build())
                    .build()))
            .isInstanceOf(ConnectorStepHandler.class);

        assertThat(
            builder.findHandler(
                new Step.Builder()
                    .stepKind("endpoint")
                    .action(new ConnectorAction.Builder()
                        .descriptor(new ConnectorDescriptor.Builder()
                            .componentScheme("file")
                            .build())
                        .build())
                    .build()))
            .isInstanceOf(SimpleEndpointStepHandler.class);

        assertThat(
            builder.findHandler(
                new Step.Builder()
                    .stepKind("endpoint")
                    .action(new ConnectorAction.Builder()
                        .descriptor(new ConnectorDescriptor.Builder()
                            .build())
                        .build())
                    .connection(new Connection.Builder()
                        .connector(new Connector.Builder()
                            .build())
                        .build())
                    .build()))
            .isInstanceOf(EndpointStepHandler.class);
    }
}
