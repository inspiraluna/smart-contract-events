import React, { useState } from "react";
import './App.css';
import Web3 from "web3";
import { abi } from "./abi"
import { bytecode } from './bytecode';
import Web3HttpProvider  from 'web3-providers-http';

function App() {

  // if (window.web3) {
  //   window.web3 = new Web3(window.web3.currentProvider);
  //   window.ethereum.enable();
  // }

  // const maticProvider = new Web3.providers.HttpProvider(
  //   "https://rpc-mumbai.maticvigil.com/v1/90e64418edda2c186a78fd4c4f63c78f5040d1f4"
  // );

  // const matic_web3 = new Web3(maticProvider);

  let options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        },
    ]
};

  const archive_node_url = 'https://speedy-nodes-nyc.moralis.io/ae457a5000fd8e233e5f9842/polygon/mainnet/archive'
  // let web3 = new Web3(new Web3.providers.HttpProvider(archive_node_url))
  let provider = new Web3HttpProvider(archive_node_url, options);
  let web3 = new Web3(provider)
  
  

  const getAllEvents = async () => {

  const contractAddress = '0x1F70A6Ebe74f202d1eC02124A7179fa7CE0D122f';
  const myContract = new web3.eth.Contract(abi, contractAddress);

  //listen for new events
  // myContract.getPastEvents("allEvents", {fromBlock: 1}).then(function(events){
  //   console.log(events)
  //   });

  // const returnValue = myContract.events.allEvents({fromBlock: 17110384})
  // console.log("returnValue", returnValue)

  const returnValue = await myContract.events.StakeCreated({fromBlock: 17173686, toBlock: "latest"})
  console.log(returnValue)

  // const returnValue = await myContract.getPastEvents("allEvents",{fromBlock: 16662386})
  // console.log("returnValue", returnValue)

}
  return (
    <div className="App">
    Let's start
    <button style={{background: "#03A9F4"}} onClick={getAllEvents}>Show all events</button>
    </div>
  );
}

export default App;
