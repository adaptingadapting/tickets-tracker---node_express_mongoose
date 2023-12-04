import React from 'react';
import ReactDOM from 'react-dom/client';
import Client from './pages/Client.jsx';
import Service from "./pages/Service.jsx";
import ClientView from "./pages/ClientView.jsx";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({  
  palette: {
    mode: 'light',
    primary: {
    main: '#323346',
    },
    secondary: {
      main: '#498baf',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    // qr reader struggles with strictmode, everything else works fine in strictmode
     <ThemeProvider theme={theme}>
      <CssBaseline />
     <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Client/>}/>
        <Route path="/:id/services" element={<Service />}/>
        <Route path="/:id" element={<ClientView />}/>
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
)
