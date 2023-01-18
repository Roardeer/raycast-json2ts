import {
  Icon,
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  popToRoot,
  closeMainWindow,
  openCommandPreferences,
} from "@raycast/api";
import useTsCode from "./hooks/useTsCode";
import { Library } from "./types";

const libNames = Object.entries(Library);
export default function main() {
  const [{ library, code, markdown, loading, changeLib }] = useTsCode();
  return (
    <Detail
      isLoading={loading}
      markdown={markdown}
      actions={
        <ActionPanel>
          {code && (
            <Action
              icon={Icon.CopyClipboard}
              title="Copy"
              onAction={() => {
                Clipboard.copy(code);
                popToRoot({ clearSearchBar: true });
                closeMainWindow();
              }}
            />
          )}
          {code &&
            libNames
              .filter((e) => e[1] !== library)
              .map((e) => {
                return <Action key={e[0]} icon={Icon.List} title={`use: ${e[1]}`} onAction={() => changeLib(e[1])} />;
              })}
          <Action
            icon={Icon.Gear}
            shortcut={{
              modifiers: ["cmd"],
              key: "t",
            }}
            title="Change default library. (CMD + T)"
            onAction={() => openCommandPreferences()}
          />
        </ActionPanel>
      }
    />
  );
}
