from flask import Flask, render_template, request, redirect, url_for, session
import random
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_url_path='/static')
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'fallback_secret_key')

# PostgreSQL database URL
DATABASE_URL = os.getenv('DATABASE_URL')

# Function to connect to the PostgreSQL database
def connect_to_db():
    """Connect to PostgreSQL database using environment variables."""
    if not DATABASE_URL:
        raise ValueError("Missing DATABASE_URL environment variable. Please check your .env file.")
    
    return psycopg2.connect(DATABASE_URL)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        password = request.form['password']
        dob = request.form['dob']
        balance = 30000

        conn = connect_to_db()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (phone, name, password, dob, balance) VALUES (%s, %s, %s, %s, %s)",
                (phone, name, password, dob, balance)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return redirect(url_for('shop', phone=phone))
        except psycopg2.IntegrityError:
            cursor.close()
            conn.close()
            return "Phone number already registered. Please use a different phone number or login."

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        phone = request.form['phone']
        password = request.form['password']

        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE phone = %s", (phone,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and user[3] == password:  # password is at index 3 in PostgreSQL
            return redirect(url_for('shop', phone=phone))
        else:
            return "Invalid credentials. Please try again."

    return render_template('login.html')

@app.route('/shop/<phone>', methods=['GET', 'POST'])
def shop(phone):
    # Store phone in session when accessing shop
    session['phone'] = phone
    
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE phone = %s", (phone,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if request.method == 'POST':
        # Process checkout data from form
        total = float(request.form.get('total', 0))
        discount = float(request.form.get('discount', 0))
        new_balance = float(user[5]) - total  # balance is at index 5 in PostgreSQL

        # Update the user's balance
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET balance = %s WHERE phone = %s", (new_balance, phone))
        conn.commit()
        cursor.close()
        conn.close()

        # Render the receipt - pass phone to the template
        return render_template('receipt.html', 
                              total=total, 
                              remaining_balance=new_balance, 
                              discount=discount,
                              phone=phone,
                              datetime=datetime)

    # For GET requests, just render the shop page with the user's balance
    return render_template('shop.html', balance=float(user[5]))

@app.route('/receipt', methods=['GET', 'POST'])
def receipt():
    if request.method == 'POST':
        try:
            # Get values from form data
            total = float(request.form.get('total', 0))
            discount = float(request.form.get('discount', 0))
            remaining_balance = float(request.form.get('remaining_balance', 0))
            
            # Store in session
            session['total'] = total
            session['discount'] = discount
            session['remaining_balance'] = remaining_balance
            
            return render_template(
                'receipt.html',
                total=total,
                discount=discount,
                remaining_balance=remaining_balance,
                datetime=datetime,
                phone=session.get('phone')  # Pass phone from session
            )
        except Exception as e:
            print(f"Error processing checkout: {e}")
            return "Error processing checkout", 400
    
    # Handle GET request
    return render_template(
        'receipt.html',
        total=session.get('total', 0),
        discount=session.get('discount', 0),
        remaining_balance=session.get('remaining_balance', 0),
        datetime=datetime,
        phone=session.get('phone')  # Pass phone to template
    )

if __name__ == '__main__':
    app.run(debug=True)
