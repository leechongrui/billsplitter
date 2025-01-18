document.addEventListener("DOMContentLoaded", () => {
    const groups = [
      { name: "Travel Buddies", netExpenditure: "+$30" },
      { name: "Family Dinners", netExpenditure: "-$20" }
    ]; // Initial groups
    const groupTabsContainer = document.getElementById("group-tabs");
  
    // Function to render group tabs
    function renderGroups() {
      groupTabsContainer.innerHTML = ""; // Clear existing content
      groups.forEach((group, index) => {
        const groupButton = document.createElement("button");
        groupButton.className = "group-tab";
        groupButton.textContent = `${group.name} (Net: ${group.netExpenditure})`;
        groupButton.onclick = () => redirectToGroupPage(group.name, index);
        groupTabsContainer.appendChild(groupButton);
      });
    }
  
    // Redirect to individual group page
    function redirectToGroupPage(groupName, groupId) {
      // Redirect to a unique page for the group
      const encodedName = encodeURIComponent(groupName); // Encode for URL safety
      location.href = `indivgroup.html?name=${encodedName}&id=${groupId}`;
    }
  
    // Open the create group popup
    function openPopup() {
      document.getElementById("create-group-popup").classList.remove("hidden");
    }
  
    // Close the create group popup
    function closePopup() {
      document.getElementById("create-group-popup").classList.add("hidden");
    }
  
    // Add a new group
    document.getElementById("create-group-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const newGroupName = document.getElementById("new-group-name").value.trim();
      if (newGroupName) {
        groups.push({ name: newGroupName, netExpenditure: "$0" });
        renderGroups(); // Refresh the group tabs
        closePopup();
      }
    });
  
    // Initial render
    renderGroups();
  
    // Export functions for global use
    window.openPopup = openPopup;
    window.closePopup = closePopup;
  });
  