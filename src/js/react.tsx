import * as React from 'react';
import * as ReactDom from 'react-dom';

const App = () => {
  return <div>If you see dis, React Works</div>;
};

ReactDom.render(<App />, document.getElementById('reactRoot'));
