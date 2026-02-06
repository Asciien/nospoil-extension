document.addEventListener("DOMContentLoaded", () => {
  // Get all interactives elements of the popup
  const onButton = document.getElementById("on"); // On button in popup
  const offButton = document.getElementById("off"); // Off button in popup
  const addButton = document.getElementById("add"); // Add tag button in popup
  const inputField = document.getElementById("taginput"); // Input tag field in popup

  // Update the status of the ON/OFF buttons
  // Initialise the state of the buttons based on the current status of the extension
  function updatePowerButtons(isOn) {
    if (isOn) {
      onButton.classList.add("active");
      offButton.classList.remove("active");
    } else {
      onButton.classList.remove("active");
      offButton.classList.add("active");
    }
  }

  // Get from storage the current statut of the buttons and update the UI.
  chrome.storage.sync.get(["isOn"], (result) => {
    const powerStatus = result.isOn !== false; // Default to true if not set
    updatePowerButtons(powerStatus);
  });

  //Add event listeners to the ON/OFF buttons
  //When the user click on the ON button, set the statuts of the extension to ON and update the UI.
  onButton.addEventListener("click", () => {
    chrome.storage.sync.set({ isOn: true }, () => {
      updatePowerButtons(true);
    });
  });

  //Same for the off button, but set the statuts to OFF.
  offButton.addEventListener("click", () => {
    chrome.storage.sync.set({ isOn: false }, () => {
      updatePowerButtons(false);
    });
  });
});
