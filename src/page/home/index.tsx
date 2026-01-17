import { useState } from "react";
import Editor from "@/components/Editor";
import Timeline from "@/components/Timeline";
import { Toaster } from "@/components/ui/toaster";
import BlobCursor from "@/components/BlobCursor";
import { format } from "date-fns";
import { defaultContent } from "@/data/defaultContent";

const Home = () => {
  const [content, setContent] = useState<string>(
    localStorage.getItem(`caremind-${format(new Date(), "yyyy-MM-dd")}`) ??
      JSON.stringify(defaultContent)
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleDateSelect = (date: string) => {
    // 这里暂时使用默认内容,后续可以接入后端API
    // 1. 存储切换前内容，默认为当天最后编辑内容
    const storageName_current = `caremind-${selectedDate}`;
    localStorage.setItem(storageName_current, content);

    // 2. 从localstorage获取切换后数据
    const storageName_next = `caremind-${date}`;
    const storageContent =
      localStorage.getItem(storageName_next) ?? JSON.stringify(defaultContent);
    setContent(storageContent);
    setSelectedDate(date);
  };

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="app">
      <Timeline selectedDate={selectedDate} onDateSelect={handleDateSelect} />
      <div className="editor-container">
        <Editor
          onChange={handleEditorChange}
          content={content}
          selectedDate={selectedDate}
        />
      </div>
      <Toaster />
      <BlobCursor />
    </div>
  );
};

export default Home;
