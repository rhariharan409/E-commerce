E-commerce Demo (Simple HTML/CSS/JS)

Overview

This is a small, front-end only demo E-commerce portal built with plain HTML, CSS and JavaScript. It implements basic features of an online store (product listing, cart, wishlist, registration/login, checkout and orders) for learning and prototyping purposes.

Features

- Navigation menu (Home, Products, Contact Us, About Us)
- Product grid with sample products and images (loaded from Unsplash)
- User registration and login (stored in browser localStorage)
- Add to Cart (update quantity, remove)
- Wishlist (move to cart, remove)
- Cart and Wishlist modal views with item counts in the navbar
- Checkout modal with shipping form and order placement
- Orders list in the dashboard showing placed orders

Important notes

- This project is front-end only. There is no backend. All data (users, cart, wishlist, orders) is stored in localStorage for demo purposes.
- Storing passwords in localStorage is NOT secure. This is for demo/testing only — do not use this approach in production.

Project structure

- index.html        — main page and modals
- css/style.css     — styles
- js/script.js      — application logic (products, auth, cart, wishlist, checkout)
- images/           — (empty or local images if you add any)

How to run (Windows)

Option A — Open directly in browser
1. Open the folder in File Explorer.
2. Double-click `index.html` to open it in your default browser.

Option B — Use VS Code Live Server (recommended for hot reload)
1. Open the folder in VS Code.
2. Install the "Live Server" extension (if you don't have it).
3. Click "Go Live" in the status bar or right-click `index.html` > "Open with Live Server".

Testing the checkout flow (quick)

1. Open the site (see "How to run").
2. Click "Register" and create a new user (name, email, password).
3. Add 1 or more products to the cart by clicking "Add to Cart".
4. Click the Cart icon (top nav) and then "Proceed to Checkout".
5. Fill in shipping details and click "Place Order".
6. After placing the order the cart will be cleared and the order will appear under "Your Orders" in the dashboard.
7. Refresh the page — your account, orders and data persist via localStorage.

Customizing images and products

- Product images are currently remote Unsplash URLs defined in `js/script.js`.
- To use local images, add image files to the `images/` folder and update the `image` field of each product in `js/script.js` to the relative path (for example `images/smartphone.jpg`).

Troubleshooting

- If images don't appear, confirm you have internet access (Unsplash CDN is used).
- If modals don't show or counts don't update, open the browser dev tools (F12) and check for console errors. Element IDs in the HTML must match the IDs referenced in `js/script.js`.

Next steps / suggestions

- Persist unauthenticated cart in localStorage so users can add items before registering.
- Add server-side backend for secure authentication and persistent storage.
- Replace localStorage password storage with proper hashed authentication via a backend.
- Improve UI/UX and add product details pages.

License

This project is a simple demo and may be reused for learning purposes. No license specified.
