import { SchemaSpec } from "prosemirror-model";

export const defaultSchema: SchemaSpec = {
  nodes: {
    doc: {
      // +表示一个或多个， 还有｜表示或
      content: "block+",
    },
    // 自定义类型
    block_tile: {
      // * 表示可以有 0 个或多个 inline 分组内的节点作为子节点
      content: "inline*",
      // 分组：当前节点所在的分组为 block，意味着它是个 block 节点
      // 也可以自定义
      group: "block",
      // 自定义节点
      // defining: true,
      inline: false,
      parseDOM: [
        {
          // 将 class 为 block_tile 的 div 转为 block_tile
          // 注意，这里使用 tag 需要带上对应的 css 选择器
          // 假如复制的内容还有别的属性，都不用管，只要能根据当前 tag 匹配到，就会转为 block_tile
          tag: "div.block_tile",
        },
      ],
      toDOM: () => {
        return ["div", { class: "block_tile" }, 0];

        // 创建一个html元素
        // const blockTile = document.createElement('div');
        // blockTile.classList.add('block_tile');
        // // 返回一个对象，dom 代表当前要转换成的 html
        // // contentDOM 代表子节点应该填充在哪个 dom 元素里，这里就直接填充在 blockTile 中
        // // 这种方法语义化清晰，但通过还是通过 上面数组的方式来定义
        // // 如果当前节点不需要子节点填充，contentDOM 可以不填，此时也可以直接 return blockTile
        // return {
        //     dom: blockTile,
        //     contentDOM: blockTile
        // }
      },
    },
    paragraph: {
      // 段落内容规定必须是 inline 类型的节点（inline 与 HTML 中 inline 概念差不多）, `*` 号代表可以有 0 个或多个（规则类似正则）
      content: "inline*",
      group: "block",
      attrs: { align: { default: "left" } },
      parseDOM: [
        {
          tag: "p",
          getAttrs: (dom) => ({
            // 可以自定义段落的样式
            align: (dom as HTMLElement).style.textAlign || "left",
          }),
        },
      ],
      // 渲染为 html 时候，使用 p 标签渲染，第二个参数 0 念做 “洞”，类似 vue 中 slot 插槽的概念，
      // 证明它有子节点，以后子节点就填充在 p 标签中
      toDOM: (node) => ["p", { style: `text-align: ${node.attrs.align}` }, 0],
    },
    heading: {
      attrs: {
        level: { default: 1 },
        align: { default: "left" },
      },
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1, align: "left" } },
        { tag: "h2", attrs: { level: 2, align: "left" } },
        { tag: "h3", attrs: { level: 3, align: "left" } },
      ],
      toDOM: (node) => [
        `h${node.attrs.level}`,
        { style: `text-align: ${node.attrs.align}` },
        0,
      ],
    },
    text: {
      group: "inline",
    },
    yesOrNo: {
      group: "block",
      inline: false,
      atom: true,
      toDOM(node) {
        const dom = document.createElement("span");
        dom.classList.add("YesOrNo");
        const content = document.createElement("span");
        content.innerText = 'Yes Or No';
        content.style.width = "60px";
        content.style.height = "60px";
        dom.appendChild(content);
        // 返回 dom
        return dom;
      },
      parseDOM: [

      ]
    },
    datetime: {
      group: "inline",
      inline: true,
      atom: true,
      attrs: {
        timestamp: {
          default: null,
        },
      },
      toDOM(node) {
        // 自定义 dom 结构
        const dom = document.createElement("span");
        dom.classList.add("datetime");
        dom.dataset.timestamp = node.attrs.timestamp;
        console.log("node.attrs", node.attrs);

        let time = "";
        if (node.attrs.timestamp) {
          const date = new Date(node.attrs.timestamp);
          time = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        }

        const label = document.createElement("label");
        label.innerText = "请选择时间";

        const input = document.createElement("input");
        input.type = "date";
        input.value = time;

        input.addEventListener("input", (event) => {
          dom.dataset.timestamp = new Date(
            (event.target as HTMLInputElement).value
          )
            .getTime()
            .toString();
        });

        dom.appendChild(label);
        dom.appendChild(input);
        // 返回 dom
        return dom;
      },
      parseDOM: [
        {
          tag: "span.datetime",
          getAttrs(htmlNode) {
            if (typeof htmlNode !== "string") {
              const timestamp = htmlNode.dataset.timestamp;
              return {
                timestamp: timestamp ? Number(timestamp) : null,
              };
            }
            return {
              timestamp: null,
            };
          },
        },
      ],
    },
  },
  marks: {
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b" },
        {
          style: "font-weight",
          getAttrs: (value) => value === "bold" || value === "700",
        },
      ],
      toDOM: () => ["strong", 0],
    },
    em: {
      parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style", getAttrs: (value) => value === "italic" },
      ],
      toDOM: () => ["em", { style: "font-style: italic" }, 0],
    },
    fontSize: {
      attrs: { size: { default: "16px" } },
      parseDOM: [
        {
          style: "font-size",
          getAttrs: (value) => ({ size: value }),
        },
      ],
      toDOM: (mark) => ["span", { style: `font-size: ${mark.attrs.size}` }, 0],
    },
    fontFamily: {
      attrs: { font: { default: "default" } },
      parseDOM: [
        {
          style: "font-family",
          getAttrs: (value) => ({ font: value }),
        },
      ],
      toDOM: (mark) => {
        const fontMap = {
          default: "inherit",
          montserrat: '"Montserrat", sans-serif',
          "noto-serif": '"Noto Serif SC", serif',
        };
        return [
          "span",
          {
            style: `font-family: ${
              fontMap[mark.attrs.font as keyof typeof fontMap]
            }`,
          },
          0,
        ];
      },
    },
  },
};
