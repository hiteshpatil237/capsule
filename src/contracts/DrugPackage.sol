pragma solidity ^0. 5.0;

contract DrugPackage {
    string public name;
    uint public orderCount = 0;
    mapping(uint => Package) public orders;
    
    struct Package {
        uint id;
        string content;
        string quantity;
        string expiryDate;
        string temperature;
        string status;
        address payable client;
    }

   event OrderCreated(
        uint id,
        string content,
        string quantity,
        string expiryDate,
        string temperature,
        string status,
        address payable client
   );

    event OrderDeployed(
        uint id,
        string status,
        address payable client
   );

   event OrderDelivered(
        uint id,
        string status,
        address payable client
   );

    constructor() public {
        name = "Capsule Drug Package";
    }

    function createOrder(string memory _content,string memory _quantity, string memory _expiryDate, string memory _temperature, string memory _status) public {
        //Require valid content
        require(bytes(_content).length > 0);
        //Increment the order count
        orderCount ++;
        //Create the order
        orders[orderCount] = Package(orderCount, _content,_quantity, _expiryDate, _temperature, _status, msg.sender);
        //Trigger event
        emit OrderCreated(orderCount, _content, _quantity, _expiryDate, _temperature, _status, msg.sender);
    }

    function deployOrder(uint _id) public {
        //Make sure id is valid
        require(_id > 0 && _id <= orderCount);
        //Fetch the order
        Package memory _order = orders[_id];
        //Fetch the client
        address payable _client = _order.client;
        //Update the status
        _order.status = 'deployed';
        //Update the order
        orders[_id] = _order;
        //Trigger an event
        emit OrderDeployed(orderCount, _order.status, _client);
    }

    function deliverOrder(uint _id) public {
        //Make sure id is valid
        require(_id > 0 && _id <= orderCount);
        //Fetch the order
        Package memory _order = orders[_id];
        //Fetch the client
        address payable _client = _order.client;
        //Update the status
        _order.status = 'delivered';
        //Update the order
        orders[_id] = _order;
        //Trigger an event
        emit OrderDelivered(orderCount, _order.status, _client);
    }

}
