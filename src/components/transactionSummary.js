import React from 'react';
import { formatCurrency } from '../utils/formatters'

export class TransactionSummary extends React.Component {
  constructor(props) {
    super(props);
    this.transactions = props.transactions;
  }

  getTransactionSummary() {
    let total = 0;
    for(const id in this.props.transactions){
      const transaction = this.props.transactions[id];
      total += transaction.amountInUSDCents
    }
    
    return {total: formatCurrency(total, this.props.currency)}
  }

  render() {
    return <div style={{margin:"10px", fontSize:"16px", fontWeight:"bold", textAlign:"center"}}> 
      <div style={{fontSize:"1.1em" }}>
        Total
      </div>
      <div style={{fontSize:"1em"}}>
        { this.getTransactionSummary().total}
      </div>
    </div>;
  }
}