import { Icon, List, ActionPanel, Action, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { EmptyView } from "./components";

export default function Command() {
  const { API_TOKEN } = getPreferenceValues();

  const { isLoading, data } = useFetch("https://ohdear.app/api/sites", {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  return (
    <List isLoading={isLoading}>
      <EmptyView />
      {((data as any).data || []).map((site: any) => (
        <List.Item
          key={site.id}
          icon={site.summarized_check_result === "succeeded" ? Icon.Checkmark : Icon.Circle}
          title={site.label}
          actions={
            <ActionPanel title="Oh Dear">
              <Action.OpenInBrowser url={`https://ohdear.app/sites/${site.id}/active-checks`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
