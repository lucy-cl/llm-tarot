import { useContext, useEffect, useState } from "react";
import { EditorContext } from "@/components/Editor/index";

export function useCurrentEditor() {
  const editorInstance = useContext(EditorContext);
  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (editorInstance) {
      editorInstance.on('transaction', () => {
        forceUpdate({})
      })
    }
  }, [editorInstance])

    
  return {
    editor: editorInstance
  };
}