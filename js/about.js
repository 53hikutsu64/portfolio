gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

window.addEventListener('load', () => {
    // 1. ページ読み込み演出
    gsap.to(["#visual-frame", "#site-wrapper"], {
        clipPath: "inset(20px)",
        duration: 1.2,
        ease: "expo.out"
    });

    // 2. タイピングアニメーション
    const title = document.querySelector('.typewriter-title');
    if (title) {
        const text = title.innerText;
        title.innerText = "";
        gsap.to(title, { duration: 1.5, text: text, ease: "none", delay: 0.5 });
    }

    // 3. ダークモード
    const navModeToggle = document.getElementById('nav-mode-toggle');
    const modeIcon = document.getElementById('mode-icon');
    if (navModeToggle && modeIcon) {
        navModeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            gsap.to(modeIcon, {
                rotation: "+=360",
                duration: 0.6,
                ease: "back.inOut(1.7)",
                onStart: () => {
                    setTimeout(() => {
                        modeIcon.src = isDark ? '../img/icon/635.png' : '../img/icon/637.png';
                    }, 300);
                }
            });
            document.body.classList.toggle('dark-mode');
        });
    }

    // 4. ヒストリーライン伸長
    gsap.to(".timeline-line", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true
        }
    });

    // 5. タイムライン項目＆趣味カード
    gsap.utils.toArray('.timeline-item, .hobby-card').forEach(item => {
        gsap.to(item, {
            opacity: 1, x: 0, y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 6. 趣味モーダル制御
    const modal = document.getElementById('hobby-modal');
    const closeBtn = document.getElementById('modal-close');
    document.querySelectorAll('.hobby-card').forEach(card => {
        card.addEventListener('click', () => {
            const h4 = card.querySelector('h4').innerText;
            const p = card.querySelector('p').innerText;
            const src = card.querySelector('img').src;

            document.getElementById('modal-title').innerText = h4;
            document.getElementById('modal-desc').innerText = p;
            document.getElementById('modal-image-area').innerHTML = `<img src="${src}" style="width:100%">`;

            modal.style.display = "flex";
            gsap.fromTo(".modal-window", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" });
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => {
        gsap.to(".modal-window", { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => { modal.style.display = "none"; } });
    });
});


//------------------------------ホビーカード------------------------------------------
let allCards = [];
let currentCardIndex = 0;
let currentImgIndex = 0;
let currentImages = [];
let currentTitles = [];
let currentDescs = [];

window.addEventListener('load', () => {
    const modal = document.getElementById('hobby-modal');
    allCards = Array.from(document.querySelectorAll('.hobby-card'));

    const loadCardData = (index) => {
        currentCardIndex = index;
        const card = allCards[currentCardIndex];
        currentImages = card.dataset.images.split(',');
        currentTitles = card.dataset.titles.split(',');
        currentDescs = card.dataset.descs.split(',');
        
        document.getElementById('modal-title').innerText = card.querySelector('h4').innerText;
    };

    const openCardModal = (cardIdx, imgIdx = 0) => {
        loadCardData(cardIdx);
        currentImgIndex = imgIdx;
        updateModalContent();
        
        modal.style.display = "flex";
        gsap.fromTo(".modal-window", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" });
    };

    allCards.forEach((card, index) => {
        card.addEventListener('click', () => openCardModal(index, 0));
    });

    document.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex++;

        if (currentImgIndex >= currentImages.length) {
            // 次のカード
            currentCardIndex = (currentCardIndex + 1) % allCards.length;
            loadCardData(currentCardIndex);
            currentImgIndex = 0; 
        }
        updateModalContent();
    });

    document.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex--;

        if (currentImgIndex < 0) {
            // 前のカード
            currentCardIndex = (currentCardIndex - 1 + allCards.length) % allCards.length;
            loadCardData(currentCardIndex);
            currentImgIndex = currentImages.length - 1; 
        }
        updateModalContent();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

function updateModalContent() {
    const imgArea = document.getElementById('modal-image-area');
    const titleArea = document.getElementById('modal-sub-title');
    const descArea = document.getElementById('modal-desc');

    gsap.to([imgArea, titleArea, descArea], {
        opacity: 0, duration: 0.2, onComplete: () => {
            imgArea.innerHTML = `<img src="${currentImages[currentImgIndex]}" style="width:100%; height:auto; border-radius:8px;">`;
            titleArea.innerText = currentTitles[currentImgIndex];
            descArea.innerHTML = currentDescs[currentImgIndex];

            gsap.to([imgArea, titleArea, descArea], { opacity: 1, duration: 0.3 });
            
            updateThumbnails();
        }
    });
}

function updateThumbnails() {
    const dotsContainer = document.getElementById('modal-dots');
    dotsContainer.innerHTML = currentImages.map((img, i) => 
        `<div class="thumb ${i === currentImgIndex ? 'active' : ''}" onclick="jumpToImage(${i})">
            <img src="${img}" alt="thumb">
        </div>`
    ).join('');
}

jumpToImage = (index) => {
    currentImgIndex = index;
    updateModalContent();
};

function closeModal() {
    const modal = document.getElementById('hobby-modal');
    gsap.to(".modal-window", { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => { modal.style.display = "none"; } });
}





//----------------------------------------------------------------------------------------------

	const thanks = document.querySelector('.thanks-text');
    if (thanks) {
        const fullContent = thanks.innerText;
        thanks.innerText = "";

        gsap.to(thanks, {
            duration: 2.5,
            text: fullContent,
            ease: "none",
            scrollTrigger: {
                trigger: ".thanks-section",
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
    }