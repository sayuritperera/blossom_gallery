$(document).ready(function() {

    // ==========================================================================
    // 1. FIX "WHY CHOOSE US" HOME PAGE SCRAMBLED LAYOUT
    // ==========================================================================
    if ($('.why-choose-us-section').length || $('#why-choose-us-text').length) {
        // Enforces clean container bounds so text doesn't overflow or break out of its container box
        $('.why-choose-us-container, .why-choose-us-section').css({
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
            'padding': '60px 20px',
            'text-align': 'center',
            'box-sizing': 'border-box'
        });
        
        // Target the specific text block causing the alignment issues
        $('h2:contains("Why Choose Us"), .why-choose-heading').css({
            'position': 'relative',
            'margin': '0 auto 20px auto',
            'transform': 'none',
            'top': '0',
            'left': '0',
            'display': 'block',
            'width': '100%'
        });
    }

    // ==========================================================================
    // 2. DYNAMIC GALLERY FILTERING (Fixed Mismatched Chip Classes)
    // ==========================================================================
    $('.filter-chip').on('click', function() {
        // Remove active highlights from all chips, then apply to the clicked one
        $('.filter-chip').removeClass('active');
        $(this).addClass('active');

        const chosenCategory = $(this).attr('data-filter');

        $('.gallery-item').each(function() {
            // If 'All Works' is clicked, or if the card item has the category class name, reveal it
            if (chosenCategory === 'all' || $(this).hasClass(chosenCategory)) {
                $(this).fadeIn(300);
            } else {
                $(this).fadeOut(200);
            }
        });
    });

    // ==========================================================================
    // 3. ROUTING FROM GALLERY CARDS TO DETAIL PAGES
    // ==========================================================================
   $(document).on('click', '.gallery-card', function(event) {
        // Prevent click triggers on layout buttons if present
        if ($(event.target).hasClass('info-redirect-btn')) return;

        // Uses .closest() so clicking the raw image element still correctly extracts data attributes
        const currentCard = $(this).closest('.gallery-card');
        const title = currentCard.attr('data-title') || currentCard.find('.art-meta h3').text().trim();
        const price = currentCard.attr('data-price') || currentCard.find('.art-price').text().trim();
        
        window.location.href = `painting-info.html?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}`;
    });
    // ==========================================================================
    // 4. PAINTING-INFO SCREEN CONFIGURATION (Fixing Image Proportions & Toggles)
    // ==========================================================================
    if (window.location.pathname.includes('painting-info.html')) {
        
       
        $('.angle-view-btn, .on-wall-btn, #view-modes-wrapper, .view-toggle-container').remove();

        const urlParams = new URLSearchParams(window.location.search);
        const titleParam = urlParams.get('title');
        const priceParam = urlParams.get('price');

        const artworkDatabase = {
            "Serenade in Blue": { 
                frontImg: "paradisefound1.JPG", 
                medium: "Heavy-body Studio Oil on Premium Stretched Linen", 
                dimensions: "24\" × 36\" (Gallery Wrap)", 
                year: "March 2026" 
            },
            "Paradise Found": { 
                frontImg: "extra1.jpg", 
                medium: "Premium Oil Canvas with Custom Dammar Varnish Overlay", 
                dimensions: "30\" × 40\" (Grand Statement Canvas)", 
                year: "February 2026" 
            },
            "Wild Petal Sketch": { 
                frontImg: "wps1.jpg", 
                medium: "Raw Charcoal Base with Layered Oil Underglazes", 
                dimensions: "16\" × 20\" (Unframed Raw Canvas Edge)", 
                year: "January 2026" 
            },
            "Lilies Canvas": { 
                frontImg: "lilies canvas 1.jpg", 
                medium: "Fine Acrylic & Oil Glaze Blend on Traditional Canvas", 
                dimensions: "20\" × 20\" (Classic Profile)", 
                year: "April 2026" 
            },
            "Chrysanthemum": { 
                frontImg: "mini1.JPG", 
                medium: "Mixed Media & Oil Impasto on Stretched Canvas Mini", 
                dimensions: "12\" × 12\" (Studio Scale)", 
                year: "May 2026" 
            },
            "Golden Horizon": { 
                frontImg: "extra3.jpg", 
                medium: "Gold Leaf Overlay & Knife Oil Palette on Linen", 
                dimensions: "18\" × 24\" (Gallery Profile)", 
                year: "April 2026" 
            }
        };

        if (titleParam) {
            const decodedTitle = decodeURIComponent(titleParam);
            const decodedPrice = priceParam ? decodeURIComponent(priceParam) : "";
            
            $('#canvas-title').text(decodedTitle);
            if (decodedPrice) $('#canvas-price').text(decodedPrice);

            // FIX PHOTO SIZES: Prevent distortion on Serenade, Paradise, and Wild Petal Sketch
            $('.painting-main-display-img').css({
                'width': '100%',
                'max-width': '550px',
                'height': 'auto',
                'object-fit': 'contain',
                'display': 'block',
                'margin': '0 auto',
                'border-radius': '2px'
            });

            const specificArtData = artworkDatabase[decodedTitle];
            if (specificArtData) {
                $('.painting-main-display-img').attr('src', specificArtData.frontImg);
                $('#art-spec-medium').text(specificArtData.medium);
                $('#art-spec-dimensions').text(specificArtData.dimensions);
                $('#art-spec-year').text(specificArtData.year);
            }

            // Change button functionality to act as the direct information bridge
            $('#info-inquiry-redirect-btn, #add-to-cart-detail-btn')
                .text('Click to get more information')
                .attr('id', 'info-inquiry-redirect-btn') 
                .off('click')
                .on('click', function() {
                    
                    // Package the artwork context to take with us to the contact page
                    const inquiryPackage = {
                        title: decodedTitle,
                        image: specificArtData ? specificArtData.frontImg : 'sib1.jpg'
                    };
                    localStorage.setItem('currentInquiryItem', JSON.stringify(inquiryPackage));
                    
                    // Route directly over to the new direct contact interface
                    window.location.href = 'cart.html';
                });
        }
    }

    // ==========================================================================
    // 5. CONTACT SCREEN DIRECT PORTFOLIO ENGINE (Replacing old Cart functions)
    // ==========================================================================
    if (window.location.pathname.includes('cart.html')) {
        const structuralData = localStorage.getItem('currentInquiryItem');
        const displayZone = $('#inquiry-artwork-showcase-zone');

        if (structuralData) {
            const parsedInquiry = JSON.parse(structuralData);

            // Dynamically inject the focused canvas artwork and premium personal message
            displayZone.html(`
                <div style="max-width: 1100px; margin: 40px auto; padding: 0 20px; font-family: 'Montserrat', sans-serif;">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
                        
                        <div style="text-align: center; background: #fafafa; padding: 30px; border: 1px solid #f0f0f0;">
                            <img src="${parsedInquiry.image}" alt="${parsedInquiry.title}" style="max-width: 100%; max-height: 500px; height: auto; width: auto; object-fit: contain; box-shadow: 0 15px 35px rgba(0,0,0,0.08);">
                            <h3 style="font-family: 'Cinzel', serif; margin-top: 20px; font-size: 22px; letter-spacing: 1px; color: #111;">${parsedInquiry.title}</h3>
                            <p style="color: #bfa37a; font-size: 12px; uppercase; letter-spacing: 2px; margin-top: 5px;">Inquiry Selection</p>
                        </div>

                        <div>
                            <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #bfa37a; font-weight: 600;">Acquisition & Inquiry</span>
                            <h2 style="font-family: 'Cinzel', serif; font-size: 36px; font-weight: 400; margin: 15px 0 25px 0; color: #111; line-height: 1.3;">Thank you for exploring my collection.</h2>
                            
                            <p style="font-size: 15px; line-height: 1.8; color: #555; margin-bottom: 35px; font-family: 'Montserrat', sans-serif;">
                                Thank you for coming to my website to look into purchasing these works. If you would like to gather more details, establish private collection acquisitions, or request full structural insights regarding <strong>${parsedInquiry.title}</strong>, please connect with me directly through any of my personal channels below.
                            </p>

                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-left: 3px solid #bfa37a; background: #fdfdfd;">
                                    <span style="font-size: 18px;">✉️</span>
                                    <div>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Direct Studio Email</p>
                                        <a href="mailto:studio@blossomgallery.com" style="margin: 0; font-size: 15px; font-weight: 500; color: #111; text-decoration: none;">studio@blossomgallery.com</a>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-left: 3px solid #111; background: #fdfdfd;">
                                    <span style="font-size: 18px;">📸</span>
                                    <div>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Instagram Portfolio</p>
                                        <a href="https://instagram.com" target="_blank" style="margin: 0; font-size: 15px; font-weight: 500; color: #111; text-decoration: none;">@Blossom.Gallery</a>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-left: 3px solid #111; background: #fdfdfd;">
                                    <span style="font-size: 18px;">📱</span>
                                    <div>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Direct Line / WhatsApp</p>
                                        <a href="tel:+1234567890" style="margin: 0; font-size: 15px; font-weight: 500; color: #111; text-decoration: none;">011-222-675</a>
                                    </div>
                                </div>
                            </div>

                            <a href="gallery.html" style="display: inline-block; margin-top: 40px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #111; font-weight: 600; border-bottom: 2px solid #bfa37a; padding-bottom: 4px; transition: color 0.3s;">
                                ← Return to Full Gallery
                            </a>
                        </div>

                    </div>
                </div>
            `);
        } else {
            // General structural fallback message if someone navigates directly to cart.html without clicking a painting
            displayZone.html(`
                <div style="max-width: 600px; margin: 80px auto; text-align: center; font-family: 'Montserrat', sans-serif; padding: 0 20px;">
                    <h2 style="font-family: 'Cinzel', serif; font-size: 28px; margin-bottom: 20px;">Connect with the Studio</h2>
                    <p style="color: #666; line-height: 1.7; margin-bottom: 30px;">Thank you for visiting my website. To inquire about acquiring custom paintings or purchasing pieces from my collections, please reach out directly via email at <a href="mailto:studio@blossomgallery.com" style="color:#bfa37a; text-decoration:none; font-weight:500;">studio@blossomgallery.com</a> or view my social media profiles.</p>
                    <a href="gallery.html" style="display: inline-block; padding: 12px 30px; background: #111; color: #fff; text-decoration: none; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">View Artwork Collection</a>
                </div>
            `);
        }
    }
});