# MERN E-Commerce Platform with SSLCommerz Integration

## Project Overview

This is a full-featured e-commerce platform built using the MERN stack (MongoDB, Express.js, React, Node.js) with integrated payment processing via SSLCommerz. The platform provides a complete shopping experience for customers with secure payment processing, order management, and admin functionalities.

## Features

### Customer Features

- User authentication (Login/Register)
- Product browsing and search
- Shopping cart functionality
- Secure checkout process
- Order history and tracking
- Multiple payment options via SSLCommerz
- Address management
- Responsive design for all devices

### Admin Features

- Dashboard with sales analytics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Inventory tracking

## Technology Stack

### Frontend (Client)

- **React 18** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Declarative routing
- **Shadcn UI** - Reusable component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend (Server)

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **SSLCommerz** - Payment gateway integration

## Payment Integration

### SSLCommerz (Primary Payment Gateway)

This platform uses SSLCommerz as its primary payment gateway, which is one of the most trusted payment gateways in Bangladesh. SSLCommerz supports multiple payment methods including:

- Credit/Debit Cards (Visa, Mastercard, American Express)
- Mobile Banking (bKash, Rocket, Nagad)
- Internet Banking
- Mobile Wallets
- Offline Payment (Cash on Delivery)

### Why SSLCommerz Instead of PayPal?

1. **Regional Focus**: SSLCommerz is specifically designed for the Bangladesh market with local payment methods
2. **Local Payment Options**: Supports popular Bangladeshi payment methods like bKash, Rocket, and Nagad
3. **Lower Transaction Fees**: Competitive pricing for local merchants
4. **Regulatory Compliance**: Fully compliant with Bangladesh banking regulations
5. **Better Support**: Local customer support in Bangla and English
6. **Faster Settlement**: Quicker payment settlements compared to international gateways

## Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── store/               # Redux store and slices
│   ├── assets/              # Static assets
│   └── App.jsx              # Main application component
├── public/                  # Public assets
└── ...

server/
├── controllers/             # Request handlers
├── models/                  # Database models
├── routes/                  # API routes
├── helpers/                 # Utility functions
└── server.js               # Entry point
```

## Key Components

### Shopping Experience

1. **Product Catalog**: Browse products with filtering and search capabilities
2. **Shopping Cart**: Add/remove items, adjust quantities
3. **Checkout Process**: Secure multi-step checkout with address selection
4. **Payment Processing**: Integrated SSLCommerz payment gateway
5. **Order Management**: View order history and status

### Admin Dashboard

1. **Analytics**: Sales reports and metrics
2. **Product Management**: Add, edit, delete products
3. **Order Management**: Process and update order statuses
4. **User Management**: View and manage customer accounts

## Payment Flow

1. Customer adds items to cart and proceeds to checkout
2. Customer selects delivery address
3. Customer chooses payment method (SSLCommerz)
4. System creates order with "pending" status
5. Customer is redirected to SSLCommerz payment gateway
6. Customer completes payment on SSLCommerz portal
7. SSLCommerz sends IPN to server with payment status
8. Server updates order status based on payment result
9. Customer is redirected back to success/failure page

## Environment Variables

### Client (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

### Server (.env)

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
SSLCOMMERZ_STORE_ID=your_sslcommerz_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install client dependencies:

```bash
cd client
npm install
```

3. Install server dependencies:

```bash
cd ../server
npm install
```

4. Set up environment variables in both client and server directories

5. Start the development servers:

```bash
# In server directory
npm run dev

# In client directory
npm run dev
```

## Deployment

### Frontend

- Can be deployed to any static hosting service (Vercel, Netlify, etc.)

### Backend

- Can be deployed to any Node.js hosting service (Heroku, Render, etc.)
- Requires MongoDB database connection

## Future Enhancements

1. **Advanced Analytics**: Implement more detailed sales and customer analytics
2. **Inventory Management**: Enhanced stock tracking with low stock alerts
3. **Coupon System**: Discount codes and promotional offers
4. **Wishlist**: Save products for later purchase
5. **Product Reviews**: Customer reviews and ratings
6. **Multi-language Support**: Localization for different regions
7. **Mobile App**: Native mobile applications for iOS and Android

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or support, please contact the development team.
