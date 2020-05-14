
/**
 * Converts an ISO date string to a more readable YYYY-MM-DD format.
 * 
 * @param {string} ISOString ISO representation of a Date object
 * 
 * @return the date in a YYYY-MM-DD hh:mm:ss format.
 */
function ISOStringToReadable(ISOString) {
    return ISOString.substring(0,19).replace("T", " ")
}

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
        this.props.onDeleteAllHistory();
    }

    render() {

        const unsavedTableRows = this.props.unSavedHistory.map((element) =>
            <tr key={element["dateTime"]} className="unsaved">
                <td>{ISOStringToReadable(element["dateTime"])}</td>
                <td><TableIcon checked={element["bicycleIsSelected"]} /></td>
                <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
                <td><TableIcon checked={element["warrantyIsSelected"]} /></td>
            </tr>
        );

        var savedTableRows = this.props.savedHistory.map((element) =>
            <tr key={element["ID"]} className="saved">
                <td>{element["datetime"]}</td>
                <td><TableIcon checked={parseInt(element["bicycleSelected"])} /></td>
                <td><TableIcon checked={parseInt(element["warrantySelected"])} /></td>
                <td><TableIcon checked={parseInt(element["warrantySelected"])} /></td>
            </tr>
        );
        savedTableRows.reverse();

        return (
            <div id="history-container">
                <div id="button-container">
                    <button className="btn success" onClick={this.onSaveButtonClick}>Save</button>
                    <button className="btn warning" onClick={this.onClearUnsavedHistoryButtonClick}>Clear unsaved history</button>
                    <button className="btn danger" onClick={this.onDeleteFullHistoryButtonClick}>Delete whole history</button>
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
            unSavedHistory: [],
            savedHistory: []
        }
        this.updateSavedHistory();
        this.handleBicycleStateChange = this.handleBicycleStateChange.bind(this);
        this.handleWarrantyStateChange = this.handleWarrantyStateChange.bind(this);
        this.clearUnsavedHistory = this.clearUnsavedHistory.bind(this);
        this.deleteSavedHistory = this.deleteSavedHistory.bind(this);
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

    deleteSavedHistory() {
        var self = this;

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.clearUnsavedHistory();
                self.updateSavedHistory();
            }
        }

        xhttp.open("DELETE", "api/history.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");

        xhttp.send();
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

        var reversedUnsavedHistory = this.state.unSavedHistory;
        reversedUnsavedHistory.reverse();
        xhttp.send(JSON.stringify(reversedUnsavedHistory));
    }
    
    updateSavedHistory() {

        var self = this;

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var responseJson = JSON.parse(this.responseText);
                self.setState({
                    savedHistory: responseJson
                });
            }
        }

        xhttp.open("GET", "api/history.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send();
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
                    savedHistory={this.state.savedHistory}
                    onSaveButtonClick={this.onSaveButtonClick}
                    onClearUnsavedHistory={this.clearUnsavedHistory}
                    onDeleteAllHistory={this.deleteSavedHistory}
                />
            </div>
        );
    }
}
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);