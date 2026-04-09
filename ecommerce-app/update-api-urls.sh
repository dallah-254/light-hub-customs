#!/bin/bash

# Update all hardcoded localhost:3001 references to use the API config

FILES=(
  "src/pages/Profile.jsx"
  "src/pages/Checkout.jsx"
  "src/pages/Orders.jsx"
  "src/pages/TrackOrder.jsx"
  "src/pages/admin/AdminDashboard.jsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    sed -i "s|'http://localhost:3001|\`\${API_URL}|g" "$file"
    sed -i "s|\`http://localhost:3001|\`\${API_URL}|g" "$file"
    
    # Add import if not present
    if ! grep -q "import API_URL" "$file"; then
      sed -i "1i import API_URL from '../config/api-config'" "$file"
    fi
  fi
done

echo "Done! All files updated."
