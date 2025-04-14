document.addEventListener('DOMContentLoaded', function() {
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

    // Phone number validation
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

    // Password strength validation
    if (passwordField) {
        const lengthCheck = document.getElementById('length');
        const uppercaseCheck = document.getElementById('uppercase');
        const lowercaseCheck = document.getElementById('lowercase');
        const numberCheck = document.getElementById('number');
        const specialCheck = document.getElementById('special');
        
        passwordField.addEventListener('input', function() {
            const password = this.value;
            
            // Check length
            if (password.length >= 8) {
                lengthCheck.classList.add('valid');
                lengthCheck.classList.remove('invalid');
                lengthCheck.innerHTML = '✓ At least 8 characters';
            } else {
                lengthCheck.classList.add('invalid');
                lengthCheck.classList.remove('valid');
                lengthCheck.innerHTML = '✗ At least 8 characters';
            }
            
            // Check uppercase letter
            if (/[A-Z]/.test(password)) {
                uppercaseCheck.classList.add('valid');
                uppercaseCheck.classList.remove('invalid');
                uppercaseCheck.innerHTML = '✓ One uppercase letter';
            } else {
                uppercaseCheck.classList.add('invalid');
                uppercaseCheck.classList.remove('valid');
                uppercaseCheck.innerHTML = '✗ One uppercase letter';
            }
            
            // Check lowercase letter
            if (/[a-z]/.test(password)) {
                lowercaseCheck.classList.add('valid');
                lowercaseCheck.classList.remove('invalid');
                lowercaseCheck.innerHTML = '✓ One lowercase letter';
            } else {
                lowercaseCheck.classList.add('invalid');
                lowercaseCheck.classList.remove('valid');
                lowercaseCheck.innerHTML = '✗ One lowercase letter';
            }
            
            // Check number
            if (/[0-9]/.test(password)) {
                numberCheck.classList.add('valid');
                numberCheck.classList.remove('invalid');
                numberCheck.innerHTML = '✓ One number';
            } else {
                numberCheck.classList.add('invalid');
                numberCheck.classList.remove('valid');
                numberCheck.innerHTML = '✗ One number';
            }
            
            // Check special character
            if (/[^A-Za-z0-9]/.test(password)) {
                specialCheck.classList.add('valid');
                specialCheck.classList.remove('invalid');
                specialCheck.innerHTML = '✓ One special character';
            } else {
                specialCheck.classList.add('invalid');
                specialCheck.classList.remove('valid');
                specialCheck.innerHTML = '✗ One special character';
            }
        });
    }

    // Form submission validation
    const registerForm = document.querySelector('form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errorMessages = [];
            
            // Get all input fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const dobInput = document.getElementById('dob');
            const termsCheckbox = document.getElementById('terms');
            
            // Validate name
            if (nameInput && nameInput.value.trim() === '') {
                errorMessages.push('Full name is required');
                isValid = false;
            }
            
            // Validate email
            if (emailInput && emailInput.value.trim() === '') {
                errorMessages.push('Email is required');
                isValid = false;
            } else if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                errorMessages.push('Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone number
            if (phoneInput && phoneInput.value.trim().length !== 10) {
                errorMessages.push('Phone number must be 10 digits');
                isValid = false;
            }
            
            // Validate date of birth
            if (dobInput && dobInput.value.trim() === '') {
                errorMessages.push('Date of birth is required');
                isValid = false;
            }
            
            // Validate password strength
            if (passwordField && passwordField.value.trim() === '') {
                errorMessages.push('Password is required');
                isValid = false;
            } else if (passwordField) {
                const password = passwordField.value;
                let strengthValid = true;
                
                if (password.length < 8) strengthValid = false;
                if (!/[A-Z]/.test(password)) strengthValid = false;
                if (!/[a-z]/.test(password)) strengthValid = false;
                if (!/[0-9]/.test(password)) strengthValid = false;
                if (!/[^A-Za-z0-9]/.test(password)) strengthValid = false;
                
                if (!strengthValid) {
                    errorMessages.push('Password does not meet all requirements');
                    isValid = false;
                }
            }
            
            // Validate terms checkbox
            if (termsCheckbox && !termsCheckbox.checked) {
                errorMessages.push('You must agree to the Terms of Service and Privacy Policy');
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
                registerForm.insertBefore(errorContainer, registerForm.firstChild);
                
                // Scroll to top of form to see errors
                window.scrollTo(0, registerForm.offsetTop - 20);
            }
        });
    }
    
    // Add animation to form elements
    const formElements = document.querySelectorAll('.form-row, .terms-checkbox, button, .social-section, .links-container');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`;
    });
    
    // Date of birth max date (must be at least 13 years old)
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        const today = new Date();
        const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const maxDate = thirteenYearsAgo.toISOString().split('T')[0];
        dobInput.setAttribute('max', maxDate);
    }
    
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
