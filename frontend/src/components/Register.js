import { useState } from "react";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    function handle(e) {
        const n = { ...form };
        n[e.target.name] = e.target.value;
        setForm(n);
    }

    async function register() {
        await fetch('http://localhost:8000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(res => {
                if (res === 0) {
                    alert("Account created");
                }
                else if (res === -1) {
                    alert("User already exists");
                }
            });
    }
    return (
        <div>
            <h1>Register</h1>
            <input required type="text" name="username" placeholder="Username" onChange={(e) => handle(e)} />
            <input required type="email" name="email" placeholder="Your email address" onChange={(e) => handle(e)} />
            <input required type="password" name="password" placeholder="Your Password" onChange={(e) => handle(e)} />
            <input type="button" value="Register" onClick={register} />
        </div>
    )
}

export default Register;