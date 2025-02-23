from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

# ✅ Initialize Flask App
auth_app = Flask(__name__)
CORS(auth_app, origins=[os.getenv("FRONTEND_URL", "https://finqa-chatbot.netlify.app")], supports_credentials=True)
bcrypt = Bcrypt(auth_app)

# ✅ PostgreSQL Configuration
auth_app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
auth_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(auth_app)

# ✅ User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# ✅ Initialize Database
with auth_app.app_context():
    db.create_all()

# 🔐 Signup Route
@auth_app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'Email already registered.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'User registered successfully.'})

# 🔐 Login Route
@auth_app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({'status': 'success', 'message': 'Login successful.', 'user_id': user.id, 'username': user.username})

    return jsonify({'status': 'error', 'message': 'Invalid credentials.'}), 401

# ✅ Home Route for Verification
@auth_app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'success', 'message': 'Auth service running!'}), 200

# ✅ Bind app to the correct port for Render
port = int(os.environ.get("PORT", 5000))
if __name__ == '__main__':
    auth_app.run(host='0.0.0.0', port=port, debug=False)
