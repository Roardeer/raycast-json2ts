import { Action, ActionPanel, Form, LocalStorage, popToRoot } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { useEffect } from "react";
import { Library } from "./types";

export default () => {
  const form = useForm<{ lib: Library | string }>({
    validation: {
      lib: FormValidation.Required,
    },
    onSubmit: async (values) => {
      await LocalStorage.setItem('lib', values.lib);
      popToRoot({ clearSearchBar: true });
    },
  });
  useEffect(() => {
    LocalStorage.getItem<Library>('lib').then(lib => {
      if (!lib) return;
      setTimeout(() => {
        form.setValue('lib', lib);
      });
    })
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