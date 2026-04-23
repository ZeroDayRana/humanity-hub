import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [dark, setDark] = useState(false);

    // 🔥 Load saved theme on first render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            setDark(true);
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // 🔥 Update theme when toggled
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className={`px-4 py-2 rounded ${dark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} transition-colors`}
        >
            {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
}

export default ThemeToggle;