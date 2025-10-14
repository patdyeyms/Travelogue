Travelogue Web Application

Travelogue is a full-featured travel planning web application built with React. It allows users to search for flights, book hotels, create detailed itineraries, and explore destinations interactively using maps and guides.

Table of Contents
• Features

• Technologies Used

• Project Structure

• Components Overview

• Installation & Setup

• Usage

• Future Improvements


Features
• Landing Page: Welcome screen with video background, destination search, and key features showcase.

• Flight Planner: Select origin and destination, set departure and return dates. Stores selected flights in localStorage.

• Hotel Booking: Filter hotels by city or country, view ratings and reviews, book hotels linked to flight trips.

• Itinerary Page: Visualize trip details with:
    - Interactive map view with attractions.

    - List of places to visit.

    - Lodging info (selected hotel).

    - Sidebar for trip notes, reservations, and attachments.

• Responsive UI with sidebar toggle, suggestion lists, and search filtering.


Technologies Used
• Frontend:
    - React (Functional Components & Hooks)

    - React Router (useNavigate, useLocation)

    - Leaflet for interactive maps

    - CSS modules for styling


State Management:
• React useState and useEffect

• localStorage for persisting flight and hotel selections


Assets:
• Images for hotels and destinations

• Video background on landing page


Components Overview
1. Landing.jsx
    • Main entry page.

    • Video background and destination search with autocomplete.

    • Feature highlights: flight planner, hotel booking, itinerary journal, interactive maps.

2. Flights.jsx
    • Flight search with From, To, Departure, and Return inputs.

    • Saves selected flight data to localStorage.

    • Redirects to flight results page.

3. Hotels.jsx
    • Displays hotel cards filtered by city or country.
    
    • Includes ratings, reviews, and "Book" button.

    • Linked to selected flight for contextual bookings.

4. BookingDetails.jsx
    • Collects traveler information.

    • Validates check-in/check-out dates based on flight unless "Future Booking" is enabled.

    • Stores booking in localStorage and navigates to confirmation page.

5. Itinerary.jsx
    • Generates trip itinerary based on flight and hotel data.

    • Displays interactive map with attractions using Leaflet.

    • Sidebar for exploring attractions, restaurants, and reservations.

    • Handles reset of trip data and conditional display if no flight is selected.


Installation & Setup

1. Clone the repository:
    git clone https://github.com/yourusername/travelogue.git
    cd travelogue

2. Install dependencies:
    npm install

3. Start the development server:
    npm start

4. Access the app:
    Open http://localhost:3000 in your browser.


Usage
• Landing Page: Choose a destination or click "Get Started".

• Flights: Select origin, destination, and dates → search flights.

• Hotels: Filter and select hotels for the chosen destination.

• Booking Details: Input traveler information → confirm booking.

• Itinerary: View trip overview, explore attractions, and interact with maps.

• All flight and hotel selections persist in localStorage for session continuity.


Future Improvements
• Add authentication and user profiles.

• Connect to real-time flight and hotel APIs for dynamic search.

• Implement payment processing for bookings.

• Improve mobile responsiveness and accessibility.

• Add notifications and reminders for trip events.


Travelogue: Plan your trips, book flights and hotels, and organize itineraries—all in one intuitive web application.