# Store Rating Web Application

A web application to allow users to submit ratings for stores registered on the platform. The app has a **single login system**, and functionalities differ based on user roles: System Administrator, Normal User, and Store Owner.

---

# Live Link :

[Live Link](https://assignment-eight-mu-43.vercel.app)

## Features

- User authentication with role-based access.
- Normal users can submit and modify store ratings (1 to 5).
- Store owners can view ratings and users who rated their stores.
- Admin dashboard with statistics and management features.
- Search, filter, and sorting options for better usability.
- Responsive design and clean UI.

---

## User Roles and Functionalities

### 1. System Administrator

- Can add new stores, normal users, and store owner.
- Access to a dashboard showing:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- Can view, filter, and sort lists of stores and users.
- Can see store owner ratings.
- Can log out securely.

![](/FRONTEND/public/ad1.PNG)

![](/FRONTEND/public/ad2.PNG)

### 2. Normal User

- Can sign up and login.
- Update password after logging in.
- View and search all registered stores by Name and Address.
- View store details:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
  - Option to submit or modify rating
- Logout functionality.

![](/FRONTEND/public/user1.PNG)

![](/FRONTEND/public/user2.PNG)

### 3. Store Owner

- Can log in and update password.
- Dashboard displays:
  - Users who submitted ratings for their store
  - Average rating of their store
- Logout functionality.
  ![](/FRONTEND/public/own1.PNG)

![](/FRONTEND/public/own2.PNG)

---

## Form Validations

- **Name:** 20–60 characters
- **Address:** Max 400 characters
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character
- **Email:** Standard email format

---

## Tech Stack

- **Frontend:** React.js, Shadcn UI, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

---

## Deploy

- **Frontend** Vercel
- **Backend** Render

## How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/devoleper-samreen/ASSIGNMENT.git
   ```
