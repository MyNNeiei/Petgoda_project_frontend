"use client";
import { useEffect } from "react";
import "./styles.css";
// import Image from "next/image";

export default function LoginPage() {
    // useEffect(() => {
    //     // นำเข้า JavaScript
    //     import("./scripts.js");
    // }, []);

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
                <label>
                    <div className="fa fa-phone"></div>
                    <input className="username" type="text" autoComplete="on" placeholder="username" />
                </label>
                <label>
                    <div className="fa fa-commenting"></div>
                    <input className="password" type="password" autoComplete="off" placeholder="password" />
                </label>
                <button className="login-button">Login</button>
                <p className="mt-4 text-sm">
                    Don't have an account?{" "}
                    <a href="/register/" className="text-[#243946] font-bold">Register</a>
                </p>
            </div>
        </main>
    );
}
