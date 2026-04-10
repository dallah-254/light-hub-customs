# Styles Organization

All CSS files have been consolidated into 5 organized files:

## 1. `1-global.css`
**Base styles for the entire application**
- Global resets
- Body styles
- App container
- Main layout

## 2. `2-layout.css`
**Header, Footer, and Navigation**
- Header component
- Footer component
- Navigation menus
- Mobile menu

## 3. `3-pages.css`
**All main page styles**
- Home page
- Shop page
- Product details
- Cart page
- Checkout page
- Orders page
- Profile page
- Track order page

## 4. `4-auth.css`
**Authentication and Admin**
- Login page
- Register page
- Admin login
- Admin dashboard

## 5. `5-utilities.css`
**Utility pages and components**
- About page
- Contact page
- Help page
- Tools page
- Bulb finder
- Fitment guide
- Categories
- Wishlist
- Compare products
- Compatibility checker
- Small components (AddToCart, DeliveryInfo)

## How to Edit Styles

1. **Global changes** (colors, fonts, spacing) → Edit `1-global.css`
2. **Header/Footer changes** → Edit `2-layout.css`
3. **Main page changes** → Edit `3-pages.css` (find the page section)
4. **Login/Register/Admin changes** → Edit `4-auth.css`
5. **Other pages/tools** → Edit `5-utilities.css`

All files are imported in `App.jsx` in order (1-5).
