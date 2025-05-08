// dummy event
const events = [{
     id: 1,
     name: "Hackathon",
     date: "September 5, 2025",
     location: "Boston",
     description: "A full-day coding event.",
     category: "Social",
     hostInfo: "555-777-2222",
     seats: 50,
     seatsRemaining: 2,
     imageDataUrl: "images final project/hackathon.png",
     approved: true,
 }];

 let registrants = [];
 let checkedInUsers = [];
let reminders = [];

function createReminders() {
     const reminderList = document.getElementById('reminder-list');
     reminderList.innerHTML = '';
 
     const today = new Date();
 
     // Force include Hackathon
     const hackathon = events.find(e => e.name.toLowerCase() === "hackathon");
     const filteredEvents = events.filter(event => {
         const eventDate = new Date(event.date);
         return event.approved && eventDate > today;
     });
 
     if (filteredEvents.length === 0) {
         reminderList.innerHTML = '<li>No upcoming events to remind</li>';
         return;
     }
 
     filteredEvents.forEach(event => {
         const eventDate = new Date(event.date);
         const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
 
         const reminderItem = document.createElement('li');
         reminderItem.innerHTML = `
             <strong>${event.name}</strong><br>
             <span>${event.date}</span><br>
             <span>${daysUntil >= 0 ? daysUntil + ' day(s) remaining' : 'Already occurred'}</span>
         `;
         reminderList.appendChild(reminderItem);
     });
 
     saveReminders();
 }
 
 

// Call this function whenever events are updated
function updateReminders() {
    createReminders();
} 
 function saveRegistrants() {
     localStorage.setItem("registrants", JSON.stringify(registrants));
 }
 
 function loadRegistrants() {
     const stored = localStorage.getItem("registrants");
     if (stored) {
         registrants = JSON.parse(stored);
     }
 }
 
 // Load events from localStorage (if available)
 function loadEvents() {
     const storedEvents = localStorage.getItem('events');
     if (storedEvents) {
         events = JSON.parse(storedEvents);
         // Filter and display only approved events
         const approvedEvents = events.filter(event => event.approved);
         displayEvents(approvedEvents);
     } else {
         // Load default events if none in storage
         displayEvents(events.filter(event => event.approved));
     }
 }
 
 // store checkedin users
 function storeCheckedInUsers() {
     localStorage.setItem('checkedInUsers', JSON.stringify(checkedInUsers));
 }
 function loadCheckedInUsers() {
     const storedUsers = localStorage.getItem('checkedInUsers');
     if (storedUsers) {
         checkedInUsers = JSON.parse(storedUsers);
     }
 }
 
 // Save current state of events to localStorage
 function saveEvents() {
     localStorage.setItem("events", JSON.stringify(events));
 }
 
 // Save current state of checked-in users to localStorage
 function saveCheckedInUsers() {
     localStorage.setItem("checkedInUsers", JSON.stringify(checkedInUsers));
 }
 
 // Load data after the DOM is ready
 window.addEventListener("DOMContentLoaded", () => {
     loadEvents();
     loadCheckedInUsers();
 });
 
 function saveReminders() {
     const reminderList = document.getElementById('reminder-list');
     const items = reminderList.querySelectorAll('li');
 
     reminders = Array.from(items).map(item => item.innerHTML);
     localStorage.setItem('reminders', JSON.stringify(reminders));
 }
 
 
 function loadReminders() {
     const storedReminders = localStorage.getItem('reminders');
     const reminderList = document.getElementById('reminder-list');
 
     if (storedReminders) {
         const savedItems = JSON.parse(storedReminders);
         reminderList.innerHTML = ''; // Clear any existing content
         savedItems.forEach(html => {
             const li = document.createElement('li');
             li.innerHTML = html;
             reminderList.appendChild(li);
         });
     }
 }
 
 
 /* login box */
 const form = document.getElementById('login-box');
 const login = document.getElementById('login');
 const submitButton = document.getElementById('submit-btn');
 const username = document.getElementById('username');
 const password = document.getElementById('password');
 const role = document.getElementById('role');
 const loggedin = document.getElementById('loggedin');
 const loggedout = document.getElementById('loggedout');
 const loginheader = document.getElementById('login-header');
 
 /* event submission box */
 const submitEventForm = document.getElementById('eventsubmission-box');
 const successMessage = document.getElementById('success-code');
 
 /* approve/reject box */
 const approvalForm = document.getElementById('approval-form');
 
 const checkInForm = document.getElementById('checkin-form');
 const checkInSelect = document.getElementById('checkinevents-list');
 console.log(checkInSelect); // should NOT be null
 
 // Function to check in a user and store it in localStorage
 function checkInUser(user) {
     // Add the new user to the list
     checkedInUsers.push(user);
     // Store the updated list in localStorage
     //localStorage.setItem('checkedInUsers', JSON.stringify(checkedInUsers));
     storeCheckedInUsers(); // call your save function
 }
 
 function addOption(){
 // drop down list
 events.forEach(event => {
     const option = document.createElement('option');
     option.value = event.id;
     option.textContent = event.name;
     checkInSelect.appendChild(option);
 
 });
 }
 
 addOption();
 
 
 // check in form
 // Check-in form reset function
 checkInForm.addEventListener('submit', function(e) {
     e.preventDefault();
 
     const checkInFormDropDown = document.getElementById('checkinevents-list');
     const eventId = parseInt(checkInFormDropDown.value);
     const usernameInput = document.getElementById('username-input').value;
     const useremailInput = document.getElementById('useremail-input').value;
     const event = events.find(e => e.id === eventId);
 
     if (!event) {
         alert('Event not found!');
         return;
     }
     if (event.seatsRemaining <= 0) {
         alert('Sorry, this event is full!');
         return;
     }
     if (!usernameInput || !useremailInput) {
         alert('Please fill in all fields.');
         return;
     }
 
     // Check-in the user
     checkInUser({ eventId, username: usernameInput, email: useremailInput });
     event.seatsRemaining--;
 
     // Store the updated checked-in users in localStorage
     storeCheckedInUsers();
     loadCheckedInUsers();
     displayEvents(events);
 
     // Display success message
     successMessage.textContent = 'Checked in successfully!';
     successMessage.style.display = 'block';
     setTimeout(() => successMessage.style.display = 'none', 3000);
 
     // Reset the form
     checkInForm.reset();
 });
 
 
 // APPROVAL FORM
 // Replace the existing event listeners with these:
 
 document.getElementById('approve-event').addEventListener('click', function(e) {
     e.preventDefault();
     const selectEvent = document.getElementById('events-list');
     const eventId = selectEvent.value;
     if (!eventId) {
         alert('Please select an event first');
         return;
     }
     for (let i = 0; i < events.length; i++) {
         if (events[i].id === eventId) {
             if (decision === 'approve') {
                 events[i].approved = true;
                 events[i].rejected = false;
             } else {
                 events[i].approved = false;
                 events[i].rejected = true;
             }
             break;
         }
     }
     approveEvent(eventId);
 });
 
 document.getElementById('reject-event').addEventListener('click', function(e) {
     e.preventDefault();
     const selectEvent = document.getElementById('events-list');
     const eventId = selectEvent.value;
     if (!eventId) {
         alert('Please select an event first');
         return;
     }
 
     for (let i = 0; i < events.length; i++) {
         if (events[i].id === eventId) {
             if (decision === 'approve') {
                 events[i].approved = true;
                 events[i].rejected = false;
             } else {
                 events[i].approved = false;
                 events[i].rejected = true;
             }
             break;
         }
     }
     rejectEvent(eventId);
 });
 
 const upcomingEventsBox = document.getElementById('upcomingevents-box');
 const eventList = document.getElementById('event-list');
 const eventSearch = document.getElementById('event-search');
 const eventFilter = document.getElementById('event-filter');
 const searchButton = document.getElementById('searchButton');
 const modal = document.getElementById('registration-modal');
 const closeModalButton = document.querySelector('.close-modal');
 const eventsListDropdown = document.getElementById('events-list');
 const submitEventButton = document.getElementById('submit-event');
 
 // check in box
 const eventcheckin = document.getElementById('checkinmodal');
 const checkInButton = document.getElementById('checkin-btn');
 
 checkInButton.addEventListener('click', () => {
     const eventId = eventsListDropdown.value;
     const event = events.find(e => e.id == eventId);
     if (event) {
         const usernameInput = document.getElementById('username-input').value;
         const useremailInput = document.getElementById('useremail-input').value;
 
         if (!usernameInput || !useremailInput) {
             alert('Please fill in all fields.');
             return;
         }
 
         checkInUser({ eventId, username: usernameInput, email: useremailInput });
         alert(`Checked in for ${event.name}!`);
     } else {
         alert('Event not found!');
     }
 });
 
 // feedback box
 const feedbackContainer = document.getElementById('feedback');
 
 //registration box
 const useremail = document.getElementById('useremail'); 
 const registerButton = document.querySelector('#registration-form button[type="submit"]');
 
 // event reminders
 const eventreminders = document.getElementById('event-reminders');
 
 document.getElementById('event-reminders').addEventListener('submit', function(event) {
     event.preventDefault(); // Prevent form from submitting to the server
     showReminders(); // A function to display the reminders
 });
 
 let isVisible = false;
 let authenticated = false;
 
 
 if(!isVisible) {
     submitEventForm.style.display = 'none';
     successMessage.style.display = 'none';
     upcomingEventsBox.style.display = 'none';
     approvalForm.style.display = 'none'; 
     eventcheckin.style.display = 'none';
     feedbackContainer.style.display = 'none';
     loginheader.style.display = 'none';
     eventreminders.style.display = 'none';
 } else {
     submitEventForm.style.display = 'block';
     successMessage.style.display = 'block';
     upcomingEventsBox.style.display = 'block'; 
     eventcheckin.style.display = 'block';
     eventreminders.style.display = 'block';
     createReminders();
     approvalForm.style.display = 'block'; 
     feedbackContainer.style.display = 'block';
 }
 
 // LOGIN FORM
 const loginForm = document.getElementById('login-form');
 
 loginForm.addEventListener('submit', function(e) {
     e.preventDefault();
 
     if (authenticated) {
         // logout logic
         document.body.classList.remove('authenticated');
         document.getElementById('login-image-container').style.display = 'block';
         
         // Hide all elements
         submitEventForm.style.display = 'none';
         successMessage.style.display = 'none';
         upcomingEventsBox.style.display = 'none';
         approvalForm.style.display = 'none';
         eventcheckin.style.display = 'none';
         feedbackContainer.style.display = 'none';
         eventreminders.style.display = 'none';
         
         // Reset form and authentication state
         isVisible = false;
         authenticated = false;
         submitButton.textContent = "Login";
         username.required = true;
         password.required = true;
         username.style.display = 'block';
         password.style.display = 'block';
         role.style.display = 'block';
     } else {
         // login logic
         const user = username.value.trim();
         const pass = password.value.trim();
         const userRole = role.value;
 
         if (!user || !pass) {
             alert("Please enter both username and password.");
             return;
         }
 
         document.body.classList.add('authenticated');
         document.getElementById('login-image-container').style.display = 'none';
 
         localStorage.setItem('username', user);
         isVisible = true;
         authenticated = true;
         submitButton.textContent = "Logout";
 
         username.required = false;
         password.required = false;
         username.style.display = 'none';
         password.style.display = 'none';
         role.style.display = 'none';
 
         // Show elements based on role
         submitEventForm.style.display = 'block';
         successMessage.style.display = 'block';
         upcomingEventsBox.style.display = 'block';     
         eventcheckin.style.display = 'block';         
         eventreminders.style.display = 'block';
         approvalForm.style.display = 'block';
         feedbackContainer.style.display = 'block';

         loginForm.reset();
         displayEvents(events);
     }
 });
 
 // FEEDBACK CONTAINER TO SAVE LOCAL STORAGE
 document.getElementById("eventfeedback").addEventListener("submit", function (e) {
     e.preventDefault();
 
     const name = document.getElementById("feedback-name").value.trim();
     const text = document.getElementById("feedback-text").value.trim();
     const rating = document.querySelector('input[name="rating"]:checked');
 
     if (!name || !text || !rating) {
         alert("Please complete all fields including rating.");
         return;
     }
 
     const feedbackEntry = {
         name: name,
         feedback: text,
         rating: parseInt(rating.value),
         timestamp: new Date().toISOString()
     };
 
     let feedbackList = JSON.parse(localStorage.getItem("eventFeedbackList")) || [];
     feedbackList.push(feedbackEntry);
     localStorage.setItem("eventFeedbackList", JSON.stringify(feedbackList));
 
     alert("Thank you for your feedback!");
     this.reset();
 });
 
 // event submission
 submitEventButton.addEventListener('click', function(e){
     e.preventDefault();
     addEvent(); // calling addevent function
     // addOption();
     console.log(events);
 });
 
 searchButton.addEventListener('click', () => {
     const searchTerm = eventSearch.value.toLowerCase();
     const filterValue = eventFilter.value.toLowerCase();
 
     const filteredEvents = events.filter(event => {
         const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
             event.description.toLowerCase().includes(searchTerm);
         const matchesFilter = filterValue === 'all' || event.category.toLowerCase() === filterValue;
         return matchesSearch && matchesFilter;
     });
 
     // Sort the filtered events by category
     const sortedEvents = filteredEvents.sort((a, b) => 
         a.category.localeCompare(b.category)
     );
 
     displayEvents(filteredEvents);
 });
 
 submitEventButton.addEventListener('click', function(e) {
     e.preventDefault();
     document.getElementById('event-form').requestSubmit();
 });
 
 document.getElementById('event-form').addEventListener('submit', addEvent);
 
 // use loop for storing submitted ecents
 function addEvent(e) {
     if (e) e.preventDefault();
 
     const eventName = document.getElementById('event-name').value;
     const eventDate = document.getElementById('event-date').value;
     const eventLocation = document.getElementById('event-location').value;
     const eventSeats = document.getElementById('event-seats').value;
     const eventDescription = document.getElementById('event-description').value;
     const eventCategory = document.getElementById('event-category').value;
     const hostInfo = document.getElementById('event-host').value;
     const eventImage = document.getElementById('event-image');
     const file = eventImage.files[0];
 
     if (!eventName || !eventDate || !eventLocation || !eventDescription ||
         !eventCategory || !hostInfo || !eventSeats || !file) {
         alert("Please fill all fields and upload an image!");
         return;
     }
 
     if (!file.type.match('image.*')) {
         alert("Please upload an image file (JPEG, PNG, etc.)");
         return;
     }
 
     const reader = new FileReader();
 
     reader.onload = () => {
         const dataUrl = reader.result;
 
         const newEvent = {
             id: events.length + 1,
             name: eventName,
             date: eventDate,
             location: eventLocation,
             description: eventDescription,
             category: eventCategory,
             hostInfo: hostInfo,
             seats: parseInt(eventSeats),
             seatsRemaining: parseInt(eventSeats),
             imageDataUrl: dataUrl,
             approved: false,
             rejected: false,
         };
 
         events.push(newEvent);
         const option = document.createElement('option');
         option.value = newEvent.id;
         option.textContent = newEvent.name;
         checkInSelect.appendChild(option);
         console.log("Event added:", newEvent);
         
 
         populateEvents();
         updateReminders();
         displayEvents(events);
         document.getElementById('event-form').reset();
         document.getElementById('preview').style.display = 'none';
 
         successMessage.style.display = 'block';
         setTimeout(() => {
             successMessage.style.display = 'none';
         }, 3000);
     };
 
     reader.onerror = function () {
         alert("Error reading the image file. Please try again.");
     };
 
     reader.readAsDataURL(file);
 }
 
 
 document.getElementById('event-form').addEventListener('submit', addEvent);
 
 // Initial display of events
 displayEvents(events);
 
 // Add image preview functionality
 document.getElementById('event-image').addEventListener('change', function(e) {
     const file = e.target.files[0];
     if (file) {
         const reader = new FileReader();
         reader.onload = function(e) {
             const preview = document.getElementById('preview');
             preview.src = e.target.result;
             preview.style.display = 'block';
         };
         reader.readAsDataURL(file);
     }
 }); 
 
 // Update your event listener to use the form submission
 document.getElementById('event-form').addEventListener('submit', addEvent);
 
 function displayEvents(eventsToDisplay) {
     eventList.innerHTML = '';
 
     if (eventsToDisplay.length === 0) {
         eventList.innerHTML = '<p>No events found.</p>';
         return;
     }
 
     eventsToDisplay.filter(event => event.approved).forEach(event => {
         const eventElement = document.createElement('div');
         eventElement.className = 'event-item';
         eventElement.innerHTML = `
             <h3>${event.name}</h3>
             <img src="${event.imageDataUrl}" alt="${event.name}" loading="lazy">
             <p><strong>Date:</strong> ${event.date}</p>
             <p><strong>Location:</strong> ${event.location}</p>
             <p><strong>Category:</strong> ${event.category}</p>
             <p><strong>Host Info:</strong> ${event.hostInfo}</p>
             <p><strong>Seats:</strong> ${event.seatsRemaining}/${event.seats}</p>
             <button class="viewdetailsbutton" data-id="${event.id}">Register</button>
         `;
         eventList.appendChild(eventElement);
     });
 
     document.querySelectorAll('.viewdetailsbutton').forEach(button => {
         button.addEventListener('click', (e) => {
             const eventId = parseInt(e.target.getAttribute('data-id'));
             showEventDetails(eventId);
         });
     });
 }
 
 
 function showEventDetails(eventId) {
     const event = events.find(e => e.id === eventId);
     events.find(e => console.log(e.id));
     if (!event) return;
 
     modal.style.display = 'block';
     document.getElementById('modal-event-title').textContent = event.name;
     document.getElementById('modal-description').textContent = event.description;
     document.getElementById('modal-event-details').innerHTML = `
         <p><strong>Date:</strong> ${event.date}</p>
         <p><strong>Location:</strong> ${event.location}</p>
         <p><strong>Category:</strong> ${event.category}</p>
     `;
 
     const form = document.getElementById('registration-form');
     form.onsubmit = function (e) {
         e.preventDefault();
         registerForEvent(event.id);
         modal.style.display = 'none';
     }
 
     registerButton.onclick = () => {
         showSuccessMessage(event);
         displayEvents(events.filter(e => e.approved));
         console.log("You are registered!");
     }
 }
 
 function registerForEvent(eventId) {
     const event = events.find(e => e.id === eventId);
 
     if (!event) {
         alert('Event not found!');
         return;
     }
     if (event.seatsRemaining <= 0) {
         alert('Sorry, this event is full!');
         return;
     }
 
     const form = document.getElementById('registration-form');
     const usernameInput = form.querySelector('input[type="text"]').value.trim();
     const useremailInput = form.querySelector('input[type="email"]').value.trim();
 
     if (!usernameInput || !useremailInput) {
         alert('Please fill in all fields.');
         return;
     }
 
     registrants.push({ eventId, username: usernameInput, email: useremailInput });
     saveRegistrants();
 
     event.seatsRemaining--;
 
     console.log('Current registrations:', registrants);
     alert(`Successfully registered for ${event.name}!`);
     displayEvents(events.filter(e => e.approved));
 }
 
 // Function to approve an event
function approveEvent(eventId) {
    const event = events.find(e => e.id == eventId);
    if (event) {
        event.approved = true;
        event.rejected = false;
        saveEvents(); // Save to localStorage
        populateEvents(); // Refresh the approval list
        displayEvents(events.filter(e => e.approved)); // Show approved events
        updateReminders();
        alert(`Event "${event.name}" has been approved.`);
    } else {
        alert('Event not found!');
    }
}
     
     function rejectEvent(eventId) {
         const event = events.find(e => e.id == eventId);
         if (!event) {
             alert('Event not found!');
             return;
         }
         
         const feedbackMessage = prompt("Please provide a reason for rejection:");
         if (feedbackMessage === null) return; // User cancelled
         
         event.approved = false;
         event.rejected = true;
         event.feedback = feedbackMessage || "No feedback provided";
         
         saveEvents(); // Save to localStorage
         populateEvents(); // Refresh the list
         displayEvents(events); // Update the display
         displayRejectedEvents(); // Show rejected events
         updateReminders();
         
         alert(`Event "${event.name}" has been rejected.`);
     }
 
 function displayRejectedEvents() {
     const rejectedList = document.getElementById('rejected-list');
     rejectedList.innerHTML = '';
 
     const rejectedEvents = events.filter(e => e.rejected);
 
     if (rejectedEvents.length === 0) {
         rejectedList.innerHTML = '<p>No rejected events.</p>';
         return;
     }
 
     rejectedEvents.forEach(event => {
         const div = document.createElement('div');
         div.className = 'event-item';
         div.innerHTML = `
             <h3>${event.name} (Rejected)</h3>
             <p><strong>Date:</strong> ${event.date}</p>
             <p><strong>Location:</strong> ${event.location}</p>
             <p><strong>Category:</strong> ${event.category}</p>
             <p><strong>Host Info:</strong> ${event.hostInfo}</p>
             <p><strong>Seats:</strong> ${event.seatsRemaining}/${event.seats}</p>
             <p><strong>Description:</strong> ${event.description}</p>
             <p><strong>Rejection Reason:</strong> ${event.feedback}</p>
         `;
         rejectedList.appendChild(div);
     });
 }
 
  // populates events in approval form
  function populateEvents() {
     const eventsList = document.getElementById('events-list');
     eventsList.innerHTML = ''; 
 
     events
         .filter(event => !event.approved && !event.rejected) // Only show unapproved events
         .forEach(event => {
             const option = document.createElement('option');
             option.value = event.id;
             option.textContent = event.name;
             eventsList.appendChild(option);
         });
 }
   
  //Show success message
  function showSuccessMessage(event) {
     modal.style.display = 'none';
     successMessageBox.innerHTML = `
         <p>Successfully registered for ${event.name}!</p>
         ${authenticated ? `<label>
             <input type="checkbox" id="email-confirmation"> 
             Send email confirmation
         </label>` : ''}
         <button id="close-success">Close</button>
     `;
     successMessageBox.style.display = 'block';
     
     document.getElementById('close-success').onclick = () => {
         successMessageBox.style.display = 'none';
     };
 }
 
 // close register form
 closeModalButton.addEventListener('click', () => {
     modal.style.display = 'none';
 }); 
 
   // Close if user clicks outside modal
   window.addEventListener('click', function(e) {
     const modal = document.getElementById('checkin-window');
     if (e.target === modal) {
       modal.style.display = 'none';
     }
   });
   
 const registered = [];
 
 function register(){
    console.log("You are registered!");
 
 } 
 
 // Make sure this runs when the page loads
 document.addEventListener('DOMContentLoaded', function() {
     loadEvents();
     loadCheckedInUsers();
     loadReminders(); 
     displayEvents(events);
     displayRejectedEvents();
     updateReminders();

     const selectApprove = document.getElementById('approve-event'); 
     const selectReject = document.getElementById('reject-event');
 
     selectApprove.addEventListener('click', function(e){
         e.preventDefault();
         const selectEvent = document.getElementById('events-list');
         const eventId = selectEvent.value;
         approveEvent(eventId);
     });
 
     selectReject.addEventListener('click', function(e){
         e.preventDefault();
         const selectEvent = document.getElementById('events-list');
         const eventId = selectEvent.value;
         rejectEvent(eventId);
     });
 });
 
// Call this on page load
window.addEventListener("DOMContentLoaded", showLoginImage);

 // image 
 window.addEventListener("DOMContentLoaded", () => {
     if (localStorage.getItem('username')) {
       document.body.classList.add('authenticated');
       document.getElementById('login-image-container').style.display = 'none';
     } else {
       document.body.classList.remove('authenticated');
       document.getElementById('login-image-container').style.display = 'block';
     }
   });