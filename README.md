# Role-Based-Access-Control

RBAC (Role-Based Access Control) Dashboard

- **Overview:**
     This project is an Admin Dashboard designed for Role-Based Access Control (RBAC) management. The dashboard allows administrators to manage users, roles, and permissions. It features a user-friendly interface for CRUD operations, bulk actions, and detailed user management, role and permission assignments, and various other management functions.

## Table of Contents
    
 - Installation
 - Project Structure
 - Features
 - Technologies Used
 - Environment Variables
 - Setup and Running the Project
 - How to Use
 - Code Structure and Contribution

## Installation

Install my-project with npm

```bash
Node.js

 - Install from: https://nodejs.org

Text Editor or IDE

 - Recommended: Visual Studio Code or any IDE of your choice.
```
## Project Structure

 - pages/: Contains the pages for the app (e.g., Users, Roles, Permissions, Create User, etc.)
 - components/: Reusable UI components such as tables, forms, and modals.
 - lib/: Contains utility functions like API calls to Supabase and validation.
 - store/: Zustand store to manage global state.
 - styles/: Tailwind CSS setup and global styles.
 - utils/: Helper functions for pagination, bulk actions, etc.
 - Public assets/: images, icons
 - ui/: Reusable common components



## Features

- **User Management**: Create, Edit, Delete, and manage user roles and permissions.
- **Bulk Actions:** Update the status of multiple users at once (active/inactive).
- **Role Management:** Create, Edit, Delete roles.
- **Permission Management:** Create, Edit, Delete permissions.
- **Pagination:** Navigate between pages using next/previous pagination.
  Dialog-based 
-  **Validations:** Pop-up dialogs for user creation, confirmation,    and cancel actions.
- **Bread crumbs:** Bread crumbs are added for easy navigation.



## Tech Stack

**Client:**  React, Next js, Tailwind CSS, Shadcn UI, Zustand, React Hook, Form, Zod

**Server:**  Node, Supabase (for database)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_SUPABASE_URL` : https://wuoifapsvadlubqpcxji.supabase.co/

`NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1b2lmYXBzdmFkbHVicXBjeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNjY4NzksImV4cCI6MjA0Nzk0Mjg3OX0.89yBkNPAyeCNsQSrViK8o-ifn76ZACND7fC6t04DIdM

## Run Locally

Clone the project

```bash
  git clone https://github.com/RobertBhanuPrasad/Role-Based-Access-Control.git
```

Go to the project directory

```bash
  cd rbac
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Technologies Used

- **Next.js:** Framework for building server-side rendered React applications.
- **Shadcn:** UI component library for building sleek interfaces.
- **Zod:** For input validation.
- **React Hook Form:** For managing form state and validation.
- **Supabase:** Backend as a service (BaaS) for authentication, database, and storage.
- **Tailwind CSS:** For styling and UI components.
- **Zustand:** For global state management.
- **Node.js:** JavaScript runtime.
- **TypeScript:** Strongly typed JavaScript for better code quality and tooling
## How to use

This project is used by the following companies:

- **Dashboard:** The dashboard is the landing page with easy access to the user, role, and permission management sections.
- **Users:** View users in the user listing page and manage them using the CRUD operations and bulk actions
- **Roles & Permissions:** Manage roles and permissions via their respective sections. You can create, edit, and delete roles and permissions as needed.
- **Pagination:** Use the pagination buttons to navigate through multiple pages of users, roles, and permissions.
- **Dialogs:** Interact with various confirmation and validation dialogs during user creation or other actions.
- **Breadcrumbs:** For easy navigations

## Demo

Insert gif or link to demo


# Hi, I'm Robert! 👋


## 🚀 About Me
As a software developer with hands-on experience in web development, I bring a versatile skill set that combines technical proficiency and creative problem-solving. My journey includes internships at companies like Infitronics and Sumeru Software Solutions, where I contributed to building responsive web applications, API integrations, and multilingual website translations, while gaining expertise in technologies like React, Tailwind CSS, and WordPress.

I am passionate about creating user-centric solutions and have showcased this in projects like an E-commerce Website and Expense Tracking Application. My focus is on delivering high-quality, scalable, and efficient systems. With additional skills in Python, JavaScript, PostgreSQL, React js, Next js and UI/UX design, I am eager to bring my skills to dynamic teams working on impactful projects.


## 🛠 Skills
Javascript, HTML, CSS, Typescript, Next js, Tailwind CSS, Supabase


## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/robert-bhanu-prasad-034454213/)



## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Support

For support, email robertbhanuprasad0108@gmail.com.

