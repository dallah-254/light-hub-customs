#!/bin/bash

# Script to update all API URLs in the frontend

cd "$(dirname "$0")"

echo "Updating API URLs in all frontend files..."

# Profile.jsx
if grep -q "import API_URL" src/pages/Profile.jsx 2>/dev/null; then
  echo "Profile.jsx already updated"
else
  sed -i "1i import API_URL from '../config/api-config'" src/pages/Profile.jsx
  sed -i "s|'http://localhost:3001|\`\${API_URL}|g" src/pages/Profile.jsx
  echo "✓ Updated Profile.jsx"
fi

# Orders.jsx
if grep -q "import API_URL" src/pages/Orders.jsx 2>/dev/null; then
  echo "Orders.jsx already updated"
else
  sed -i "1i import API_URL from '../config/api-config'" src/pages/Orders.jsx
  sed -i "s|'http://localhost:3001|\`\${API_URL}|g" src/pages/Orders.jsx
  echo "✓ Updated Orders.jsx"
fi

# TrackOrder.jsx
if grep -q "import API_URL" src/pages/TrackOrder.jsx 2>/dev/null; then
  echo "TrackOrder.jsx already updated"
else
  sed -i "1i import API_URL from '../config/api-config'" src/pages/TrackOrder.jsx
  sed -i "s|'http://localhost:3001|\`\${API_URL}|g" src/pages/TrackOrder.jsx
  echo "✓ Updated TrackOrder.jsx"
fi

# AdminDashboard.jsx
if grep -q "import API_URL" src/pages/admin/AdminDashboard.jsx 2>/dev/null; then
  echo "AdminDashboard.jsx already updated"
else
  sed -i "1i import API_URL from '../../config/api-config'" src/pages/admin/AdminDashboard.jsx
  sed -i "s|'http://localhost:3001|\`\${API_URL}|g" src/pages/admin/AdminDashboard.jsx
  sed -i "s|\`http://localhost:3001|\`\${API_URL}|g" src/pages/admin/AdminDashboard.jsx
  echo "✓ Updated AdminDashboard.jsx"
fi

echo ""
echo "All files updated successfully!"
echo "You can now deploy to Render."
