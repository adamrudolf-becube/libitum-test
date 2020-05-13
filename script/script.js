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

class ProductBox extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
        this.props.onChange();
    }

    render() {
        return (
            <label className="container">{this.props.name}
                <input type="checkbox" onChange={this.handleChange} checked={this.props.checked} disabled={this.props.disabled} />
                <span className="checkmark"></span>
            </label>
        );
    }
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

    const unsavedTableRows = props.unSavedHistory.map((element) =>
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bicycleIsSelected: false,
            warrantyIsSelected: false,
            unSavedHistory: []
        }
        this.handleBicycleStateChange = this.handleBicycleStateChange.bind(this);
        this.handleWarrantyStateChange = this.handleWarrantyStateChange.bind(this);
    }

    handleBicycleStateChange() {
        if (this.state.bicycleIsSelected) {
            this.setState((state) => ({
                bicycleIsSelected: false,
                warrantyIsSelected: false
            }));
        } else {
            this.setState((state) => ({
                bicycleIsSelected: true
            }));
        }
    }

    handleWarrantyStateChange() {
        this.setState((state) => ({warrantyIsSelected: !state.warrantyIsSelected}));
    }

    render() {
        return (
            <div id="app">
                <h1>Libitum test</h1>
                <div id="checkbox-container">
                    <ProductBox
                     name="Awesome bicycle"
                     onChange={this.handleBicycleStateChange}
                     checked={this.state.bicycleIsSelected}
                    />
                    <ProductBox 
                     name="Extended warranty" 
                     onChange={this.handleWarrantyStateChange} 
                     checked={this.state.warrantyIsSelected} 
                     disabled={!this.state.bicycleIsSelected} 
                    />
                    <ProductBox
                     name="Gratis 3 months" 
                     checked={this.state.warrantyIsSelected} 
                     disabled 
                    />
                </div>
                <HistoryContainer unSavedHistory={this.state.unSavedHistory} />
            </div>
        );
    }
}
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );