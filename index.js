import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
	update,
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
		likes: 0,
	};
	push(endorsementListInDB, endorsement);
});

onValue(endorsementListInDB, (snapshot) => {
	const likeBtn = document.getElementById("like-btn");

	if (snapshot.exists()) {
		let itemArray = Object.entries(snapshot.val());

		// Clear the list
		endorsementList.innerHTML = "";

		for (let i = itemArray.length - 1; i >= 0; i--) {
			const currentItem = itemArray[i];
			const endorsementId = currentItem[0];
			const text = currentItem[1].text;
			const from = currentItem[1].from;
			const to = currentItem[1].to;
			let numberOfLikes = currentItem[1].likes;
			let hasLiked = localStorage.getItem(`${endorsementId}`);

			const endorsementItemDiv = document.createElement("div");
			const fromAndLikeContainer = document.createElement("div");
			const toText = document.createElement("p");
			const textBody = document.createElement("p");
			const fromText = document.createElement("p");
			const likeBtn = document.createElement("button");

			toText.textContent = `To ${to}`
			toText.id = "to";
			textBody.textContent = text;
			textBody.id = "endorsement";
			fromText.textContent = `From ${from}`;
			fromText.id = "from";
			likeBtn.textContent = `♥ ${numberOfLikes}`;

			endorsementList.append(endorsementItemDiv);
			endorsementItemDiv.appendChild(toText);
			endorsementItemDiv.appendChild(textBody);
			endorsementItemDiv.appendChild(fromAndLikeContainer);
			fromAndLikeContainer.appendChild(fromText);
			fromAndLikeContainer.appendChild(likeBtn);

			if (hasLiked === 'true') {
                likeBtn.className = 'liked-style'
			} else {
				likeBtn.addEventListener("click", () => {
					let exactLocationOfItemInDB = ref(
						database,
						`endorsementList/${endorsementId}`
					);
					localStorage.setItem(`${endorsementId}`, JSON.stringify(true));
					update(exactLocationOfItemInDB, { likes: numberOfLikes++ });
				});
			}
		}
	} else {
        console.log('nothing yet')
    }
});
