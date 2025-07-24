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

- **Phy Vathanak** — Frontend & Backend, Database Design  
- **Choun Rathanak** — Frontend, UML Design  
- **Chhun Sivheng** — UI/UX Design, Frontend
- **Cheng Chanpanha** — UML Design  


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

## 🚀 Technology Used

| Category         | Technology                             |
|------------------|-----------------------------------------|
| Frontend         | React.js, Tailwind CSS                  |
| Backend          | Node.js, Express.js, TypeScript         |
| Database         | MySQL                                   |
| Authentication   | JWT (JSON Web Tokens), bcrypt           |
| Payments         | KHQR (Bakong Network)                   |
| Notifications    | Telegram Bot API, InfoBip SMS API       |
| File Upload      | Cloudinary                              |

---

## 🔧 System Design & API

### ⚙️ Architecture

The backend uses a **modular structure** with clear separation of controllers, services, and repositories. All APIs are **stateless and RESTful**, using **JWT authentication** to allow horizontal scaling and secure endpoints.

### 👣 User Flow

```text
Login/Register → Browse Products → View Details → Add to Cart → Checkout → KHQR Payment → Success

## 🌐 Hosting & Deployment
This project is hosted using a modern multi-service architecture to ensure scalability and performance:

### **Database**
MySQL hosted on **AWS RDS**

### **Backend API**
Hosted on **Render**
* **URL**: [https://computer-shop-89hq.onrender.com](https://computer-shop-89hq.onrender.com)

### **Frontend**
Hosted on **Vercel**
* **URL**: [https://computer-shop-henna.vercel.app/](https://computer-shop-henna.vercel.app/)

---
## 🔄 Data Flow
1.  The user interacts with the frontend application hosted on **Vercel**.
2.  The frontend sends API requests to the backend server hosted on **Render**.
3.  The backend communicates with the **MySQL** database on **AWS** to store and retrieve data.
4.  On successful order payment, the backend triggers notifications via **Telegram** and **InfoBip SMS** services.
5.  Payments are processed using the **Bakong KHQR system** integrated into the backend.

This architecture allows for independent scaling and maintenance of frontend, backend, and database components.

---
## 📄 License
This project is licensed under the **MIT License**.

---
## 🙏 Acknowledgments
Thanks to the **Cambodia Academy of Digital Technology** for supporting this project and providing the Software Engineering course framework.
