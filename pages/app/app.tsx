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
import RadioButtonPage from '../pages/radioButtonPage';
import TextareaPage from '../pages/textareaPage';
import TextboxPage from '../pages/textboxPage';
import TextStylePage from '../pages/textStylePage';
import ThemeSetupPage from '../pages/themeSetupPage';
import TooltipPage from '../pages/tooltipPage';
import Layout from './layout';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/installation" element={<InstallationPage />} />
        <Route path="/theme-setup" element={<ThemeSetupPage />} />
        <Route path="/box" element={<BoxPage />} />
        <Route path="/flex" element={<FlexPage />} />
        <Route path="/grid" element={<GridPage />} />
        <Route path="/textbox" element={<TextboxPage />} />
        <Route path="/textarea" element={<TextareaPage />} />
        <Route path="/datagrid" element={<DataGridPage />} />
        <Route path="/button" element={<ButtonPage />} />
        <Route path="/checkbox" element={<CheckboxPage />} />
        <Route path="/radiobutton" element={<RadioButtonPage />} />
        <Route path="/tooltip" element={<TooltipPage />} />
        <Route path="/dropdown" element={<DropdownPage />} />
        <Route path="/style-grouping" element={<TextStylePage />} />
        <Route path="/colors" element={<ColorPage />} />
        <Route path="/ai-context" element={<AiContextPage />} />
        <Route path="/fido-enrollment" element={<FidoEnrollmentPage />} />
      </Routes>
    </Layout>
  );
}
