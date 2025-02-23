import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const authBackendURL = process.env.REACT_APP_AUTH_BACKEND_URL;

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${authBackendURL}/signup`, {
                username: data.name,
                email: data.email,
                password: data.password
            });

            if (response.data.status === "success") {
                alert("Signup successful! You can now log in.");
                navigate('/login'); // Redirect to login page
            } else {
                setError("Email already registered.");
            }
        } catch (err) {
            setError("Email already registered or invalid input.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && <p className="error-message">{error}</p>}

                <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Full Name"
                    className={`input-field ${errors.name ? "error" : ""}`}
                />
                {errors.name && <span className="error-text">{errors.name.message}</span>}

                <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Email"
                    className={`input-field ${errors.email ? "error" : ""}`}
                />
                {errors.email && <span className="error-text">{errors.email.message}</span>}

                <div className="password-field">
                    <input
                        {...register("password", { required: "Password is required" })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`input-field ${errors.password ? "error" : ""}`}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                </div>
                {errors.password && <span className="error-text">{errors.password.message}</span>}

                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
