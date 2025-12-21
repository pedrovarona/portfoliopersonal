(function() {
  'use strict';

  function detectLanguage() {
    const path = decodeURIComponent(window.location.pathname);
    if (path.includes('/español/') || path.includes('/espanol/')) {
      return 'es';
    } else if (path.includes('/english/')) {
      return 'en';
    }
    return 'es';
  }

  function getComponentsPath() {
    const path = decodeURIComponent(window.location.pathname);
    if (path.includes('/español/') || path.includes('/espanol/') || path.includes('/english/')) {
      return '/components/';
    }
    return 'components/';
  }

  async function loadComponent(elementId, componentFile) {
    const container = document.getElementById(elementId);
    if (!container) {
      console.warn(`Container #${elementId} not found`);
      return;
    }

    try {
      const componentsPath = getComponentsPath();
      const fullPath = componentsPath + componentFile;
      
      const response = await fetch(fullPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      container.innerHTML = html;

      if (elementId === 'header') {
        setActivePage();
        setupLanguageSwitch();
      }
    } catch (error) {
      console.error(`Error loading ${componentFile}:`, error);
    }
  }

  function setActivePage() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('#header .nav a');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (currentPage.includes(href)) {
        link.classList.add('active');
      }
    });
  }

  function setupLanguageSwitch() {
    const lang = detectLanguage();
    const currentPage = window.location.pathname.split('/').pop();
    
    const pageMapping = {
      'index_es.html': 'index_en.html',
      'index_en.html': 'index_es.html',
      'educacion_es.html': 'education_en.html',
      'education_en.html': 'educacion_es.html',
      'proyectos_es.html': 'projects_en.html',
      'projects_en.html': 'proyectos_es.html',
      'contacto_es.html': 'contact_en.html',
      'contact_en.html': 'contacto_es.html'
    };

    const langSwitchBtn = document.getElementById(lang === 'es' ? 'lang-switch-en' : 'lang-switch-es');
    
    if (langSwitchBtn) {
      langSwitchBtn.addEventListener('click', function() {
        const targetPage = pageMapping[currentPage];
        if (targetPage) {
          const targetFolder = lang === 'es' ? '../english/' : '../español/';
          window.location.href = targetFolder + targetPage;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const lang = detectLanguage();
    loadComponent('header', `header_${lang}.html`);
    loadComponent('footer', `footer_${lang}.html`);
  });
})();
