# 📚 EduStack – Online Learning Platform  

EduStack is a **fully functional ed-tech platform** that enables users to **create, consume, and rate educational content**.  
It is built using the **MERN Stack** – ReactJS, NodeJS, MongoDB, and ExpressJS.  

🔗 **GitHub Repository:** [EduStack Code](https://github.com/Abhisheksingh555/Online-Learning-Platform)  
🌐 **Live Demo:** [Try EduStack](https://edu-stack-frontend.vercel.app/)  

---

## 📝 Project Description  

EduStack is designed to provide:  
1️⃣ A **seamless and interactive learning experience** for students, making education more engaging.  
2️⃣ A **platform for instructors** to showcase their expertise and connect with learners globally.  

---

## 📑 Table of Contents  

| Section | Description |
|---------|-------------|
| 📚 [EduStack Aim](#-edustack-aim-) | Overview of EduStack's goals |
| 💻 [Tech Stack](#-tech-stack-) | Technologies used in the project |
| 🏰 [System Architecture](#-system-architecture-) | Overview of the system architecture |
| 🏗️ [Architecture Diagram](#-architecture-diagram-) | High-level architecture |
| 🗂 [Schema](#-data-models-and-database-schema-) | Data schemas explanation |
| 🎣 [React Hooks](#-react-hooks-) | React Hooks used |
| ⚛️ [React Libraries](#%EF%B8%8F-react-libraries-) | React Libraries used |
| 🖥️ [Screen Preview](#%EF%B8%8F-screen-preview) | App Preview Screens |

---

## 📚 EduStack Aim  

- ✅ Create an engaging learning ecosystem for students.  
- ✅ Help instructors publish, manage, and monetize courses.  
- ✅ Provide interactive features like ratings, wishlists, insights, and secure payments.  

---

## 💻 Tech Stack  

### 🎨 Frontend  
- **ReactJS** – UI Library  
- **Tailwind CSS** – Styling  
- **React Router** – Navigation  
- **Redux Toolkit** – State Management  

### ⚙️ Backend  
- **NodeJS** – Server Runtime  
- **ExpressJS** – Backend Framework  

### 🛢️ Database  
- **MongoDB** – NoSQL Database  

### ☁️ Cloud Services  
- **Cloudinary** – Media Storage (Images, Videos, Docs)  
- **Razorpay** – Payment Gateway  

---

## 🏰 System Architecture  

EduStack follows a **client-server architecture** with three main components:  

- 🎨 **Frontend** (ReactJS) – Interactive UI with API integration  
- ⚙️ **Backend** (Node + Express) – Handles authentication, course logic, APIs  
- 🛢️ **Database** (MongoDB) – Stores users, courses, media, and transactions  

---

## 🏗️ Architecture Diagram  

```mermaid
graph TD
A[Frontend - ReactJS] -->|REST API| B[Backend - NodeJS/Express]
B --> C[(Database - MongoDB)]
B --> D[(Cloudinary - Media Storage)]
B --> E[(Razorpay - Payments)]
