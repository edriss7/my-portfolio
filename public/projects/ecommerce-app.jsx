const { useState, useMemo } = React;

var products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, description: 'Premium noise-canceling wireless headphones with 30-hour battery life and crystal clear audio.', category: 'Electronics', color: '#6366f1' },
  { id: 2, name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical keyboard with Cherry MX switches, aluminum frame, and programmable keys.', category: 'Electronics', color: '#8b5cf6' },
  { id: 3, name: 'Running Shoes', price: 94.99, description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for daily runs.', category: 'Sports', color: '#22c55e' },
  { id: 4, name: 'Coffee Maker', price: 49.99, description: 'Programmable 12-cup coffee maker with thermal carafe and built-in grinder for the freshest brew.', category: 'Kitchen', color: '#f59e0b' },
  { id: 5, name: 'Desk Lamp', price: 34.99, description: 'LED desk lamp with adjustable color temperature, brightness levels, and USB charging port.', category: 'Home', color: '#3b82f6' },
  { id: 6, name: 'Yoga Mat', price: 29.99, description: 'Non-slip eco-friendly yoga mat with alignment marks. Thick padding for comfortable practice.', category: 'Sports', color: '#ec4899' },
  { id: 7, name: 'Backpack', price: 59.99, description: 'Water-resistant laptop backpack with anti-theft design, USB port, and multiple compartments.', category: 'Accessories', color: '#14b8a6' },
  { id: 8, name: 'Smart Watch', price: 199.99, description: 'Fitness-focused smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life.', category: 'Electronics', color: '#ef4444' }
];

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  var cartCount = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
  var cartTotal = cart.reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);

  var addToCart = function(product) {
    setCart(function(prev) {
      var existing = prev.find(function(item) { return item.id === product.id; });
      if (existing) {
        return prev.map(function(item) {
          if (item.id === product.id) return Object.assign({}, item, { quantity: item.quantity + 1 });
          return item;
        });
      }
      return prev.concat([Object.assign({}, product, { quantity: 1 })]);
    });
  };

  var updateQuantity = function(id, delta) {
    setCart(function(prev) {
      return prev.map(function(item) {
        if (item.id === id) {
          var newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return Object.assign({}, item, { quantity: newQty });
        }
        return item;
      }).filter(Boolean);
    });
  };

  var removeFromCart = function(id) {
    setCart(function(prev) { return prev.filter(function(item) { return item.id !== id; }); });
  };

  var isInCart = function(id) {
    return cart.some(function(item) { return item.id === id; });
  };

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 30px' },
    title: { fontSize: '32px', color: '#ffffff' },
    cartBtn: { position: 'relative', padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    cartBadge: { position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' },
    productCard: { background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' },
    imagePlaceholder: { width: '100%', height: '150px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '16px' },
    productName: { fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' },
    productDesc: { fontSize: '13px', lineHeight: '1.5', color: '#999', marginBottom: '12px', flex: 1 },
    productCategory: { fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
    price: { fontSize: '22px', fontWeight: 'bold', color: '#8b5cf6' },
    addBtn: { padding: '8px 18px', fontSize: '13px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000 },
    cartSidebar: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '380px', maxWidth: '90vw', background: 'linear-gradient(180deg, #0f0f2e, #1a1a3e)', zIndex: 1001, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 30px rgba(0,0,0,0.5)' },
    cartHeader: { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cartTitle: { fontSize: '20px', fontWeight: 'bold' },
    closeBtn: { background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' },
    cartItems: { flex: 1, overflow: 'auto', padding: '16px' },
    cartItem: { display: 'flex', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '12px', alignItems: 'center' },
    cartItemImg: { width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
    cartItemInfo: { flex: 1 },
    cartItemName: { fontSize: '14px', fontWeight: 'bold', color: '#ddd', marginBottom: '4px' },
    cartItemPrice: { fontSize: '13px', color: '#8b5cf6' },
    qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
    qtyBtn: { width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#ddd', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyValue: { fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: '4px' },
    cartFooter: { padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' },
    checkoutBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    emptyCart: { textAlign: 'center', color: '#666', padding: '40px 20px', fontSize: '15px' },
    iconMap: { Electronics: '\u26A1', Sports: '\u2606', Kitchen: '\u2615', Home: '\u2302', Accessories: '\u272A' }
  };

  var getIcon = function(cat) {
    return styles.iconMap[cat] || '\u25CF';
  };

  return React.createElement('div', { style: styles.container },
    cartOpen && React.createElement('div', { style: styles.overlay, onClick: function() { setCartOpen(false); } }),
    cartOpen && React.createElement('div', { style: styles.cartSidebar },
      React.createElement('div', { style: styles.cartHeader },
        React.createElement('span', { style: styles.cartTitle }, 'Shopping Cart (' + cartCount + ')'),
        React.createElement('button', { onClick: function() { setCartOpen(false); }, style: styles.closeBtn }, '\u2715')
      ),
      React.createElement('div', { style: styles.cartItems },
        cart.length === 0 && React.createElement('div', { style: styles.emptyCart }, 'Your cart is empty'),
        cart.map(function(item) {
          return React.createElement('div', { key: item.id, style: styles.cartItem },
            React.createElement('div', { style: Object.assign({}, styles.cartItemImg, { background: item.color + '30' }) },
              React.createElement('span', { style: { color: item.color } }, getIcon(item.category))
            ),
            React.createElement('div', { style: styles.cartItemInfo },
              React.createElement('div', { style: styles.cartItemName }, item.name),
              React.createElement('div', { style: styles.cartItemPrice }, '$' + (item.price * item.quantity).toFixed(2))
            ),
            React.createElement('div', { style: styles.qtyControls },
              React.createElement('button', { onClick: function() { updateQuantity(item.id, -1); }, style: styles.qtyBtn }, '-'),
              React.createElement('span', { style: styles.qtyValue }, item.quantity),
              React.createElement('button', { onClick: function() { updateQuantity(item.id, 1); }, style: styles.qtyBtn }, '+')
            ),
            React.createElement('button', { onClick: function() { removeFromCart(item.id); }, style: styles.removeBtn }, '\u2715')
          );
        })
      ),
      cart.length > 0 && React.createElement('div', { style: styles.cartFooter },
        React.createElement('div', { style: styles.totalRow },
          React.createElement('span', null, 'Total'),
          React.createElement('span', { style: { color: '#8b5cf6' } }, '$' + cartTotal.toFixed(2))
        ),
        React.createElement('button', { style: styles.checkoutBtn }, 'Checkout')
      )
    ),

    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('div', { style: styles.header },
      React.createElement('h1', { style: styles.title }, 'E-Commerce Store'),
      React.createElement('button', { onClick: function() { setCartOpen(true); }, style: styles.cartBtn },
        'Cart',
        cartCount > 0 && React.createElement('span', { style: styles.cartBadge }, cartCount)
      )
    ),

    React.createElement('div', { style: styles.grid },
      products.map(function(product) {
        var inCart = isInCart(product.id);
        return React.createElement('div', { key: product.id, style: styles.productCard },
          React.createElement('div', { style: Object.assign({}, styles.imagePlaceholder, { background: product.color + '20' }) },
            React.createElement('span', { style: { color: product.color } }, getIcon(product.category))
          ),
          React.createElement('div', { style: styles.productCategory }, product.category),
          React.createElement('div', { style: styles.productName }, product.name),
          React.createElement('div', { style: styles.productDesc }, product.description),
          React.createElement('div', { style: styles.priceRow },
            React.createElement('span', { style: styles.price }, '$' + product.price.toFixed(2)),
            React.createElement('button', {
              onClick: function() { addToCart(product); },
              style: Object.assign({}, styles.addBtn, {
                background: inCart ? '#22c55e' : '#6366f1',
                color: '#fff'
              })
            }, inCart ? '\u2713 In Cart' : 'Add to Cart')
          )
        );
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
