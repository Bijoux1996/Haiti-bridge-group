import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import Page_0 from "./pages/admin.tsx";
import PageLayout_0 from "./pages/admin.pageLayout.tsx";
import Page_1 from "./pages/login.tsx";
import PageLayout_1 from "./pages/login.pageLayout.tsx";
import Page_2 from "./pages/_index.tsx";
import PageLayout_2 from "./pages/_index.pageLayout.tsx";
import Page_3 from "./pages/pricing.tsx";
import PageLayout_3 from "./pages/pricing.pageLayout.tsx";
import Page_4 from "./pages/dashboard.tsx";
import PageLayout_4 from "./pages/dashboard.pageLayout.tsx";
import Page_5 from "./pages/favorites.tsx";
import PageLayout_5 from "./pages/favorites.pageLayout.tsx";
import Page_6 from "./pages/properties.tsx";
import PageLayout_6 from "./pages/properties.pageLayout.tsx";
import Page_7 from "./pages/reset-password.tsx";
import PageLayout_7 from "./pages/reset-password.pageLayout.tsx";
import Page_8 from "./pages/agent.$agentSlug.tsx";
import PageLayout_8 from "./pages/agent.$agentSlug.pageLayout.tsx";
import Page_9 from "./pages/admin.reset-password.tsx";
import PageLayout_9 from "./pages/admin.reset-password.pageLayout.tsx";
import Page_10 from "./pages/properties.$propertyId.tsx";
import PageLayout_10 from "./pages/properties.$propertyId.pageLayout.tsx";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/admin.tsx","/admin"],["./pages/login.tsx","/login"],["./pages/_index.tsx","/"],["./pages/pricing.tsx","/pricing"],["./pages/dashboard.tsx","/dashboard"],["./pages/favorites.tsx","/favorites"],["./pages/properties.tsx","/properties"],["./pages/reset-password.tsx","/reset-password"],["./pages/agent.$agentSlug.tsx","/agent/:agentSlug"],["./pages/admin.reset-password.tsx","/admin/reset-password"],["./pages/properties.$propertyId.tsx","/properties/:propertyId"]]);
const fileNameToComponent = new Map([
    ["./pages/admin.tsx", Page_0],
["./pages/login.tsx", Page_1],
["./pages/_index.tsx", Page_2],
["./pages/pricing.tsx", Page_3],
["./pages/dashboard.tsx", Page_4],
["./pages/favorites.tsx", Page_5],
["./pages/properties.tsx", Page_6],
["./pages/reset-password.tsx", Page_7],
["./pages/agent.$agentSlug.tsx", Page_8],
["./pages/admin.reset-password.tsx", Page_9],
["./pages/properties.$propertyId.tsx", Page_10],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}

import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // Back/forward: keep browser-like behavior
    if (navType === "POP") return;

    // Hash links: let the browser scroll to the anchor
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash, navType]);

  return null;
}

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <ScrollManager />
      <GlobalContextProviders>
        <Routes>
          {toElement({ trie: buildLayoutTrie({
"./pages/admin.tsx": PageLayout_0,
"./pages/login.tsx": PageLayout_1,
"./pages/_index.tsx": PageLayout_2,
"./pages/pricing.tsx": PageLayout_3,
"./pages/dashboard.tsx": PageLayout_4,
"./pages/favorites.tsx": PageLayout_5,
"./pages/properties.tsx": PageLayout_6,
"./pages/reset-password.tsx": PageLayout_7,
"./pages/agent.$agentSlug.tsx": PageLayout_8,
"./pages/admin.reset-password.tsx": PageLayout_9,
"./pages/properties.$propertyId.tsx": PageLayout_10,
}), fileNameToRoute, makePageRoute })} 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}
