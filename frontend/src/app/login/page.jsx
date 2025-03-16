"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import "./styles.css";
import { config } from "process";
// import Image from "next/image";

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset previous errors
    
        try {
            const response = await axiosInstance.post("/api/login/", formData);
            const token = response.data.token;
            
            if (!token) {
                throw new Error("No token received");
            }
    
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                id: response.data.user_id,
                username: response.data.username,
            }));
    
            // ✅ Ensure router is ready before pushing
            setTimeout(() => {
                router.replace("/");
            }, 100); 
    
            // ✅ Alternative: Reload the window to ensure the auth state updates
            setTimeout(() => {
                window.location.reload();
            }, 200);
    
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.non_field_errors?.[0] || "Invalid login credentials.");
        }
    };

    return (
        <main className="center">
            <div className="ear ear--left"></div>
            <div className="ear ear--right"></div>
            <div className="face">
                <div className="eyes">
                    <div className="eye eye--left">
                        <div className="glow"></div>
                    </div>
                    <div className="eye eye--right">
                        <div className="glow"></div>
                    </div>
                </div>
                <div className="nose">
                    <svg width="38.161" height="22.03">
                        <path
                            d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z"
                            fill="#243946"></path>
                    </svg>
                    <div className="glow"></div>
                </div>
                <div className="mouth">
                    <svg className="smile" viewBox="-2 -2 84 23" width="84" height="23">
                        <path d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161"
                            fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="3"></path>
                    </svg>
                    <div className="mouth-hole"></div>
                    <div className="tongue breath">
                        <div className="tongue-top"></div>
                        <div className="line"></div>
                        <div className="median"></div>
                    </div>
                </div>
            </div>
            <div className="login">
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-700 text-sm font-medium">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="on"
                            placeholder="Username"
                            required
                        />
                    </label>
                    <label className="block text-gray-700 text-sm font-medium">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Password"
                            required
                        />
                    </label>
                    <button type="submit" className="login-button">Login</button>
                    <p className="text-sm text-center mt-2">
                        Don't have an account?{" "}
                        <a href="/register/" className="text-[#243946] font-semibold hover:underline">Register</a>
                    </p>
                </form>
            </div>
        </main>
    );
}
