const API = 'http://localhost:3000';

// Load & filter products
function loadProducts() {
  const filters = {
    name: document.getElementById('f-name').value.trim(),
    minPrice: document.getElementById('f-min').value,
    maxPrice: document.getElementById('f-max').value
  };

  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== '')
  );
  const params = new URLSearchParams(cleaned).toString();

  fetch(`${API}/products?${params}`)
    .then(res => res.json())
    .then(products => {
      const list = document.getElementById('product-list');
      list.innerHTML = '';
      if (!products.length) {
        list.innerHTML = '<p>No products found.</p>';
        return;
      }
      products.forEach(p => {
        const d = document.createElement('div');
        d.className = 'product';
        d.innerHTML = `
          <img src="${p.image}" alt="${p.name}" />
          <h2>${p.name}</h2>
          <p>$${p.price.toFixed(2)}</p>
          <p>${p.description}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        list.appendChild(d);
      });
    })
    .catch(error => console.error('Fetch error:', error));
}

// Add items to cart
function addToCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

// Load cart items
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const container = document.getElementById('cart-items');
  if (!cart.length) {
    container.innerText = 'Your cart is empty.';
    return;
  }
  fetch(`${API}/products`)
    .then(res => res.json())
    .then(products => {
      container.innerHTML = '';
      cart.forEach(id => {
        const p = products.find(o => o.id === id);
        if (p) {
          const d = document.createElement('div');
          d.className = 'product';
          d.innerHTML = `<h2>${p.name}</h2><p>$${p.price.toFixed(2)}</p>`;
          container.appendChild(d);
        }
      });
    });
}

// Checkout & redirect to tracking
function checkout() {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  })
    .then(res => res.json())
    .then(order => {
      localStorage.removeItem('cart');
      window.location.href = `tracking.html?id=${order.id}`;
    });
}

// Load order status
function loadTracking() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;
  fetch(`${API}/orders/${id}`)
    .then(res => res.json())
    .then(order => {
      document.getElementById('status').innerText = `Order ${order.id}: ${order.status}`;
    });
}

// Reviews: skipped for simplicity here

// Initialize pages
if (document.getElementById('product-list')) loadProducts();
if (document.getElementById('cart-items')) loadCart();
if (document.getElementById('status')) loadTracking();
