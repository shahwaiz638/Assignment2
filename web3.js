// // web3.js
// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';

// function App() {
//   const [account, setAccount] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadBlockchainData = async () => {
//       try {
//         const web3 = new Web3('http://localhost:7545'); // Update with your Ganache endpoint
//         const accounts = await web3.eth.getAccounts();
//         setAccount(accounts[0]);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading blockchain data:', error);
//         setError('Error loading blockchain data. Please check your connection and try again.');
//         setLoading(false);
//       }
//     };

//     loadBlockchainData();
//   }, []); // Empty dependency array to run the effect only once on mount

//   if (loading) {
//     return <h1>Loading...</h1>;
//   }

//   if (error) {
//     return <h1>{error}</h1>;
//   }

//   return <h1>Connected Account: {account}</h1>;
// }

// export default App;

// web3.js
// web3.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
    const [account, setAccount] = useState('');

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3('http://localhost:7545'); // Update with your Ganache endpoint
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error loading blockchain data:', error);
            }
        };

        loadBlockchainData();
    }, []); // Empty dependency array to run the effect only once on mount

    return <h1>{account}</h1>;
}

export default App;

