import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sortBy: 'date', rev: false, json: {transactions: []}};
        this.sortby = this.sortby.bind(this);
        this.sort = this.sort.bind(this);
        fetch("src/spec.json")
            .then(response => response.json())
            .then(responseJson => {
                this.setState({json: responseJson});
            })
    }

    sortby(val) {
        let rev = this.state.rev;
        if (val == this.state.sortBy && !rev) {
            rev = true;
        } else {
            rev = false;
        }
        this.setState({sortBy: val, rev: rev});
    }

    sort() {
        let sorted = this.state.json.transactions;
        switch (this.state.sortBy) {
            case 'date':
                sorted.sort(function(a,b) {
                    return new Date(a.date) - new Date(b.date);
                });
                break;
            case 'desc':
                sorted.sort(function(a,b) {
                    return a.desc.localeCompare(b.desc);
                });
                break;
            case 'amount':
                sorted.sort(function(a,b) {
                    return parseFloat(a.amount) - parseFloat(b.amount);
                })
            case 'tags':
                sorted.sort(function(a,b) {
                    return a.tags.localeCompare(b.tags);
                })
        }
        if (this.state.rev) {
            sorted.reverse();
        }
        return sorted;
    }

    render() {
        let sorted = this.sort();
        let rows = sorted.map((trans, id) =>
            <tr key={trans.id}>
                <td>{trans.date}</td>
                <td>
                    <span id="from">{trans.from}</span><br/>
                    {trans.desc}
                </td>
                <Amount amount={trans.amount}/>
                <td>{trans.tags || "-"}</td>
                <td>{trans.invoice || "-"}</td>
            </tr>
        );
        return (
            <div className="block">
                <table>
                    <thead>
                        <tr>
                            <th onClick={this.sortby.bind(this, 'date')}>Date</th>
                            <th onClick={this.sortby.bind(this, 'desc')}>Description</th>
                            <th onClick={this.sortby.bind(this, 'amount')}>Amount</th>
                            <th onClick={this.sortby.bind(this, 'tags')}>Tags</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Amount extends React.Component {
    render() {
        let color = '#34d40c';
        if (this.props.amount.substr(0,1) == '-') {
            color = '#D50C2D';
        }
        return (
            <td style={{'color': color}}>{this.props.amount}</td>
        );
    }
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
