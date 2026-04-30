const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 0);
});

/* 2. MOBILE MENU TOGGLE */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        // Toggle the 'bx-x' class to change the icon if desired
        menuIcon.classList.toggle('bx-x');
        // Toggle the 'active' class on navbar to show/hide the dropdown
        navbar.classList.toggle('active');
    };

    // Hide menu when clicking a link
    navbar.querySelectorAll('a').forEach(link => {
        link.onclick = () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        };
    });
}

/* 3. DARK MODE TOGGLE */
const darkmode = document.querySelector('#darkmode');
if (darkmode) {
    // Check for saved dark mode preference on page load to prevent reverting during navigation
    if (localStorage.getItem('darkMode') === 'enabled') {
        darkmode.classList.replace('bx-moon', 'bx-sun');
        document.body.classList.add('active');
    }

    darkmode.onclick = () => {
        if(darkmode.classList.contains('bx-moon')){
            darkmode.classList.replace('bx-moon', 'bx-sun');
            document.body.classList.add('active');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkmode.classList.replace('bx-sun', 'bx-moon');
            document.body.classList.remove('active');
            localStorage.setItem('darkMode', 'disabled');
        }
    };
}

/* 4. TYPING EFFECT */
const typingText = document.querySelector(".typing");
if (typingText) {
    const roles = ["Software Developer", "Web Developer", "Problem Solver"];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        typingText.textContent = isDeleting 
            ? currentRole.substring(0, charIndex - 1) 
            : currentRole.substring(0, charIndex + 1);
        
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    document.addEventListener("DOMContentLoaded", typeEffect);
}

/* 5. SMOOTH SCROLL FOR BUTTONS & NAV LINKS */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

/* 6. CONTACT FORM (AJAX SUBMISSION WITH VALIDATION) */
const contactForm = document.querySelector('.contact-form form');
const statusMessage = document.getElementById('form-status');
const submitBtn = contactForm?.querySelector('button[type="submit"]');
const nameInput = contactForm?.querySelector('input[name="name"]');
const emailInput = contactForm?.querySelector('input[name="email"]');
const messageInput = contactForm?.querySelector('textarea[name="message"]');

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show status message with styling
function showStatus(message, type = 'info') {
    if (!statusMessage) return;
    statusMessage.style.display = 'block';
    statusMessage.className = `status-${type}`;
    statusMessage.innerText = message;
    statusMessage.setAttribute('role', 'alert');
    statusMessage.setAttribute('aria-live', 'polite');
    window.scrollTo({ top: statusMessage.offsetTop - 100, behavior: 'smooth' });
}

// Form validation
function validateForm() {
    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    if (!name) {
        showStatus('⚠️ Please enter your name.', 'warning');
        nameInput?.focus();
        return false;
    }
    if (!email) {
        showStatus('⚠️ Please enter your email address.', 'warning');
        emailInput?.focus();
        return false;
    }
    if (!isValidEmail(email)) {
        showStatus('⚠️ Please enter a valid email address.', 'warning');
        emailInput?.focus();
        return false;
    }
    if (!message) {
        showStatus('⚠️ Please write a message.', 'warning');
        messageInput?.focus();
        return false;
    }
    return true;
}

// Clear status on input focus (improve UX)
if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('focus', () => {
            if (statusMessage?.classList.contains('status-warning')) {
                statusMessage.style.display = 'none';
            }
        });
    });
}

// Form submission handler
if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Validate before submission
        if (!validateForm()) return;

        // Disable submit button and show sending state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            submitBtn.textContent = 'Sending...';
        }

        const data = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showStatus(' Message sent successfully! Thato will get back to you soon.', 'success');
                contactForm.reset();
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.setAttribute('aria-busy', 'false');
                        submitBtn.textContent = 'Send Message';
                    }
                }, 5000);
            } else {
                showStatus(' Error: Could not send message. Please try again.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.setAttribute('aria-busy', 'false');
                    submitBtn.textContent = 'Send Message';
                }
            }
        } catch (error) {
            showStatus(' Error: Connection error. Please check your internet and try again.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.setAttribute('aria-busy', 'false');
                submitBtn.textContent = 'Send Message';
            }
        }
    });
}

/* ===========================
   CHATBOT FOR PORTFOLIO Q&A
   =========================== */
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotPanel = document.querySelector('.chatbot-panel');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.querySelector('#chatbot-messages');
const chatbotInput = document.querySelector('#chatbot-input');
const chatbotSend = document.querySelector('#chatbot-send');

if (chatbotToggle && chatbotPanel && chatbotClose && chatbotInput && chatbotSend) {
    chatbotToggle.addEventListener('click', () => {
        chatbotPanel.classList.toggle('active');
        chatbotInput.focus();
    });

    chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.remove('active');
    });

    function addChatMessage(text, sender = 'bot') {
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message ${sender}`;
        messageEl.textContent = text;
        chatbotMessages.appendChild(messageEl);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }


    function getBotAnswer(question) {
        const q = question.trim().toLowerCase();

        const faq = [
            {
                keywords: ['skill', 'skills', 'technologies'],
                answer: 'I am skilled in Java, HTML, CSS, JavaScript, Python, PHP, XAMPP, MySQL, and basic networking. I also follow OOP best practices and build responsive web apps.'
            },
            {
                keywords: ['project', 'projects', 'portfolio'],
                answer: 'My key projects include ResConnect (student accommodation review), Employee Salary Program, Student Health Website, Property Management System, and Online Takealot Management System. You can see links in the Portfolio section.'
            },
            {
                keywords: ['certificate', 'certificates', 'credly'],
                answer: 'I have CCNA, Computer Hardware Basics, IT Customer Support Basics, and IT Essentials certificates. Each one has a verification link in the Certificates section.'
            },
            {
                keywords: ['education', 'college', 'university','level of education'],
                answer: 'I hold a Diploma in Information Technology from Vaal University of Technology (2023-2025). My expected graduation date is April 2026.'
            },
            {
                keywords: ['contact', 'email', 'hire', 'job', 'internship','available'],
                answer: 'You can contact me via email at thatomokhuamathe@gmail.com or phone at 078 279 0626. My contact form is also on the Contact page.'
            },
            {
                keywords: ['about', 'background', 'experience'],
                answer: 'I am an Information Technology graduate with a passion for software and web development. I have experience in Java, HTML, CSS, and JavaScript, and I enjoy solving problems and building user-friendly applications.'
            },
            {
                keywords: ["high school", "matric", "Grade 12"],
                answer: 'I completed my Matric (Grade 12) at Are-fadimeheng High School in 2022, achieving a National Senior Certificate with a Bachelor’s pass.'
            }
        ];

        for (const item of faq) {
            if (item.keywords.some(keyword => q.includes(keyword))) {
                return item.answer;
            }
        }

        return 'Thanks for your question! I recommend checking the relevant section on the site (About, Skills, Portfolio, Certificates, Contact). If you need something specific, please try another query.';
    }

    function handleChatbotInput() {
        const userText = chatbotInput.value.trim();
        if (!userText) return;

        addChatMessage(userText, 'user');
        chatbotInput.value = '';

        const answer = getBotAnswer(userText);
        setTimeout(() => addChatMessage(answer, 'bot'), 600);
    }

    chatbotSend.addEventListener('click', handleChatbotInput);

    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleChatbotInput();
        }
    });
}

/* ===========================
   SCROLL REVEAL OBSERVER
   =========================== */
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target); // Only reveal once
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15
});

document.querySelectorAll('.about-card, .portfolio-card, .edu-card, .skills-container span').forEach(el => {
    revealObserver.observe(el);
});

/* AUTO-ACTIVE NAV LINKS */
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navbar a").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
    }
});
