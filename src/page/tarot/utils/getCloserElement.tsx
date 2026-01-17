export function getClosestElementsToViewportCenter(elements: NodeListOf<Element>) {
    // 获取视窗中心坐标
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
  
    // 计算元素与视窗中心的距离
    const elementsWithDistance = Array.from(elements).map(element => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(
        centerX - viewportCenterX,
        centerY - viewportCenterY
      );
      return { element, distance };
    });
  
    // 按距离排序并返回前两个元素
    return elementsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(item => item.element?.id)?.sort((a: string, b: string) => Number(a?.split('-')?.[1]) - Number(b?.split('-')?.[1]));
  }