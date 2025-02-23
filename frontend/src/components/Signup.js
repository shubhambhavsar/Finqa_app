import 'bootstrap/dist/css/bootstrap.min.css';
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

    // ✅ Handle Signup Submission
    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:5001/signup", {
                username: data.name,
                email: data.email,
                password: data.password
            });

            if (response.data.status === "success") {
                // ✅ Store user data in localStorage for persistence
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("userId", response.data.user_id); // Store userId for future use
                navigate('/login'); // Redirect to login after successful signup
            }
        } catch (err) {
            setError("User already exists or invalid input.");
        }
    };

    return (
        <section className='sec-signup'>
            <div className='container-fluid'>
                <div className='row height-row'>
                    <div className='col-6 col-top'>
                        <div className='d-flex justify-content-center'>
                            <div className='box-size'>
                                <div className='d-flex align-items-center box-pad'>
                                    <img className='inline-block' src='/images/we.png' alt="Logo" />
                                </div>
                                <p className='wel-txt'>Create an account</p>

                                {error && <p className="error-text">{error}</p>}

                                <form className='form-space' onSubmit={handleSubmit(onSubmit)}>
                                    {/* ✅ Full Name Input */}
                                    <label className='txt-lab'>Full name</label>
                                    <input
                                        type='text'
                                        className='inp-set'
                                        placeholder='Enter your name'
                                        {...register("name", { required: "Full name is required" })}
                                    />
                                    {errors.name && <p className="error-text">{errors.name.message}</p>}

                                    {/* ✅ Email Input */}
                                    <label className='txt-lab txt-new'>Email</label>
                                    <input
                                        type='email'
                                        className='inp-set'
                                        placeholder='Enter your email'
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: "Enter a valid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && <p className="error-text">{errors.email.message}</p>}

                                    {/* ✅ Password Input with Toggle */}
                                    <div className="relative" style={{ position: "relative", width: "100%" }}>
                                        <label className="txt-lab txt-new">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="inp-set"
                                            placeholder="Enter your password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters long"
                                                }
                                            })}
                                        />
                                        {/* ✅ Toggle Visibility Icon */}
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="error-text">{errors.password.message}</p>}

                                    {/* ✅ Signup Button */}
                                    <button type="submit" className='mt-4 btn-sign'>Sign up</button>

                                    <p className='m-0 pt-2 pb-2 text-center'>Or</p>

                                    {/* ✅ Google Signup Button */}
                                    <button
                                        className='btn-sign btn-google'
                                        onClick={() => window.open('https://accounts.google.com/signup', '_blank')}
                                    >
                                        <img className='img-set' src='/images/google.png' alt="Google" />
                                        Sign up with Google
                                    </button>

                                    {/* ✅ Already have an account */}
                                    <div className='box-end'>
                                        <p className='mt-2 mr-2 mb-0 account-txt'>Already have an account?</p>
                                        <Link className='mb-0 mt-2 sign-txt link-line' to='/login'>Login</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Right Side Background Image */}
                    <div className='col-6 box-back'>
                        <img className='vec-img' src='/images/onlyvector.png' alt="Background" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;
