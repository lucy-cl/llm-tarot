import { lazy, Suspense } from "react";

const routeConfig: any = {
  routes: [
    {
      name: "home",
      path: "/edtor",
      component: lazy(() => import("@/page/home")),
    },
    {
      name: "tarot",
      path: "/",
      component: lazy(() => import("@/page/tarot")),
    },
  ],
};

function createRouteConfig(routeList: any): any[] {
  return routeList.map((item: any) => {
    const Com = item.component;

    return {
      path: item.path,
      element: (
        <Suspense fallback={<p>Loading...</p>}>
          <Com />
        </Suspense>
      ),
      /**
       * 支持覆盖原属性
       */
      ...item,
      children: item.children && createRouteConfig(item.children),
    };
  });
}

export default createRouteConfig(routeConfig.routes);
