import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BasicFormExample from './pages/BasicFormExample/BasicFormExample';
import ExampleIndex from './pages/ExampleIndex/ExampleIndex';
import { Paths } from './pages/Paths';
import UseDebugExample from './pages/UseDebugExample/UseDebugExample';
import UseImmerFormExample from './pages/UseImmerFormExample/UseImmerFormExample';
import UseImmerFormYupExample from './pages/UseImmerFormYupExample/UseImmerFormYupExample';
import UseSubFormErrorExample from './pages/UseSubFormErrorExample/UseSubFormErrorExample';
import UseSubFormExample from './pages/UseSubFormExample/UseSubFormExample';
import UseTokenExample from './pages/UseTokenExample/UseTokenExample';
import UseWatchExample from './pages/UseWatchExample/UseWatchExample';
import { GlobalStyled } from "../src/styles/globalStyled"
import { ResetStyled } from "./styles/resetStyled"
import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/defaultTheme"
import UseFieldExample from './pages/UseFieldExample/UseFieldExample';

const App = () => {

  return <ThemeProvider theme={defaultTheme}>
    <ResetStyled />
    <GlobalStyled />
    <BrowserRouter>
      <Routes>
        <Route path={Paths.home} element={<ExampleIndex />} />
        <Route path={Paths.basicFormExample} element={<BasicFormExample />} />
        <Route path={Paths.useImmerForm} element={<UseImmerFormExample />} />
        <Route path={Paths.useImmerFormYup} element={<UseImmerFormYupExample />} />
        <Route path={Paths.useToken} element={<UseTokenExample />} />
        <Route path={Paths.useWatch} element={<UseWatchExample />} />
        <Route path={Paths.useSubForm} element={<UseSubFormExample />} />
        <Route path={Paths.useSubFormError} element={<UseSubFormErrorExample />} />
        <Route path={Paths.useDebug} element={<UseDebugExample />} />
        <Route path={Paths.useField} element={<UseFieldExample />} />
        <Route path="/" element={<Navigate to={Paths.home} replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
}

export default App;