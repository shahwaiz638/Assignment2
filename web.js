import Web3 from 'web3';

const web3 = new Web3(window.ethereum || 'http://localhost:7545'); // Use MetaMask or local provider
export default web3;