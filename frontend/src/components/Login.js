import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const authBackendURL = process.env.REACT_APP_AUTH_BACKEND_URL;

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${authBackendURL}/login`, data);
            if (response.data.status === "success") {
                localStorage.setItem("user", JSON.stringify(response.data)); // Persist login
                localStorage.setItem("userId", response.data.user_id); // Save userId for chat
                navigate('/chat'); // Redirect to chat page
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && <p className="error-message">{error}</p>}

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

                <button type="submit" className="submit-btn">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;
