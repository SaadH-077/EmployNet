# Employ-Net Documentation

Welcome to the Employ-Net application documentation. This guide will walk you through the setup process and explain the functionality of the login and sign-up features.

## Setup and Installation

Before running the application, you need to install the necessary dependencies.

### `npm i`

This command installs all the dependencies required for the application to run. Dependencies are defined in the `package.json` file and may include libraries, frameworks, and other modules needed for the application.

### `npm start`

After installing the dependencies, you can start the application using this command. It initiates the React application and serves it usually on port 3000.

When the application is running, you can view it in development mode by navigating to: [https://employnet.onrender.com](https://employnet.onrender.com) to view it in your browser.

- The page will reload when you make changes.\
- You may also see any lint errors in the console.

## Features

### Login

The login page provides a simple and secure interface for existing users to access their accounts. Users must enter their `Username` and `Password` and select their role as either an `Employee` or a `Manager`. Upon providing the correct credentials, they will be granted access to their respective dashboards where they can manage their tasks and view important information.

## Automated Confirmation Email

To enhance the security of our users' accounts, Employ-Net has implemented an Automated Confirmation Email feature that triggers upon every successful login attempt.

- **Email Notification**: As soon as an employee or manager logs into their account using their email credentials, the system automatically sends a confirmation email to the associated email address. This email serves as a prompt notification of the recent login activity.

- **Security Prompt**: The confirmation email contains an important security message, alerting the user that an account has been accessed with their email credentials. It is a proactive measure to ensure that the user is aware of and has authorized the login.

- **Reporting Unauthorized Access**: In the event that the login was not initiated by the user, the email provides instructions on how to report this unauthorized access. Prompt reporting helps in taking immediate action to secure the account and prevent any potential misuse.

This feature is an integral part of Employ-Net's commitment to maintaining a secure platform for all users. It provides an extra layer of account security by immediately informing users of account access, thereby enabling quick responses to any unauthorized login attempts.

## Automated Confirmation Email

To enhance the security of our users' accounts, Employ-Net has implemented an Automated Confirmation Email feature that triggers upon every successful login attempt.

- **Email Notification**: As soon as an employee or manager logs into their account using their email credentials, the system automatically sends a confirmation email to the associated email address. This email serves as a prompt notification of the recent login activity.

- **Security Prompt**: The confirmation email contains an important security message, alerting the user that an account has been accessed with their email credentials. It is a proactive measure to ensure that the user is aware of and has authorized the login.

- **Reporting Unauthorized Access**: In the event that the login was not initiated by the user, the email provides instructions on how to report this unauthorized access. Prompt reporting helps in taking immediate action to secure the account and prevent any potential misuse.

This feature is an integral part of Employ-Net's commitment to maintaining a secure platform for all users. It provides an extra layer of account security by immediately informing users of account access, thereby enabling quick responses to any unauthorized login attempts.

### Sign Up

New users can create an account by navigating to the Sign Up page from the login screen. The sign-up process is straightforward, requiring users to input their `First name`, `Surname`, `Email address`, and `New password`. They also need to specify their role within the company by selecting either `Employee` or `Manager`. Once the form is submitted, users can immediately log in to their new account.

## Sign Up Page

The Sign Up page allows new users to register for an Employ-Net account. To create an account, follow these steps:

1. **First Name**: Enter your given name in the 'First name' field. This is used to personalize your user experience within Employ-Net.

2. **Surname**: Provide your family name or last name in the 'Surname' field. This helps in identifying your profile within the system.

3. **Email Address**: Input a valid email address in the 'Email address' field. This will be your username for logging in and the primary means for Employ-Net to communicate with you.

4. **New Password**: Create a strong password for your account and enter it in the 'New password' field. Ensure your password is secure and not easily guessable.

5. **Role Selection**: Choose your role within Employ-Net by selecting either 'Employee' or 'Manager'. This will customize your experience and the features available to you.

6. **Create New User**: Once all fields are correctly filled, click the 'Create New User' button to complete the registration process.

After successfully creating an account, you will be able to log in with your new credentials and access features specific to your role.

Please ensure all information provided is accurate and up-to-date. Should you face any issues during the sign-up process, do not hesitate to contact our support team for assistance.

## Employee Homepage

Once an employee logs into Employ-Net, they are greeted with the Employee Homepage. This page serves as the central hub for employee interactions and provides the following features:

- **Welcome Message**: A personalized greeting that welcomes the employee to Employ-Net, reinforcing the user-friendly nature of the platform.

- **Role Confirmation**: A confirmation message stating that the user is logged in as an employee, which helps to ensure that they have accessed the correct account type.

- **Update Information**: An actionable button that allows employees to update their personal or professional information. Keeping profiles up-to-date ensures the accuracy of the system's data.

- **Check-In/Check-Out Confirmation**: A status message accompanied by a button that reflects the employee's current check-in status. This feature is designed to provide a simple way for employees to clock in and out of their shifts and to confirm their current status at a glance.

- **Navigation Bar**: A navigation bar that includes links to the Home, Login, Features, and Dashboard pages, allowing for easy movement between different areas of the application.

- **Sign Out**: A prominent button located in the upper right corner, giving employees the ability to securely exit their account when they have finished their session.

The Employee Homepage is designed to be intuitive and efficient, enabling employees to focus on their tasks without unnecessary complexity.

Please note that the functionalities available on the Employee Homepage may vary depending on the employee's role and permissions within the company.

## Employee Dashboard

The Employee Dashboard is a personalized and informative interface within Employ-Net that presents key statistics and details relevant to an individual's employment. Here's what employees can expect to find on their dashboard:

- **Personalized Welcome**: Each employee is greeted by name, adding a personal touch and confirming that the logged-in session is customized to their profile.

- **Statistics Section**: This area displays crucial data regarding the employee's leave balances:
  - **Number of Paid Leaves Remaining**: Shows the count of remaining paid leaves the employee can take.
  - **Number of Unpaid Leaves Remaining**: Indicates how many unpaid leaves the employee has at their disposal.
  - **Overall Leaves Remaining**: Provides a total count of both paid and unpaid leaves combined, giving a quick overview of available time off.

- **Date of Joining**: Displays the date the employee started with the company, helping them keep track of their tenure.

- **Days at Company**: A dynamic counter showing the number of days the employee has been part of the company, updated daily.

The dashboard is designed to give employees a quick snapshot of their leave status and employment duration, enabling them to plan ahead and manage their time off effectively. It is a key feature for maintaining transparency and ensuring that employees have easy access to their most up-to-date employment information.

## Attendance Tracking

Employ-Net incorporates a robust Attendance Tracking feature that enables employees to manage and monitor their work attendance with ease. Here's how it functions:

- **Check-In/Check-Out**: Employees have the ability to check in when they start their workday and check out at the end. This feature captures the exact time of these actions to ensure accurate attendance records.

- **Attendance Evaluation**: The system automatically evaluates the total hours worked in a day. If an employee works for 8 hours or more, they are marked as 'Present' for the day. Any duration less than 8 hours will be recorded as 'Absent' in the database, taking into account the company's attendance policy.

- **Monthly Attendance View**: Employees can access their attendance records for the current month at any time. This feature provides them with a transparent view of their attendance status, including the number of days present, absent, and any patterns in their check-in and check-out times.

This attendance tracking mechanism is designed to foster a disciplined work environment and to support employees in maintaining consistent work habits. It also assists the HR department in managing leave balances and attendance records more efficiently.



