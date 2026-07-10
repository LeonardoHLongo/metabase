import type { SdkStoreState } from "embedding-sdk-bundle/store/types";
import type { State } from "metabase/redux/store";
import { createMockUser } from "metabase-types/api/mocks";

import { createMockAdminState } from "./admin";
import { createMockApiState } from "./api";
import { createMockAppState } from "./app";
import { createMockAuthState } from "./auth";
import { createMockDashboardState } from "./dashboard";
import { createMockEmbedState } from "./embed";
import { createMockEmbeddingDataPickerState } from "./embedding-data-picker";
import { createMockNormalizedEntitiesState } from "./entities";
import { createMockModalState } from "./modal";
import { createMockParametersState } from "./parameters";
import { createMockQueryBuilderState } from "./qb";
import { createMockRoutingState } from "./routing";
import { createMockSettingsState } from "./settings";
import { createMockSetupState } from "./setup";
import { createMockUploadState } from "./upload";
import { createMockVisualizerState } from "./visualizer";

export function createMockState<S extends Pick<SdkStoreState, "sdk">>(
  opts?: S,
): SdkStoreState;
export function createMockState(opts?: Partial<State>): State;
export function createMockState(opts: any) {
  const state = {
    admin: createMockAdminState(),
    app: createMockAppState(),
    auth: createMockAuthState(),
    currentUser: createMockUser(),
    dashboard: createMockDashboardState(),
    embed: createMockEmbedState(),
    embeddingDataPicker: createMockEmbeddingDataPickerState(),
    entities: createMockNormalizedEntitiesState(),
    "metabase-api": createMockApiState(),
    parameters: createMockParametersState(),
    qb: createMockQueryBuilderState(),
    routing: createMockRoutingState(),
    settings: createMockSettingsState(),
    setup: createMockSetupState(),
    upload: createMockUploadState(),
    visualizer: {
      past: [],
      present: createMockVisualizerState(),
      future: [],
    },
    modal: createMockModalState(),
    ...opts,
  };

  // There's no `settings` reducer — settings are read from the
  // `getSessionProperties` RTK Query cache with `window.MetabaseBootstrap` as
  // the fallback. Mirror the mock settings into the bootstrap so
  // `getSetting`/`getSettings` resolve them on states that never pass through
  // a render harness (pure-selector tests). jest-setup-env clears the
  // bootstrap between tests.
  //
  // Default settings only fill an *empty* bootstrap: a test that seeded the
  // bootstrap itself and then builds a settings-less mock state must not have
  // its seed clobbered by our defaults.
  const hasExplicitSettings = opts?.settings != null;
  if (
    typeof window !== "undefined" &&
    state.settings?.values &&
    (hasExplicitSettings || window.MetabaseBootstrap === undefined)
  ) {
    window.MetabaseBootstrap = state.settings.values;
  }

  return state;
}
