$(document).ready(function() {

    // Helper function to safely read the cart across local file paths
    function getCartData() {
        try {
            return JSON.parse(localStorage.getItem('galleryCartList')) || [];
        } catch (e) {
            return window.globalCartFallback || [];
        }
    }

    // Helper function to safely write the cart across local file paths
    function setCartData(data) {
        try {
            localStorage.setItem('galleryCartList', JSON.stringify(data));
        } catch (e) {}
        window.globalCartFallback = data;
    }

    // FUNCTION: Check if an item is already in the cart and style its button
    function updateButtonState(title, buttonSelector, addedText) {
        const basketList = getCartData();
        const isAlreadyInCart = basketList.some(item => item.title === title);

        if (isAlreadyInCart) {
            $(buttonSelector).text(addedText);
            $(buttonSelector).css({
                'background-color': '#bfa37a',
                'pointer-events': 'auto'
            });
        }
    }

    // FUNCTION: Inject and trigger a premium top-bar notification toast
    function showTopNotification(message) {
        $('#top-toast-notification').remove();

        const toastMarkup = `
            <div id="top-toast-notification" style="
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #111111;
                color: #ffffff;
                padding: 16px 32px;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                letter-spacing: 1px;
                text-transform: uppercase;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                border: 1px solid #bfa37a;
                z-index: 99999;
                transition: top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <span style="color: #bfa37a;">✨</span> ${message}
            </div>
        `;

        $('body').append(toastMarkup);

        setTimeout(function() {
            $('#top-toast-notification').css('top', '24px');
        }, 50);

        setTimeout(function() {
            $('#top-toast-notification').css('top', '-100px');
            setTimeout(function() {
                $('#top-toast-notification').remove();
            }, 400);
        }, 3500);
    }

    // ==========================================================================
    // 1. DYNAMIC CATALOG ROUTING HANDLING (Home & Gallery Pages)
    // ==========================================================================
    $(document).on('click', '.gallery-card', function(event) {
        if ($(event.target).hasClass('quick-add-to-cart-btn') || $(event.target).hasClass('heart-icon')) {
            return;
        }

        const title = $(this).attr('data-title') || $(this).find('.art-meta h3').text().trim();
        const price = $(this).attr('data-price') || $(this).find('.art-price').text().trim();
        
        window.location.href = `painting-info.html?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`;
    });

    $('.gallery-card').each(function() {
        const cardTitle = $(this).attr('data-title') || $(this).find('.art-meta h3').text().trim();
        updateButtonState(cardTitle, $(this).find('.quick-add-to-cart-btn'), '✓ Added');
    });

    // ==========================================================================
    // 2. PAINTING-INFO DETAILED PARAMETER PARSING & ADD TO CART
    // ==========================================================================
    if (window.location.pathname.includes('painting-info.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const titleParam = urlParams.get('title');
        const priceParam = urlParams.get('price');

        const artworkDatabase = {
            "Serenade in Blue": { frontImg: "sib1.jpg", medium: "Heavy-body Studio Oil on Premium Stretched Linen", dimensions: "24\" × 36\" (Gallery Wrap, 1.5\" Depth)", year: "March 2026", desc: "Capturing organic coastal transitions through layered palette knife strokes and custom mixed indigo pigments." },
            "Lilies Canvas": { frontImg: "lilies canvas 1.jpg", medium: "Fine Acrylic & Oil Glaze Blend on Traditional Canvas", dimensions: "20\" × 20\" (Classic Profile, 0.75\" Depth)", year: "April 2026", desc: "A rich, texturized botanical study focusing on soft ambient shadows and vibrant floral illumination." },
            "Chrysanthemum": { frontImg: "mini1.JPG", medium: "Mixed Media & Oil Impasto on Stretched Canvas Mini", dimensions: "12\" × 12\" (Studio Scale)", year: "May 2026", desc: "A meticulous miniature capturing explosive layers of warm rose golds and earthy ochre hues." },
            "Paradise Found": { frontImg: "paradisefound1.JPG", medium: "Premium Oil Canvas with Custom Dammar Varnish Overlay", dimensions: "30\" × 40\" (Grand Statement Canvas)", year: "February 2026", desc: "An immersive, large-scale exploration of lush wilderness canopies dominated by deep forest emeralds." },
            "Golden Horizon": { frontImg: "gh1.jpg", medium: "Gold Leaf Overlay & Knife Oil Palette on Linen", dimensions: "18\" × 24\" (Gallery Profile)", year: "April 2026", desc: "A striking semi-abstract landscape composition balancing highly reflective metallic leaf gilding." },
            "Wild Petal Sketch": { frontImg: "wps1.jpg", medium: "Raw Charcoal Base with Layered Oil Underglazes", dimensions: "16\" × 20\" (Unframed Raw Canvas Edge)", year: "January 2026", desc: "An organic, loose editorial composition showcasing deliberate sketchy linework underneath beautiful washes." }
        };

        if (titleParam && priceParam) {
            const decodedTitle = decodeURIComponent(titleParam);
            const decodedPrice = decodeURIComponent(priceParam);
            
            $('#canvas-title').text(decodedTitle);
            $('#canvas-price').text(decodedPrice);

            updateButtonState(decodedTitle, '#add-to-cart-detail-btn', '✓ Added to Collection Basket');

            const specificArtData = artworkDatabase[decodedTitle];
            if (specificArtData) {
                $('.painting-main-display-img').attr('src', specificArtData.frontImg);
                $('#art-spec-medium').text(specificArtData.medium);
                $('#art-spec-dimensions').text(specificArtData.dimensions);
                $('#art-spec-year').text(specificArtData.year);
                $('#art-narrative-text').text(specificArtData.desc);
            }
        }

        $('#add-to-cart-detail-btn').off('click').on('click', function() {
            const itemTitle = $('#canvas-title').text().trim();
            const itemPrice = $('#canvas-price').text().trim();

            const itemRecord = { title: itemTitle, price: itemPrice };
            let basketList = getCartData();
            basketList.push(itemRecord);
            setCartData(basketList);

            showTopNotification(`"${itemTitle}" added to acquisition cart`);

            $(this).text('✓ Added to Collection Basket');
            $(this).css('background-color', '#bfa37a');
        });
    }

    // ==========================================================================
    // 3. QUICK ADD TO CART ACTION FROM THE GRID CARDS
    // ==========================================================================
    $(document).on('click', '.quick-add-to-cart-btn', function(event) {
        event.stopPropagation(); 
        
        const parentCard = $(this).closest('.gallery-card');
        const itemTitle = parentCard.attr('data-title') || parentCard.find('.art-meta h3').text().trim();
        const itemPrice = parentCard.attr('data-price') || parentCard.find('.art-price').text().trim();

        const itemRecord = { title: itemTitle, price: itemPrice };
        let basketList = getCartData();
        basketList.push(itemRecord);
        setCartData(basketList);

        showTopNotification(`"${itemTitle}" added to acquisition cart`);

        $(this).text('✓ Added');
        $(this).css('background-color', '#bfa37a');
    });

    // ==========================================================================
    // 4. NEW EDITORIAL FULL-WIDTH RESTRUCTURE FOR CART.HTML
    // ==========================================================================
    if (window.location.pathname.includes('cart.html')) {
        // Break out of the side-by-side split layout and stack sections cleanly
        $('.cart-split-layout').css({
            'display': 'flex',
            'flex-direction': 'column',
            'gap': '50px',
            'margin-top': '20px'
        });

        // Setup a beautiful top container holding selected items and pricing totals side-by-side
        $('.cart-items-panel').css({
            'width': '100%',
            'display': 'grid',
            'grid-template-columns': '1.5fr 1fr',
            'gap': '40px',
            'align-items': 'start'
        });

        // Restyle the financials block to visually anchor the right side of the grid
        $('.financials-calculation-block').css({
            'background': '#f9f9f9',
            'padding': '25px',
            'border': '1px solid #eee',
            'margin-top': '0px'
        });

        // Restructure the Collector Form into a premium, wide-spanning lower section
        $('.cart-summary-sidebar').css({
            'width': '100%',
            'background': '#ffffff',
            'padding': '40px 0',
            'border-top': '1px solid #e5e5e5'
        });

        // Style form inputs for an expansive, clean dual-column presentation matrix
        $('#integrated-final-checkout-form').css({
            'display': 'grid',
            'grid-template-columns': '1fr 1fr',
            'gap': '20px 30px'
        });

        // Ensure notes, addresses, and actions stretch wide across the form rows
        $('.full-span-input, .form-action-row, #billing-address, .form-grid-inner-split').parent().css('grid-column', 'span 2');
        $('.form-grid-inner-split').css({
            'display': 'grid',
            'grid-template-columns': '1fr 1fr',
            'gap': '20px 30px',
            'grid-column': 'span 2'
        });
        $('.form-action-row').css('grid-column', 'span 2');

        const storedCartList = getCartData();
        const listContainer = $('#dynamic-invoice-list-container');
        let dynamicSubtotalSum = 0;

        if (storedCartList.length === 0) {
            // Revert layout properties if empty to keep presentation centered
            $('.cart-items-panel').css('display', 'block');
            listContainer.html(`
                <div class="empty-cart-state-view" style="padding: 60px 0; text-align: center; border: 1px dashed #ddd; background: #fafafa;">
                    <p style="font-family: 'Montserrat', sans-serif; color: #666;">Your acquisition container is currently empty.</p>
                    <a href="gallery.html" style="display:inline-block; margin-top:15px; text-decoration:none; padding: 12px 28px; background: #111; color: #fff; font-family: 'Montserrat', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Browse Paintings</a>
                </div>
            `);
            $('.cart-summary-sidebar').hide();
            $('.cart-utility-buttons').hide();
            $('.financials-calculation-block').hide();
        } else {
            listContainer.empty();
            $('.cart-summary-sidebar').show();
            $('.cart-utility-buttons').show();
            $('.financials-calculation-block').show();

            storedCartList.forEach(function(artwork, index) {
                const strictNumericPrice = parseFloat(artwork.price.replace(/[^0-9.-]+/g,"")) || 0;
                dynamicSubtotalSum += strictNumericPrice;

                const productRowMarkup = `
                    <div class="invoice-product-row" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="font-size: 28px; background: #f5f5f5; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">🎨</div>
                            <div>
                                <h4 style="margin: 0 0 5px 0; font-family: 'Cinzel', serif; font-size: 16px; font-weight: 500; color: #111;">${artwork.title}</h4>
                                <p style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 12px; color: #888;">Original Studio Canvas Work</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 25px;">
                            <span style="font-family: 'Montserrat', sans-serif; font-weight: 500; color: #111;">${artwork.price}</span>
                            <button class="remove-item-btn" data-index="${index}" style="background: none; border: none; color: #cc0000; cursor: pointer; font-size: 14px;">✕</button>
                        </div>
                    </div>
                `;
                listContainer.append(productRowMarkup);
            });

            // Adjust the spatial placement of calculations to drop directly under the items stack
            $('.cart-items-panel').append($('.cart-utility-buttons'));
            $('.cart-items-panel').append($('.financials-calculation-block'));

            $('#invoice-subtotal-value').text('$' + dynamicSubtotalSum.toFixed(2));
            $('#invoice-total-value').text('$' + dynamicSubtotalSum.toFixed(2));
        }

        $(document).on('click', '.remove-item-btn', function() {
            const indexToRemove = $(this).data('index');
            let currentItems = getCartData();
            currentItems.splice(indexToRemove, 1);
            setCartData(currentItems);
            window.location.reload();
        });

        $('#clear-cart-trigger').off('click').on('click', function() {
            setCartData([]);
            window.location.reload();
        });
    }

    // ==========================================================================
    // 5. SECURE SIDEBAR CHECKOUT FORM SUBMISSION
    // ==========================================================================
    $('#integrated-final-checkout-form').off('submit').on('submit', function(event) {
        event.preventDefault();

        const currentItems = getCartData();
        if (currentItems.length === 0) {
            alert('Your acquisition cart is empty.');
            return;
        }

        const finalOrderRecord = {
            fullName: $('#billing-name').val(),
            email: $('#billing-email').val(),
            phone: $('#billing-phone').val(),
            address: $('#billing-address').val(),
            city: $('#billing-city').val(),
            zipCode: $('#billing-zip').val(),
            notes: $('#billing-notes').val(),
            itemsBought: currentItems
        };

        localStorage.setItem('finalConfirmedInvoice', JSON.stringify(finalOrderRecord));
        alert('✨ Order Successfully Placed! Thank you for acquiring these original works.');
        
        setCartData([]);
        window.location.href = 'index.html';
    });
});