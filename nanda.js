<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Hotel Booking Pro DApp</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Hotel Booking Pro</h2>
<p id="status">Not connected</p>

<button onclick="connectWallet()">Connect Wallet</button>

<hr/>

<h3>Add Room (Owner Only)</h3>
Room Number: <input type="number" id="roomNumber"><br/>
Price per Night (ETH): <input type="text" id="pricePerNight"><br/>
Currency: 
<select id="currency">
  <option value="0">Ether</option>
  <option value="1">ERC-20 Token</option>
</select><br/>
ERC-20 Token Address (if applicable): <input type="text" id="tokenAddress" value="0x0000000000000000000000000000000000000000"><br/>
<button onclick="addRoom()">Add Room</button>

<hr/>

<h3>Check Availability</h3>
Room Number: <input type="number" id="availRoom"><br/>
Check-In Date: <input type="date" id="checkIn"><br/>
Check-Out Date: <input type="date" id="checkOut"><br/>
<button onclick="checkAvailability()">Check Availability</button>
<p id="availability"></p>

<hr/>

<h3>Book Room (Ether only demo)</h3>
Same room & dates as above.<br/>
<button onclick="bookRoom()">Book Room</button>

<hr/>

<h3>Cancel Booking</h3>
Room Number: <input type="number" id="cancelRoom"><br/>
Booking ID: <input type="number" id="cancelBookingId"><br/>
<button onclick="cancelBooking()">Cancel Booking</button>

<hr/>

<h3>View Bookings</h3>
Room Number: <input type="number" id="viewRoom"><br/>
<button onclick="viewBookings()">View</button>
<table border="1" cellpadding="5" id="bookingsTable">
  <thead>
    <tr>
      <th>Guest</th>
      <th>Check-In</th>
      <th>Check-Out</th>
      <th>Amount Paid</th>
      <th>Active</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
<script>
const contractAddress = "0x545fbccf583c1ca1dcb757a48bd4cbd90645b267";
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

let provider, signer, contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  document.getElementById("status").innerText = "Connected: " + await signer.getAddress();
}

async function addRoom() {
  const roomNum = parseInt(document.getElementById("roomNumber").value);
  const priceEth = document.getElementById("pricePerNight").value;
  const currency = parseInt(document.getElementById("currency").value);
  const tokenAddr = document.getElementById("tokenAddress").value;

  const priceWei = ethers.utils.parseEther(priceEth);
  const tx = await contract.addRoom(roomNum, priceWei, currency, tokenAddr);
  await tx.wait();
  alert("Room added!");
}

function toTimestamp(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

async function checkAvailability() {
  const roomNum = parseInt(document.getElementById("availRoom").value);
  const checkInTs = toTimestamp(document.getElementById("checkIn").value);
  const checkOutTs = toTimestamp(document.getElementById("checkOut").value);
  
  const available = await contract.isAvailable(roomNum, checkInTs, checkOutTs);
  document.getElementById("availability").innerText = available ? "Available!" : "Not available";
}

async function bookRoom() {
  const roomNum = parseInt(document.getElementById("availRoom").value);
  const checkInTs = toTimestamp(document.getElementById("checkIn").value);
  const checkOutTs = toTimestamp(document.getElementById("checkOut").value);

  const room = await contract.rooms(roomNum);
  
  let nights = Math.floor((checkOutTs - checkInTs) / 86400);
  if ((checkOutTs - checkInTs) % 86400 !== 0) nights += 1;
  const totalPrice = room.pricePerNight.mul(nights);

  if (room.currency.toString() === "0") {
    const tx = await contract.bookRoom(roomNum, checkInTs, checkOutTs, { value: totalPrice });
    await tx.wait();
    alert("Booked!");
  } else {
    alert("ERC-20 booking flow not implemented in this demo.");
  }
}

async function cancelBooking() {
  const roomNum = parseInt(document.getElementById("cancelRoom").value);
  const bookingId = parseInt(document.getElementById("cancelBookingId").value);

  const tx = await contract.cancelBooking(roomNum, bookingId);
  await tx.wait();
  alert("Booking cancelled");
}

async function viewBookings() {
  const roomNum = parseInt(document.getElementById("viewRoom").value);
  const roomBookings = await contract.getBookings(roomNum);

  const tbody = document.querySelector("#bookingsTable tbody");
  tbody.innerHTML = "";
  
  for (let b of roomBookings) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.guest}</td>
      <td>${new Date(b.checkIn.toNumber() * 1000).toLocaleDateString()}</td>
      <td>${new Date(b.checkOut.toNumber() * 1000).toLocaleDateString()}</td>
      <td>${ethers.utils.formatEther(b.amountPaid)} ETH</td>
      <td>${b.active ? "Yes" : "No"}</td>
    `;
    tbody.appendChild(tr);
  }
}
</script>
</body>
</html>
