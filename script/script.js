'use strict';

const e = React.createElement;

class ExampleText extends React.Component {
  render() {
    return (
        <p>ExampleText</p>
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(ExampleText), domContainer);