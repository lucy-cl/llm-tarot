import { useState } from "react";
import { EditorView } from "prosemirror-view";
import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  MoreIcon,
} from "../Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/utils/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconButton } from "../IconButton";
import "./index.css";

interface ToolbarProps {
  view: EditorView | undefined;
}

const Toolbar = ({ view }: ToolbarProps) => {
  const { toast } = useToast();

  if (!view) return null;

  const showError = (message: string) => {
    toast({
      variant: "destructive",
      title: "错误",
      description: message,
    });
  };

  const toggleFormat = (markType: MarkType) => {
    try {
      if (!view || !view.state) {
        throw new Error("编辑器状态无效");
      }

      if (!markType) {
        throw new Error("格式类型未定义");
      }

      const { from, to } = view.state.selection;
      if (from === to) {
        throw new Error("请先选择要格式化的文本");
      }

      const command = toggleMark(markType);
      const success = command(view.state, view.dispatch);

      if (!success) {
        throw new Error("格式操作失败");
      }

      view.focus();
    } catch (err) {
      console.error("Format error:", err);
      showError(err instanceof Error ? err.message : "格式操作失败");
    }
  };

  const changeFontSize = (size: string) => {
    try {
      const { state, dispatch } = view;
      const { schema, selection } = state;
      const { from, to } = selection;

      if (from === to) {
        throw new Error("请先选择要修改字号的文本");
      }

      // 检查选中的文本是否包含标题节点
      let hasHeading = false;
      state.doc.nodesBetween(from, to, (node) => {
        if (node.type === schema.nodes.heading) {
          hasHeading = true;
          return false; // 停止遍历
        }
      });

      if (hasHeading) {
        throw new Error("标题的字号不可更改");
      }

      const fontSizeMark = schema.marks.fontSize;
      if (!fontSizeMark) {
        throw new Error("字号功能未定义");
      }

      const tr = state.tr
        .removeMark(from, to, fontSizeMark)
        .addMark(from, to, fontSizeMark.create({ size }));

      dispatch(tr);
      view.focus();
    } catch (err) {
      console.error("Font size error:", err);
      showError(err instanceof Error ? err.message : "字号修改失败");
    }
  };

  const isMarkActive = (markType: MarkType) => {
    try {
      if (!view || !markType) return false;

      const { state } = view;
      const { from, to, empty } = state.selection;

      if (empty) {
        return !!state.storedMarks?.some((mark) => mark.type === markType);
      }

      return state.doc.rangeHasMark(from, to, markType);
    } catch (err) {
      console.error("Mark active check error:", err);
      return false;
    }
  };

  const setHeading = (level: number) => {
    try {
      const { state, dispatch } = view;
      const { schema } = state;
      const { from, to } = state.selection;

      const nodeType = schema.nodes.heading;
      const attrs = { level };

      const tr = state.tr.setBlockType(from, to, nodeType, attrs);
      dispatch(tr);
      view.focus();
    } catch (err) {
      console.error("Heading error:", err);
      showError(err instanceof Error ? err.message : "标题设置失败");
    }
  };

  const setParagraph = () => {
    try {
      const { state, dispatch } = view;
      const { schema } = state;
      const { from, to } = state.selection;

      const nodeType = schema.nodes.paragraph;
      const tr = state.tr.setBlockType(from, to, nodeType);
      dispatch(tr);
      view.focus();
    } catch (err) {
      console.error("Paragraph error:", err);
      showError(err instanceof Error ? err.message : "正文设置失败");
    }
  };

  const changeFont = (font: string) => {
    try {
      const { state, dispatch } = view;
      const { schema, selection } = state;
      const { from, to } = selection;

      if (from === to) {
        throw new Error("请先选择要修改字体的文本");
      }

      const fontMark = schema.marks.fontFamily;
      if (!fontMark) {
        throw new Error("字体功能未定义");
      }

      const tr = state.tr
        .removeMark(from, to, fontMark)
        .addMark(from, to, fontMark.create({ font }));

      dispatch(tr);
      view.focus();
    } catch (err) {
      console.error("Font family error:", err);
      showError(err instanceof Error ? err.message : "字体修改失败");
    }
  };

  const setAlignment = (
    view: EditorView,
    align: "left" | "center" | "right"
  ) => {
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    // 创建一个事务
    let tr = state.tr;

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "paragraph" || node.type.name === "heading") {
        const nodeType = node.type;
        const attrs = {
          ...node.attrs,
          align,
        };
        // 将所有修改累积到同一个事务中
        tr = tr.setNodeMarkup(pos, nodeType, attrs);
      }
      return true;
    });

    // 最后一次性派发所有修改
    dispatch(tr);
  };

  const { marks } = view.state.schema;
  // console.log("Available marks:", marks);

  return (
    <div className="editor-toolbar-container">
      <div className="editor-toolbar">
        <DropdownMenu>
          <DropdownMenuTrigger className="toolbar-dropdown-trigger">
            段落格式
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setParagraph()}>
              正文
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(1)}>
              标题1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(2)}>
              标题2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(3)}>
              标题3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="toolbar-dropdown-trigger">
            字体
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeFont("default")}>
              默认字体
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeFont("montserrat")}>
              Montserrat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeFont("noto-serif")}>
              Noto Serif SC
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`toolbar-btn ${
                  isMarkActive(marks.strong) ? "active" : ""
                }`}
                onClick={() => toggleFormat(marks.strong)}
              >
                <strong>B</strong>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>粗体 (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`toolbar-btn ${
                  isMarkActive(marks.em) ? "active" : ""
                }`}
                onClick={() => toggleFormat(marks.em)}
              >
                <em>I</em>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>斜体 (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger className="toolbar-dropdown-trigger">
            字号
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["12px", "14px", "16px", "18px", "20px", "24px"].map((size) => (
              <DropdownMenuItem key={size} onClick={() => changeFontSize(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="toolbar-btn"
                onClick={() => view && setAlignment(view, "left")}
              >
                <AlignLeftIcon className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>左对齐</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="toolbar-btn"
                onClick={() => view && setAlignment(view, "center")}
              >
                <AlignCenterIcon className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>居中对齐</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="toolbar-btn"
                onClick={() => view && setAlignment(view, "right")}
              >
                <AlignRightIcon className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>右对齐</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="toolbar-btn"
                onClick={() => console.log("More clicked")}
              >
                <MoreIcon className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>更多选项</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Toolbar;
