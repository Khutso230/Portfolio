function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu || !icon) {
    return;
  }
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (menu && icon && menu.classList.contains('open')) {
    menu.classList.remove('open');
    icon.classList.remove('open');
  }
}

// Normalize all in-page anchor navigations
(function initAnchorNavigation() {
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    // Support '#id' and './#id' patterns
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;
    const hash = href.slice(hashIndex + 1);
    if (!hash) return;
    const element = document.getElementById(hash);
    if (!element) return;
    e.preventDefault();
    scrollToId(hash);
  });
})();

// Theme toggle functionality
function toggleTheme() {
  document.body.classList.toggle('dark-bg');
  const themeIcon = document.querySelector('.theme-icon');
  if (document.body.classList.contains('dark-bg')) {
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }
}

// Typing animation
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Skill progress animation
function animateSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    const progressBar = item.querySelector('.skill-progress');
    const width = progressBar.getAttribute('data-width');
    progressBar.style.setProperty('--target-width', width);
    progressBar.style.width = width;
  });
}

// Scroll reveal animations
(function initScrollReveal() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Animate skill bars when experience section is visible
        if (entry.target.id === 'experience') {
          setTimeout(animateSkillBars, 500);
        }
        
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1,
  });

  elements.forEach((el) => observer.observe(el));
})();

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', function() {
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const text = typingElement.textContent;
    setTimeout(() => typeWriter(typingElement, text, 150), 1000);
  }
  
  // Initialize project functionality
  initProjectFilters();
  initProjectModal();
  initProjectAnimations();
});

// Enhanced project animations
function initProjectAnimations() {
  const projectCards = document.querySelectorAll('.details-container[data-category]');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.animation = 'projectEntrance 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.9)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
  });
  
  // Add entrance animation to filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn, index) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    setTimeout(() => {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
      btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 1200 + index * 100);
  });
}

// Project filtering functionality
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.details-container[data-category]');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Project modal functionality
function initProjectModal() {
  // Add click event to project overlays
  const projectOverlays = document.querySelectorAll('.project-overlay');
  projectOverlays.forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      e.stopPropagation();
      const projectCard = this.closest('.details-container');
      openProjectModal(projectCard);
    });
  });
  
  // Close modal when clicking outside
  const modal = document.getElementById('project-modal');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectCard) {
  const modal = document.getElementById('project-modal');
  
  // Get project data
  const title = projectCard.querySelector('.project-title').textContent;
  const description = projectCard.querySelector('.project-description').textContent;
  const imageSrc = projectCard.querySelector('.project-img').src;
  const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
  const githubBtn = projectCard.querySelector('button[onclick*="github"]');
  const demoBtn = projectCard.querySelector('button[onclick*="demo"], button[onclick*="netlify"]');
  
  // Populate modal with project data
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-description').textContent = description;
  document.getElementById('modal-image').src = imageSrc;
  document.getElementById('modal-image').alt = title;
  
  // Populate tech tags
  const modalTech = document.getElementById('modal-tech');
  modalTech.innerHTML = '';
  techTags.forEach(tech => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = tech;
    modalTech.appendChild(tag);
  });
  
  // Set modal links
  const modalGithub = document.getElementById('modal-github');
  const modalDemo = document.getElementById('modal-demo');
  
  if (githubBtn) {
    const githubUrl = githubBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
    modalGithub.onclick = () => window.open(githubUrl, '_blank');
    modalGithub.style.display = 'block';
  } else {
    modalGithub.style.display = 'none';
  }
  
  if (demoBtn) {
    const demoUrl = demoBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
    modalDemo.onclick = () => window.open(demoUrl, '_blank');
    modalDemo.style.display = 'block';
  } else {
    modalDemo.style.display = 'none';
  }
  
  // Populate additional project details
  populateProjectDetails(title);
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('show');
  document.body.style.overflow = ''; // Restore scroll
}

function populateProjectDetails(projectTitle) {
  const projectData = {
    'E-Commerce Platform': {
      overview: 'A full-featured e-commerce platform built with modern web technologies. This project showcases my ability to create scalable, user-friendly online shopping experiences with secure payment processing and inventory management.',
      features: [
        'User authentication and authorization system',
        'Product catalog with advanced search and filtering',
        'Shopping cart and wishlist functionality',
        'Secure payment integration with Stripe',
        'Order tracking and management system',
        'Admin dashboard for inventory management',
        'Responsive design for all devices'
      ],
      implementation: 'Built using React for the frontend with Redux for state management. The backend uses Node.js with Express and MongoDB for data storage. Implemented RESTful APIs, JWT authentication, and integrated Stripe for payment processing. The application is deployed on Netlify with serverless functions for backend operations.'
    },
    'Fitness Tracker App': {
      overview: 'A comprehensive mobile fitness tracking application designed to help users monitor their workouts, nutrition, and progress. This app demonstrates my expertise in mobile development and user experience design.',
      features: [
        'Workout planning and tracking',
        'Exercise library with video demonstrations',
        'Nutrition logging and calorie counting',
        'Progress tracking with visual analytics',
        'Social features for sharing achievements',
        'Push notifications for reminders',
        'Offline mode for tracking without internet'
      ],
      implementation: 'Developed using React Native for cross-platform compatibility. Firebase is used for real-time data synchronization, authentication, and push notifications. Redux manages the application state, and the app includes custom animations and gestures for an enhanced user experience.'
    },
    'Portfolio Website': {
      overview: 'A modern, responsive portfolio website showcasing my web development skills and projects. This site features smooth animations, interactive elements, and a professional design that adapts to all screen sizes.',
      features: [
        'Smooth scroll animations and transitions',
        'Interactive project gallery with filtering',
        'Contact form with email integration',
        'Dark/light theme toggle',
        'Responsive design for all devices',
        'SEO optimization',
        'Accessibility features (ARIA labels, keyboard navigation)'
      ],
      implementation: 'Built with semantic HTML5, modern CSS3 with custom properties, and vanilla JavaScript for maximum performance. Uses CSS Grid and Flexbox for responsive layouts, Intersection Observer API for scroll animations, and Formspree for contact form handling. The site is optimized for performance and accessibility.'
    }
  };
  
  const data = projectData[projectTitle];
  if (data) {
    document.getElementById('modal-overview').textContent = data.overview;
    
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
    
    document.getElementById('modal-implementation').textContent = data.implementation;
  }
}
