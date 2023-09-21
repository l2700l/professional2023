// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract token {

  enum Phase {SEED, PRIVATE, PUBLIC}

  enum Role {OWNER, PRIVATE, PUBLIC, USER}

  address public owner;
  address public publicProvider;
  address public privateProvider;

  mapping (address => uint) public balanceOf;
  mapping (address => Role) public roles;
  address[] public users;

  mapping (address => bool) public whitelist;
  mapping (address => string) public requests;
  address[] public requestsAddresses;
  
  uint public timeStart = block.timestamp;
  uint8 public timeDiff = 0;
  Phase public currentPhase = Phase.SEED;
  address currentOwner;

  string public name = "CryptoMonster";
  string public symbol = "CMON";
  uint public totalSuply = 10000000;
  uint public digits = 12;
  uint public cost = 1 ether * 75 / 100000;
  uint public phaseLimit;
  
  mapping (address => mapping (address => uint)) public allow;

  mapping (address => uint) public seedTokens;
  mapping (address => uint) public privateTokens;
  mapping (address => uint) public publicTokens;

  function _addUser(address addr, Role role) private {
    users.push(addr);
    roles[addr] = role;
  }

  function _transfer(address from, address to, uint amount) private {
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    _setPhaseHistrory(to, amount);
  }

  function _setPhaseHistrory(address to, uint amount) private {
    if (currentPhase == Phase.SEED) {
      seedTokens[to] +=amount;
    }
    if (currentPhase == Phase.PRIVATE) {
      privateTokens[to] +=amount;
    }
    if (currentPhase == Phase.PUBLIC) {
      publicTokens[to] +=amount;
    }
  }

  constructor(address _private, address _public, address _investor1, address _investor2, address _friend) {
    owner = msg.sender;
    privateProvider = _private;
    publicProvider = _public;
    _addUser(msg.sender, Role.OWNER);
    _addUser(_private, Role.PRIVATE);
    _addUser(_public, Role.PUBLIC);
    _addUser(_investor1, Role.USER);
    _addUser(_investor2, Role.USER);
    _addUser(_friend, Role.USER);
    balanceOf[owner] += 10000000;
    seedTokens[owner] += 10000000;
    _transfer(owner, _investor1, 300000);
    _transfer(owner, _investor2, 400000);
    _transfer(owner, _friend, 200000);
  }

  function transfer(address to, uint amount) public enoughtTokens(msg.sender, amount) checkTokenLimit(amount) {
    _transfer(msg.sender, to, amount);
  }

  function transferFrom(address from, address to, uint amount) public enoughtTokens(from, amount) checkTokenLimit(amount) {
    require(allow[from][msg.sender] >= amount, "Allow smaller then amount");
    allow[from][msg.sender] -= amount;
    _transfer(from, to, amount);
  }

  function createRequest(string memory text) public {
    requests[msg.sender] = text;
    requestsAddresses.push(msg.sender);
  }

  function approveRequest(address addr, bool isAccept) public {
    require(msg.sender == privateProvider,"only private provider can do this operation");
    requests[addr] = "";
    whitelist[addr] = isAccept;
    for (uint8 i=0; i<requestsAddresses.length; i++) {
      if (requestsAddresses[i] == addr) {
        requestsAddresses[i] = requestsAddresses[requestsAddresses.length-1];
        requestsAddresses.pop();
        return;
      }
    }
  }

  function buy(uint amount) public payable checkWhiteList() checkTokenLimit(amount) enoughtTokens(currentOwner, amount) {
    uint sum = amount * cost;
      payable(currentOwner).transfer(sum);
      if (sum < msg.value){
          payable(msg.sender).transfer(sum - msg.value);
      }
    _transfer(currentOwner, msg.sender, amount);
  }

  function setAllow(address to, uint amount) public {
    allow[msg.sender][to] = amount;
  }

  function setCost(uint newCost) public {
    require(msg.sender == publicProvider, "You are not public provider");
    cost = newCost;
  }

  function setPrivatePhase() public {
    if (currentPhase == Phase.SEED) {
      _transfer(owner, privateProvider, 3000000);
      currentOwner = privateProvider;
      currentPhase = Phase.PRIVATE;
      phaseLimit = 100000;
    }
  }

  function setPublicPhase() public {
    if (currentPhase == Phase.PRIVATE) {
      _transfer(currentOwner, owner, balanceOf[currentOwner]);
      currentOwner = publicProvider;
      currentPhase = Phase.PUBLIC;
      _transfer(owner, publicProvider, 6000000);
      phaseLimit = 5000;
      cost = 1 ether / 1000;
    }
  }

  function getTime() public view returns(uint) {
    return (block.timestamp - timeStart)/60 +timeDiff;
  }

  function timeTravel() public {
    timeDiff++;
  }

  modifier checkWhiteList() {
    if (currentPhase == Phase.SEED) {
      revert("Private sell not started");
    }
    if (currentPhase == Phase.PRIVATE) {
      require(whitelist[msg.sender], "Free sale not started");
    }
    _;
  }

  modifier enoughtTokens(address from, uint amount) {
    require(balanceOf[from] >= amount, "Balance smaller then amount");
    _;
  } 

  modifier checkTokenLimit(uint amount) {
    require(phaseLimit >= amount, "Amount bigger then phaseLimit");
    _;
  }

}
