import { Form, ActionPanel, Action, popToRoot, LaunchProps, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import fetch from "node-fetch";

interface SiteValues {
  url: string;
  team: string;
}

export default function Command(props: LaunchProps<{ draftValues: SiteValues }>) {
  const { API_TOKEN } = getPreferenceValues();

  const { isLoading, data } = useFetch("https://ohdear.app/api/me", {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  const { draftValues } = props;

  const [url, setUrl] = useState<string>(draftValues?.url || "");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: SiteValues) => {
              fetch("https://ohdear.app/api/sites", {
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(values),
              })
                .then((response) => response.json())
                .then((data) => {
                  showToast({
                    title: "Site is added",
                    message: `${(data as any).url} has status ${(data as any).summarized_check_result}`,
                  });
                  popToRoot();
                });
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="url" title="URL" placeholder="awesome-site.com" value={url} onChange={setUrl} />
      <Form.Dropdown id="team_id" title="Team">
        {(data as any).teams.map((team: any) => {
          return <Form.Dropdown.Item key={team.id} value={String(team.id)} title={team.name} />;
        })}
      </Form.Dropdown>
    </Form>
  );
}
