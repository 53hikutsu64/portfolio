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