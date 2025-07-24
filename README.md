# 🖥️ Computer Shop E-Commerce System

This project is a full-featured e-commerce platform developed specifically for the Cambodian tech retail market. It enables customers to browse, purchase, and pay for technology products through a user-friendly, mobile-responsive interface.

Designed with the local ecosystem in mind, the platform integrates real-time KHQR payments via the Bakong system and provides instant Telegram notifications to administrators upon successful transactions. It also features secure user authentication, efficient order management, and a robust admin dashboard—making it a powerful solution for digital commerce in Cambodia.

Key highlights include:

- ✅ KHQR Payments via Bakong
- ✅ Real-time Telegram notifications for new orders
- ✅ Secure authentication with JWT
---

## 👥 Meet the Team

This project was developed by **G3 (SE GEN 10)**. Below are the team members:

 Phy Vathanak    
 Choun Rathanak   
 Cheng Chanpanha 
 Chhun Sivheng    

---

## ✨ Key Features

### 🛒 Customer Side
- Browse and search for tech products by category or brand
- Add items to cart and checkout easily
- Secure login & order history tracking
- Pay in real-time using **Bakong KHQR**
- Instant order confirmation after payment

### 🛠️ Admin Side
- Secure admin dashboard for managing orders and inventory
- Real-time Telegram notifications on successful payments
- Track order status and update delivery stages
- Full control over product listings and discounts

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
