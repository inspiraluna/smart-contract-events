import React, { useState } from "react";
import './App.css';
import Web3 from "web3";
import { abi } from "./abi"
import { bytecode } from './bytecode';
import Web3HttpProvider  from 'web3-providers-http';
import { ethers } from "ethers";

function App() {

  // if (window.web3) {
  //   window.web3 = new Web3(window.web3.currentProvider);
  //   window.ethereum.enable();
  // }

  // const maticProvider = new Web3.providers.HttpProvider(
  //   "https://rpc-mumbai.maticvigil.com/v1/90e64418edda2c186a78fd4c4f63c78f5040d1f4"
  // );

  // const matic_web3 = new Web3(maticProvider);

    const archive_node_url = 'https://speedy-nodes-nyc.moralis.io/ae457a5000fd8e233e5f9842/polygon/mainnet/archive'
  // const archive_node_url = 'https://speedy-nodes-nyc.moralis.io/ae457a5000fd8e233e5f9842/eth/mainnet/archive'
  const provider = new ethers.providers.JsonRpcProvider(archive_node_url);
  const signer = provider.getSigner()

//   let options = {
//     keepAlive: true,
//     withCredentials: false,
//     timeout: 20000, // ms
//     headers: [
//         {
//             name: 'Access-Control-Allow-Origin',
//             value: '*'
//         },
//     ]
// };

//   const archive_node_url = 'https://speedy-nodes-nyc.moralis.io/ae457a5000fd8e233e5f9842/polygon/mainnet/archive'
//   // let web3 = new Web3(new Web3.providers.HttpProvider(archive_node_url))
//   let provider = new Web3HttpProvider(archive_node_url, options);
//   let web3 = new Web3(provider)
  
  

  const getAllEvents = async () => {

    // const blockN = await provider.getBlockNumber()
    // console.log("BlockNumber", blockN)

  const contractAddress = '0x1F70A6Ebe74f202d1eC02124A7179fa7CE0D122f';
  const contractAddressEth = '0x06012c8cf97bead5deoe237070f9587f8e7a266d';
  // const myContract = new web3.eth.Contract(abi, contractAddress);

  //listen for new events
  // myContract.getPastEvents("allEvents", {fromBlock: 1}).then(function(events){
  //   console.log(events)
  //   });

  // const returnValue = myContract.events.allEvents({fromBlock: 17110384})
  // console.log("returnValue", returnValue)

  // const returnValue = await myContract.events.StakeCreated({fromBlock: 17173686, toBlock: "latest"})
  // console.log(returnValue)

  // const returnValue = await myContract.getPastEvents("allEvents",{fromBlock: 16662386})
  // console.log("returnValue", returnValue)


  const iface = new ethers.utils.Interface(abi);

  // intialize array for the logs
  let logs = [];
  // get latest block number
  const latest = await provider.getBlockNumber();
  // intialize a counter for which block we're scraping starting at the most recent block
  // let blockNumberIndex = latest;
  let blockNumberIndex = 16662386;
  let currentBlock = blockNumberIndex
  const minters = new Map();
  const burners = new Map();
  while(currentBlock < latest - 25000){
    let topicTransfer = ethers.utils.id("Transfer(address,address,uint256)");
    const tempLogs = await provider.getLogs({
      address: contractAddress,
      fromBlock: currentBlock,
      toBlock: currentBlock + 25000,
      topics: [topicTransfer],
    });
    currentBlock += 25000;
    // logs = logs && logs.length > 0 ? [...logs, ...tempLogs] : [...tempLogs]
    console.log("currentBlock", currentBlock);
    console.log("logs", tempLogs.length);

    const decodedEvents = tempLogs.map((log) => iface.parseLog(log));

    decodedEvents.forEach((e, i) => {
      const sender = e.args[0];
      const recipient = e.args[1];
      const amount = ethers.utils.formatEther(e.args[2]);
      if (sender === "0x0000000000000000000000000000000000000000") {
        console.log("MintedTo", recipient);
        console.log("Amount", amount);
        let mints = minters.get(recipient)
        if(mints===undefined){
          mints = 1
          minters.set(recipient,mints)
        }
        else{
          mints = mints+1
         minters.set(recipient,mints)
        }

        // (mints===0)?minters.set(recipient,1):minters.set(recipient,mints++)
        console.log("mints", mints)
      }
      if (recipient === "0x0000000000000000000000000000000000000000") {
        console.log("BurntFrom", sender);
        console.log("Amount", amount);
      }
    });
  }

}
  return (
    <div className="App">
    Let's start
    <button style={{background: "#03A9F4"}} onClick={getAllEvents}>Show all events</button>
    </div>
  );
}

export default App;
