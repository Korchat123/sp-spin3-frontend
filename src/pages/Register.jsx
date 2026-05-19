import { useContext, useState } from "react"
import { UserContext } from "../context/userContext/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { usersInfo } from "../assets/usersInfo";

export default function Register() {
    const navigate = useNavigate();
    const { setMyUserInfo } = useContext(UserContext);

    // 1. Single state for all form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: "",
        email: ""
    });

    // 2. State for validation feedback
    const [availability, setAvailability] = useState({
        username: "",
        email: ""
    });

    const [error, setError] = useState("");

    // 3. Check if username/email exists in our mock data
    const checkAvailability = (value, type) => {
        if (!value) {
            setAvailability(prev => ({ ...prev, [type]: "" }));
            return;
        }
        const exists = usersInfo.find((u) => u[type] === value);
        setAvailability(prev => ({
            ...prev,
            [type]: exists ? "alreadyExists" : "available"
        }));
    };

    // 4. Generic handle change for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Trigger availability check for specific fields
        if (name === "username" || name === "email") {
            checkAvailability(value, name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        setError("");

        // Validation Logic
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (availability.username === "alreadyExists" || availability.email === "alreadyExists") {
            setError("Please resolve the username/email conflicts.");
            return;
        }

        // Create new user object
        const newUser = {
            ...formData,
            role: "customer" // Default role
        };

        // For this mock app: Update context and navigate
        console.log("Registering User:", newUser);
        setMyUserInfo(newUser);
        alert("Registration Successful!");
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-w-full bg-secondary">
            <form onSubmit={handleSubmit} className="flex flex-col justify-evenly items-center content-evenly bg-neutral min-h-[80vh] m-[10vh] p-8 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-4">Register</h1>

                {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

                <div className="flex flex-col gap-4 w-full max-w-md">
                    <span>
                        Username: 
                        <input 
                            name="username" 
                            className="border w-full p-2 rounded" 
                            type="text" 
                            minLength="6"
                            maxLength="12" 
                            required 
                            value={formData.username} 
                            onChange={handleChange} 
                        />
                        {availability.username === "alreadyExists" && <span className="text-red-500 text-sm">Username taken</span>}
                        {availability.username === "available" && <span className="text-green-500 text-sm">Available!</span>}
                    </span>

                    <span>
                        Email: 
                        <input 
                            name="email" 
                            className="border w-full p-2 rounded" 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        {availability.email === "alreadyExists" && <span className="text-red-500 text-sm">Email already registered</span>}
                    </span>

                    <div className="flex gap-2">
                        <span>
                            Name: 
                            <input name="name" className="border w-full p-2 rounded" type="text" required value={formData.name} onChange={handleChange} />
                        </span>
                        <span>
                            Surname: 
                            <input name="surname" className="border w-full p-2 rounded" type="text" required value={formData.surname} onChange={handleChange} />
                        </span>
                    </div>

                    <span>
                        Password: 
                        <input 
                            name="password" 
                            className="border w-full p-2 rounded" 
                            type="password" 
                            required 
                            minLength="6" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </span>

                    <span>
                        Confirm Password: 
                        <input 
                            name="confirmPassword" 
                            className="border w-full p-2 rounded" 
                            type="password" 
                            required 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                        />
                    </span>
                </div>

                <button type="submit" className="mt-6 w-[20vh] bg-secondary hover:bg-accent text-neutral px-6 py-2 rounded-lg font-semibold transition duration-300 cursor-pointer">
                    Submit
                </button>

                <span className="mt-4 hover:text-secondary text-blue-500 font-bold">
                    <Link to="/login">Have an account? Click here to login</Link>
                </span>
            </form>
        </div>
    );
}
