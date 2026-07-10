import { useCallback } from "react";

import {
  sessionApi,
  useClearGroupMembershipMutation,
  useDeletePermissionsGroupMutation,
  useListPermissionsGroupsQuery,
  useUpdateSettingMutation,
} from "metabase/api";
import { runRtkEndpoint } from "metabase/api/utils/run-rtk-endpoint";
import { useDispatch, useSelector } from "metabase/redux";
import { getSetting } from "metabase/selectors/settings";
import type { GroupId, GroupInfo } from "metabase-types/api";
import type { Settings } from "metabase-types/api/settings";

import { GroupMappingsWidgetView } from "./GroupMappingsWidgetView";

const EMPTY_GROUP_LIST: GroupInfo[] = [];

type GroupMappingsWidgetProps = {
  mappingSetting: string;
  [key: string]: unknown;
};

export function GroupMappingsWidget(props: GroupMappingsWidgetProps) {
  const dispatch = useDispatch();
  const [updateSetting] = useUpdateSettingMutation();
  const { data } = useListPermissionsGroupsQuery({});
  const allGroups = data ?? EMPTY_GROUP_LIST;
  const mappings = useSelector(
    (state) =>
      (getSetting(state, props.mappingSetting as keyof Settings) as
        | Record<string, GroupId[]>
        | undefined) ?? {},
  );

  const [deletePermissionsGroup] = useDeletePermissionsGroupMutation();
  const [clearGroupMembership] = useClearGroupMembershipMutation();

  const deleteGroup = useCallback(
    ({ id }: { id: GroupId }) => deletePermissionsGroup(id).unwrap(),
    [deletePermissionsGroup],
  );
  const clearGroupMember = useCallback(
    ({ id }: { id: GroupId }) => clearGroupMembership(id).unwrap(),
    [clearGroupMembership],
  );
  const handleUpdateSetting = useCallback(
    async (args: { key: string; value: Record<string, GroupId[]> }) => {
      await updateSetting(args as Parameters<typeof updateSetting>[0]).unwrap();
      // `updateSetting` invalidates session-properties, which starts a
      // refetch, but the mutation resolves as soon as the PUT lands. The
      // mappings table reads from that cache, so wait for the refetch too —
      // otherwise the just-saved mapping vanishes from the table until the
      // background refetch completes. The non-forced initiate joins the
      // already-in-flight invalidation refetch rather than issuing a second
      // request.
      await runRtkEndpoint(
        undefined,
        dispatch,
        sessionApi.endpoints.getSessionProperties,
        { forceRefetch: false },
      );
    },
    [updateSetting, dispatch],
  );

  return (
    <GroupMappingsWidgetView
      {...(props as unknown as React.ComponentProps<
        typeof GroupMappingsWidgetView
      >)}
      allGroups={allGroups}
      mappings={mappings}
      deleteGroup={deleteGroup}
      clearGroupMember={clearGroupMember}
      updateSetting={handleUpdateSetting}
    />
  );
}
