import { useEffect, useState } from "react";
import { gsap } from "gsap";
import GradientText from "@/components/GradientText";
import InfiniteScroll from "@/components/InfiniteScroll";
import Particles from "@/components/Particles";
import Tarot_3D from "@/components/3DTarget";
import tarotImgs from "./mock/index";
import "./index.css";

const Tarot = () => {
  // 抽出牌的结论
  const [currentResult, setCurrentResult] = useState<any>([]);
  // section 1
  const [isStart, setIsStart] = useState(true);
  const [isHover, setIsHover] = useState<any>(null);

  // section 2
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [cardHover, setCardHover] = useState<any>(null);

  // section 3
  const [isDetail, setIsDetail] = useState(false);

  const [scrollSpeed, setScrollSpeed] = useState(0.4);
  const [pauseOnEvent, setPauseOnEvent] = useState(false);

  const scrollPause = (isPause: boolean) => {
    return new CustomEvent('scrollPause', {
      detail: isPause
    })
  };

  useEffect(() => {
    if (isDetail) {
      // rotateAnimation();
      setScrollSpeed(1.6);
    } else {
      setScrollSpeed(0.4);
    }
  }, [isDetail]);

  function rotateAnimation() {
    const speed = 6;
    const r = gsap.timeline({ repeat: -1 });
    const o = gsap.timeline({ repeat: -1 });
    const h = gsap.timeline({ repeat: -1 });

    r.to("#section-tarot-detail", {
      "--r": "180deg",
      "--p": "0%",
      duration: speed,
      ease: "sine.in",
    });
    r.to("#section-tarot-detail", {
      "--r": "360deg",
      "--p": "100%",
      duration: speed,
      ease: "sine.out",
    });
    o.to("#section-tarot-detail", {
      "--o": 1,
      duration: speed / 2,
      ease: "power1.in",
    });
    o.to("#section-tarot-detail", {
      "--o": 0,
      duration: speed / 2,
      ease: "power1.out",
    });

    h.to("#section-tarot-detail", {
      "--h": "100%",
      duration: speed / 2,
      ease: "sine.in",
    });
    h.to("#section-tarot-detail", {
      "--h": "50%",
      duration: speed / 2,
      ease: "sine.out",
    });
    h.to("#section-tarot-detail", {
      "--h": "0%",
      duration: speed / 2,
      ease: "sine.in",
    });
    h.to("#section-tarot-detail", {
      "--h": "50%",
      duration: speed / 2,
      ease: "sine.out",
    });
  }

  return (
    <div className="tarot-container">
      <header className="header">
        <div
          className="left"
          onClick={() => {
            setIsStart(false);
            setIsDetail(false);
            setIsGrid(true);
            setScrollSpeed(0.4);
          }}
        >
          <div className="logo" />
          abababa
        </div>
        <div
          className="right"
          onClick={() => {
            setIsDetail(false);
          }}
        >
          More
        </div>
      </header>
      <main>
        {/* {isStart && !isGrid && (
          <section className="section-info flex flex-col justify-between items-center pb-[8vh] pt-[14vh] text-center ipad:h-dvh">
            <div className="main-title text-center pointer-events-none">
              <div
                className={`text-nuances intro__annee ${
                  isStart ? "start" : ""
                }`}
              >
                <span className="letterWrapper">
                  <span className="letter">M</span>
                </span>
                <span className="letterWrapper">
                  <span className="letter">M</span>
                </span>
                <span className="letterWrapper">
                  <span className="letter">X</span>
                </span>
                <span className="letterWrapper">
                  <span className="letter">X</span>
                </span>
                <span className="letterWrapper">
                  <span className="letter">V</span>
                </span>
              </div>
              <GradientText
                animationSpeed={3}
                showBorder={false}
                className={`text-h1 ${isGrid ? "start" : ""}`}
                backgroundImage={
                  "linear-gradient(90deg,#DB9850, #886D62 20%, #DB9850 40%, #886D62 60%, #DB9850 80%, #886D62)"
                }
              >
                HappyScope
              </GradientText>
            </div>
            <div
              className={`flex flex-col items-center gap-[32px] z-30 ${
                isGrid ? "start" : ""
              }`}
            >
              <p className="max-w-[420px] pointer-events-none intro__texte ipad:max-w-full ipad:px-16">
                Découvrez ce que vous réserve l’année à venir grâce à nos
                prédictions<span className="font-bold"> IA</span>strales !
              </p>
              <div
                className="intro__button"
                onClick={() => {
                  setIsGrid(true);
                }}
              >
                <div className="intro__button__inner">
                  <div className="button relative text-buttonstart buttonGradient w-fit rounded-1000 min-h-[60px] min-w-[250px] cursor-pointer bgGradient undefined type-false">
                    <div className="button__base flex items-center justify-center p-[22px] gap-10 text-white">
                      <span>asjdhuw start mon HappyScope</span>
                    </div>
                    <div className="button__hover absolute top-0 left-0 w-full h-full flex items-center justify-center p-[22px] gap-10">
                      <div className="button__hover__bg absolute top-0 left-0 w-full h-full bg-white"></div>
                      <div className="button__hover__inner z-20 w-full h-full flex items-center justify-between text-white">
                        <span className="relative">asjdhuw start</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}

        {/* {isStart && !isGrid && (
          <section className={`section-tarot-list ${isStart ? "start" : ""}`}>
            <div className="tarot-content">
              {tarotImgs.map((_, index) => {
                //rotate3d(-${Math.sin(index)}, 0, 0, 30deg)
                return (
                  <div
                    key={index}
                    className={`tarot-card ${isStart ? "start" : ""}`}
                    style={{
                      transform: `translateY(-${index === isHover ? 20 : 0}px)`,
                      top: -`${Math.cos(index / 3) * 30}`,
                      left: 80 * index,
                    }}
                    onMouseEnter={() => {
                      setIsHover(index);
                    }}
                    onMouseLeave={() => {
                      setIsHover(index);
                    }}
                  ></div>
                );
              })}
            </div>
          </section>
        )} */}

        {isGrid && (
          <section
            className={`section-tarot-grid ${isGrid ? "start" : ""} ${
              isDetail ? "detail" : ""
            }`}
            style={{
              pointerEvents: isStart ? "auto" : "none",
            }}
          >
            <div className="tarot-content">
              {new Array(4).fill(0).map((_, idx) => {
                return (
                  <div className="tarot-col" key={`col-${idx}`}>
                    <InfiniteScroll
                      items={new Array(5).fill(0).map((_, index) => {
                        return {
                          content: (
                            <div
                              className={`tarot-card`}
                              key={`card-${idx}-${index}`}
                              id={`card-${idx}-${index}`}
                              // onMouseEnter={() => {
                              //   setCardHover(`${idx-index}`);
                              // }}
                              // onMouseLeave={() => {
                              //   setCardHover(null)
                              // }}
                            >
                              {/* <Particles
                                // 加外发光
                                particleColors={["#ffffff", "#ffffff"]}
                                particleCount={Math.ceil(Math.random() * 100)}
                                particleSpread={10}
                                speed={0.1}
                                particleBaseSize={100}
                                moveParticlesOnHover={true}
                                alphaParticles={false}
                                disableRotation={false}
                                className={`hover-start ${
                                  cardHover === `${idx - index}` ? "hover" : ""
                                }`}
                              /> */}
                            </div>
                          ),
                        };
                      })}
                      isTilted={false}
                      autoplay={true}
                      autoplaySpeed={scrollSpeed}
                      autoplayDirection={idx % 2 === 0 ? "up" : "down"}
                      pauseOnHover={false}
                      pauseOnClick={false}
                      pauseOnEvent={pauseOnEvent}
                      itemMinHeight={260}
                      width={"100%"}
                      negativeMargin={"10px"}
                      onItemClick={() => {
                        // console.log("onItemClick1");
                        // setIsDetail(true);
                        // setCurrentIdx(Math.ceil(Math.random() * 22) - 1);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* {isDetail && (
          <section
            className={`section-tarot-detail ${isDetail ? "detail" : ""}`}
            style={{
              pointerEvents: isDetail ? "auto" : "none",
            }}
            id="section-tarot-detail"
          >
            <section className="tarot-card-container" id="tarot-card-container">
              <header
                className="tarot-card-fg"
                style={{
                  backgroundImage: `url(${
                    tarotImgs[currentResult[0]?.idx].img
                  })`,
                }}
              />
              <section className="tarot-card" />
            </section>

            <div className="tarot-desc">
              {tarotImgs[currentResult[0]?.idx].name}
            </div>
          </section>
        )} */}
      </main>

      <footer className="footer">
        <div className="tarot-choose">
          <div className={`tarot-select ${isDetail ? 'detail' : ''}`}>
            关于
            <select id="direction" onSelect={v => {
              console.log(v)
            }}>
              <option value={"business"}>事业</option>
              <option value={"emotion"}>情感</option>
              <option value={"healthy"}>健康</option>
            </select>
            心中默念你的问题...
          </div>
          <button
            className="tarot-start"
            onClick={() => {
              setIsDetail(!isDetail);
              setCurrentResult([
                {
                  idx: Math.ceil(Math.random() * 22) - 1,
                  direction: Math.ceil(Math.random()),
                },
                {
                  idx: Math.ceil(Math.random() * 22) - 1,
                  direction: Math.ceil(Math.random()),
                },
              ]);
            }}
          >
            {isDetail ? "Return" : "Click here"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Tarot;
