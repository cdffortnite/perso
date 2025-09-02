document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  function scrollToForm() {
    document.getElementById('formulario').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  function showNotImplemented() {
    showToast(
      '🚧 Siga-nos!  🚀',
      'error'
    );
  }

  function validateForm(formData) {
    const errors = [];
    if (!formData.nome.trim()) {
      errors.push('Nome é obrigatório');
    }
    if (!formData.email.trim()) {
      errors.push('E-mail é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('E-mail inválido');
    }
    if (!formData.whatsapp.trim()) {
      errors.push('WhatsApp é obrigatório');
    }
    return errors;
  }

  async function saveToLocalStorage(formData) {
    // envia ao servidor via AJAX
    try {
      const resp = await fetch('enviar.php', {
        method: form.method,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
      });
      const json = await resp.json();
      if (!resp.ok || json.status !== 'ok') {
        console.error('Erro no servidor:', json);
        return false;
      }
    } catch (error) {
      console.error('Erro de rede ao enviar ao servidor:', error);
      return false;
    }
    return true;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      whatsapp: document
        .getElementById('whatsapp')
        .value.replace(/\D/g, '')
    };

    const errors = validateForm(formData);
    if (errors.length > 0) {
      showToast(errors.join(', '), 'error');
      return;
    }

    showToast('Enviando…', 'info');
    const saved = await saveToLocalStorage(formData);

    if (saved) {
      showToast('Sucesso! Seus dados foram enviados. Entraremos em contato em breve!');
      form.reset();
    } else {
      showToast('Erro ao salvar os dados. Tente novamente.', 'error');
    }
  }

  form.addEventListener('submit', handleFormSubmit);

  function addScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document
      .querySelectorAll('.benefit-card, .testimonial-card, .stat-item')
      .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function addHeaderScrollEffect() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }
    });
  }

  function addHoverEffects() {
    document.querySelectorAll('.benefit-card, .testimonial-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  function formatPhoneInput() {
    const phoneInput = document.getElementById('whatsapp');
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      e.target.value = value;
    });
  }

  addScrollAnimations();
  initSmoothScroll();
  addHeaderScrollEffect();
  addHoverEffects();
  formatPhoneInput();

  window.scrollToForm = scrollToForm;
  window.showNotImplemented = showNotImplemented;

  console.log('Personallis - Landing Page carregada com sucesso! 🚀');
});
