// ========== NAVIGATION ==========
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== MODAL SYSTEM ==========
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetFunnel(modal);
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function resetFunnel(modal) {
    var steps = modal.querySelectorAll('.funnel-content');
    var progressSteps = modal.querySelectorAll('.funnel-step');
    
    steps.forEach(function(step, i) {
        if (i === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    progressSteps.forEach(function(step, i) {
        step.classList.remove('completed');
        if (i === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function nextStep(modalId, currentStep) {
    var modal = document.getElementById(modalId);
    var steps = modal.querySelectorAll('.funnel-content');
    var progressSteps = modal.querySelectorAll('.funnel-step');
    
    // Validate
    var currentContent = modal.querySelector('.funnel-content[data-step="' + currentStep + '"]');
    var requiredFields = currentContent.querySelectorAll('[required]');
    var valid = true;
    
    requiredFields.forEach(function(field) {
        if (!field.value) {
            field.style.borderColor = '#ef4444';
            valid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!valid) return;
    
    // Next step
    var nextStepNum = currentStep + 1;
    steps.forEach(function(step) {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === nextStepNum) {
            step.classList.add('active');
        }
    });
    
    progressSteps.forEach(function(step, i) {
        if (i < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (i === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function prevStep(modalId, currentStep) {
    var modal = document.getElementById(modalId);
    var steps = modal.querySelectorAll('.funnel-content');
    var progressSteps = modal.querySelectorAll('.funnel-step');
    
    var prevStepNum = currentStep - 1;
    steps.forEach(function(step) {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === prevStepNum) {
            step.classList.add('active');
        }
    });
    
    progressSteps.forEach(function(step, i) {
        step.classList.remove('active', 'completed');
        if (i < prevStepNum) {
            step.classList.add('completed');
        } else if (i === prevStepNum - 1) {
            step.classList.add('active');
        }
    });
}

// Modal backdrop close
document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
    backdrop.addEventListener('click', function() {
        var modal = backdrop.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Modal X close
document.querySelectorAll('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var modal = btn.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Escape key close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(function(modal) {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 80;
                var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        }
    });
});
