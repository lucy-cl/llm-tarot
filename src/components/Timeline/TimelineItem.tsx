import { useMemo } from 'react';

interface TimelineItemProps {
  date: Date;
  isSelected?: boolean;
  onClick?: () => void;
}

const WEEKDAY_MAP = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TimelineItem = ({ date, isSelected, onClick }: TimelineItemProps) => {
  const randomWidth = useMemo(() => Math.floor(Math.random() * 60 + 20), []); // 20-80px随机宽度

  return (
    <div 
      className={`timeline-item ${isSelected ? 'timeline-item-selected' : ''}`}
      onClick={onClick}
    >
      <div className="timeline-content">
        <div 
          className="timeline-indicator" 
          style={{ width: `${randomWidth}px` }} 
        />
        <span className="timeline-weekday">
          {WEEKDAY_MAP[date.getDay()]}
        </span>
        <span className="timeline-date">
          {date.getDate()}
        </span>
      </div>
    </div>
  );
};

export default TimelineItem; 