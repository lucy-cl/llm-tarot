
import { NodeView } from "prosemirror-view";

export class DateNodeView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
   
    constructor() {
      this.dom = document.createElement('div');
      this.contentDOM = document.createElement('div');
      this.dom.appendChild(this.contentDOM);
      this.update();
    }
   
    update() {
      const date = new Date();
      this.contentDOM.textContent = `Today is ${date.toDateString()}`;
      return true;
    }
   
    selectNode() {
      // 处理选中状态
    }
  
    deselectNode() {
      // 处理非选中状态
    }
   
    setSelection(anchor: number, head: number) {
      // 设置文本选区
    }
   
    stopEvent() {
      // 阻止事件冒泡
      return false;
    }
   
    destroy() {
      // 清理资源
    }
  }