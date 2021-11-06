import React from 'react';
import styles from './transactionTable.css'
import { formatCurrency, formatDate} from '../utils/formatters'

export class TransactionTable extends React.Component {
  getTableRows(){
    let rows = [];
    for(const id in this.props.transactions){
      const transaction = this.props.transactions[id];
      rows.push( <tr key={transaction.id}>
        <td>{transaction.id}</td>
        <td>{formatCurrency(transaction.amountInUSDCents, this.props.currency)}</td>
        <td>{formatDate(transaction.date)}</td>
        <td>{transaction.merchantNetworkId}</td>
        <td>{transaction.cardId}</td>
      </tr>);
    }
    return rows;
  }

  render() {
    return <div style={{ maxHeight: "600px", overflowY:"scroll"}} >
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Merchant</th>
            <th>User</th>
          </tr>
          {
            this.getTableRows()
          }
        </tbody>
      </table>
    </div>;
  }
}