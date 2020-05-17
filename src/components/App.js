import React, { Component } from 'react';
import Web3 from  'web3';
import Identicon from 'identicon.js';
import './App.css';
import DrugPackage from '../abis/DrugPackage.json';
import Navbar from './Navbar';
import Manufacturer from './Manufacturer';
import Deploy from './Deploy';
const API_KEY = "AIzaSyAFn5Xp4X7-QmeueZmfPNFtYnpw_XwxCWY"

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData =  DrugPackage.networks[networkId]
    if(networkData) {
      const drugPackage = web3.eth.Contract(DrugPackage.abi, networkData.address)
      this.setState({ drugPackage })
      const orderCount = await drugPackage.methods.orderCount().call()
      this.setState({ orderCount })
      //Load Orders
      for (var i = 1; i <= orderCount; i++) {
        const order = await drugPackage.methods.orders(i).call()
        this.setState({
          orders: [...this.state.orders, order]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Drug Package contract has not been deployed to the detected network.')
    }
  }

  createOrder(content, quantity, expiryDate, temperature, status) {
    this.setState({ loading: true })
    this.state.drugPackage.methods.createOrder(content, quantity, expiryDate, temperature, status).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  deployOrder(id) {
    this.setState({ loading: true })
    this.state.drugPackage.methods.deployOrder(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
    } else {
      alert("Geolocation is not supported in this browser.");
    }
  }

  getCoordinates(position) {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
  }

  handleLocationError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for geolocation")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occured")
        break;
      default:
        alert("An unknown error occured")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      drugPackage: null,
      orderCount: 0,
      orders: [],
      loading: true, 
      latitude: null,
      longitude: null,
      userAddress: null
    }
    this.createOrder = this.createOrder.bind(this)
    this.deployOrder = this.deployOrder.bind(this)
    this.getLocation = this.getLocation.bind(this)
    this.getCoordinates = this.getCoordinates.bind(this)
  }
 
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
          // this.state.account === "0x1DAd6631Fd36ACbD0Ed40BD43d237c5712505deA" 
          {  this.state.account === "0x1DAd6631Fd36ACbD0Ed40BD43d237c5712505deA"
              
            ? <div id="loader" className="text-center mt-5"><p>The address hash has been changed</p></div>
            : <Manufacturer 
                orders={this.state.orders}
                createOrder={this.createOrder}
              />
          }
          <button type="submit" className="btn btn-primary btn-lg btn-block">Deploy Orders</button>
          <Deploy 
                orders={this.state.orders}
                deployOrder={this.deployOrder}
              /> 
        
      </div>
      
    );
  }
}

export default App;
