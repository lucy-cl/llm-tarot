import { useEffect, useMemo, useRef, useState } from "react";
import { inputRules, InputRule } from "prosemirror-inputrules";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, NodeSpec } from "prosemirror-model";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { history, undo, redo } from "prosemirror-history";
import { toggleMark } from "prosemirror-commands";
import Toolbar from "./components/Toolbar";
import { useToast } from "@/utils/hooks/use-toast";
import { defaultSchema } from "./mockSchema";
import "prosemirror-view/style/prosemirror.css";
import "./index.css";

// 创建 schema
const mySchema = new Schema(defaultSchema);
interface EditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
  content?: string;
  selectedDate?: string;
}

const Editor = ({ onChange, content, selectedDate }: EditorProps) => {
  const elContentRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView>();
  const { toast } = useToast();

  useEffect(() => {
    if (!elContentRef.current) return;
    editorViewRef.current = init(content);

    return () => {
      editorViewRef.current?.destroy();
    }
  }, []);


  // 每次左侧时间切换，通过触发view层的事物，更新内容，有两种方法
  // 1. 销毁上一个编辑器，重新初始化 （如果要做时间长河动画，要创建多个编辑器实例）
  // 2. 更新当前编辑器 （目前用这个）
  useEffect(() => {
    if (editorViewRef.current) {
      update(editorViewRef.current, content);
    }
  }, [selectedDate]);

  // 初始化编辑器
  function init(content?: string) {
    try {
      const docContent = mySchema.nodeFromJSON(JSON.parse(content ?? ""));

      console.log("docContent", content, docContent)
      const state = EditorState.create({
        schema: mySchema,
        doc: docContent,
        plugins: [
          history(),
          keymap(baseKeymap),
          keymap({
            "Mod-b": toggleMark(mySchema.marks.strong),
            "Mod-i": toggleMark(mySchema.marks.em),
            "Mod-z": undo,
            "Mod-y": redo,
            "Shift-Mod-z": redo,
            "Mod-s": (state, dispatch) => {
              window.addEventListener(
                "keydown",
                (e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                    e.preventDefault();
                  }
                },
                { once: true }
              );

              toast({
                title: "Save Success",
                description: "Your mind has been saved",
                duration: 5000,
              });
              return true;
            },
          }),
          // inputRules({
          //   rules: [
          //     new InputRule(
          //       /\*\*[^\*]{1,}\*\*$/,
          //       (state: EditorState, match, from, to, text) => {
          //         const mark = state.schema.mark("strong");
          //         const str = match[0].substring(2, match[0].length - 2);
          //         const node = state.schema.text(str, [mark]);
          //         return state.tr.replaceWith(from, to, node);
          //       }
          //     ),
          //   ],
          // }),
        ],
      });

      const view = new EditorView(elContentRef.current, {
        state,
        // 处理编辑器中的事务（transaction），并在每次事务应用后更新编辑器的状态
        dispatchTransaction(transaction) {
          try {
            const currentView = view;
            const newState =  currentView.state.apply(transaction);
            currentView.updateState(newState);

            if (onChange) {
              const content = JSON.stringify(newState.doc.toJSON());

              onChange(content);
            }
          } catch (err) {
            console.error("Transaction error:", err);
          }
        },
      });

      return view;
    } catch (err) {
      console.error("Editor initialization error:", err);

      return undefined;
    }
  }

  // 编辑器内容更新
  // 这里要优化
  function update(view: EditorView, newContent: string | undefined) {
    try {
      const { state } = view;
      const docContent = mySchema.nodeFromJSON(JSON.parse(newContent));

      const tr = state.tr;

      // 清空当前文档内容
      tr.delete(0, state.doc.content.size);

      // 插入新的文档内容
      // tr.replaceSelectionWith(docContent);
      // tr.replaceWith(0, state?.doc?.content?.size ?? 0, docContent)
      tr.insert(0, docContent)

      // 应用事务
      view.dispatch(tr);
      // const newState = view.state.apply(tr);
      // view.updateState(newState);
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  return (
    <div className="editor-wrapper">
      <Toolbar view={editorViewRef.current} />
      <div className="editor-content" ref={elContentRef} />
    </div>
  );
};

export default Editor;
