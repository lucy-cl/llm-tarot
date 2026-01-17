import React, { useEffect, useState, CSSProperties, useRef } from "react";
import "./index.css";

interface TextAnimatorProps {
  text: string;
  duration?: number;
  visibleChars?: number;
  style?: CSSProperties;
  isVisible?: boolean;
  delay?: number;
  maxHeight?: string;
  sign?: string;
  imagePath?: string;
  imageStyle?: CSSProperties;
}

const TextAnimator: React.FC<TextAnimatorProps> = ({
  text,
  duration = 1000,
  visibleChars = text.length,
  style,
  isVisible = false,
  delay = 0,
  maxHeight = "100%",
  sign = '',
  imagePath,
  imageStyle
}) => {
  const [chars, setChars] = useState<JSX.Element[]>([]);
  const [imagePosition, setImagePosition] = useState({x:0, y:0});

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const observerRef = useRef<IntersectionObserver>();


  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.scrollHeight;
      setScrollEnabled(contentHeight > containerHeight);
    }
  }, [text, visibleChars]);

  useEffect(() => {
    if (!scrollEnabled || !containerRef.current) return;

    const targetChar = contentRef.current?.children[visibleChars - 1];
    if (!targetChar) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          const charTop = (targetChar as HTMLElement).offsetTop;
          containerRef.current?.scrollTo({
            top: charTop - containerRef.current.clientHeight * 0.2,
            behavior: "smooth",
          });
        }
      },
      {
        root: containerRef.current,
        threshold: 1.0,
      }
    );

    observerRef.current.observe(targetChar);
    return () => observerRef.current?.disconnect();
  }, [visibleChars, scrollEnabled]);

  // useEffect(() => {
  //   const activeChar = document.querySelector(`.char[data-index="${visibleChars-1}"]`);
  //   // console.log(2222, visibleChars, activeChar)
  //   if (activeChar && imagePath) {
  //     const rect = activeChar.getBoundingClientRect();
  //     setImagePosition({
  //       x: rect.left + rect.width/2,
  //       y: rect.top - 30 // 上浮30px
  //     });
  //   }
  // }, [visibleChars, imagePath]);

  return (
    <div
      className="text-container"
      style={{
        ...style,
        overflowY: scrollEnabled ? "auto" : "hidden",
        maxHeight,
      }}
      ref={containerRef}
    >
      <div ref={contentRef}>
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="char"
            style={{
              opacity: index < visibleChars && isVisible ? 1 : 0,
              transition: isVisible
                ? `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
              transitionDelay: isVisible
                ? `${((index * duration) / text.length) + delay * 1000}ms`
                : "0s",
            }}
          >
            {char}
          </span>
        ))}

        {/* <div
          className="sign"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: isVisible
              ? `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
            transitionDelay: isVisible ? `${duration + 600}ms` : "0s",
          }}
        >
          {sign}
        </div> */}
      </div>

      {/* {imagePath && (
          <img
            src={imagePath}
            style={{
              position: "fixed",
              left: imagePosition.x,
              top: imagePosition.y,
              transition: "transform 0.3s ease-out",
              pointerEvents: "none",
              ...imageStyle,
            }}
          />
        )} */}
    </div>
  );
};

export default TextAnimator;
