import { useState, useEffect, useRef } from 'react';
import TimelineItem from './TimelineItem';
import { format } from 'date-fns';
import './index.css';

interface TimelineProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

const Timeline = ({ onDateSelect, selectedDate }: TimelineProps) => {
  const [days, setDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 生成日期数据
  const generateDays = (startDate: Date, count: number) => {
    const result: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < count; i++) {
      result.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return result;
  };

  useEffect(() => {
    const initialDays = generateDays(new Date(), 100);
    setDays(initialDays);
  }, []);

  // 滚动加载
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (loading) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setLoading(true);
        const lastDate = days[days.length - 1];
        const nextDay = new Date(lastDate);
        nextDay.setDate(nextDay.getDate() - 1);
        
        const newDays = generateDays(nextDay, 100);
        setDays(prev => [...prev, ...newDays]);
        setLoading(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [days, loading]);

  return (
    <div className="timeline" ref={containerRef}>
      <div className="timeline-container">
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          return (
            <TimelineItem 
              key={dateStr}
              date={date}
              isSelected={dateStr === selectedDate}
              onClick={() => onDateSelect(dateStr)}
            />
          );
        })}
        {loading && <div className="timeline-loading">加载中...</div>}
      </div>
    </div>
  );
};

export default Timeline; 