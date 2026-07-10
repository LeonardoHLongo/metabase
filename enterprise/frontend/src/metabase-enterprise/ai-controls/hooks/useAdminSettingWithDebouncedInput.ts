import { useDebouncedCallback } from "@mantine/hooks";
import { useCallback } from "react";
import { c } from "ttag";

import { useAdminSetting } from "metabase/api/utils";
import { useMetadataToasts } from "metabase/metadata/hooks";
import type {
  EnterpriseSettingKey,
  EnterpriseSettingValue,
} from "metabase-types/api";

import { useHydratedInput } from "./useHydratedInput";

export const SAVE_DEBOUNCE_MS = 500;

export function useAdminSettingWithDebouncedInput<T>(
  settingName: EnterpriseSettingKey,
  defaultValue: T | null = null,
) {
  const {
    value: settingValue,
    isLoading,
    updateSetting,
  } = useAdminSetting(settingName);
  const { sendErrorToast } = useMetadataToasts();

  const { inputValue, setInputValueFromUser } = useHydratedInput<T>({
    value: (settingValue || defaultValue) as T,
    isLoading,
  });

  const debouncedSaveSetting = useDebouncedCallback(async (value: T) => {
    const response = await updateSetting({
      key: settingName,
      value: value as EnterpriseSettingValue<typeof settingName>,
      toast: false,
    });
    if (response.error) {
      sendErrorToast(
        c("{0} is the setting name")
          .t`Failed to update setting: ${settingName}`,
      );
    }
  }, SAVE_DEBOUNCE_MS);

  const handleInputChange = useCallback(
    (newValue: T) => {
      setInputValueFromUser(newValue);
      debouncedSaveSetting(newValue);
    },
    [setInputValueFromUser, debouncedSaveSetting],
  );

  return {
    inputValue,
    handleInputChange,
  };
}
