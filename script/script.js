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
            <label className={this.props.disabled ? "disabled container" : "container"}>{this.props.name}
                <input type="checkbox" onChange={this.handleChange} checked={this.props.checked} disabled={this.props.disabled} />
                <span className="checkmark"></span>
            </label>
        );
    }
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

class HistoryContainer extends React.Component {
    constructor(props) {
        super(props);
        
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
        this.onClearUnsavedHistoryButtonClick = this.onClearUnsavedHistoryButtonClick.bind(this);
        this.onDeleteFullHistoryButtonClick = this.onDeleteFullHistoryButtonClick.bind(this);
    }

    onSaveButtonClick(e) {

    }

    onClearUnsavedHistoryButtonClick(e) {
        this.props.onClearUnsavedHistory();
    }

    onDeleteFullHistoryButtonClick(e) {
        
    }

    render() {

        const unsavedTableRows = this.props.unSavedHistory.map((element) =>
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
                <div id="button-container">
                    <button className="btn success">Save</button>
                    <button className="btn warning" onClick={this.onClearUnsavedHistoryButtonClick}>Clear unsaved history</button>
                    <button className="btn danger">Delete whole history</button>
                </div>
                <HistoryTable>
                    {unsavedTableRows}
                    {savedTableRows}
                </HistoryTable>
            </div>
        )
    }
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
        this.clrearUnsavedHistory = this.clrearUnsavedHistory.bind(this);
    }

    appendStateToHistory() {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString();
        this.setState((state) => ({
            unSavedHistory: [{
                "dateTime": currentDateString,
                "bicycleIsSelected": state.bicycleIsSelected,
                "warrantyIsSelected": state.warrantyIsSelected,
            }].concat(state.unSavedHistory)
        }));
    }

    clrearUnsavedHistory() {
        this.setState({
            unSavedHistory: []
        });
    }

    handleBicycleStateChange() {
        if (this.state.bicycleIsSelected) {
            this.setState({
                bicycleIsSelected: false,
                warrantyIsSelected: false
            });
        } else {
            this.setState({
                bicycleIsSelected: true
            });
        }
        this.appendStateToHistory();
    }

    handleWarrantyStateChange() {
        this.setState((state) => ({warrantyIsSelected: !state.warrantyIsSelected}));
        this.appendStateToHistory();
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
                <HistoryContainer
                    unSavedHistory={this.state.unSavedHistory}
                    onClearUnsavedHistory={this.clrearUnsavedHistory} 
                />
            </div>
        );
    }
}
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );