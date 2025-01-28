document.addEventListener('DOMContentLoaded', () => {
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
