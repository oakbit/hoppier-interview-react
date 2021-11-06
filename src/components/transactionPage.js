import React from 'react';
import { getMerchants, getTransactions, getUsers} from '../utils/GraphQLData'
import { TransactionTable, TransactionSummary } from './'

class Loader extends React.Component {
  render(){
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", width:"100vw"}}>
      <h1>LOADING</h1>
    </div>;
  }
}

class CurrencySwitcher extends React.Component {
  constructor(props){
    super(props);
    this.currencyOptions = ['CAD', 'USD']
    this.currencyChanged(this.props.initialCurrency);
  }

  currencyChanged(currency){
    this.selected = currency;
    this.props.currencyChanged(currency);
  }

  render(){
    return <div style={{ display: 'flex',  justifyContent:"center", alignItems:"center"}}>
      {
        this.currencyOptions.map((currency, idx, array) => {
          return <button key={currency} style={{ padding: '5px', color: "white", fontWeight: "bold", backgroundColor:this.selected === currency ? "lightblue" : 'lightgray'}} onClick={this.currencyChanged.bind(this,currency)}>{currency}</button>;
        })
      }
    </div>;
  }
}

export class TransactionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, transactions: [], users: [], merchants: []};
  }
  
  componentDidMount(){
    this.loadData().then(async ()=> {
      
      await this.setView({
        currency: 'CAD',
        transactions: this.state.transactions, 
        merchants: this.state.merchants, 
        users: this.state.users
      });
      this.setState({
        loading: false,
      })
    });
  }

  /**
   * Performs a shallow update to the view data
   * @param {*} data  Any data that is accessible by visible page components
   */
  async setView(data) {
    let view = this.state.view;

    view = {
      ...view,
      ...data
    };

    this.setState({
      view
    });
  }

  switchCurrency(currency){
    // Filter the visible transactions to the selected currency
    let viewTransactions = [];
    for(const id in this.state.transactions){
      const transaction = this.state.transactions[id];
      const merchant = this.state.merchants[transaction.merchantNetworkId];
      if(merchant && merchant.currency === currency){
        viewTransactions.push(transaction);
      }
    }

    this.setView({
      transactions: viewTransactions,
      currency
    });
  }
  
  async loadData(){ 
    try{
      // Map arrays to objects because it's easier to do lookups
      const [ users, merchants, transactions] = await Promise.all([
        getUsers().then((a) => new Promise((resolve)=> resolve(this.arrayToObject(a,'cardId')))), 
        getMerchants().then((a) => new Promise((resolve)=> resolve(this.arrayToObject(a,'networkId')))), 
        getTransactions().then((a) => new Promise((resolve)=> resolve(this.arrayToObject(a,'id')))), 
      ]);
      
      this.setState({
        users,
        transactions,
        merchants,
      });
    } catch(e) {
      console.log("Failed to load data:", e);
      // Error redirect
    }
  }

  arrayToObject(array, objectKeyProperty){
    return array.reduce((object, element)=> { 
      object[element[objectKeyProperty]] = element;
      return object;
    }, {});
  }
  
  render() {
    return <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
      { this.state.loading ? 
        <Loader/> :
        <div style={{marginTop: "30px", marginBottom:"30px", maxWidth:"800px"}}>
          <CurrencySwitcher initialCurrency={this.state.view.currency} currencyChanged={this.switchCurrency.bind(this)}/>
          <TransactionSummary transactions={this.state.view.transactions} currency={this.state.view.currency}></TransactionSummary>
          <TransactionTable transactions={this.state.view.transactions} currency={this.state.view.currency}></TransactionTable>
        </div>
      }
    </div>
  }
}