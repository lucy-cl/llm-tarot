import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import InfiniteScroll from "@/components/InfiniteScroll";
import TextAnimator from "@/components/TextAnimation";
import tarotImgs, { context } from "./mock/index";
import { options } from "./mock/options";
import { systemContent, userContent, choiceDataSource } from "./mock/model";
import { getTwoUniqueNumbers } from "./utils/getRandomNumber";
import { rotateAnimation } from "./utils/getAnimation";
import { getClosestElementsToViewportCenter } from "./utils/getCloserElement";
import "./index.css";

const Tarot = () => {
  // 抽卡相关state
  const [currentChoice, setCurrentChoice] = useState<string>("事业");
  const [currentResult, setCurrentResult] = useState<any>([]);

  const [llmLoading, setLlmLoading] = useState<any>(true);
  const [llmResult, setLlmResult] = useState<any>("");

  // section 1
  const [isGrid, setIsGrid] = useState<boolean>(true);

  // section 2
  const [isDetail, setIsDetail] = useState(false);
  const [isSecondDetail, setIsSecondDetail] = useState(false);

  const [scrollSpeed, setScrollSpeed] = useState(
    options._section1_animation_speed.value
  );

  // show Gui
  const [isGui, setGUI] = useState(false);

  // gui
  const { register, watch, getValues } = useForm<any>();

  const {
    _section2_card_1_top,
    _section2_card_1_left,
    _section2_card_1_scale,
    _section2_card_1_rotate,
    _section2_card_2_delay,
    _section2_card_2_top,
    _section2_card_2_left,
    _section2_card_2_scale,
    _section2_card_2_rotate,
  } = getValues();

  const getTarotResult = async () => {
    const card1 = `${currentResult[0].direction ? "正位" : "逆位"}的${
      tarotImgs[currentResult[0].idx].name
    }`;
    const card2 = `${currentResult[1].direction ? "正位" : "逆位"}的${
      tarotImgs[currentResult[1].idx].name
    }`;
    try {
      const response = await fetch(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 2222",
          },
          body: JSON.stringify({
            model: "qwen-omni-turbo",
            messages: [
              {
                role: "system",
                content: systemContent,
              },
              {
                role: "user",
                content: userContent(currentChoice, [card1, card2]),
              },
            ],
            // 流式响应
            stream: true,
            stream_options: {
              include_usage: true,
            },
            modalities: ["text"],
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      if (response.ok && response?.body) {
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder();
        setLlmLoading(false);

        let llmData = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          lines.forEach((line) => {
            if (line.startsWith("data: ") && !line.includes("DONE")) {
              const data = JSON.parse(line.slice(6));
              if (data.choices[0]?.delta) {
                // console.log(3333, data.choices[0]?.delta?.content || "");
                llmData = llmData?.concat(
                  data.choices[0]?.delta?.content || ""
                );
                setLlmResult(llmData);
              }
            }
          });
        }
      }
    } catch (error) {
      console.error("API调用失败:", error);
      return null;
    }
  };

  useEffect(() => {
    if (currentResult.length > 0) {
      // 本地暂时不走大模型
      if (location.origin.includes("localhost")) {
        setLlmResult(context);
      } else {
        getTarotResult();
      }
    }
  }, [currentResult]);

  useEffect(() => {
    const cardList = document.querySelectorAll(".tarot-card");
    // 目前固定取第0张和第1张，后期改为根据视窗相对位置，找在中间的卡片
    let queryEl = document.getElementById("card-1-1");
    let queryEl_second = document.getElementById("card-2-0");
    const button_ele = document.getElementById("tarot-start");
    const gridAnimationDuration = options._section1_scroll_duration.value;

    if (isDetail) {
      setLlmLoading(true);

      // 牌阵先快速动，然后减缓到停止
      setScrollSpeed(options._section1_scroll_speed.value);
      setTimeout(() => {
        setScrollSpeed(0.01);
        setLlmLoading(false);

        try {
          const closerEles = getClosestElementsToViewportCenter(cardList);
          queryEl = document.getElementById(closerEles?.[0]);
          queryEl_second = document.getElementById(closerEles?.[1]);
        } catch (e) {
          console.log(e);
        }
        // console.log(queryEl, queryEl_second);

        // 第一张牌选中 -》 高亮
        gsap.to(queryEl, {
          "--tarot-card-opacity": 1,
          duration: 0.5,
          delay: 0.5,
        });

        gsap.to(queryEl, {
          "--tarot-card-opacity": 0,
          duration: 0.4,
          delay: 1,
        });

        // 暂停动画
        gsap.to(queryEl_second, {
          "--tarot-card-opacity": 1,
          duration: 0.5,
          delay: Number(_section2_card_2_delay) + 0.5,
        });

        gsap.to(queryEl_second, {
          "--tarot-card-opacity": 0,
          duration: 0.1,
          delay: Number(_section2_card_2_delay) + 1,
        });

        if (queryEl && queryEl_second) {
          rotateAnimation(
            queryEl,
            "#section-tarot-detail",
            1,
            _section2_card_1_top,
            _section2_card_1_left,
            _section2_card_1_scale,
            _section2_card_1_rotate,
            currentResult?.[0]?.direction
          );
  
          rotateAnimation(
            queryEl_second,
            "#section-tarot-detail-second",
            Number(_section2_card_2_delay) + 1,
            _section2_card_2_top,
            _section2_card_2_left,
            _section2_card_2_scale,
            _section2_card_2_rotate,
            currentResult?.[1]?.direction
          );
        }
      }, gridAnimationDuration * 1000);

      setTimeout(() => {
        gsap.to(button_ele, {
          opacity: 1,
          duration: 0.5,
        });  
      }, (gridAnimationDuration + Number(_section2_card_2_delay) + 5) * 1000);

      cardList.forEach((card) => {
        gsap.to(card, {
          "--tarot-card-opacity": 0.5,
          duration: gridAnimationDuration,
        });
      });

      // gsap.to(".section-tarot-grid", {
      //   filter: "blur(4px)",
      //   duration: 0.5,
      //   delay: gridAnimationDuration + 0.7,
      // });

      // gsap.to(".tarot-content", {
      //   transform: "scale(0.8)",
      //   duration: 1,
      //   delay: gridAnimationDuration,
      // });

      gsap.to(".section-tarot-drawer", {
        opacity: 1,
        duration: 1,
        delay: gridAnimationDuration + Number(_section2_card_2_delay) + 4.3,
      });
    } else {
      setScrollSpeed(options._section1_animation_speed.value);
      // console.log('return', isDetail, queryEl, queryEl_second)

      cardList.forEach((card) => {
        gsap.to(card, {
          "--tarot-card-opacity": 1,
          duration: 1,
        });
      });

      // gsap.to(buuton_el, {
      //   opacity: 0,
      //   duration: 1,
      //   // delay: 0.5,
      // });
    
      // gsap.to(".section-tarot-grid", {
      //   filter: "blur(0px)",
      //   duration: 1,
      // });

      gsap.to(".section-tarot-drawer", {
        opacity: 0,
      });

      setCurrentChoice('事业');
      setCurrentResult([]);
      setLlmLoading(true);
      setLlmResult("")
    }
  }, [isDetail]);

  return (
    <div className="tarot-container">
      <header className="header">
        <div
          className="left"
          onClick={() => {
            setIsDetail(false);
            setIsSecondDetail(false);
            setIsGrid(true);
            setLlmLoading(true);
            setCurrentResult([]);
            setScrollSpeed(options._section1_animation_speed.value);
          }}
        >
          <div className="logo" />
          abababa
        </div>

        <form
          onChange={() => {
            console.log(getValues());
            // const { _section1_animation_speed } = getValues();
            // setScrollSpeed(watch("_section1_animation_speed"));
          }}
          style={{
            opacity: isGui ? 1 : 0,
          }}
        >
          {Object.keys(options).map((key: string) => {
            return (
              <>
                <label>{options[key].label}</label>
                <input
                  type={options[key].type}
                  defaultValue={options[key].value}
                  {...register(key)}
                />
              </>
            );
          })}

          <input type="submit" />
        </form>
      </header>
      <main>
        {isGrid && (
          <section
            className={`section-tarot-grid ${isGrid ? "start" : ""} ${
              isDetail ? "detail" : ""
            }`}
          >
            <div className="tarot-content">
              {new Array(4).fill(0).map((_, idx) => {
                return (
                  <div className="tarot-col" key={`col-${idx}`}>
                    <InfiniteScroll
                      items={new Array(5).fill(0).map((_, index) => {
                        return (
                          <div
                            className={`tarot-card`}
                            key={`card-${idx}-${index}`}
                            id={`card-${idx}-${index}`}
                          ></div>
                        );
                      })}
                      autoplay={true}
                      autoplaySpeed={scrollSpeed}
                      autoplayDirection={idx % 2 === 0 ? "up" : "down"}
                      itemMinHeight={260}
                      width={"100%"}
                      negativeMargin={"10px"}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {isDetail && (
          <section
            className={`section-tarot-detail-second ${
              isSecondDetail ? "detail" : ""
            }`}
            style={{
              pointerEvents: isSecondDetail ? "auto" : "none",
            }}
            id="section-tarot-detail-second"
          >
            <section className="tarot-card-container" id="tarot-card-container">
              <header
                className="tarot-card-fg"
                style={{
                  backgroundImage: `url(${
                    tarotImgs[currentResult[1]?.idx].img
                  })`,
                }}
              />
              <section className="tarot-card" />
            </section>
          </section>
        )}

        <section
          className={`section-tarot-drawer ${isDetail ? "detail" : ""}`}
          style={{
            pointerEvents: isDetail ? "auto" : "none",
          }}
          id="section-tarot-drawer"
        >
          <TextAnimator
            text={llmResult}
            duration={5 * 1000}
            visibleChars={llmResult.length}
            delay={Number(_section2_card_2_delay) + 4.3}
            isVisible={!llmLoading}
            style={{
              fontSize: "16px",
              color: "#D49E65",
              fontFamily: "Lora",
            }}
            sign={"lucy"}
            imagePath={
              "https://img.alicdn.com/imgextra/i1/O1CN01aN21lH1kn1F5ChegG_!!6000000004727-2-tps-53-57.png"
            }
            imageStyle={{}}
          />

          <img
            src={
              "https://img.alicdn.com/imgextra/i1/O1CN01aN21lH1kn1F5ChegG_!!6000000004727-2-tps-53-57.png"
            }
            className="pen"
            style={{
              opacity: !llmLoading ? 1 : 0,
              transition: isDetail
                ? `opacity 5000ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
              transitionDelay: isDetail ? `10000ms` : "0s",
            }}
          />
        </section>

        {isDetail && (
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
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="tarot-choose">
          <div className={`tarot-select ${isDetail ? "detail" : ""}`}>
            关于
            <select
              id="select-direction"
              onChange={() => {
                const select = document.getElementById("select-direction");
                // console.log(select?.options?.[select?.selectedIndex]?.text);
                setCurrentChoice(
                  select?.options?.[select?.selectedIndex]?.text
                );
              }}
            >
              {choiceDataSource.map((el: any) => {
                return <option value={el.value}>{el.label}</option>;
              })}
            </select>
            心中默念你的问题...
          </div>
          <button
            className="tarot-start"
            id="tarot-start"
            onClick={() => {
              setIsDetail(!isDetail);
              setIsSecondDetail(!isSecondDetail);
              setLlmLoading(!llmLoading);

              const resultArray = getTwoUniqueNumbers();

              setCurrentResult([
                {
                  idx: resultArray[0],
                  direction: Math.round(Math.random()),
                },
                {
                  idx: resultArray[1],
                  direction: Math.round(Math.random()),
                },
              ]);

              if (!isDetail) {
                const button_ele = document.getElementById("tarot-start");
                gsap.to(button_ele, {
                  opacity: 0,
                  duration: 0.5,
                });
              }
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
