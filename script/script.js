
/**
 * Converts an ISO date string to a more readable YYYY-MM-DD format.
 * 
 * Example:
 * 
 *      "2020-05-14T18:07:28.284Z" -> "2020-05-14 18:07:28"
 * 
 * @param {string} ISOString ISO representation of a Date object
 * 
 * @return the date in a YYYY-MM-DD hh:mm:ss format.
 */
function ISOStringToReadable(ISOString) {
    return ISOString.substring(0,19).replace("T", " ")
}

/**
 * ProductBox represents a selectable product.
 * 
 * Product box has a fancy clickable checkbox and a label.
 * 
 * @param {string} name is displayed as a product name next to the checkbox.
 * @param {function} onChange callback to be called when "checked" state changes.
 * @param {bool} checked product is selected if true and unselected if false
 * @param {bool} disabled user cannot change the state (i.e. product is unselectable) if true.
 *      A css class "disabled" is also added when true. Product is selectable and css class
 *      "disabled" is not present if false.
 */
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

/**
 * History table renders a table with a fixed 4 column header, and flexible children.
 * 
 * Header fields are "Date and time", "Awesome bicycle", "Extended warranty" and "Gratis 3 months".
 * The table has a body where HistoryTable renders it's child elements. They are expected to be
 * table rows with these 4 columns.
 * 
 * @param {JSX elements} props table rows preferably with 4 fields.
 */
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

/**
 * TableIcon renders an <i> element with the font-awesome check or "X" symbol based
 * on whether the "checked" property is true or false.
 * 
 * @param {bool} checked any varialbe JavaScript can interpret as true or false
 */
function TableIcon(props) {
    return props.checked ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>;
}

/**
 * HistoryContainer contains 3 buttons and the HistoryTable.
 * 
 * The component renders 3 buttons: "Save", "Clear unsaved history"
 * and "Delete whole history". The 3 buttons expect their callback in props.
 * 
 * The contents of the HistoryTable must be also given in 2 separate props: 
 * one for saved and one for the unsaved history. (I.e. the ones from the 
 * database and from the current run.
 * 
 * @param {function} onSaveButtonClick callback for the "Save" button
 * @param {function} onClearUnsavedHistory callback for the "Clear unsaved history" button
 * @param {function} onDeleteAllHistory callback for the "Delete whole history" button
 * @param {JSON} unSavedHistory JSON array to be displayed on the top of the HistoryTable. Example data:
 *      [
 *          {
 *              bicycleIsSelected: true
 *              dateTime: "2020-05-14T18:07:28.284Z"
 *              warrantyIsSelected: false
 *          }
 *          {
 *              bicycleIsSelected: true
 *              dateTime: "2020-05-14T18:07:28.867Z"
 *              warrantyIsSelected: true
 *          }
 *          {
 *              bicycleIsSelected: false
 *              dateTime: "2020-05-14T18:07:29.642Z"
 *              warrantyIsSelected: false
 *          }
 *      ]
 * @param {JSON} savedHistory JSON array to be displayed on the bottom of the HistoryTable. Example data:
 *     [
 *         {
 *             0: "98"
 *             1: "2020-05-14 18:06:49"
 *             2: "1"
 *             3: "0"
 *             ID: "98"
 *             bicycleSelected: "1"
 *             datetime: "2020-05-14 18:06:49"
 *             warrantySelected: "0"
 *         }
 *         {
 *             0: "99"
 *             1: "2020-05-14 18:06:50"
 *             2: "1"
 *             3: "1"
 *             ID: "99"
 *             bicycleSelected: "1"
 *             datetime: "2020-05-14 18:06:50"
 *             warrantySelected: "1"
 *         }
 *     ]
 */
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

/**
 * App renders the whole application and maintains the common state.
 * 
 * App renders the 3 products: "Awesome bicycle", "Extended warranty" and "Gratis 3 months"
 * 
 * App handles logic behind checkbox "checked" and "disabled" properties, stores information
 * about the saved (in database) history, unsaved history (not yet in database), and handles
 * callbacks of button clicks maintaining connection to the backend via http requests.
 * 
 *  - Checkbox logic
 *      - If "Awesome bicycle" is selected, "Extended warranty" is selectable
 *      - If "Awesome bicycle" is not selected, "Extended warranty" is unselected and disabled
 *      - If "Extended warranty" is selected, "Gratis 3 months" is selected and vica versa.
 *      - "Gratis 3 months" is always disabled.
 * 
 *  - Checkbox states
 *      - Every checkbox change is appended to unsaved history and immediately displayed on the
 *        history table.
 *      - If the application is started and database is empty, all checkboxes start unselected
 *        and table is empty.
 *      - If the application is started and database is not empty, checkboxes are set to the last 
 *        saved state and table shows the saved history.
 * 
 *  - User actions
 *      - User can save the unsaved history to the database. Unsaved history gets empty and what
 *        was earlier in unsaved history, gets to the saved history (indirectly, through the database).
 *        Checkboxes are set to the last saved sate (no change in this case).
 *      - User can delete the unsaved history and return to the last saved state.
 *      - User can delete all (saved and unsaved) history. In this case the saved and unsaved history
 *        gets empty, database gets cleared and all checkboxes become unchecked.
 * 
 * App doesn't expect any props.
 */
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

        this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
        this.onClearUnsavedHistoryButtonClick = this.onClearUnsavedHistoryButtonClick.bind(this);
        this.onDeleteSavedHistoryButtonClick = this.onDeleteSavedHistoryButtonClick.bind(this);

        this.handleBicycleStateChange = this.handleBicycleStateChange.bind(this);
        this.handleWarrantyStateChange = this.handleWarrantyStateChange.bind(this);
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

    onClearUnsavedHistoryButtonClick() {
        this.clearUnsavedHistory();
    }
    
    onDeleteSavedHistoryButtonClick() {
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
        this.appendStateToUnsavedHistory();
    }

    handleWarrantyStateChange() {
        this.setState((state) => ({warrantyIsSelected: !state.warrantyIsSelected}));
        this.appendStateToUnsavedHistory();
    }

    appendStateToUnsavedHistory() {
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
                    onClearUnsavedHistory={this.onClearUnsavedHistoryButtonClick}
                    onDeleteAllHistory={this.onDeleteSavedHistoryButtonClick}
                />
            </div>
        );
    }
}
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);