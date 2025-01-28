document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input');

    // Add animation to inputs
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Form validation
    form.addEventListener('submit', (e) => {
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Social login buttons
    document.querySelector('.github-btn').addEventListener('click', () => {
        // Implement GitHub OAuth login
        window.location.href = '/auth/github';
    });

    document.querySelector('.google-btn').addEventListener('click', () => {
        // Implement Google OAuth login
        window.location.href = '/auth/google';
    });
});

function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message') || 
                    createErrorElement(input);
    errorDiv.textContent = message;
    input.classList.add('error');
}

function clearError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
    input.classList.remove('error');
}

function createErrorElement(input) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.parentElement.appendChild(errorDiv);
    return errorDiv;
}
