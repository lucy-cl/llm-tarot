import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./index.css";

export default function InfiniteScroll({
  width = "30rem",
  maxHeight = "100%",
  negativeMargin = "-0.5em",
  items = [],
  itemMinHeight = 150,
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = "down",
  pauseOnHover = false,
  ease = 'linear'
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const speedRef = useRef(autoplaySpeed); // 动画速度的引用
  const [isPaused, setIsPaused] = useState(false); // 动画暂停状态

  useEffect(() => {
    const container: HTMLElement | null = containerRef.current;
    if (!container || items.length === 0) return;

    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;

    const firstItem: any = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
    const totalItemHeight = itemHeight + itemMarginTop;
    const totalHeight = itemHeight * items.length + itemMarginTop * (items.length - 1);
    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    divItems.forEach((child, i) => {
      const y = i * totalItemHeight;
      gsap.set(child, { y });
    });

    let rafId: number | null = null;
    let lastTimestamp = 0; // 上一帧的时间戳

    const directionFactor = autoplayDirection === "down" ? 1 : -1;

    const tick = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp; // 初始化时间戳
      const elapsed = timestamp - lastTimestamp; // 帧间隔时间
      lastTimestamp = timestamp;

      // 如果速度为 0，暂停动画
      if (speedRef.current === 0) {
        setIsPaused(true);
        if (rafId) cancelAnimationFrame(rafId);
        return;
      }

      // 根据速度更新位置
      const currentSpeed = speedRef.current * directionFactor;
      divItems.forEach((child) => {
        gsap.set(child, {
          y: `+=${currentSpeed}`,
          modifiers: {
            y: gsap.utils.unitize(wrapFn),
          },
          ease: 'power1.inOut',
        });
      });

      // 如果未暂停，继续下一帧
      if (!isPaused) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const startAnimation = () => {
      setIsPaused(false);
      lastTimestamp = 0; // 重置时间戳
      rafId = requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      setIsPaused(true);
      cancelAnimationFrame(rafId);
    };

    if (autoplay) {
      startAnimation();

      if (pauseOnHover) {
        container.addEventListener("mouseenter", stopAnimation);
        container.addEventListener("mouseleave", startAnimation);

        return () => {
          cancelAnimationFrame(rafId);
          container.removeEventListener("mouseenter", stopAnimation);
          container.removeEventListener("mouseleave", startAnimation);
        };
      }

      return () => {
        cancelAnimationFrame(rafId);
      };
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [autoplay, autoplayDirection, pauseOnHover]);

  // 动态更新速度
  useEffect(() => {
    const duration = 1000; // 速度变化的持续时间（毫秒）
    const startTime = performance.now(); // 记录开始时间
    const initialSpeed = speedRef.current; // 当前速度
    const targetSpeed = autoplaySpeed; // 目标速度

    const updateSpeed = (timestamp: number) => {
      const elapsed = timestamp - startTime; // 已经过的时间
      const progress = Math.min(elapsed / duration, 1); // 插值进度（0 到 1）

      // 根据缓动函数计算当前速度
      const easingFunction = gsap.parseEase(ease); // 解析缓动函数
      const interpolatedSpeed = initialSpeed + (targetSpeed - initialSpeed) * easingFunction(progress);

      speedRef.current = interpolatedSpeed; // 更新当前速度

      // 如果未完成插值，继续下一帧
      if (progress < 1) {
        requestAnimationFrame(updateSpeed);
      } else {
        speedRef.current = targetSpeed; // 确保最终速度为目标速度
      }
    };

    requestAnimationFrame(updateSpeed);
  }, [autoplaySpeed, ease]);

  return (
    <>
      <style>
        {`
        .infinite-scroll-wrapper {
          max-height: ${maxHeight};
        }

        .infinite-scroll-container {
          width: ${width};
        }

        .infinite-scroll-item {
          height: ${itemMinHeight}px;
          margin-top: ${negativeMargin};
        }
        `}
      </style>
      <div className="infinite-scroll-wrapper" ref={wrapperRef}>
        <div className="infinite-scroll-container" ref={containerRef}>
          {items.map((item, i) => (
            <div key={i} className="infinite-scroll-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
