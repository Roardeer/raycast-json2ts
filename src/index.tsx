import {
  Icon,
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Form,
  useNavigation,
  showToast,
  showHUD,
  popToRoot,
  showInFinder,
  closeMainWindow,
} from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "@raycast/utils";
import { resolve } from "path";
import { homedir } from "os";
import { mkdirSync, writeFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const json2ts = require('json2ts') as never;

const useJSON = () => {
  const [text, setText] = useState<string>('{}');
  useEffect(() => {
    Clipboard.readText().then(json => {
      try {
        if (!json) throw new Error("No content");
        const decoded = JSON.parse(json);
        setText(JSON.stringify(decoded, null, 2));
      } catch (error) {
        setText('{}');
      }
    });
  }, []);
  return [text];
}

interface Json2Ts {
  convert(json: string): string;
}

const initialValues = {
  rootName: 'RootObject',
};

const RenameForm: React.FC<{ tsString: string }> = (props) => {
  const [tsCode, setTSCode] = useState<string>();
  const { itemProps, handleSubmit, ...form } = useForm<typeof initialValues>({
    initialValues,
    validation: {
      rootName: v => {
        if (!v) return 'this is required.';
        if (!/^[A-Z]/.test(v)) return 'Must start with uppercase.';
      },
    },
    onSubmit: async (values) => {
      const newTsString = props.tsString.replace('export interface RootObject', `export interface ${values.rootName}`);
      setTSCode(newTsString);
      Clipboard.copy(newTsString);
    },
  });
  const handleSave = useCallback(() => {
    if (!tsCode) {
      showToast({ title: 'No code.' });
      return;
    }
    const rootName = form.values.rootName;
    const folder = resolve(homedir(), 'raycast-json2ts');
    mkdirSync(folder, { recursive: true });
    const filePath = resolve(folder, `${rootName}.ts`);
    writeFileSync(filePath, tsCode.toString());
    Clipboard.copy({ file: filePath });
    showHUD('File is save to clipboard. and copy to home dir.');
    popToRoot({ clearSearchBar: true });
    showInFinder(filePath);
  }, [tsCode, form]);
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.CopyClipboard} title="Submit" onSubmit={handleSubmit} />
          {tsCode && <Action
            icon={Icon.CopyClipboard}
            shortcut={{ modifiers: ['cmd'], key: 's' }}
            title="Save (cmd + s)"
            onAction={handleSave}
          />
          }
        </ActionPanel>
      }
    >
      <Form.TextField title="Root Name" {...itemProps.rootName} />
    </Form>
  );
}

export default function main() {
  const [code] = useJSON();
  const nav = useNavigation();
  const data = (json2ts as Json2Ts).convert(code);
  const markdown = `\
  \`\`\`typescript
  ${data || ''}
  \`\`\`
  `;
  console.log({ code, data });
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action
            icon={Icon.CopyClipboard}
            title="Copy"
            onAction={() => {
              Clipboard.copy(data);
              popToRoot({ clearSearchBar: true });
              closeMainWindow();
            }}
          />
          <Action
            icon={Icon.Pencil}
            title="Rename root and copy (cmd + r)"
            shortcut={{
              modifiers: ['cmd'],
              key: 'r'
            }}
            onAction={() => nav.push(<RenameForm tsString={data} />)}
          />
        </ActionPanel>
      }
    />
  );
}
