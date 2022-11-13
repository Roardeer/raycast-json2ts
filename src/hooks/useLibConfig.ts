import { useEffect, useState } from "react"
import { LocalStorage } from "@raycast/api";
import { Library } from "../types";

const useLibConfig = () => {
  const [lib, setLib] = useState<string>();
  useEffect(() => {
    LocalStorage.getItem<Library>('lib').then(lib => {
      if (!lib) return;
      setTimeout(() => {
        setLib(lib);
      });
    })
  }, []);
  return [lib];
}

export default useLibConfig;
