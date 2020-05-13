function ProductBox(props) {
    return (
        <label class="container">{props.name}
            <input type="checkbox" checked={props.checked} disabled={props.disabled} />
            <span class="checkmark"></span>
        </label>
    );
}

function App(props) {
    return (
        <div id="checkbox-container">
            <ProductBox name="Awesome bicycle" />
            <ProductBox name="Extended warranty"  />
            <ProductBox name="Gratis 3 months" disabled />
        </div>
    );
}
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );