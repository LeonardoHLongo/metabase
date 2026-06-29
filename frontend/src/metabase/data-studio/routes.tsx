import type { Store } from "@reduxjs/toolkit";
import { IndexRoute, Route, type RouteComponent } from "react-router";

import { DependencyDiagnosticsSectionLayout } from "metabase/monitor/dependency-diagnostics/DependencyDiagnosticsSectionLayout";
import { DependencyDiagnosticsUpsellPage } from "metabase/monitor/dependency-diagnostics/DependencyDiagnosticsUpsellPage";
import {
  PLUGIN_DEPENDENCIES,
  PLUGIN_LIBRARY,
  PLUGIN_SCHEMA_VIEWER,
  PLUGIN_WORKSPACES,
} from "metabase/plugins";
import type { State } from "metabase/redux/store";
import { getDataStudioTransformRoutes } from "metabase/transforms/routes";
import * as Urls from "metabase/urls";

import { DataSectionLayout } from "./app/pages/DataSectionLayout";
import { DataStudioLayout } from "./app/pages/DataStudioLayout";
import { DependenciesSectionLayout } from "./app/pages/DependenciesSectionLayout";
import { GitSyncSectionLayout } from "./app/pages/GitSyncSectionLayout";
import { TransformsSectionLayout } from "./app/pages/TransformsSectionLayout";
import { WorkspacesSectionLayout } from "./app/pages/WorkspacesSectionLayout";
import { getDataStudioMetadataRoutes } from "./data-model/routes";
import { getDataStudioGlossaryRoutes } from "./glossary/routes";
import { GuidePage } from "./guide/pages/GuidePage/GuidePage";
import {
  DependenciesUpsellPage,
  LibraryUpsellPage,
  SchemaViewerUpsellPage,
} from "./upsells/pages";

export function getDataStudioRoutes(
  _store: Store<State>,
  CanAccessDataStudio: RouteComponent,
  CanAccessDataModel: RouteComponent,
  _CanAccessTransforms: RouteComponent,
  IsAdmin: RouteComponent,
) {
  return (
    <Route component={CanAccessDataStudio}>
      <Route path="data-studio" component={DataStudioLayout}>
        <IndexRoute
          onEnter={(_state, replace) => {
            replace(Urls.dataStudioGuide());
          }}
        />
        <Route path="guide" component={GuidePage} />
        <Route path="data" component={CanAccessDataModel}>
          <Route component={DataSectionLayout}>
            {getDataStudioMetadataRoutes(IsAdmin)}
          </Route>
        </Route>
        <Route path="transforms" component={TransformsSectionLayout}>
          {getDataStudioTransformRoutes()}
        </Route>
        <Route component={WorkspacesSectionLayout}>
          {PLUGIN_WORKSPACES.getDataStudioRoutes()}
        </Route>
        {getDataStudioGlossaryRoutes()}
        {PLUGIN_LIBRARY.isEnabled ? (
          PLUGIN_LIBRARY.getDataStudioLibraryRoutes(IsAdmin)
        ) : (
          <Route path="library" component={LibraryUpsellPage} />
        )}
        {PLUGIN_DEPENDENCIES.isEnabled ? (
          <Route path="dependencies" component={DependenciesSectionLayout}>
            {PLUGIN_DEPENDENCIES.getDataStudioDependencyRoutes()}
          </Route>
        ) : (
          <Route path="dependencies" component={DependenciesUpsellPage} />
        )}
        {PLUGIN_DEPENDENCIES.isEnabled ? (
          <Route
            path="dependency-diagnostics"
            component={DependencyDiagnosticsSectionLayout}
          >
            {PLUGIN_DEPENDENCIES.getDataStudioDependencyDiagnosticsRoutes()}
          </Route>
        ) : (
          <Route
            path="dependency-diagnostics"
            component={DependencyDiagnosticsUpsellPage}
          />
        )}
        {PLUGIN_SCHEMA_VIEWER.isEnabled ? (
          <Route path="schema-viewer">
            {PLUGIN_SCHEMA_VIEWER.getDataStudioSchemaViewerRoutes()}
          </Route>
        ) : (
          <Route path="schema-viewer" component={SchemaViewerUpsellPage} />
        )}
        <Route path="git-sync" component={GitSyncSectionLayout} />
      </Route>
    </Route>
  );
}
