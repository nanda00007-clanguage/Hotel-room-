import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Replace with your deployed contract's ABI & address
const contractABI = [ [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_pricePerNight",
				"type": "uint256"
			},
			{
				"internalType": "enum HotelBookingPro.Currency",
				"name": "_currency",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "addRoom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roomNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bookingId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "guest",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "checkIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "checkOut",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalCost",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum HotelBookingPro.Currency",
				"name": "currency",
				"type": "uint8"
			}
		],
		"name": "Booked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roomNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bookingId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "guest",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundAmount",
				"type": "uint256"
			}
		],
		"name": "BookingCancelled",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_checkIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_checkOut",
				"type": "uint256"
			}
		],
		"name": "bookRoom",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bookingId",
				"type": "uint256"
			}
		],
		"name": "cancelBooking",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			}
		],
		"name": "removeRoom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roomNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerNight",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum HotelBookingPro.Currency",
				"name": "currency",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "RoomAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roomNumber",
				"type": "uint256"
			}
		],
		"name": "RoomRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roomNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "RoomUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			}
		],
		"name": "updateRoomPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawEther",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "currencyToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bookings",
		"outputs": [
			{
				"internalType": "address",
				"name": "guest",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "checkIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "checkOut",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountPaid",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			}
		],
		"name": "getBookings",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "guest",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "checkIn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "checkOut",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amountPaid",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct HotelBookingPro.Booking[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_checkIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_checkOut",
				"type": "uint256"
			}
		],
		"name": "isAvailable",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rooms",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerNight",
				"type": "uint256"
			},
			{
				"internalType": "enum HotelBookingPro.Currency",
				"name": "currency",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];
const contractAddress = "0x545fbccf583c1ca1dcb757a48bd4cbd90645b267";

// Currency enum matching Solidity
const Currency = { ETHER: 0, ERC20: 1 };

function HotelBookingProApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Contract interaction state
  const [roomNumber, setRoomNumber] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [currency, setCurrency] = useState(Currency.ETHER);
  const [tokenAddress, setTokenAddress] = useState("0x0000000000000000000000000000000000000000");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingIdToCancel, setBookingIdToCancel] = useState("");
  
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [messages, setMessages] = useState("");

  // Connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const sign = prov.getSigner();
      const acct = await sign.getAddress();
      const cont = new ethers.Contract(contractAddress, contractABI, sign);
      setProvider(prov);
      setSigner(sign);
      setAccount(acct);
      setContract(cont);
      setMessages(`Connected account: ${acct}`);
    } else {
      setMessages("Please install MetaMask!");
    }
  }

  // Add room (owner only)
  async function addRoom() {
    if (!contract) return alert("Connect wallet first");
    try {
      const tx = await contract.addRoom(
        parseInt(roomNumber),
        ethers.utils.parseEther(pricePerNight),
        currency,
        tokenAddress
      );
      await tx.wait();
      setMessages(`Room ${roomNumber} added successfully.`);
    } catch (err) {
      setMessages("Add room error: " + err.message);
    }
  }

  // Check availability
  async function checkAvailability() {
    if (!contract) return alert("Connect wallet first");
    try {
      const checkInTs = Math.floor(new Date(checkIn).getTime() / 1000);
      const checkOutTs = Math.floor(new Date(checkOut).getTime() / 1000);
      const available = await contract.isAvailable(roomNumber, checkInTs, checkOutTs);
      setAvailability(available);
      setMessages(`Room ${roomNumber} is ${available ? "available" : "not available"} for given dates.`);
    } catch (err) {
      setMessages("Check availability error: " + err.message);
    }
  }

  // Book room
  async function bookRoom() {
    if (!contract) return alert("Connect wallet first");
    try {
      const checkInTs = Math.floor(new Date(checkIn).getTime() / 1000);
      const checkOutTs = Math.floor(new Date(checkOut).getTime() / 1000);

      const room = await contract.rooms(roomNumber);
      // Calculate nights as in contract logic
      let nights = Math.floor((checkOutTs - checkInTs) / 86400);
      if ((checkOutTs - checkInTs) % 86400 !== 0) nights += 1;

      const totalPrice = room.pricePerNight.mul(nights);

      let tx;
      if (room.currency === Currency.ETHER) {
        tx = await contract.bookRoom(roomNumber, checkInTs, checkOutTs, { value: totalPrice });
      } else {
        // For ERC20 token, user must approve token spending outside of this example
        tx = await contract.bookRoom(roomNumber, checkInTs, checkOutTs);
      }
      await tx.wait();
      setMessages(`Booked room ${roomNumber} successfully.`);
    } catch (err) {
      setMessages("Booking error: " + err.message);
    }
  }

  // Cancel booking
  async function cancelBooking() {
    if (!contract) return alert("Connect wallet first");
    try {
      const bookingId = parseInt(bookingIdToCancel);
      const tx = await contract.cancelBooking(roomNumber, bookingId);
      await tx.wait();
      setMessages(`Booking ${bookingId} cancelled successfully.`);
    } catch (err) {
      setMessages("Cancel error: " + err.message);
    }
  }

  // Fetch all bookings for a room
  async function fetchBookings() {
    if (!contract) return alert("Connect wallet first");
    try {
      const rawBookings = await contract.getBookings(roomNumber);
      const n = rawBookings.length || 0;
      // rawBookings is an array of Booking structs
      setBookings(rawBookings);
      setMessages(`Fetched ${n} bookings for room ${roomNumber}.`);
    } catch (err) {
      setMessages("Fetch bookings error: " + err.message);
    }
  }

  // Auto connect wallet on load if available
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Hotel Booking Pro</h2>
      <p>{messages}</p>

      <button onClick={connectWallet}>Connect Wallet</button>

      <h3>Add Room (Owner Only)</h3>
      <input
        type="number"
        placeholder="Room Number"
        value={roomNumber}
        onChange={e => setRoomNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price per Night (Ether)"
        value={pricePerNight}
        onChange={e => setPricePerNight(e.target.value)}
      />
      <select value={currency} onChange={e => setCurrency(parseInt(e.target.value))}>
        <option value={Currency.ETHER}>Ether</option>
        <option value={Currency.ERC20}>ERC-20 Token</option>
      </select>
      {currency === Currency.ERC20 && (
        <input
          type="text"
          placeholder="ERC-20 Token Address"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
        />
      )}
      <button onClick={addRoom}>Add Room</button>

      <h3>Check Availability</h3>
      <input
        type="date"
        placeholder="Check-In Date"
        value={checkIn}
        onChange={e => setCheckIn(e.target.value)}
      />
      <input
        type="date"
        placeholder="Check-Out Date"
        value={checkOut}
        onChange={e => setCheckOut(e.target.value)}
      />
      <button onClick={checkAvailability}>Check Availability</button>
      {availability !== null && (
        <p>Availability: {availability ? "Available" : "Not Available"}</p>
      )}

      <h3>Book Room</h3>
      <button onClick={bookRoom}>Book Now</button>

      <h3>Cancel Booking</h3>
      <input
        type="number"
        placeholder="Booking ID"
        value={bookingIdToCancel}
        onChange={e => setBookingIdToCancel(e.target.value)}
      />
      <button onClick={cancelBooking}>Cancel Booking</button>

      <h3>View Bookings for Room</h3>
      <button onClick={fetchBookings}>Load Bookings</button>
      {bookings && bookings.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Amount Paid (wei)</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={i}>
                <td>{b.guest}</td>
                <td>{new Date(b.checkIn.toNumber() * 1000).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut.toNumber() * 1000).toLocaleDateString()}</td>
                <td>{b.amountPaid.toString()}</td>
                <td>{b.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HotelBookingProApp;
