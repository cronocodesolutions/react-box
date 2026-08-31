import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFoundPage from '../pages/notFoundPage';
import { SiteRoutePath, siteRoutes } from '../site/site';
import Layout from './layout';
import pageFor from './routePages';

/** One route's page: the module itself once loaded, a suspending stand-in while its chunk arrives. */
function RoutePage({ path }: { path: SiteRoutePath }) {
  // Both halves of `pageFor` are memoized per path, so the identity this returns is stable and the
  // remount the rule guards against cannot happen — but which half answers is only knowable here,
  // after `preloadPage` has run.
  const Page = pageFor(path);

  // eslint-disable-next-line react-hooks/static-components
  return <Page />;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          {siteRoutes.map(({ path }) => (
            <Route key={path} path={path} element={<RoutePage path={path} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
