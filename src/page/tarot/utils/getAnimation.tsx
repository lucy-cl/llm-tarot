import { gsap } from "gsap";
import { options } from "../mock/options";

export function rotateAnimation(
    targetEl: string,
    selectorId: string,
    totalDelay = 0,
    translateX: string,
    translateY: string,
    scale: string,
    rotate: string,
    direction: string
  ) {
    const speed = options._section2_rotate_speed.value;
    const delay = options._section2_rotate_delay.value;

    const {
      left: x,
      top: y,
      width,
      height,
    } = targetEl?.getBoundingClientRect();

    const r = gsap.timeline({ repeat: 0 });
    const o = gsap.timeline({ repeat: 0 });
    const h = gsap.timeline({ repeat: 0 });

    // 覆盖位置，初始化位置
    gsap.set(selectorId, {
      "--x": `${x}px`,
      "--y": `${y + height / 2}px`,
      "--x-2": `${x}px`,
      "--y-2": `${y - height / 2}px`,
      "--tarot-card-width": `${width}px`,
      "--tarot-card-height": `${height}px`,
      "--z": `${direction ? "0" : "180"}deg`,
      "--z-2": `${direction ? "0" : "180"}deg`,
      duration: 0.3,
      delay: totalDelay,
    });

    if (selectorId.includes('second')) {
      gsap.to(selectorId, {
        "--tarot-opacity-2": 1,
        delay: 0.1 + totalDelay,
      });
    } else {
      gsap.to(selectorId, {
        "--tarot-opacity": 1,
        duration: 0.5,
        delay: totalDelay,
      });
    }

    // gsap.to("#section-tarot-detail", {
    //   transform: "scale(1.15)",
    //   duration: 3,
    //   delay: 1.3
    // })

    gsap.to(".tarot-card-fg", {
      "--box-shadow": "0px 0px 250px #6D4E31",
      duration: 1,
      delay: totalDelay + 2,
    });

    // 1. 先翻牌，再位移
    // 2. 并行
    gsap.to(selectorId, {
      "--x": translateX,
      "--y": translateY,
      "--x-2": translateX,
      "--y-2": translateY,
      "--tarot-card-width": `${width}px`,
      "--tarot-card-height": `${height}px`,
      transform: `scale(${scale}) rotate(${rotate})`,
      duration: 1,
      delay: 0.3 + totalDelay + 2,
    });

    r.to(selectorId, {
      "--r": "180deg",
      "--p": "0%",
      duration: speed,
      ease: "sine.in",
      delay: delay + totalDelay,
    });
    r.to(selectorId, {
      "--r": "180deg",
      "--p": "100%",
      duration: speed,
      ease: "sine.out",
      delay: delay + totalDelay,
    });
    o.to(selectorId, {
      "--o": 1,
      duration: speed / 2,
      ease: "power1.in",
      delay: delay + totalDelay,
    });
    o.to(selectorId, {
      "--o": 0,
      duration: speed / 2,
      ease: "power1.out",
      delay: delay + totalDelay,
    });

    h.to(selectorId, {
      "--h": "100%",
      duration: speed / 2,
      ease: "sine.in",
      delay: totalDelay,
    });
    h.to(selectorId, {
      "--h": "50%",
      duration: speed / 2,
      ease: "sine.out",
      delay: totalDelay,
    });
    h.to(selectorId, {
      "--h": "0%",
      duration: speed / 2,
      ease: "sine.in",
      delay: totalDelay,
    });
    h.to(selectorId, {
      "--h": "50%",
      duration: speed / 2,
      ease: "sine.out",
      delay: totalDelay,
    });
  }