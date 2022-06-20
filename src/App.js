import React from 'react';
import MevDegen from './MevDegen';
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

class App extends React.Component {

  render() {
    return (
      <ThirdwebProvider desiredChainId={ChainId.polygonMainnet}>
        <MevDegen />
      </ThirdwebProvider>
    );
  }
}

export default App;
