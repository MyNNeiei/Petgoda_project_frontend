"use client";
import { useState } from "react";
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
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // ฟังก์ชันนี้ใช้จัดการตอนกด submit ฟอร์ม
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // ทำ logic ส่งข้อมูลได้ตรงนี้
    };

    return (
        <main className="form-container w-full text-center">
            <h2 className="text-3xl font-bold text-[#243946] mb-4">Register</h2>
            <form className="space-y-3 grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
                <input name="username" type="text" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Username" required onChange={handleChange} />
                <input name="email" type="email" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Email" required onChange={handleChange} />
                <input name="password1" type="password" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Password" required onChange={handleChange} />
                <input name="password2" type="password" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Confirm Password" required onChange={handleChange} />
                <input name="firstname" type="text" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="First Name" required onChange={handleChange} />
                <input name="lastname" type="text" className="input-field w-full p-2 rounded-lg border focus:outline-none" placeholder="Last Name" required onChange={handleChange} />
                <input name="birthdate" type="date" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange} />
                <select name="gender" className="input-field w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange}>
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select name="role" className="input-field w-full p-2 rounded-lg border focus:outline-none" required onChange={handleChange}>
                    <option value="">Role</option>
                    <option value="petowner">Pet Owner</option>
                    <option value="hoteladmin">Hotel Admin</option>
                </select>
                <input name="phone" type="tel" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" placeholder="Phone Number" required onChange={handleChange} />
                <input name="profileImg" type="file" className="input-field col-span-2 w-full p-2 rounded-lg border focus:outline-none" onChange={handleChange} />
                <button type="submit" className="register-btn col-span-2 w-full p-3 bg-[#243946] text-white rounded-lg font-bold transition-all">Register</button>
            </form>
            <p className="mt-3 text-sm">Already have an account? <a href="/login/" className="text-[#243946] font-bold">Login</a></p>
        </main>
    );
}
