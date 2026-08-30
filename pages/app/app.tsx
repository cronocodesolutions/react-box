import { ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';
import AiContextPage from '../pages/aiContextPage';
import BoxPage from '../pages/boxPage';
import ButtonPage from '../pages/buttonPage';
import CheckboxPage from '../pages/checkboxPage';
import ColorPage from '../pages/colorPage';
import DataGridPage from '../pages/dataGridPage';
import DropdownPage from '../pages/dropdownPage';
import FidoEnrollmentPage from '../pages/fidoEnrollmentPage';
import FlexPage from '../pages/flexPage';
import GridPage from '../pages/gridPage';
import HomePage from '../pages/homePage';
import InstallationPage from '../pages/installationPage';
import OverlayPage from '../pages/overlayPage';
import RadioButtonPage from '../pages/radioButtonPage';
import ServerComponentsPage from '../pages/serverComponentsPage';
import SvgPage from '../pages/svgPage';
import SwitchPage from '../pages/switchPage';
import TextareaPage from '../pages/textareaPage';
import TextboxPage from '../pages/textboxPage';
import TextStylePage from '../pages/textStylePage';
import ThemeSetupPage from '../pages/themeSetupPage';
import TooltipPage from '../pages/tooltipPage';
import { SiteRoutePath, siteRoutes } from '../site/site';
import Layout from './layout';

/**
 * What renders at each address. The record is keyed by the route table's own paths, so a page
 * without metadata — or metadata without a page — is a type error rather than a silent 404.
 */
const pages: Record<SiteRoutePath, ComponentType> = {
  '/': HomePage,
  '/installation': InstallationPage,
  '/theme-setup': ThemeSetupPage,
  '/server-components': ServerComponentsPage,
  '/box': BoxPage,
  '/svg': SvgPage,
  '/button': ButtonPage,
  '/textbox': TextboxPage,
  '/textarea': TextareaPage,
  '/checkbox': CheckboxPage,
  '/radiobutton': RadioButtonPage,
  '/switch': SwitchPage,
  '/tooltip': TooltipPage,
  '/overlay': OverlayPage,
  '/dropdown': DropdownPage,
  '/datagrid': DataGridPage,
  '/flex': FlexPage,
  '/grid': GridPage,
  '/style-grouping': TextStylePage,
  '/colors': ColorPage,
  '/ai-context': AiContextPage,
  '/fido-enrollment': FidoEnrollmentPage,
};

export default function App() {
  return (
    <Layout>
      <Routes>
        {siteRoutes.map(({ path }) => {
          const Page = pages[path];

          return <Route key={path} path={path} element={<Page />} />;
        })}
      </Routes>
    </Layout>
  );
}
