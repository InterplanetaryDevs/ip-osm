import React from 'react';
import {AppBar, Container, CssBaseline, Toolbar} from '@mui/material';
import {IpfsContextProvider} from './service/IpfsContext';
import {MapView} from './MapView';
import {SnackbarProvider} from 'notistack';

function App() {
  return <>
    <CssBaseline/>
    <AppBar>
      <Container>
        <Toolbar>
          {/*TODO: add items*/}
        </Toolbar>
      </Container>
    </AppBar>
    <Container>
      <Toolbar/>
      <SnackbarProvider maxSnack={3}>
        <IpfsContextProvider>
          <MapView/>
        </IpfsContextProvider>
      </SnackbarProvider>
    </Container>
  </>;
}

export default App;
//https://leafletjs.com/SlavaUkraini/examples/extending/extending-2-layers.html
//https://leaflet-extras.github.io/leaflet-providers/preview/
