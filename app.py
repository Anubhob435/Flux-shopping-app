from flask import Flask, render_template, request, redirect, url_for, session
import random
import mysql.connector
from datetime import datetime  # Add this import

app = Flask(__name__, static_url_path='/static')
app.secret_key = 'your_secret_key'  # Required for session management

# Constants for database connection
DB_HOST = "buh89x1pi8cgvaw4161i-mysql.services.clever-cloud.com"
DB_USER = "ucwyejivetooukiz"
DB_PASSWORD = "aAo8DieytbUo0FiYV4RY"
DB_NAME = "buh89x1pi8cgvaw4161i"


# Function to connect to the database
def connect_to_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

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
        cursor.execute(
            "INSERT INTO abc (phone, name, password, dob, balance) VALUES (%s, %s, %s, %s, %s)",
            (phone, name, password, dob, balance)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('shop', phone=phone))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        phone = request.form['phone']
        password = request.form['password']

        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM abc WHERE phone = %s", (phone,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and user[2] == password:
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
    cursor.execute("SELECT * FROM abc WHERE phone = %s", (phone,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if request.method == 'POST':
        # Process checkout data from form
        total = float(request.form.get('total', 0))
        discount = float(request.form.get('discount', 0))
        new_balance = user[4] - total

        # Update the user's balance
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE abc SET balance = %s WHERE phone = %s", (new_balance, phone))
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
    return render_template('shop.html', balance=user[4])


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
    app.run(host='0.0.0.0', port=5000, debug=True)
