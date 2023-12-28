import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Google Real-time Database initialization
const appSettings = {
	databaseURL: "https://endorsement-app-8ff0c-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const endorsementText = document.getElementById("endorsement-text");
const fromInput = document.getElementById("from-input");
const toInput = document.getElementById("to-input");
const publishBtn = document.getElementById("publish-btn");
const endorsementList = document.getElementById("endorsement-list");

publishBtn.addEventListener("click", () => {
	let endorsement = {
		text: endorsementText.value,
		from: fromInput.value,
		to: toInput.value,
	};
	push(endorsementListInDB, endorsement);
});

onValue(endorsementListInDB, (snapshot) => {
	if (snapshot.exists()) {
		let endorsmentHtml = "";
		let itemArray = Object.entries(snapshot.val());

		// Clear the list
		endorsementList.innerHTML = "";

		for (let i = 0; i < itemArray.length; i++) {
			let currentItem = itemArray[i];
			const text = currentItem[1].text;
			const from = currentItem[1].from;
			const to = currentItem[1].to;

			endorsmentHtml += `
            <div>
                <p id="to" >To ${to}</p>
                <p id="endorsement">${text}</p>
                <p id="from">From ${from}</p>
            </div>
            `;
		}

		endorsementList.innerHTML = endorsmentHtml;
	}
});
