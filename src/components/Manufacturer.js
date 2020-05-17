import React, { Component } from 'react';
import Identicon from 'identicon.js';



class Manufacturer extends Component {

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
      loading: true, 
      latitude: null,
      longitude: null,
      userAddress: null
    }
  
    this.getLocation = this.getLocation.bind(this)
    this.getCoordinates = this.getCoordinates.bind(this)
  }

    render() {
        return (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const content = this.orderContent.value
                  const quantity = this.orderQuantity.value
                  const expiryDate = this.orderExpiryDate.value
                  const temperature = this.orderTemperature.value
                  const status = this.orderStatus.value
                  this.props.createOrder(content, quantity, expiryDate, temperature, status)
                }}>
                  <div className="form-group mr-sm-2">
                    <input id="orderContent" type="text" ref={(input) => { this.orderContent = input }} className="form-control" placeholder="What do you want to order?" required />
                    <input id="orderQuantity" type="text" ref={(input) => { this.orderQuantity = input }} className="form-control" placeholder="What is the quantity?" required />
                    <input id="orderExpiryDate" type="text" ref={(input) => { this.orderExpiryDate = input }} className="form-control" placeholder="What is the expiry date?" required />
                    <input id="orderTemperature" type="text" ref={(input) => { this.orderTemperature = input }} className="form-control" placeholder="What is the temperature?" required />
                    <input id="orderStatus" type="text" ref={(input) => { this.orderStatus = input }} className="form-control" placeholder="What is the status?" required />
                  </div> 
                  <button type="submit" className="btn btn-primary btn-block">Create</button> 
                </form>
                <p>&nbsp;</p>
                { this.props.orders.map((order, key) =>  {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <img  
                            className='ml-2'
                            width='30'
                            height='30'
                            src={`data:image/png;base64,${new Identicon(order.client, 30).toString()}`}
                        />
                        <small className="text-muted"> Client : {order.client} </small>
                      </div>
                      <ul id="orderList" className="list-group">
                        <ul className="list-group list-group-horizontal">
                          <li className="list-group-item"> Content : {order.content} </li>
                          <li className="list-group-item"> Quantity : {order.quantity} </li>
                        </ul>
                        <ul className="list-group list-group-horizontal " >
                          <li className="list-group-item"> Expiry Date : {order.expiryDate} </li>
                          <li className="list-group-item"> Temperature : {order.temperature} </li>
                        </ul>
                        <li key={key} className="list-group-item py-2">
                          <p> Status : {order.status} </p>
                        </li>
                        <li className="list-group-item py-2">
                          <button className="btn btn-primary btn-block" onClick={this.getLocation}>Get Coordinates</button>
                          <p className="mt-3">latitude: {this.state.latitude} </p>
                          <p>longitude: {this.state.longitude} </p>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>
        );
    }
}

export default Manufacturer;