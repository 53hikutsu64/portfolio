gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);


const loadingTl = gsap.timeline();


loadingTl.to("#loading-bar-fill", {
	width: "calc(100% - 6px)",
	duration: 1.2,
	ease: "power2.inOut"
});

// バー点滅
loadingTl.to("#loading-bar-fill", {
	opacity: 0,
	duration: 0.07,
	repeat: 5,
	yoyo: true,
	ease: "steps(1)"
});


loadingTl.to("#loading-perc", {
	innerText: 100,
	duration: 1.2,
	snap: { innerText: 1 },
	ease: "power2.inOut",
	onUpdate: function () {
		document.getElementById("loading-perc").innerHTML = Math.round(this.targets()[0].innerText) + "%";
	}
}, 0); 


loadingTl.to(["#visual-frame", "#site-wrapper"], {

	clipPath: "inset(20px)",
	duration: 1.2,
	ease: "expo.out",
	onStart: () => {
		gsap.to("#loading-screen", { opacity: 0, visibility: "hidden", duration: 0.5 });
	},
	onComplete: () => {
		if (typeof runBentoShuffle === "function") runBentoShuffle();
		ScrollTrigger.refresh();
	}
});
// --- 1. ダークモードライトモード -------------------------------------------------------------------


const modeToggle = document.getElementById('mode-toggle');
const navModeToggle = document.getElementById('nav-mode-toggle');

const updateModeUI = () => {
    const isDark = document.body.classList.contains('dark-mode');
    const icon = document.getElementById('mode-icon');

    if (modeToggle) {
        modeToggle.textContent = isDark ? "LIGHT MODE" : "DARK MODE";
    }

    if (icon) {
        icon.src = isDark ? '../img/icon/637.png' : '../img/icon/635.png';
    }
};

const toggleMode = () => {
    const icon = document.getElementById('mode-icon');
    const isDarkNow = document.body.classList.contains('dark-mode');

    if (icon) {
        gsap.to(icon, {
            rotation: "+=360", // 押すたびにプラス360度
            duration: 0.5,
            ease: "power2.inOut",
            onStart: () => {
                setTimeout(() => {
                    icon.src = isDarkNow ? '../img/icon/635.png' : '../img/icon/637.png';
                }, 200);
            }
        });
    }

    document.body.classList.toggle('dark-mode');
    updateModeUI();

    gsap.fromTo("body", { opacity: 0.8 }, { opacity: 1, duration: 0.4 });
};

if (modeToggle) modeToggle.addEventListener('click', toggleMode);
if (navModeToggle) navModeToggle.addEventListener('click', toggleMode);


window.addEventListener('load', updateModeUI);


// --- 1.5 BENTO works-----------------------------------------------------------------------
const bentoWorks = [
    { type: 'video', src: 'img/works/vitavibe.webm', title: 'VITA VIBE' },
	{ type: 'img', src: 'img/works/icecream.webp', title: 'BANNER' },
    { type: 'img', src: 'img/works/world-weather.webp', title: 'WORLD WEATHER' , targetId: '#work-lp',isBanner: true},
	{ type: 'img', src: 'img/works/finland.webp', title: 'BANNER', targetId: '#work-lp',isBanner: true },
    { type: 'video', src: 'img/works/gacha.webm', title: '3 GACHA' },
	{ type: 'img', src: 'img/works/furniture.webp', title: 'BANNER', targetId: '#work-lp', isBanner: true},

];


let currentIndex = 0;
const tvContent = document.getElementById('tv-content');
const tvNoise = document.querySelector('.tv-noise');
const tvTitle = document.getElementById('tv-title');

const updateBentoTV = () => {
    const tvScreen = document.querySelector('.tv-screen'); // 揺らす対象
    const tvNoise = document.querySelector('.tv-noise');

    //切り替わりの瞬間にグリッチ（揺れ
    gsap.fromTo(tvScreen, 
        { x: 2, skewX: 0 }, // 開始
        { 
            x: 0, skewX: 0, // 終了
            duration: 0.05, 
            repeat: 5,
            yoyo: true, 
            ease: "rough",
            onStart: () => {
                tvNoise.classList.add('is-active'); // ノイズ開始
            }
        }
    );

    setTimeout(() => {
        const work = bentoWorks[currentIndex];
        tvContent.innerHTML = ''; 

        if (work.type === 'video') {
            tvContent.innerHTML = `<video src="${work.src}" autoplay muted loop playsinline></video>`;
        } else {
            
            const imgClass = work.isBanner ? 'banner-img' : 'standard-img';
            tvContent.innerHTML = `<img src="${work.src}" alt="${work.title}" class="${imgClass}">`;

            // 縦長バナーの場合だけアニメーション
            if (work.isBanner) {
    const img = tvContent.querySelector('img');

    const startScroll = () => {
        const containerH = tvContent.offsetHeight;
        const imgH = img.offsetHeight;
        const scrollDist = imgH - containerH;

        if (scrollDist > 0) {
            gsap.to(img, {
                y: -scrollDist, 
                duration: 8,    
                ease: "none",  
                repeat: -1,
                yoyo: true,
                repeatDelay: 1  
            });
        }
    };

    if (img.complete) {
        startScroll();
    } else {
        img.onload = startScroll;
    }
}
        }
        tvTitle.innerText = work.title;

        currentIndex = (currentIndex + 1) % bentoWorks.length;

        setTimeout(() => {
            tvNoise.classList.remove('is-active');
        }, 250); //ノイズ終わり時間
    }, 200);//画像切り替わりからノイズだけの時間
};

// 秒ごとの切り替え
setInterval(updateBentoTV, 4800);

updateBentoTV();



const bentoTv = document.getElementById('bento-tv');

if (bentoTv) {
    bentoTv.addEventListener('click', (e) => {
        e.preventDefault(); 

        const targetSection = document.querySelector('.works-staff-wrapper');

        if (targetSection) {
            gsap.to(window, {
                duration: 1, 
                scrollTo: {
                    y: targetSection, 
                    autoKill: false
                },
                ease: "power4.inOut"
            });
        }
    });
}

//--- 1.6 bento skill---------------------------------------------------------------------------


addEventListener('load', () => { 
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((skillItem, index) => {
        const bar = skillItem.querySelector('.bar');
        const valueDisplay = skillItem.querySelector('.value');
        const baseLevel = parseInt(bar.dataset.level); // 基準値（60, 65, 55）
        

        function createPulse() {
            // ランダムな変動幅（±5〜35）
            const variation = gsap.utils.random(5, 35);

            const targetPercent = gsap.utils.random(
                Math.max(0, baseLevel - variation), 
                Math.min(100, baseLevel + variation)
            );

            const duration = gsap.utils.random(0.5, 1.5);

            const eases = [
                "power1.inOut", 
                "power2.inOut", 
                "elastic.out(1, 0.5)",
                "back.inOut(1.2)"
            ];
            const randomEase = eases[Math.floor(Math.random() * eases.length)];

            // バーのアニメ
            gsap.to(bar, {
                width: targetPercent + "%",
                duration: duration,
                ease: randomEase,
                onComplete: createPulse // 完了したら次の脈打ち
            });

            // 数字
            gsap.to(bar, {
                duration: duration,
                ease: randomEase,
                onUpdate: function() {
                    const currentWidth = parseFloat(getComputedStyle(bar).width);
                    const parentWidth = parseFloat(getComputedStyle(bar.parentElement).width);
                    const currentPercent = (currentWidth / parentWidth) * 100;
                    valueDisplay.textContent = Math.round(currentPercent) + "%";
                }
            });
        }

        // 各スキルバーをランダムな遅延
        gsap.delayedCall(index * 0.3, createPulse);
    });
});

// --- 2　ホバーアニメーション -------------------------------------------------------------------
const items = document.querySelectorAll('[data-gsap="hover"]');

items.forEach(item => {
	item.addEventListener('mouseenter', () => {
		gsap.to(item, {
			scale: 1.02,
			backgroundColor: 'var(--text)',
			color: 'var(--bg)',
			duration: 0.3,
			ease: "power2.out"
		});
		
	
		const bars = item.querySelectorAll('.bar');
		bars.forEach(bar => {
			gsap.to(bar, {
				backgroundColor: 'var(--bg)',
				boxShadow: '0 0 8px var(--bg)',
				duration: 0.3,
				ease: "power2.out"
			});
		});
	});

	item.addEventListener('mouseleave', () => {
		gsap.to(item, {
			scale: 1,
			backgroundColor: 'var(--bg)',
			color: 'var(--text)',
			duration: 0.3,
			ease: "power2.in"
		});
		
	
		const bars = item.querySelectorAll('.bar');
		bars.forEach(bar => {
			gsap.to(bar, {
				backgroundColor: 'var(--text)',
				boxShadow: '0 0 8px var(--text)',
				duration: 0.3,
				ease: "power2.in"
			});
		});
	});
});

// ---横スクロールの


const staffTrack = document.querySelector('.staff-track');
const lastItem = document.getElementById('last-item');
const laneTexts = document.querySelectorAll('.lane-text');

const tl = gsap.timeline({
	scrollTrigger: {
		trigger: ".works-staff-wrapper",
		start: "top top",
		invalidateOnRefresh: true,//スマホのサイズ変化にも対応
	

		end: () => `+=${staffTrack.scrollWidth}`,
		pin: true,
		scrub: 1,
		invalidateOnRefresh: true,
	}
});

tl.to(staffTrack, {
	x: () => {
		const winWidth = window.innerWidth;
		const trackWidth = staffTrack.scrollWidth;

		const stopPos = lastItem.offsetLeft + (lastItem.offsetWidth / 2) - (winWidth / 2);

		return -stopPos;
	},
	ease: "none"
}, 0);

// パララックステキスト
laneTexts.forEach(text => {
	const speed = parseFloat(text.getAttribute('data-speed')) || 0.3;
	tl.to(text, {
		x: () => -(staffTrack.scrollWidth * speed),
		ease: "none"
	}, 0);
});


// --- 4　モーダル開閉アニメ----------------------------------------------------------------------------

const modalOverlay = document.getElementById('modal-overlay');
const modalWindow = document.querySelector('.modal-window');
const modalClose = document.getElementById('modal-close');
const workItems = document.querySelectorAll('.work-item');




workItems.forEach(item => {
    item.addEventListener('click', () => {
        // --- 1　データの取得 ---
        const descText = item.getAttribute('data-desc') || "説明文は準備中！";
        const techText = item.getAttribute('data-tech') || "技術は内緒だぜ";
        const caseUrl = item.getAttribute('data-case-url');
        const siteUrl = item.getAttribute('data-site-url');
        const projectTitle = item.getAttribute('data-title');

        const modalImgArea = document.getElementById('modal-image-area');	
        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-desc');
        const techEl = document.getElementById('modal-tech');
        
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        // --- 2　モーダルの中身を書き換え ---

        if (titleEl) {
            const h3Text = item.querySelector('h3') ? item.querySelector('h3').innerText : '';
            titleEl.innerText = projectTitle || (img ? img.alt : (h3Text || 'WORK DETAIL'));
        }

        // 画像 動画の表
        if (modalImgArea) {
            modalImgArea.innerHTML = '';
            if (video) {
                modalImgArea.innerHTML = `
                    <video src="${video.src}" autoplay muted loop playsinline 
                           style="width:100%; height:100%; object-fit:cover;"></video>`;
            } else if (img) {
                modalImgArea.innerHTML = `
                    <img src="${img.src}" alt="${img.alt}" 
                         style="width:100%; height:100%; object-fit:cover;">`;
            }
        }

        // 説明文の更新
        if (descEl) descEl.innerHTML = descText;
        if (techEl) techEl.innerText = techText;

        // ボタン表示
        const caseBtn = document.getElementById('modal-case-link');
        const siteBtn = document.getElementById('modal-site-link');

        if (caseBtn) {
            caseBtn.href = caseUrl || "#";
            caseBtn.style.display = caseUrl ? "inline-block" : "none";
        }
        if (siteBtn) {
            siteBtn.href = siteUrl || "#";
            siteBtn.style.display = siteUrl ? "inline-block" : "none";
        }

        // --- 3　モーダルを表示 ---
        if (modalOverlay && modalWindow) {
            modalOverlay.style.display = 'flex';
            gsap.fromTo(modalWindow,
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
            );
            gsap.fromTo(modalOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
    });
});

// --- 閉じる ---
const closeModal = () => {
	if (modalOverlay && modalWindow) {
		gsap.to(modalWindow, {
			scale: 0.8, opacity: 0, duration: 0.3,
			onComplete: () => { modalOverlay.style.display = 'none'; }
		});
	}
};

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
	if (e.target === modalOverlay) closeModal();
});


// --- 5　文字シャッフル ---

const decodeText = (el, finalValue) => {

	el.innerText = "";

	gsap.to(el, {
		duration: 0.8,
		text: {
			value: finalValue,
			padSpace: true
		},
		ease: "none",
		
	});
};

// --- 自己紹介のスクロールトリガー ---
ScrollTrigger.create({
	trigger: ".about-section",
	start: "top 80%",

	onEnter: () => {
		const nameEl = document.querySelector('.about-name');
		const bioEl = document.querySelector('.about-bio');
		if (nameEl) decodeText(nameEl, "SYUNSUKE KOTANI");
		if (bioEl) decodeText(bioEl, "東京(郊外)生まれ、東京(もっと郊外)育ち。<br>2025年8月より職業訓練校にてWebデザインやコーディングについて学ぶ。");
	},
	
	onEnterBack: () => {
		const nameEl = document.querySelector('.about-name');
		const bioEl = document.querySelector('.about-bio');
		if (nameEl) decodeText(nameEl, "SYUNSUKE KOTANI");
		if (bioEl) decodeText(bioEl, "東京(郊外)生まれ、東京(もっと郊外)育ち。<br>2025年8月より職業訓練校にてWebデザインやコーディングについて学ぶ。");
	},
	once: false 
});


setInterval(() => {
	const tickers = document.querySelectorAll('.ticker-track span');
	tickers.forEach(t => decodeText(t, "WELCOME TO PORTFOLIO!! "));
}, 4000);


// --- 6Bento Gridのシャッフル ---
const runBentoShuffle = () => {
	
	const labels = document.querySelectorAll('.bento-item .label');
	const titles = document.querySelectorAll('.bento-item h2, .bento-item h3');
	const texts = document.querySelectorAll('.bento-item p');

	
	labels.forEach(el => decodeText(el, el.innerText));
	titles.forEach(el => decodeText(el, el.innerText));
	texts.forEach(el => decodeText(el, el.innerText));
};


window.addEventListener('load', () => {
	runBentoShuffle();
});


// --- 7 ナビゲーション、スクロール ---


const floatingNav = document.querySelector('.floating-nav');
const navLinks = document.querySelectorAll('.nav-item');


ScrollTrigger.create({
	trigger: "#profile",
	start: "top 80%", 
	onEnter: () => {
		gsap.to(floatingNav, { opacity: 1, visibility: "visible", y: 0, duration: 0.5 });
	},
	onLeaveBack: () => {
		
		gsap.to(floatingNav, { opacity: 0, visibility: "hidden", y: 20, duration: 0.5 });
	}
});

// activeクラスの付け替え
const navSections = ['#top', '#profile', '#works', '#skills', '#contact'];
navSections.forEach(id => {
	ScrollTrigger.create({
		trigger: id,
		start: "top center",
		end: "bottom center",
		onToggle: self => {
			if (self.isActive) {
				navLinks.forEach(link => link.classList.remove('active'));
				const activeLink = document.querySelector(`.nav-item[href="${id}"]`);
				if (activeLink) activeLink.classList.add('active');
			}
		}
	});
});

//スムーズスクロール
navLinks.forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		const targetId = link.getAttribute('href');


		gsap.to(window, {
			duration: 0.8,
			scrollTo: {
				y: targetId,
				autoKill: false
			},
			ease: "power4.inOut",
			overwrite: true
		});
	});
});