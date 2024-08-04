# Flux Shopping App

Welcome to the Flux Shopping App! This application allows users to register, log in, and shop online with a unique twist—guess the number game to win discounts. This README file provides an overview of the application, installation instructions, usage guidelines, and details about the codebase.

## Features

- **User Registration and Login:** Securely register and log in with a phone number and password.
- **Shopping Experience:** Browse items, select quantities, and add them to your cart.
- **Guess the Number Game:** Chance to win a 50% discount on your total purchase by guessing a number.
- **Receipt Generation:** View your purchase details, including total cost, discounts, and remaining balance.

## Technologies Used

- **Flask:** Web framework for Python.
- **MySQL:** Database to store user information and transaction records.
- **HTML/CSS:** Frontend for user interface.
- **Python:** Backend logic and database interaction.

## Installation

### Prerequisites

- Python 3.8 or higher
- MySQL Server
- Flask
- MySQL Connector for Python

### Steps to Set Up

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/flux-shopping-app.git
    cd flux-shopping-app
    ```

2. **Install Required Packages:**

    Create a virtual environment (recommended) and install the necessary Python packages:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install flask mysql-connector-python
    ```

3. **Set Up the Database:**

    Create a new MySQL database and table:

    ```sql
    CREATE DATABASE flux_shopping;
    USE flux_shopping;

    CREATE TABLE abc (
        phone VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255),
        password VARCHAR(255),
        dob DATE,
        balance DECIMAL(10, 2)
    );
    ```

4. **Update Database Configuration:**

    Modify the `connect_to_db` function in `app.py` to use your MySQL credentials:

    ```python
    def connect_to_db():
        return mysql.connector.connect(
            host="your-db-host",
            user="your-db-username",
            password="your-db-password",
            database="flux_shopping"
        )
    ```

5. **Run the Application:**

    ```bash
    python app.py
    ```

    The application will be accessible at `http://127.0.0.1:5000`.

## Application Structure

- **`app.py`**: Main application file containing Flask routes and logic.
- **`templates/`**: Contains HTML templates for the web pages:
  - **`home.html`**: Home page with links to register or log in.
  - **`register.html`**: Registration page.
  - **`login.html`**: Login page.
  - **`shop.html`**: Shopping page where users can add items to their cart.
  - **`receipt.html`**: Receipt page displaying the purchase summary.
- **`static/`**: Directory for static files (CSS, JavaScript, images) if needed.

## Routes

- **`/`**: Home page with options to register or log in.
- **`/register`**: Page for new users to create an account.
- **`/login`**: Page for existing users to log in.
- **`/shop/<phone>`**: Shopping page where users can browse items and make purchases.
- **`/receipt`**: Page showing the receipt of the purchase, including the total amount, any discounts, and remaining balance.

## Usage

1. **Register:** Navigate to the registration page, enter your full name and phone number, set a password, and provide your date of birth.
2. **Log In:** Enter your registered phone number and password to access the shopping page.
3. **Shop:** Select items, specify quantities, and proceed to checkout. Optionally, guess a number to win a discount.
4. **View Receipt:** Check the receipt page for a summary of your purchase and any applied discounts.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code follows the project’s coding standards and includes appropriate tests.

## Contact

For any questions or feedback, please contact the project maintainer at [anubhob435@gmail.com](mailto:your-email@example.com).

