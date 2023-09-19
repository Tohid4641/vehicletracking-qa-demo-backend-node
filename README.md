# Vehicle Tracking App Demo - Admin Panel

## Table of Contents
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [APIs](#apis)
  - [Fetch User Location API](#fetch-user-location-api)
  - [Send and Verify OTP API](#send-and-verify-otp-api)
  - [Submit Form API](#submit-form-api)
  - [Access UI Application Pages API](#access-ui-application-pages-api)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Welcome to the Vehicle Tracking App Demo - Admin Panel! This project serves as the admin panel for a vehicle tracking application demo. It enables administrators to manage and verify user information, access specific UI application pages, and provide a seamless user experience.

## Technologies Used
- Node.js
- Express.js
- CRM (Customer Relationship Management) as the database

## Features
- Designed and developed APIs using Node.js and the Express framework to power the admin panel.
- Implemented three key APIs for user verification and management.

## APIs

### Fetch User Location API
- Description: Retrieves the user's location, including city and country, using the IP Stack service.
- Usage: Helps in tracking user locations for effective administration.

### Send and Verify OTP API
- Description: Sends OTPs (One-Time Passwords) to users for verification.
- Services Used:
  - SendGrid for Email OTPs
  - Twilio for International Number OTPs
  - TextLocal for Indian Number OTPs
- Purpose: Ensures user identity verification and security.

### Submit Form API
- Description: Submits user details to the company's CRM system.
- Function: Captures and stores user information securely.

### Access UI Application Pages API
- Description: Grants access to specific UI application pages.
- Modes:
  - Manual Demo
  - Socket Slideshow Demo
- Authentication: Uses JWT for API authentication and authorization.
- Real-time Interaction: Employs Socket.io for real-time interactions in the Slideshow Demo API.

## Installation
To set up the admin panel locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Tohid4641/vehicletracking-qa-demo-backend-node
   ```

2. Navigate to the project directory:
   ```
   cd vehicle-tracking-admin-panel
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Configure the CRM database connection in the project's configuration file.

5. Run the application:
   ```
   npm start
   ```

## Usage
The admin panel provides essential tools for managing user data, verifying user identities, and accessing UI application pages. It ensures the smooth operation of the vehicle tracking application demo.

## Application URL
Visit [Vehicle Tracking App Demo](https://www.vehicletracking.qa/) to access the application online.

<!-- ## Contributing
Contributions to this project are appreciated. Please refer to the [Contributing Guidelines](CONTRIBUTING.md) in the repository for details on how to contribute.

## License
This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software as per the terms of the license. -->