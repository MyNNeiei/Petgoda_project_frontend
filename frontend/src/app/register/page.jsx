"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
// useState เป็น hook ที่ช่วยให้ component ใน React สามารถจัดการ state ได้ โดย state คือข้อมูลที่เปลี่ยนแปลงได้และมีผลต่อการ render UI นั่นเอง
import "./styles.css";
// import Image from "next/image";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        gender: '',
        role: '',
        phone: '',
        profileImg: null,
    });

    // ฟังก์ชันนี้ใช้สำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // ✅ Validate Passwords Match
        if (formData.password1 !== formData.password2) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const dataToSend = new FormData(); // ✅ Use FormData for file upload
            Object.keys(formData).forEach((key) => {
                dataToSend.append(key, formData[key]);
            });

            console.log("Submitting data:", formData); // ✅ Debugging

            const response = await axiosInstance.post("api/register/", dataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data", // ✅ Required for file uploads
                },
            });

            console.log("Registration successful:", response.data);
            setSuccess("Registration successful! Redirecting...");
            
            // ✅ Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push("api/login");
            }, 2000);
        } catch (error) {
            console.log("Registration error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to register. Please try again.");
        }
    };

    return (
        <main className="form-container w-full text-center">
            <h2 className="text-3xl font-bold text-[#243946] mb-4">Register</h2>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
            <form className="space-y-3 grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
                <input name="username" type="text" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Username" required onChange={handleChange} />
                <input name="email" type="email" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Email" required onChange={handleChange} />
                <input name="password" type="password" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Password" required onChange={handleChange} />
                <input name="confirm_password" type="password" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Confirm Password" required onChange={handleChange} />
                <input name="firstname" type="text" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="First Name" required onChange={handleChange} />
                <input name="lastname" type="text" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Last Name" required onChange={handleChange} />
                <input name="birth_date" type="date" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange} />
                <select name="gender" className="input-field w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange}>
                    <option value="">Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                </select>
                {/* <select name="role" className="input-field w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange}>
                    <option value="">Role</option>
                    <option value="petowner">Pet Owner</option>
                    <option value="hoteladmin">Hotel Admin</option>
                </select> */}
                <input name="phone_number" type="tel" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Phone Number" required onChange={handleChange} />
                <button type="submit" className="register-btn col-span-2 w-full p-3 bg-[#243946] text-white rounded-lg font-bold transition-all">Register</button>
            </form>
            <p className="mt-3 text-sm">Already have an account? <a href="/login/" className="text-[#243946] font-bold">Login</a></p>
        </main>
    );
}
