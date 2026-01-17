interface Content {
  type: string;
  attrs?: { level: number; align: string } | any;
  content?: Array<{
    type: string;
    text?: string;
    marks?: Array<{ type: string }>;
  } | any>;
}

interface DefaultContent {
  type: string;
  content: Content[];
}

export const defaultContent = {
  type: "doc",
  content: [
    {
      type: "text",
      text: "开始写作...",
    },
    {
      type: "datetime",
      attrs: {
        timestamp: new Date(),
      }
    },
    {
      type: "yesOrNo",
    }
  ],
};

export const mockMiniCard: any = [
  {
    title: "Sick title",
    description:
      "How to design with gestures and motion that feel intuitive and natural.",
  },
  {
    title: "Sick title",
    description:
      "How to design with gestures and motion that feel intuitive and natural.",
  },
  {
    title: "Sick title",
    description:
      "How to design with gestures and motion that feel intuitive and natural.",
  },
  {
    title: "Sick title",
    description:
      "How to design with gestures and motion that feel intuitive and natural.",
  },
  {
    title: "Sick title",
    description:
      "How to design with gestures and motion that feel intuitive and natural.",
  },
];
