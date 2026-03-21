# RepairLink – Service Marketplace Platform

RepairLink is a full-stack marketplace platform designed to connect customers with local repair service providers. The system enables seamless service discovery, booking, and management through role-based dashboards and secure backend services.

---

## Overview

RepairLink was built as a real-world system to simulate production-level workflows, including authentication, booking flows, and user-role management. The platform focuses on reliability, structured data handling, and scalable backend architecture.

---

## User Roles

- **Customers** – Browse services, book repairs, and leave reviews  
- **Service Providers (Vendors)** – Manage services, bookings, and availability  
- **Admin** – Oversee platform activity and user management  

---

## Key Features

- Secure **JWT-based authentication**  
- Role-based access control (Customer / Vendor / Admin)  
- End-to-end **booking and scheduling system**  
- Vendor dashboard for managing services and requests  
- Customer dashboard for tracking bookings  
- Reviews and ratings system  
- RESTful API architecture  

---

## Architecture

**Backend:**  
- Java  
- Spring Boot  
- REST APIs  
- JWT Authentication  

**Frontend:**  
- React  
- Tailwind CSS  

**Database:**  
- MySQL  

**Infrastructure:**  
- AWS (previously deployed)  
- Docker  
- Redis  

---

## Technical Highlights

- Designed and implemented **secure authentication and authorization flows** using JWT  
- Built **role-based system architecture**, ensuring controlled access across multiple dashboards  
- Modeled relational database structures for **users, services, and bookings**  
- Implemented **booking workflows with status tracking and data consistency**  
- Developed REST APIs with proper validation, error handling, and structured responses  
- Gained hands-on experience deploying and managing backend services on **AWS**  

---

## Challenges & Solutions

**Challenge:**  
Implementing secure role-based navigation and ensuring consistent data handling across booking workflows  

**Solution:**  
- Structured backend logic to enforce role-based access  
- Designed relational database schema to maintain data integrity  
- Applied debugging techniques to trace authentication and data flow issues  

---

## Deployment Note

This project was previously deployed on AWS with full backend functionality.  
Due to billing constraints, the live backend services are currently inactive.  

👉 However, the full system architecture, source code, and implementation remain available in this repository.

---

## 🔗 Live Demo

https://repairlinkdemo.netlify.app/

*(Frontend available – backend services currently inactive)*

---

## Author

**Siphamandla**  
Java Backend Developer | Spring Boot | Full-Stack Experience  

---

## 📌 Notes

This project was a key milestone in developing real-world backend skills, particularly in authentication, system design, and building production-oriented workflows.
