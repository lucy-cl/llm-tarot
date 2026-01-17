import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";

export function parseJson(json: string) {
  let result = "";
  try {
    result = JSON.parse(json);
  } catch (e) {
    console.warn("parse warn", e);
  }

  return result;
}

/**
 * 插入时间选择器
 *
 * @param editorView
 * @param datetime
 */
export function insertDatetime(editorView: EditorView, timestamp: number) {
  const { state, dispatch } = editorView;
  const schema = state.schema as Schema;

  const jsonContent = {
    type: "datetime",
    attrs: {
      timestamp: timestamp || Date.now(),
    },
  };

  const node = schema.nodeFromJSON(jsonContent);
  console.log("jsonContent", jsonContent, node);
  const tr = state.tr.replaceWith(
    state.selection.from,
    state.selection.to,
    node
  );
  dispatch(tr);
}
