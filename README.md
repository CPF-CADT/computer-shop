# 🖥️ Computer Shop E-Commerce System



Key highlights include:

- ✅ KHQR Payments via Bakong
- ✅ Real-time Telegram notifications for new orders
- ✅ Secure authentication with JWT
- ✅ Scalable modular backend architecture

---

## 👥 Meet the Team

This project was developed by **G3 (SE GEN 10)**. Below are the team members and their roles:

| Name             | Student ID   | Project Role                   | Scrum Role         |
|------------------|--------------|--------------------------------|--------------------|
| Phy Vathanak     | IDTB100037   | Project Lead, Backend Developer| Developer          |
| Choun Rathanak   | IDTB100043   | Front-End, UML Assistant       | Developer          |
| Cheng Chanpanha  | IDTB100070   | UML, Database Admin            | Developer          |
| Lim Lyheang      | IDTB100001   | Documentation                  | Product Owner      |
| Sat Panha        | IDTB100033   | Scrum, Slide Assistant         | Scrum Master       |
| Chhun Sivheng    | IDTB100035   | Figma, Slide                   | Business Analyst   |

---

## ✨ Key Features

### 🛒 Customer-Facing Features

- **Product Discovery:** Browse products by categories (phones, accessories, laptops), search by name, and filter by brand or price.
- **Shopping Cart:** Add, update, or remove items before checking out.
- **Authentication:** Register, log in, and log out securely using JWT.
- **Order History:** Logged-in users can view all their past orders.
- **KHQR Payments:** Checkout generates a KHQR code for real-time Bakong payment with success confirmation.

### 🛠️ Administrator Features

- **Secure Admin Dashboard:** Only authorized admins can access the dashboard.
- **Telegram Notifications:** Admins receive real-time notifications when orders are paid.
- **Order Management:** View and update order status (e.g., pending, preparing, delivered).
- **Product Management:** Admins can create, update, and delete product entries (CRUD operations).

---

## 🚀 Technology Stack

| Category        | Technology                            |
|-----------------|----------------------------------------|
| Frontend        | React.js                               |
| Backend         | Node.js, Express.js, TypeScript        |
| Database        | MySQL                                  |
| Authentication  | JWT (JSON Web Tokens), bcrypt          |
| Payments        | KHQR (Bakong Network)                  |
| Notifications   | Telegram Bot API                       |
| Version Control | Git, GitHub                            |

---

## 🔧 System Design & API

### ⚙️ Architecture

The backend uses a **modular structure** with clear separation of controllers, services, and repositories. All APIs are **stateless and RESTful**, using **JWT authentication** to allow horizontal scaling and secure endpoints.

### 👣 User Flow

```text
Login/Register → Browse Products → View Details → Add to Cart → Checkout → KHQR Payment → Success
