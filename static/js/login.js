document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.querySelector('#password');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Phone number format validation
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            // Update the field value
            this.value = value;
        });
    }

    // Form submission validation
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errorMessages = [];
            
            // Validate phone number
            const phoneValue = phoneInput.value.trim();
            if (phoneValue.length === 0) {
                errorMessages.push('Phone number is required');
                isValid = false;
            } else if (phoneValue.length !== 10) {
                errorMessages.push('Phone number must be 10 digits');
                isValid = false;
            }
            
            // Validate password
            const passwordValue = passwordField.value.trim();
            if (passwordValue.length === 0) {
                errorMessages.push('Password is required');
                isValid = false;
            }
            
            // If validation fails, prevent form submission and display errors
            if (!isValid) {
                e.preventDefault();
                
                // Remove existing error messages
                const existingErrors = document.querySelectorAll('.error');
                existingErrors.forEach(error => error.remove());
                
                // Display new error messages
                const errorContainer = document.createElement('div');
                errorContainer.classList.add('error');
                errorContainer.innerHTML = errorMessages.join('<br>');
                loginForm.insertBefore(errorContainer, loginForm.firstChild);
            }
        });
    }
    
    // Add animation to form elements
    const formElements = document.querySelectorAll('.input-group, button, .social-section, .links-container');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`;
    });
    
    // Social login buttons functionality
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            // This would typically trigger OAuth authentication
            alert('Social login functionality will be implemented here.');
        });
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
