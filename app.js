// Job Portal Application JavaScript with Enhanced Authentication and Testimonials

// Application Data
// App State for AI Interviewer
let interviewInProgress = false;
let currentQuestion = "";
let generativeModel; // This will hold the initialized Gemini model

// Browser APIs for Speech Recognition and Synthesis
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
const synthesis = window.speechSynthesis;

const jobsData = [
    {
        "id": 1,
        "title": "Software Developer Trainee",
        "company": "TechStart Solutions",
        "location": "Bangalore, India",
        "type": "Full-time",
        "experience": "0-1 years",
        "salary": "₹3,50,000 - ₹5,00,000",
        "posted_date": "2025-04-12",
        "description": "We are looking for fresh graduates to join our software development team. You will work on web applications using modern technologies.",
        "requirements": ["Bachelor's in Computer Science/IT", "Basic knowledge of programming languages", "Good problem-solving skills", "Eager to learn"],
        "skills": ["JavaScript", "HTML", "CSS", "Python", "Problem Solving"],
        "benefits": ["Health Insurance", "Learning Budget", "Flexible Hours", "Mentorship"],
        "category": "Technology",
        "remote": false,
        "company_size": "51-200"
    },
    {
        "id": 2,
        "title": "Marketing Associate",
        "company": "Digital Marketers Inc",
        "location": "Mumbai, India", 
        "type": "Full-time",
        "experience": "0-2 years",
        "salary": "₹3,00,000 - ₹4,50,000",
        "posted_date": "2025-11-11",
        "description": "Join our marketing team to help create and execute marketing campaigns. Perfect opportunity for fresh graduates to learn digital marketing.",
        "requirements": ["Bachelor's in Marketing/Business", "Basic understanding of digital marketing", "Creative thinking", "Communication skills"],
        "skills": ["Digital Marketing", "Social Media", "Content Writing", "Analytics", "Communication"],
        "benefits": ["Performance Bonus", "Training Programs", "Health Benefits", "Career Growth"],
        "category": "Marketing",
        "remote": true,
        "company_size": "201-500"
    },
    {
        "id": 3,
        "title": "Data Analyst Trainee",
        "company": "DataInsights Corp",
        "location": "Hyderabad, India",
        "type": "Full-time",
        "experience": "0-1 years", 
        "salary": "₹4,00,000 - ₹6,00,000",
        "posted_date": "2025-12-10",
        "description": "Entry-level position for recent graduates interested in data analysis. You'll work with large datasets and create meaningful insights.",
        "requirements": ["Bachelor's in Statistics/Math/CS", "Basic SQL knowledge", "Excel proficiency", "Analytical mindset"],
        "skills": ["SQL", "Excel", "Python", "Data Analysis", "Statistics"],
        "benefits": ["Health Insurance", "Skill Development", "Work from Home", "Performance Bonus"],
        "category": "Data Science",
        "remote": true,
        "company_size": "101-500"
    },
    {
        "id": 4,
        "title": "UI/UX Designer Intern",
        "company": "Creative Design Studio",
        "location": "Delhi, India",
        "type": "Internship", 
        "experience": "0 years",
        "salary": "₹15,000 - ₹25,000 /month",
        "posted_date": "2025-08-09",
        "description": "6-month internship program for fresh graduates passionate about design. Learn industry-standard design processes and tools.",
        "requirements": ["Bachelor's in Design/Fine Arts", "Portfolio of design work", "Creativity", "Design thinking"],
        "skills": ["Figma", "Adobe Creative Suite", "UI Design", "UX Research", "Prototyping"],
        "benefits": ["Mentorship", "Certificate", "Full-time Opportunity", "Learning Resources"],
        "category": "Design",
        "remote": false,
        "company_size": "11-50"
    },
    {
        "id": 5,
        "title": "Junior Business Analyst",
        "company": "Consulting Partners",
        "location": "Chennai, India",
        "type": "Full-time",
        "experience": "0-1 years",
        "salary": "₹4,50,000 - ₹6,50,000", 
        "posted_date": "2025-09-08",
        "description": "Entry-level business analyst position. Work with clients to understand business requirements and provide analytical solutions.",
        "requirements": ["Bachelor's in Business/Economics", "Analytical skills", "Communication skills", "Problem-solving ability"],
        "skills": ["Business Analysis", "Excel", "PowerPoint", "Communication", "Critical Thinking"],
        "benefits": ["Client Exposure", "Training", "Health Benefits", "Growth Opportunities"],
        "category": "Business",
        "remote": false,
        "company_size": "201-1000"
    },
    {
        "id": 6,
        "title": "Content Writer",
        "company": "ContentCraft Media",
        "location": "Pune, India",
        "type": "Full-time",
        "experience": "0-2 years",
        "salary": "₹2,50,000 - ₹4,00,000",
        "posted_date": "2025-08-07",
        "description": "Create engaging content for various digital platforms. Great opportunity for fresh graduates with strong writing skills.",
        "requirements": ["Bachelor's in English/Journalism/Mass Comm", "Excellent writing skills", "Creativity", "Research skills"],
        "skills": ["Content Writing", "SEO", "Research", "Creativity", "Communication"],
        "benefits": ["Flexible Hours", "Creative Freedom", "Skill Development", "Health Insurance"],
        "category": "Content",
        "remote": true,
        "company_size": "11-50"
    },
    {
        "id": 7,
        "title": "Customer Success Associate", 
        "company": "ServiceFirst Solutions",
        "location": "Gurgaon, India",
        "type": "Full-time",
        "experience": "0-1 years",
        "salary": "₹3,00,000 - ₹4,50,000",
        "posted_date": "2025-08-06",
        "description": "Help customers achieve success with our products. Perfect for graduates who love helping people and problem-solving.",
        "requirements": ["Bachelor's degree any field", "Customer service mindset", "Communication skills", "Patience"],
        "skills": ["Customer Service", "Communication", "Problem Solving", "CRM Tools", "Empathy"],
        "benefits": ["Training Program", "Career Growth", "Health Benefits", "Team Events"],
        "category": "Customer Service",
        "remote": true,
        "company_size": "101-500"
    },
    {
        "id": 8,
        "title": "Frontend Developer",
        "company": "WebTech Innovations",
        "location": "Bangalore, India",
        "type": "Full-time",
        "experience": "0-2 years",
        "salary": "₹4,00,000 - ₹7,00,000",
        "posted_date": "2025-01-05",
        "description": "Build beautiful and responsive user interfaces. Join our team of developers creating cutting-edge web applications.",
        "requirements": ["Bachelor's in CS/IT", "HTML, CSS, JavaScript knowledge", "React/Angular basics", "Portfolio of projects"],
        "skills": ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
        "benefits": ["Latest Tech Stack", "Learning Budget", "Flexible Hours", "Health Insurance"],
        "category": "Technology",
        "remote": true,
        "company_size": "51-200"
    }
    
];

// Testimonials Data
const testimonialsData = [
    {
        "id": 1,
        "name": "Anisha Sharma",
        "position": "Software Developer",
        "company": "TechStart Solutions",
        "location": "Bangalore, India",
        "rating": 5,
        "review": "FreshStart Jobs completely transformed my job search! The AI-powered resume parser extracted all my skills perfectly and matched me with companies I never would have found otherwise. Got my first job in just 3 weeks!",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1754913092/pplx_project_search_images/892c95666e4bbfedc46cc0d4c527666d082e3685.png",
        "date": "2025-07-30",
        "category": "Technology",
        "verified": true,
        "job_found_days": 21,
        "salary_increase": "40%"
    },
    {
        "id": 2,
        "name": "Rahul Patel", 
        "position": "Digital Marketing Associate",
        "company": "Growth Marketing Inc",
        "location": "Mumbai, India",
        "rating": 5,
        "review": "As a fresh graduate, I was overwhelmed by job searching. FreshStart's AI recommendations were spot-on! The skill gap analysis showed me exactly what to learn, and I landed my dream marketing role.",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1755136693/pplx_project_search_images/748d6f64d11dfd064932ac9ea4aa22aa66ba68cb.png",
        "date": "2025-07-17",
        "category": "Marketing",
        "verified": true,
        "job_found_days": 18,
        "salary_increase": "35%"
    },
    {
        "id": 3,
        "name": "Priya Reddy",
        "position": "Data Analyst", 
        "company": "Analytics Pro Ltd",
        "location": "Hyderabad, India",
        "rating": 5,
        "review": "The personalized job matching was incredible! FreshStart's AI understood my statistics background and connected me with data science opportunities that were perfect for my skill set. Highly recommended!",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1754824468/pplx_project_search_images/39c87ff8703d5dee0ab7d23bad561c42f0d20847.png",
        "date": "2025-08-02",
        "category": "Data Science",
        "verified": true,
        "job_found_days": 16,
        "salary_increase": "50%"
    },
    {
        "id": 4,
        "name": "Karan Singh",
        "position": "UI/UX Designer",
        "company": "Creative Design Studio", 
        "location": "Delhi, India",
        "rating": 5,
        "review": "The AI job summaries helped me understand exactly what employers wanted. I could tailor my portfolio accordingly and received multiple interview calls. The platform truly understands design roles!",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1755136693/pplx_project_search_images/e09ef5d2518360ccfc2b83f2407cb87f87290676.png",
        "date": "2025-07-10",
        "category": "Design",
        "verified": true,
        "job_found_days": 25,
        "salary_increase": "45%"
    },
    {
        "id": 5,
        "name": "Sneha Kumar",
        "position": "Business Analyst",
        "company": "Consulting Excellence",
        "location": "Chennai, India",
        "rating": 4,
        "review": "FreshStart Jobs made my transition from college to corporate seamless. The AI-powered insights into company culture and role expectations were invaluable. Found my ideal consulting position quickly!",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1755136693/pplx_project_search_images/3fa270aae8a8024ba42f7f98ea92c08c7ceb3d66.png",
        "date": "2025-08-06",
        "category": "Business",
        "verified": true,
        "job_found_days": 14,
        "salary_increase": "30%"
    },
    {
        "id": 6,
        "name": "Arjun Gupta",
        "position": "Content Writer",
        "company": "Digital Content Hub",
        "location": "Pune, India",
        "rating": 5,
        "review": "The platform's ability to match my writing samples with relevant opportunities was amazing. The AI understood my creative style and suggested positions that were perfect fits. Couldn't be happier!",
        "avatar": "https://pplx-res.cloudinary.com/image/upload/v1754806600/pplx_project_search_images/ae2efb08e0074d3cce6389f264aacc207d2562ee.png",
        "date": "2025-07-03",
        "category": "Content",
        "verified": true,
        "job_found_days": 19,
        "salary_increase": "38%"
    }
];

// Platform Statistics
const platformStats = {
    "total_users": 45780,
    "successful_placements": 15420,
    "average_rating": 4.9,
    "five_star_reviews": 92,
    "average_time_to_hire": 17,
    "companies_partnered": 850,
    "total_reviews": 2340,
    "satisfaction_rate": 96
};

// Application State
let currentUser = null;
let filteredJobs = [...jobsData];
let appliedJobs = [];
let registeredUsers = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});
/* -----------------------------------------
   AI Blog / Insights Section
   ----------------------------------------- */

let aiBlogs = [];
let aiBlogsLoading = false;

// Setup AI Blog controls & auto refresh
function setupAIBlogFeatures() {
  const refreshBtn = document.getElementById('refreshAIBlogs');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await generateAIBlogs(true);
    });
  }
  // Auto-load blogs when section is first opened
}

// Generate or fetch AI insights automatically
async function generateAIBlogs(forceRefresh = false) {
  if (aiBlogsLoading) return;
  aiBlogsLoading = true;

  const countEl = document.getElementById('aiBlogCount');
  if (countEl) countEl.textContent = "Fetching latest AI insights...";

  try {
    // Option 1: Fetch from live AI news APIs (replace with actual endpoint later)
    // For now we simulate AI-generated insights dynamically:
    const sampleTopics = [
      "AI in Healthcare",
      "Generative AI Tools",
      "AI & Cybersecurity",
      "Ethical AI Governance",
      "AI in Education",
      "LLMs for Business Automation",
      "AI Hardware Breakthroughs",
      "Autonomous Agents",
      "AI and Climate Modeling",
      "Neural Architecture Search"
    ];

    aiBlogs = Array.from({ length: 6 }).map((_, i) => ({
      id: i + 1,
      title: sampleTopics[Math.floor(Math.random() * sampleTopics.length)],
      summary: generateAIInsightSummary(),
      author: "AI Research Team",
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      tags: ["AI", "Machine Learning", "Innovation"].slice(0, Math.floor(Math.random() * 3) + 1),
    }));

    displayAIBlogs(aiBlogs);

  } catch (err) {
    console.error(err);
    createToast("Failed to load AI insights", "error");
  } finally {
    aiBlogsLoading = false;
  }
}

// Generates a random insight summary (AI-style)
function generateAIInsightSummary() {
  const insights = [
    "A new transformer-based architecture reduces compute cost by 40% while improving reasoning accuracy.",
    "Researchers explore multimodal AI that merges text, image, and speech understanding seamlessly.",
    "Enterprise adoption of generative AI tools accelerates productivity in content and analytics sectors.",
    "Open-source LLM frameworks are reshaping innovation by enabling fine-tuning at lower costs.",
    "Advancements in AI safety focus on interpretability, alignment, and human-in-the-loop design.",
    "New AI chips deliver breakthroughs in inference speed and energy efficiency.",
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

// Display AI blog cards
function displayAIBlogs(list) {
  const grid = document.getElementById('aiBlogGrid');
  const countEl = document.getElementById('aiBlogCount');

  if (countEl) countEl.textContent = `${list.length} AI insights available`;

  if (!grid) return;

  grid.innerHTML = list.map(blog => `
    <div class="blog__card slide-up" data-blog-id="${blog.id}">
      <div class="blog__header">
        <h3 class="blog__title">${blog.title}</h3>
        <span class="blog__date">${blog.date}</span>
      </div>
      <p class="blog__summary">${blog.summary}</p>
      <div class="blog__footer">
        <span class="blog__author">👤 ${blog.author}</span>
        <div class="blog__tags">
          ${blog.tags.map(t => `<span class="skill__tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Add interactivity
  document.querySelectorAll('.blog__card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.blogId);
      openBlogModal(id);
    });
    card.style.cursor = 'pointer';
  });
}

// Modal detail view
function openBlogModal(id) {
  const blog = aiBlogs.find(b => b.id === id);
  if (!blog) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal__backdrop';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';

  const modal = document.createElement('div');
  modal.className = 'modal panel--blog';
  modal.style.cssText = 'background:var(--color-surface);padding:24px;border-radius:12px;max-width:700px;max-height:90vh;overflow:auto;box-shadow:var(--shadow-lg);';
  modal.innerHTML = `
    <h2>${blog.title}</h2>
    <p><em>${blog.date}</em></p>
    <p style="margin:12px 0;">${blog.summary}</p>
    <p><strong>Author:</strong> ${blog.author}</p>
    <button id="closeBlogModal" class="btn btn--outline" style="margin-top:16px;">Close</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('closeBlogModal').onclick = () => document.body.removeChild(overlay);
}

// Hook AI blog into showSection
// In your showSection(sectionName) add this:
  // else if (sectionName === 'aiBlog') {
  //     generateAIBlogs();
  // }

// Also call setupAIBlogFeatures() inside setupEventListeners()


function initializeApp() {
    loadUserData();
    setupEventListeners();
    displayJobs(jobsData);
    showSection('home');
    updateAuthUI();
    renderTestimonials();
    setupScrollAnimations();
}

// Event Listeners Setup
function setupEventListeners() {
    {
    // ... your other existing event listeners ...
    
    setupInterviewEventListeners(); // ✅ ADD THIS LINE

    // ... etc.
}
    // Authentication buttons
    setupAuthButtons();
    
    // Navigation links
    setupNavigation();
    
    // Authentication forms
    setupAuthForms();
    
    // Modal controls
    setupModalControls();
    
    // Search and filters
    setupSearchAndFilters();
    
    // Profile and job features
    setupProfileFeatures();
    
    // Job application features
    setupJobFeatures();
}

function setupAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const heroSignupBtn = document.getElementById('heroSignupBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Login button clicked');
            openModal('loginModal');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Signup button clicked');
            openModal('signupModal');
        });
    }

    if (heroSignupBtn) {
        heroSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentUser) {
                showSection('profile');
            } else {
                openModal('signupModal');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleLogout();
        });
    }
}

function setupNavigation() {
    // Navigation links
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Nav link clicked:', this.getAttribute('data-section'));
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                updateActiveNav(this);
            }
        });
    });

    // Hero buttons
    document.querySelectorAll('[data-section]').forEach(btn => {
        if (btn.classList.contains('nav__link')) return; // Skip nav links (already handled)
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Section button clicked:', this.getAttribute('data-section'));
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
            }
        });
    });

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

function setupAuthForms() {
    // Modal switching buttons
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal('loginModal');
            setTimeout(() => openModal('signupModal'), 100);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal('signupModal');
            setTimeout(() => openModal('loginModal'), 100);
        });
    }

    // Authentication forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleLogin(e);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleSignup(e);
        });
        
        // Real-time password strength checking
        const passwordInput = document.getElementById('signupPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }

        // Real-time form validation
        const formInputs = signupForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function setupModalControls() {
    // Modal close buttons
    document.querySelectorAll('.modal__close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Modal backdrop clicks
    document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function(e) {
            e.stopPropagation();
            if (e.target === backdrop) {
                const modal = this.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            }
        });
    });

    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function setupSearchAndFilters() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Filter dropdowns
    ['locationFilter', 'categoryFilter', 'typeFilter', 'remoteFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', function() {
                applyFilters();
            });
        }
    });
}

function setupProfileFeatures() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleProfileSubmit(e);
        });
    }

    // Resume upload
    const resumeUpload = document.getElementById('resumeUpload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', handleResumeUpload);
    }

    // File upload button
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        const uploadButton = uploadArea.querySelector('.btn--outline');
        if (uploadButton) {
            uploadButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const fileInput = document.getElementById('resumeUpload');
                if (fileInput) fileInput.click();
            });
        }
    }
}

function setupJobFeatures() {
    // Job modal controls
    const applyBtn = document.getElementById('applyBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleJobApplication();
        });
    }
}

// Testimonials Rendering
function renderTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;

    testimonialsGrid.innerHTML = testimonialsData.map(testimonial => createTestimonialCard(testimonial)).join('');
    
    // Setup scroll animations for testimonial cards
    setTimeout(() => {
        observeTestimonialCards();
        setupImageErrorHandling();
    }, 100);
}

function createTestimonialCard(testimonial) {
    const stars = generateStars(testimonial.rating);
    const formattedDate = formatTestimonialDate(testimonial.date);
    
    return `
        <div class="testimonial-card fade-in" data-testimonial-id="${testimonial.id}">
            <div class="testimonial__header">
                <img src="${testimonial.avatar}" 
                     alt="${testimonial.name}" 
                     class="user-avatar" 
                     loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.style.opacity='1';">
                <div class="avatar-fallback" style="display: none; width: 80px; height: 80px; border-radius: 50%; background: var(--color-primary); color: white; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; flex-shrink: 0;">
                    ${testimonial.name.charAt(0)}
                </div>
                <div class="user__info">
                    <h3 class="user__name">${testimonial.name}</h3>
                    <p class="user__position">${testimonial.position}</p>
                    <p class="user__company">${testimonial.company}</p>
                    <p class="user__location">📍 ${testimonial.location}</p>
                </div>
            </div>
            
            <div class="rating-stars">
                ${stars}
            </div>
            
            <p class="review__text">"${testimonial.review}"</p>
            
            <div class="testimonial__footer">
                <div class="testimonial__meta">
                    <span class="verified-badge">✓ Verified User</span>
                    <span class="review__date">${formattedDate}</span>
                </div>
                
                <div class="job__metrics">
                    <div class="metric">
                        <span class="metric__value">${testimonial.job_found_days}</span>
                        <span class="metric__label">Days to Hire</span>
                    </div>
                    <div class="metric">
                        <span class="metric__value">${testimonial.salary_increase}</span>
                        <span class="metric__label">Salary Boost</span>
                    </div>
                    <div class="metric">
                        <span class="category__tag">${testimonial.category}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupImageErrorHandling() {
    // Ensure all images have proper opacity set initially
    document.querySelectorAll('.user-avatar').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star">★</span>';
        } else {
            stars += '<span class="star empty">☆</span>';
        }
    }
    return stars;
}

function formatTestimonialDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Scroll Animations
function setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('slide-up');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Observe testimonial section and stats dashboard
        const elementsToObserve = document.querySelectorAll(
            '.testimonials-section, .platform-stats, .stat-card'
        );
        
        elementsToObserve.forEach(el => {
            if (el) observer.observe(el);
        });
    }
}

function observeTestimonialCards() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        entry.target.style.transition = 'all 0.6s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 100);
                        
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
        );

        document.querySelectorAll('.testimonial-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = document.getElementById('loginSubmitBtn');
    
    // Clear previous errors
    clearFormErrors('loginForm');
    
    // Validate inputs
    if (!email || !password) {
        showFieldError('loginEmail', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    setTimeout(() => {
        // Simulate authentication
        const user = registeredUsers.find(u => u.email === email);
        
        if (user && user.password === password) {
            currentUser = { ...user };
            delete currentUser.password; // Don't store password in current session
            
            saveUserData();
            updateAuthUI();
            closeModal('loginModal');
            showSuccess('Welcome back!');
            
            // If user has profile data, show dashboard immediately
            if (currentUser.skills && currentUser.skills.length > 0) {
                setTimeout(() => {
                    showSection('recommendations');
                }, 500);
            }
        } else {
            showFieldError('loginEmail', 'Invalid email or password');
        }
        
        setButtonLoading(submitBtn, false);
    }, 1000);
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = getSignupFormData();
    const submitBtn = document.getElementById('signupSubmitBtn');
    
    // Clear previous errors
    clearFormErrors('signupForm');
    
    // Validate form
    if (!validateSignupForm(formData)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    setTimeout(() => {
        // Create new user
        const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            password: formData.password, // In real app, this would be hashed
            phone: formData.phone,
            location: formData.location,
            education: `${formData.educationLevel}${formData.fieldOfStudy ? ' - ' + formData.fieldOfStudy : ''}`,
            skills: formData.skills,
            experienceLevel: formData.experienceLevel,
            jobCategories: formData.jobCategories,
            interests: formData.jobCategories, // Use job categories as interests
            created_at: new Date().toISOString()
        };
        
        // Add to registered users
        registeredUsers.push(newUser);
        
        // Set as current user (auto-login after signup)
        currentUser = { ...newUser };
        delete currentUser.password;
        
        saveUserData();
        updateAuthUI();
        closeModal('signupModal');
        
        setButtonLoading(submitBtn, false);
        
        // Show success and immediate onboarding
        showSuccess('Account created successfully! Welcome to FreshStart Jobs!');
        
        setTimeout(() => {
            showOnboardingFlow();
        }, 1000);
        
    }, 1500);
}

function handleLogout() {
    currentUser = null;
    saveUserData();
    updateAuthUI();
    showSection('home');
    showSuccess('Logged out successfully');
}

// Form Validation Functions
function validateSignupForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError('signupName', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showFieldError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    } else if (registeredUsers.some(u => u.email === data.email)) {
        showFieldError('signupEmail', 'This email is already registered');
        isValid = false;
    }
    
    // Password validation
    if (!data.password) {
        showFieldError('signupPassword', 'Password is required');
        isValid = false;
    } else if (data.password.length < 8) {
        showFieldError('signupPassword', 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('signupPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Location validation
    if (!data.location) {
        showFieldError('signupLocation', 'Location is required');
        isValid = false;
    }
    
    // Education level validation
    if (!data.educationLevel) {
        showFieldError('educationLevel', 'Education level is required');
        isValid = false;
    }
    
    // Skills validation
    if (!data.skills || data.skills.length === 0) {
        showFieldError('signupSkills', 'At least one skill is required');
        isValid = false;
    }
    
    // Experience level validation
    if (!data.experienceLevel) {
        showFieldError('experienceLevel', 'Experience level is required');
        isValid = false;
    }
    
    // Job categories validation
    if (!data.jobCategories || data.jobCategories.length === 0) {
        showFieldError('jobCategories', 'Please select at least one job category');
        isValid = false;
    }
    
    // Terms validation
    if (!data.termsAccepted) {
        showFieldError('termsAccepted', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    switch (fieldId) {
        case 'signupEmail':
            if (value && !isValidEmail(value)) {
                showFieldError(fieldId, 'Please enter a valid email address');
            } else if (value && registeredUsers.some(u => u.email === value)) {
                showFieldError(fieldId, 'This email is already registered');
            }
            break;
        case 'signupPhone':
            if (value && !isValidPhone(value)) {
                showFieldError(fieldId, 'Please enter a valid phone number');
            }
            break;
        case 'confirmPassword':
            const password = document.getElementById('signupPassword').value;
            if (value && value !== password) {
                showFieldError(fieldId, 'Passwords do not match');
            }
            break;
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthIndicator.classList.remove('show', 'weak', 'medium', 'strong');
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    strengthIndicator.classList.add('show');
    strengthIndicator.classList.remove('weak', 'medium', 'strong');
    
    if (strength < 3) {
        strengthIndicator.classList.add('weak');
    } else if (strength < 5) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function getSignupFormData() {
    const jobCategories = Array.from(document.querySelectorAll('#jobCategories input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    return {
        name: document.getElementById('signupName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('signupPhone').value.trim(),
        location: document.getElementById('signupLocation').value,
        educationLevel: document.getElementById('educationLevel').value,
        fieldOfStudy: document.getElementById('fieldOfStudy').value.trim(),
        skills: document.getElementById('signupSkills').value.split(',').map(s => s.trim()).filter(s => s),
        experienceLevel: document.getElementById('experienceLevel').value,
        jobCategories: jobCategories,
        termsAccepted: document.getElementById('termsAccepted').checked
    };
}

// Helper Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone.replace(/\s/g, ''));
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.error__message').forEach(el => el.classList.remove('show'));
    }
}

function setButtonLoading(button, isLoading) {
    const text = button.querySelector('.btn__text');
    const spinner = button.querySelector('.btn__spinner');
    
    if (isLoading) {
        button.disabled = true;
        if (text) text.style.display = 'none';
        if (spinner) spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        if (text) text.style.display = 'inline';
        if (spinner) spinner.classList.add('hidden');
    }
}

// Modal Functions
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Clear form data and errors
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form.id);
            
            // Reset button states
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) setButtonLoading(submitBtn, false);
        }
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            closeModal(modal.id);
        }
    });
}

// UI Update Functions
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userName) userName.textContent = `Welcome, ${currentUser.name}`;
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

function showOnboardingFlow() {
    showLoading('Setting up your profile...');
    
    setTimeout(() => {
        hideLoading();
        showSection('recommendations');
        
        setTimeout(() => {
            createToast('🎉 Your account is ready! Here are some personalized job recommendations based on your profile.', 'success', 5000);
        }, 500);
    }, 2000);
}

// Navigation Functions
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('fade-in');
        
        // Section-specific initialization
        if (sectionName === 'jobs') {
            displayJobs(filteredJobs);
        } else if (sectionName === 'recommendations') {
            generateRecommendations();
        } else if (sectionName === 'profile') {
            updateProfileDashboard();
        }
    } else {
        console.error('Section not found:', sectionName + 'Section');
    }

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) activeLink.classList.add('active');
}

// Job Search and Filter Functions
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredJobs = [...jobsData];
    } else {
        filteredJobs = jobsData.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.category.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    let jobs = (searchInput && searchInput.value) ? filteredJobs : [...jobsData];
    
    // Location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter && locationFilter.value) {
        jobs = jobs.filter(job => job.location.includes(locationFilter.value));
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value) {
        jobs = jobs.filter(job => job.category === categoryFilter.value);
    }
    
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter && typeFilter.value) {
        jobs = jobs.filter(job => job.type === typeFilter.value);
    }
    
    // Remote filter
    const remoteFilter = document.getElementById('remoteFilter');
    if (remoteFilter && remoteFilter.value) {
        const isRemote = remoteFilter.value === 'true';
        jobs = jobs.filter(job => job.remote === isRemote);
    }
    
    filteredJobs = jobs;
    displayJobs(filteredJobs);
}

// Job Display Functions
function displayJobs(jobs) {
    const jobsGrid = document.getElementById('jobsGrid');
    const jobsCount = document.getElementById('jobsCount');
    
    if (jobsCount) {
        jobsCount.textContent = `${jobs.length} jobs found`;
    }
    
    if (!jobsGrid) return;
    
    if (jobs.length === 0) {
        jobsGrid.innerHTML = `
            <div class="no__jobs">
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
    
    // Add click listeners to job cards
    setTimeout(() => {
        document.querySelectorAll('.job__card').forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const jobId = parseInt(this.getAttribute('data-job-id'));
                if (jobId) showJobDetails(jobId);
            });
            
            card.style.cursor = 'pointer';
        });
    }, 100);
}

function createJobCard(job) {
    const matchScore = currentUser ? calculateJobMatch(currentUser, job) : null;
    const isApplied = appliedJobs.includes(job.id);
    
    return `
        <div class="job__card slide-up" data-job-id="${job.id}" style="cursor: pointer;">
            <div class="job__header">
                <h3 class="job__title">${job.title}</h3>
                <span class="job__type">${job.type}</span>
            </div>
            <p class="job__company">${job.company}</p>
            <p class="job__location">📍 ${job.location}</p>
            <p class="job__salary">💰 ${job.salary}</p>
            <div class="job__skills">
                ${job.skills.slice(0, 3).map(skill => 
                    `<span class="skill__tag">${skill}</span>`
                ).join('')}
                ${job.skills.length > 3 ? `<span class="skill__tag">+${job.skills.length - 3} more</span>` : ''}
            </div>
            <div class="job__footer">
                <span class="job__date">${formatDate(job.posted_date)}</span>
                ${matchScore ? `<span class="match__score">${matchScore}% Match</span>` : ''}
                ${isApplied ? `<span class="status status--success">Applied</span>` : ''}
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Job Details Modal
function showJobDetails(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const jobModal = document.getElementById('jobModal');
    const applyBtn = document.getElementById('applyBtn');
    
    if (modalTitle) modalTitle.textContent = job.title;
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="job__details">
                <div class="job__company" style="font-size: 18px; font-weight: 500; color: var(--color-primary); margin-bottom: 16px;">${job.company}</div>
                <div class="job__meta" style="margin-bottom: 24px;">
                    <p style="margin: 8px 0;"><strong>Location:</strong> ${job.location}</p>
                    <p style="margin: 8px 0;"><strong>Type:</strong> ${job.type}</p>
                    <p style="margin: 8px 0;"><strong>Experience:</strong> ${job.experience}</p>
                    <p style="margin: 8px 0;"><strong>Salary:</strong> ${job.salary}</p>
                    <p style="margin: 8px 0;"><strong>Work Mode:</strong> ${job.remote ? 'Remote' : 'On-site'}</p>
                    <p style="margin: 8px 0;"><strong>Company Size:</strong> ${job.company_size} employees</p>
                </div>
                
                <div class="job__description" style="margin: 24px 0;">
                    <h4 style="margin-bottom: 12px;">About the Role</h4>
                    <p style="line-height: 1.6;">${job.description}</p>
                </div>
                
                <div class="job__requirements" style="margin: 24px 0;">
                    <h4 style="margin-bottom: 12px;">Requirements</h4>
                    <ul style="padding-left: 20px;">
                        ${job.requirements.map(req => `<li style="margin-bottom: 8px;">${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="job__skills" style="margin: 24px 0;">
                    <h4 style="margin-bottom: 12px;">Required Skills</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                        ${job.skills.map(skill => `<span class="skill__tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="job__benefits" style="margin: 24px 0;">
                    <h4 style="margin-bottom: 12px;">Benefits</h4>
                    <ul style="padding-left: 20px;">
                        ${job.benefits.map(benefit => `<li style="margin-bottom: 8px;">${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                ${currentUser ? `
                    <div class="ai__insights" style="margin: 24px 0; padding: 16px; background: var(--color-bg-1); border-radius: 8px;">
                        <h4 style="margin-bottom: 12px;">AI Insights</h4>
                        <div class="insights__grid" style="display: flex; flex-direction: column; gap: 8px;">
                            <div class="insight">
                                <strong>Match Score:</strong> ${calculateJobMatch(currentUser, job)}%
                            </div>
                            <div class="insight">
                                <strong>Skills Match:</strong> ${calculateSkillsMatch(currentUser, job)}%
                            </div>
                            ${generateSkillGapAnalysis(currentUser, job)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Update apply button
    if (applyBtn) {
        const isApplied = appliedJobs.includes(jobId);
        applyBtn.textContent = isApplied ? 'Applied ✓' : 'Apply Now';
        applyBtn.disabled = isApplied;
        applyBtn.setAttribute('data-job-id', jobId);
        applyBtn.style.opacity = isApplied ? '0.6' : '1';
    }
    
    if (jobModal) {
        jobModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Profile Management
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        education: document.getElementById('education').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        interests: document.getElementById('interests').value.split(',').map(s => s.trim()).filter(s => s),
        created_at: new Date().toISOString()
    };
    
    // Update existing user or create new profile
    if (currentUser) {
        Object.assign(currentUser, userData);
    } else {
        currentUser = userData;
    }
    
    saveUserData();
    
    showSuccess('Profile updated successfully!');
    updateProfileDashboard();
    
    // Hide form and show dashboard
    const profileForm = document.querySelector('.profile__form');
    const resumeUpload = document.querySelector('.resume__upload');
    const profileDashboard = document.getElementById('profileDashboard');
    
    if (profileForm) profileForm.style.display = 'none';
    if (resumeUpload) resumeUpload.style.display = 'none';
    if (profileDashboard) profileDashboard.classList.remove('hidden');
}

function updateProfileDashboard() {
    if (!currentUser) return;
    
    const profileProgress = document.getElementById('profileProgress');
    const profilePercentage = document.getElementById('profilePercentage');
    const applicationsList = document.getElementById('applicationsList');
    const recommendedJobs = document.getElementById('recommendedJobs');
    
    // Calculate and show profile completeness
    const completeness = calculateProfileCompleteness(currentUser);
    if (profileProgress) profileProgress.style.width = `${completeness}%`;
    if (profilePercentage) profilePercentage.textContent = `${completeness}%`;
    
    // Show applications
    if (applicationsList) {
        if (appliedJobs.length > 0) {
            applicationsList.innerHTML = appliedJobs.map(jobId => {
                const job = jobsData.find(j => j.id === jobId);
                return job ? `
                    <div class="application__item" data-job-id="${jobId}" style="cursor: pointer;">
                        <strong>${job.title}</strong>
                        <p style="margin: 4px 0; color: var(--color-text-secondary);">${job.company}</p>
                        <span class="status status--info">Under Review</span>
                    </div>
                ` : '';
            }).join('');
        } else {
            applicationsList.innerHTML = '<p style="color: var(--color-text-secondary);">No applications yet</p>';
        }
    }
    
    // Show recommended jobs
    if (recommendedJobs) {
        const recommendations = getJobRecommendations(currentUser, 3);
        recommendedJobs.innerHTML = recommendations.map(job => `
            <div class="recommendation__item" data-job-id="${job.id}" style="cursor: pointer;">
                <strong>${job.title}</strong>
                <p style="margin: 4px 0; color: var(--color-text-secondary);">${job.company}</p>
                <span class="match__score">${calculateJobMatch(currentUser, job)}% Match</span>
            </div>
        `).join('');
        
        // Add click listeners
        setTimeout(() => {
            document.querySelectorAll('.recommendation__item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const jobId = parseInt(this.getAttribute('data-job-id'));
                    if (jobId) showJobDetails(jobId);
                });
            });
        }, 100);
    }
}

// Resume Upload and AI Parsing
function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    showLoading('Parsing resume with AI...');
    
    setTimeout(() => {
        const extractedData = simulateResumeParser(file.name);
        hideLoading();
        displayExtractedData(extractedData);
    }, 2000);
}

function simulateResumeParser(filename) {
    const sampleProfiles = [
        {
            name: "Alex Johnson",
            email: "alex.johnson@email.com",
            phone: "+91 9876543210",
            education: "B.Tech Computer Science",
            skills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
            interests: ["Web Development", "Machine Learning", "Software Engineering"]
        },
        {
            name: "Sarah Williams",
            email: "sarah.williams@email.com",
            phone: "+91 9876543211",
            education: "MBA Marketing",
            skills: ["Digital Marketing", "Content Writing", "SEO", "Analytics", "Social Media"],
            interests: ["Marketing Strategy", "Brand Management", "Content Creation"]
        }
    ];
    
    return sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];
}

function displayExtractedData(data) {
    const resumePreview = document.getElementById('resumePreview');
    const extractedInfo = document.getElementById('extractedInfo');
    
    if (extractedInfo) {
        extractedInfo.innerHTML = `
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Name:</span>
                <span class="info__value" style="margin-left: 8px;">${data.name}</span>
            </div>
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Email:</span>
                <span class="info__value" style="margin-left: 8px;">${data.email}</span>
            </div>
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Phone:</span>
                <span class="info__value" style="margin-left: 8px;">${data.phone}</span>
            </div>
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Education:</span>
                <span class="info__value" style="margin-left: 8px;">${data.education}</span>
            </div>
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Skills:</span>
                <span class="info__value" style="margin-left: 8px;">${data.skills.join(', ')}</span>
            </div>
            <div class="info__item" style="margin-bottom: 12px;">
                <span class="info__label" style="font-weight: 500;">Interests:</span>
                <span class="info__value" style="margin-left: 8px;">${data.interests.join(', ')}</span>
            </div>
        `;
    }
    
    if (resumePreview) {
        resumePreview.classList.remove('hidden');
    }
    
    // Add event listener for use extracted data button
    setTimeout(() => {
        const useExtractedBtn = document.getElementById('useExtractedBtn');
        if (useExtractedBtn) {
            useExtractedBtn.addEventListener('click', function(e) {
                e.preventDefault();
                populateFormWithExtractedData(data);
            });
        }
    }, 100);
}

function populateFormWithExtractedData(data) {
    const formFields = {
        'fullName': data.name,
        'email': data.email,
        'phone': data.phone,
        'education': data.education,
        'skills': data.skills.join(', '),
        'interests': data.interests.join(', ')
    };
    
    Object.entries(formFields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = value;
    });
    
    showSuccess('Form populated with extracted data!');
}

// AI Recommendation System
function generateRecommendations() {
    const recommendationsContent = document.getElementById('recommendationsContent');
    if (!recommendationsContent) return;
    
    if (!currentUser) {
        recommendationsContent.innerHTML = `
            <div class="no__profile">
                <div class="empty__state">
                    <h3>Create Your Profile First</h3>
                    <p>Sign up and complete your profile to get personalized AI recommendations.</p>
                    <button class="btn btn--primary" id="getStartedBtn">Get Started</button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const getStartedBtn = document.getElementById('getStartedBtn');
            if (getStartedBtn) {
                getStartedBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openModal('signupModal');
                });
            }
        }, 100);
        return;
    }
    
    showLoading('Generating AI recommendations...');
    
    setTimeout(() => {
        const recommendations = getJobRecommendations(currentUser, 8);
        hideLoading();
        
        recommendationsContent.innerHTML = `
            <div class="recommendations__results">
                <div class="recommendations__summary" style="text-align: center; margin-bottom: 32px;">
                    <h3>Personalized for ${currentUser.name}</h3>
                    <p style="color: var(--color-text-secondary);">Based on your skills: ${currentUser.skills.slice(0, 3).join(', ')}${currentUser.skills.length > 3 ? '...' : ''}</p>
                </div>
                <div class="jobs__grid">
                    ${recommendations.map(job => createJobCard(job)).join('')}
                </div>
            </div>
        `;
        
        // Add click listeners to job cards
        setTimeout(() => {
            document.querySelectorAll('.job__card').forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    const jobId = parseInt(this.getAttribute('data-job-id'));
                    if (jobId) showJobDetails(jobId);
                });
            });
        }, 100);
    }, 1500);
}

function getJobRecommendations(user, limit = 5) {
    const jobsWithScores = jobsData.map(job => ({
        ...job,
        matchScore: calculateJobMatch(user, job)
    }));
    
    return jobsWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
}

// AI Matching Algorithms
function calculateJobMatch(user, job) {
    const weights = { skills: 40, location: 20, education: 20, interests: 15, experience: 5 };
    let totalScore = 0;
    
    totalScore += (calculateSkillsMatch(user, job) / 100) * weights.skills;
    totalScore += ((user.location && job.location.includes(user.location) ? 100 : 0) / 100) * weights.location;
    totalScore += (calculateEducationMatch(user, job) / 100) * weights.education;
    totalScore += (calculateInterestMatch(user, job) / 100) * weights.interests;
    totalScore += ((job.experience.includes('0') ? 100 : 50) / 100) * weights.experience;
    
    return Math.round(totalScore);
}

function calculateSkillsMatch(user, job) {
    if (!user.skills || user.skills.length === 0) return 0;
    
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    
    const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
}

function calculateEducationMatch(user, job) {
    if (!user.education) return 50;
    
    const education = user.education.toLowerCase();
    const requirements = job.requirements.join(' ').toLowerCase();
    
    if (education.includes('computer') && requirements.includes('computer')) return 100;
    if (education.includes('engineering') && requirements.includes('engineering')) return 90;
    if (education.includes('business') && requirements.includes('business')) return 100;
    if (education.includes('marketing') && requirements.includes('marketing')) return 100;
    if (education.includes('design') && requirements.includes('design')) return 100;
    
    return 60;
}

function calculateInterestMatch(user, job) {
    if (!user.interests || user.interests.length === 0) return 50;
    
    const interests = user.interests.map(i => i.toLowerCase());
    const jobText = (job.title + ' ' + job.description + ' ' + job.category).toLowerCase();
    
    const matchingInterests = interests.filter(interest => jobText.includes(interest.toLowerCase()));
    return Math.round((matchingInterests.length / interests.length) * 100);
}

function generateSkillGapAnalysis(user, job) {
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    
    const missingSkills = jobSkills.filter(skill => 
        !userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    
    if (missingSkills.length === 0) {
        return '<div class="insight"><strong>Skill Gap:</strong> None! You have all required skills.</div>';
    }
    
    return `
        <div class="insight">
            <strong>Missing Skills:</strong> ${missingSkills.join(', ')}
            <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                Consider learning these skills to improve your match score.
            </p>
        </div>
    `;
}

// Job Application
function handleJobApplication() {
    const applyBtn = document.getElementById('applyBtn');
    const jobId = parseInt(applyBtn.getAttribute('data-job-id'));
    
    if (!currentUser) {
        closeModal('jobModal');
        setTimeout(() => {
            openModal('signupModal');
        }, 300);
        showError('Please create an account first to apply for jobs.');
        return;
    }
    
    if (appliedJobs.includes(jobId)) {
        showError('You have already applied for this job.');
        return;
    }
    
    showLoading('Submitting application...');
    
    setTimeout(() => {
        appliedJobs.push(jobId);
        saveUserData();
        hideLoading();
        closeModal('jobModal');
        showSuccess('Application submitted successfully!');
        
        // Refresh displays that show applied jobs
        const currentSection = document.querySelector('.section:not(.hidden)');
        if (currentSection && currentSection.id === 'profileSection') {
            updateProfileDashboard();
        }
    }, 1000);
}

// Utility Functions
function calculateProfileCompleteness(user) {
    const fields = ['name', 'email', 'phone', 'location', 'education', 'skills', 'interests'];
    const completedFields = fields.filter(field => user[field] && user[field].length > 0);
    return Math.round((completedFields.length / fields.length) * 100);
}

function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.querySelector('.loading__text');
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (loadingText) loadingText.textContent = message;
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

function showSuccess(message) {
    createToast(message, 'success');
}

function showError(message) {
    createToast(message, 'error');
}

function createToast(message, type, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 9999;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Data Persistence
function saveUserData() {
    try {
        if (currentUser) {
            // Remove sensitive data before storing
            const userToStore = { ...currentUser };
            delete userToStore.password;
            const userData = {
                user: userToStore,
                applications: appliedJobs,
                registeredUsers: registeredUsers.map(u => ({ ...u })) // Store all registered users
            };
        }
    } catch (e) {
        console.warn('LocalStorage not available');
    }
}

function loadUserData() {
    try {
        const data = localStorage.getItem('freshstart_data');
        if (data) {
            const parsedData = JSON.parse(data);
            
            if (parsedData.user) {
                currentUser = parsedData.user;
                
                // Update profile display
                setTimeout(() => {
                    const profileForm = document.querySelector('.profile__form');
                    const resumeUpload = document.querySelector('.resume__upload');
                    const profileDashboard = document.getElementById('profileDashboard');
                    
                    if (profileForm) profileForm.style.display = 'none';
                    if (resumeUpload) resumeUpload.style.display = 'none';
                    if (profileDashboard) profileDashboard.classList.remove('hidden');
                }, 100);
            }
            
            if (parsedData.applications) {
                appliedJobs = parsedData.applications;
            }
            
            if (parsedData.registeredUsers) {
                registeredUsers = parsedData.registeredUsers;
            }
        }
    } catch (e) {
        console.warn('Error loading user data');
    }
}
// ===============================================
// AI MOCK INTERVIEWER LOGIC (FRONTEND-ONLY)
// ===============================================

function setupInterviewEventListeners() {
    const startBtn = document.getElementById('startInterviewBtn');
    if (!startBtn) return;

    if (!recognition) {
        startBtn.disabled = true;
        startBtn.textContent = "Browser Not Supported";
        updateInterviewStatus("Speech recognition is not supported in this browser. Please use Chrome or Edge.", "error");
        return;
    }

    // Configure the speech recognition API
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    // Connect handlers
    recognition.onresult = handleSpeechResult;
    recognition.onerror = handleSpeechError;
    recognition.onend = () => {
        if (interviewInProgress) {
            updateInterviewStatus("AI is thinking...", "thinking");
        }
    };

    startBtn.addEventListener('click', startInterview);
}

function startInterview() {
    // ❗ MAKE SURE YOUR API KEY IS PASTED HERE
    const apiKey = "AIzaSyCmedhJOlg_YpMKK37-DcLftVZPT2HVnCQ"; 

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        showError("API Key is missing in app.js. Please follow the instructions to add it.");
        return;
    }

    if (!window.GoogleGenerativeAI) {
        showError("AI SDK is not loaded. Please check the script tag in index.html.");
        return;
    }

    try {
        const genAI = new window.GoogleGenerativeAI(apiKey);
        generativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        console.log("Gemini model initialized successfully.");
    } catch (error) {
        console.error("Gemini initialization error:", error);
        showError("Invalid API Key or initialization failed.");
        return;
    }
    
    interviewInProgress = true;
    document.getElementById('startInterviewBtn').textContent = "Interview in Progress...";
    document.getElementById('startInterviewBtn').disabled = true;
    document.getElementById('apiKeyInput').style.display = 'none'; // Hide the input field
    document.getElementById('userTranscript').textContent = "";
    
    updateInterviewStatus("Initializing...", "thinking");
    getAIResponse("This is the first question.").then(data => {
        if (data) {
            currentQuestion = data.next_question;
            speakAndListen(currentQuestion);
        }
    });
}

function handleSpeechResult(event) {
    const userAnswer = event.results[0][0].transcript;
    document.getElementById('userTranscript').textContent = `You said: "${userAnswer}"`;
    updateInterviewStatus("AI is thinking...", "thinking");

    getAIResponse(userAnswer).then(data => {
        if (!data) return;
        
        const feedback = data.feedback;
        currentQuestion = data.next_question;
        
        speakAndListen(feedback, () => {
            speakAndListen(currentQuestion);
        });
    });
}

function handleSpeechError(event) {
    console.error("Speech recognition error:", event.error);
    let errorMessage = "Sorry, I didn't catch that. Let's try again.";
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings.";
        resetInterviewState();
    }
    updateInterviewStatus(errorMessage, "error");
    speakAndListen(errorMessage);
}

async function getAIResponse(userAnswer) {
    if (!generativeModel) {
        showError("AI Model is not initialized.");
        return null;
    }

    const jobTitle = document.getElementById('interviewJobTitle').value;
    const prompt = `You are a professional interviewer for a fresher applying for a "${jobTitle}" role. The previous question was: "${currentQuestion}". The candidate's answer was: "${userAnswer}". Respond in two parts separated by "|||". First, give brief, constructive feedback. Second, ask the next logical interview question.`;
    
    try {
        const result = await generativeModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const parts = text.split('|||');
        if (parts.length === 2) {
            return { feedback: parts[0].trim(), next_question: parts[1].trim() };
        } else {
            return { feedback: "Okay, let's move on.", next_question: text.trim() };
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        showError("Error connecting to AI. Check your API key and network.");
        resetInterviewState();
        return null;
    }
}

function speakAndListen(textToSpeak, onEndCallback) {
    if (synthesis.speaking) synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    document.getElementById('aiResponse').textContent = textToSpeak;

    utterance.onend = () => {
        if (onEndCallback) {
            onEndCallback();
        } else {
            if (interviewInProgress) {
                updateInterviewStatus("Listening...", "listening");
                try { recognition.start(); } catch(e) { console.error("Recognition start error:", e); }
            }
        }
    };
    synthesis.speak(utterance);
}

function updateInterviewStatus(statusText, statusClass) {
    const statusIndicator = document.getElementById('interviewStatus');
    statusIndicator.className = 'interview-status-indicator'; // Reset classes
    if (statusClass) {
        statusIndicator.classList.add(statusClass);
    }
    statusIndicator.textContent = statusText;
}

function resetInterviewState() {
    interviewInProgress = false;
    const startBtn = document.getElementById('startInterviewBtn');
    startBtn.textContent = "Start Interview";
    startBtn.disabled = false;
    document.getElementById('apiKeyInput').style.display = 'block';
    if(synthesis.speaking) synthesis.cancel();
    if(recognition) recognition.abort();
}