// ==========================================
// 1. GLOBAL STATES & LOCALSTORAGE CONFIG
// ==========================================
let wishlist = JSON.parse(localStorage.getItem("wishlist_items")) || [];
let cart = JSON.parse(localStorage.getItem("cart_items")) || [];

// Target IDs matching unga HTML layout exactly
function updateCounts() {
    const cartEl = document.getElementById("cart-count");
    const wishEl = document.getElementById("wishlist-count");

    if (cartEl) cartEl.innerText = cart.length;
    if (wishEl) wishEl.innerText = wishlist.length;
}

// ==========================================
// 2. LIKE / WISHLIST DYNAMIC LOGIC
// ==========================================
function toggleLike(id, name, price) {
    if (window.event) window.event.stopPropagation();

    const existingIndex = wishlist.findIndex(item => item.id === id);
    
    if (existingIndex === -1) {
        wishlist.push({ id, name, price });
        alert(`${name} ❤️ Added To Wishlist`);
    } else {
        wishlist.splice(existingIndex, 1);
        alert(`${name} Removed from Wishlist!`);
    }
    
    localStorage.setItem("wishlist_items", JSON.stringify(wishlist));
    updateCounts();
    updateWishlistUI();
}

// ==========================================
// 3. ADD TO CART DYNAMIC LOGIC
// ==========================================
function ADDTOBAG(id, name, price) {
    if (window.event) window.event.stopPropagation();

    cart.push({ id, name, price });
    alert(`${name} 🛒 Added To BAG`);
    
    localStorage.setItem("cart_items", JSON.stringify(cart));
    updateCounts();
    updateCartUI();
}

// ==========================================
// 4. POP-UP MODALS OPEN / CLOSE
// ==========================================
function openWishlistModal() {
    document.getElementById('wishlistModal').style.display = 'flex';
    updateWishlistUI();
}
function closeWishlistModal() {
    document.getElementById('wishlistModal').style.display = 'none';
}

// Idhu dhaan unga navbar-la irukura cart icon-ku connect aagum
function openCartModal() {
    document.getElementById('cartModal').style.display = 'flex';
    updateCartUI();
}
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// ==========================================
// 5. UPDATE POP-UP INNER DYNAMIC ELEMENTS
// ==========================================
function updateWishlistUI() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '<p class="empty-msg">No items in wishlist yet.</p>';
        return;
    }
    
    container.innerHTML = wishlist.map(item => {
        const name = item.name || "Product";
        const price = item.price || 0;
        const id = item.id || 0;

        return `
            <div class="modal-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${name} - ₹${price}</span>
                <button class="remove-item-btn" onclick="toggleLike(${id}, '${name}', ${price})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-size:16px;">❌</button>
            </div>
        `;
    }).join('');
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total-price');
    if (!container || !totalSpan) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        totalSpan.innerText = '0';
        return;
    }
    
    container.innerHTML = cart.map((item, index) => {
        const name = item.name || "Item";
        const price = item.price || 0;

        return `
            <div class="modal-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${name} - ₹${price}</span>
                <button class="remove-item-btn" onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-size:16px;">❌</button>
            </div>
        `;
    }).join('');
    
    // Total calculation (`NaN` varama safe panna)
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    totalSpan.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart_items", JSON.stringify(cart));
    updateCounts();
    updateCartUI();
}

// Proceed to Checkout Button Logic
function processCheckout() {
    if (cart.length === 0) {
        alert("Unga cart empty-ah iruku! Edhavadhu product add pannunga.");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    alert(`🎉 Order Placed Successfully!\nTotal Amount: ₹${total}\nThank you for shopping with LUXORA!`);
    
    cart = [];
    localStorage.removeItem("cart_items");
    updateCounts();
    closeCartModal();
}

// Close popup via outer background click
window.onclick = function(event) {
    if (event.target == document.getElementById('wishlistModal')) closeWishlistModal();
    if (event.target == document.getElementById('cartModal')) closeCartModal();
}

// ==========================================
// 6. UTILITIES (NEWSLETTER & SCROLL TO TOP)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    updateCounts(); 

    const subscribeBtn = document.querySelector(".newsletter button");
    if(subscribeBtn) {
        subscribeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const emailInput = document.querySelector(".newsletter input");
            if(emailInput && emailInput.value === "") {
                alert("Please enter your email!");
            } else if(emailInput) {
                alert("Thanks for subscribing ❤️");
                emailInput.value = "";
            }
        });
    }

    const topBtn = document.getElementById("topBtn");
    if(topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
