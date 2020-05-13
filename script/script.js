function ProductBox(props) {
    return (
        <label className="container">{props.name}
            <input type="checkbox" checked={props.checked} disabled={props.disabled} />
            <span className="checkmark"></span>
        </label>
    );
}

function ProductBoxContainer(props) {
    return (
        <div id="checkbox-container">
            <ProductBox name="Awesome bicycle" />
            <ProductBox name="Extended warranty"  />
            <ProductBox name="Gratis 3 months" disabled />
        </div>
    );
}

function ButtonContainer(props) {
    return (
        <div id="button-container">
            <button className="btn success">Save</button>
            <button className="btn warning">Clear unsaved history</button>
            <button className="btn danger">Delete whole history</button>
        </div>
    );
}

function HistoryTable(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Date and time</th>
                    <th>Awesome bicycle</th>
                    <th>Extended warranty</th>
                    <th>Gratis 3 months</th>
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    );
}

function HistoryContainer(props) {
    return (
        <div id="history-container">
            <ButtonContainer />
            <HistoryTable>
                <tr class="unsaved">
                    <td>2020. may 13th 13:11</td>
                    <td><i class="fa fa-check"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                </tr>
                <tr class="unsaved">
                    <td>2020. may 13th 13:09</td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                </tr>
                <tr class="saved">
                    <td>2020. may 13th 13:07</td>
                    <td><i class="fa fa-check"></i></td>
                    <td><i class="fa fa-check"></i></td>
                    <td><i class="fa fa-check"></i></td>
                </tr>
                <tr class="saved">
                    <td>2020. may 13th 12:59</td>
                    <td><i class="fa fa-check"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                </tr>
                <tr class="saved">
                    <td>2020. may 13th 12:57</td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                    <td><i class="fa fa-remove"></i></td>
                </tr>
            </HistoryTable>
        </div>
    )
}

function App(props) {
    return (
        <div id="app">
            <h1>Libitum test</h1>
            <ProductBoxContainer />
            <HistoryContainer />
        </div>
    );
}
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );