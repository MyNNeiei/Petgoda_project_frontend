"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import "./styles.css";
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

            // ✅ Store token in localStorage
            localStorage.setItem("token", token);

            // ✅ Redirect to the profile page
            router.push("/profile");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid login credentials.");
        }
    };

    return (
        <main className="center">
            <div className="ear ear--left"></div>
            <div className="ear ear--right"></div>
            <div class="face">
                <div class="eyes">
                    <div class="eye eye--left">
                        <div class="glow"></div>
                    </div>
                    <div class="eye eye--right">
                        <div class="glow"></div>
                    </div>
                </div>
                <div class="nose">
                    <svg width="38.161" height="22.03">
                        <path
                            d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z"
                            fill="#243946"></path>
                    </svg>
                    <div class="glow"></div>
                </div>
                <div class="mouth">
                    <svg class="smile" viewBox="-2 -2 84 23" width="84" height="23">
                        <path d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161"
                            fill="none" stroke-width="3" stroke-linecap="square" stroke-miterlimit="3"></path>
                    </svg>
                    <div class="mouth-hole"></div>
                    <div class="tongue breath">
                        <div class="tongue-top"></div>
                        <div class="line"></div>
                        <div class="median"></div>
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
