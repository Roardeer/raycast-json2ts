import { Action, ActionPanel, Form, popToRoot, showHUD } from "@raycast/api";
import { FormValidation, useCachedState, useForm } from "@raycast/utils";
import { useEffect } from "react";
import { Library } from "./types";

export default () => {
  const [lib, setLib] = useCachedState<string>('lib');
  const form = useForm<{ lib: Library | string }>({
    initialValues: {
      lib: Library.JSON_TS,
    },
    validation: {
      lib: FormValidation.Required,
    },
    onSubmit: async (values) => {
      // await LocalStorage.setItem('lib', values.lib);
      setLib(values.lib);
      popToRoot({ clearSearchBar: true });
      showHUD(`use convertor: ${values.lib}`);
    },
  });
  useEffect(() => {
    if (!lib) return;
    setTimeout(() => {
      form.setValue('lib', lib);
    }, 300);
  }, []);
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={form.handleSubmit} title='Save' />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        key='lib'
        title='Convert library'
        {...form.itemProps.lib}
      >
        <Form.Dropdown.Item title="json2ts" value={Library.JSON_2_TS} />
        <Form.Dropdown.Item title="json-ts" value={Library.JSON_TS} />
        <Form.Dropdown.Item title="json2ts.com API" value={Library.JSON2TS_COM_API} />
      </Form.Dropdown>
    </Form>
  );
}