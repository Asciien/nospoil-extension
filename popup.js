// Get all interactives elements of the popup
const onButton = document.getElementById("on"); // On button in popup
const offButton = document.getElementById("off"); // Off button in popup
const addButton = document.getElementById("add"); // Add tag button in popup
const inputField = document.getElementById("taginput"); // Input tag field in popup
const tagsList = document.getElementById("tags"); // List of tags in popup

// Update the status of the ON/OFF buttons
// Initialise the state of the buttons based on the current status of the extension
function updatePowerButtons(isOn) {
  //isOn is called after getting the current status of the extension from chrome storage, and is used to update the UI of the buttons.
  if (isOn) {
    //If true
    onButton.classList.add("actualStatus");
    offButton.classList.remove("actualStatus");
  } else {
    //If false
    onButton.classList.remove("actualStatus");
    offButton.classList.add("actualStatus");
  }
}

// Get from storage the current statut of the buttons and update the UI.
chrome.storage.sync.get(["isOn"], (result) => {
  //get the current status of the extension from chrome storage, and is used to update the UI of the buttons.
  const powerStatus = result.isOn !== false; // Default to true if not set
  updatePowerButtons(powerStatus);
});

//Add event listeners to the ON/OFF buttons
//When the user click on the ON button, set the statuts of the extension to ON and update the UI.
onButton.addEventListener("click", () => {
  if (offButton.classList.contains("actualStatus")) {
    chrome.storage.sync.set({ isOn: true }, () => {
      updatePowerButtons(true);
    });
  }
});

//Same for the off button, but set the statuts to OFF.
offButton.addEventListener("click", () => {
  if (onButton.classList.contains("actualStatus")) {
    chrome.storage.sync.set({ isOn: false }, () => {
      updatePowerButtons(false);
    });
  }
});

//Tags management
//Get all tags stored in chrome storage and display them in the popup
function loadTags() {
  chrome.storage.sync.get(["tags"], (results) => {
    //Get all tags stored in chrome storage
    const tags = results.tags || []; //If no tags are stored, init an empty array
    displaytags(tags); //Call the tag display function
  });
}

//Create for each tag an element in the popup and listen to the click event on the delete button to remove the tag from the list of tags and update the UI.
function displaytags(tags) {
  tagsList.innerHTML = ""; // Clear the list of tags before displaying the new one
  tags.forEach((tag) => {
    // Create a new element for each tag in the list of tags
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag";
    tagSpan.textContent = tag + "";

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "X";

    // Listen click event to remove the tag from the list and exec the function
    delBtn.addEventListener("click", () => {
      removeTags(tag);
    });

    //assemble the tag element in the taglist
    tagSpan.appendChild(delBtn);
    tagsList.appendChild(tagSpan);
  });
}

//When the user click on the X button of a tag, this is called to remove it from the list and from the storage
function removeTags(tagToRemove) {
  chrome.storage.sync.get(["tags"], (results) => {
    let tags = results.tags || [];
    tags = tags.filter((tag) => tag !== tagToRemove); //Remove the tag(tagToRemove) from the list of tags and set the new list

    chrome.storage.sync.set({ tags }, () => {
      //Update the list stored in chrome storage with the new list of tags after removing the tag
      displaytags(tags); //Update the UI with the new list of tags after removing the tag
    });
  });
}

//When the user add a tag. This is called to add the tag to the list and to the storage, then update the UI.
addButton.addEventListener("click", () => {
  const newTag = inputField.value.trim(); //Get the value of the input field and remove the edge spaces

  chrome.storage.sync.get(["tags"], (results) => {
    //Get the current list of tags stored in chrome storage
    let currentList = results.tags || [];
    if (newTag.length > 0 && currentList.includes(newTag) === false) {
      //verify if the tag is not empty and not already in the list of tags
      currentList.push(newTag);
      chrome.storage.sync.set({ tags: currentList }, () => {
        //Update the list of tags stored in chrome storage with the new list of tags after adding the new tag
        inputField.value = ""; //Clear the input field after adding the tag
        displaytags(currentList); //Update the UI with the new list of tags after adding the new tag
      });
    }
  });
});

loadTags();
