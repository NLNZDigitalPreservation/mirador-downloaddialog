import { getWindowConfig } from "mirador";
import { createSelector } from "reselect";

interface PluginConfig {
  dialogOpen: boolean;
  enabled: boolean;
  maxDownloadWidth: number | null;
  includeRenderings: boolean;
}

const defaultConfig: PluginConfig = {
  // Open the download dialog
  dialogOpen: false,
  // Enable the plugin
  enabled: true,
  // Set an optional size limit
  maxDownloadWidth: null,
  // Include download links to the renderings section of the manifest
  includeRenderings: false
};

/** Selector to get the plugin config for a given window */
const getPluginConfig = createSelector([getWindowConfig], (windowConfig) => ({
  ...defaultConfig,
  ...((windowConfig.downloadDialog ?? {}) as Partial<PluginConfig>),
}));

export { getPluginConfig };
export type { PluginConfig };
