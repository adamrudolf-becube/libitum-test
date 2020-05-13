// Fake data to temporary mimic API responses
var unSavedHistory = [
    {
        "dateTime": "2020-05-13 14:54",
        "bicycleIsSelected": true,
        "warrantyIsSelected": false,
    },
    {
        "dateTime": "2020-05-13 14:52",
        "bicycleIsSelected": false,
        "warrantyIsSelected": false,
    },
]

// Fake data to temporary mimic API responses
var savedHistory = [
    {
        "dateTime": "2020-05-13 13:15",
        "bicycleIsSelected": true,
        "warrantyIsSelected": true,
    },
    {
        "dateTime": "2020-05-13 13:12",
        "bicycleIsSelected": true,
        "warrantyIsSelected": false,
    },
    {
        "dateTime": "2020-05-13 11:50",
        "bicycleIsSelected": false,
        "warrantyIsSelected": false,
    },
]

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

function TableIcon(props) {
    return props.checked ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>;
}

function HistoryContainer(props) {

    const unsavedTableRows = unSavedHistory.map((element) =>
        <tr key={element["dateTime"]} className="unsaved">
            <td>{element["dateTime"]}</td>
            <td><TableIcon checked={element["bicycleIsSelected"]} /></td>
            <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
            <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
        </tr>
    );

    const savedTableRows = savedHistory.map((element) =>
        <tr key={element["dateTime"]} className="saved">
            <td>{element["dateTime"]}</td>
            <td><TableIcon checked={element["bicycleIsSelected"]} /></td>
            <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
            <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
        </tr>
    );
    
    return (
        <div id="history-container">
            <ButtonContainer />
            <HistoryTable>
                {unsavedTableRows}
                {savedTableRows}
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