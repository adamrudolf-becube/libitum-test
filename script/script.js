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
        this.props.onSaveButtonClick();
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
                    <button className="btn success" onClick={this.onSaveButtonClick}>Save</button>
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
        this.clearUnsavedHistory = this.clearUnsavedHistory.bind(this);
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
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

    clearUnsavedHistory() {
        this.setState({
            bicycleIsSelected: false,
            warrantyIsSelected: false,
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

    onSaveButtonClick() {

        var self = this;

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.clearUnsavedHistory();
                self.updateSavedHistory();
            }
        }

        xhttp.open("POST", "api/history.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send(JSON.stringify(this.state.unSavedHistory));
    }
    
    updateSavedHistory() {
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
                    onSaveButtonClick={this.onSaveButtonClick}
                    onClearUnsavedHistory={this.clearUnsavedHistory} 
                />
            </div>
        );
    }
}
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);