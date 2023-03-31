import { useState } from "react";
import Posts from "./Posts";
import { useCookies } from 'react-cookie';

const Login = () => {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [cookie, setCookie] = useCookies();

    function handle(e) {
        const n = { ...form };
        n[e.target.name] = e.target.value;
        setForm(n);
    }

    async function login() {
        await fetch('http://localhost:8000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.res === '0') {
                    setCookie('id', res.id);
                    alert("Logged In successfully.");
                    window.location.href = "/posts"
                }
                else if (res.res === '1') {
                    alert("Wrong Password");
                }
                else if (res.res === '-1') {
                    alert("No such user exists");
                }
            });
    }

    return (
        <div>
            <h1>Login</h1>
            <input required type="text" name="username" placeholder="Your username" onChange={(e) => handle(e)} />
            <input required type="password" name="password" placeholder="Your Password" onChange={(e) => handle(e)} />
            <input type="button" value="Login" onClick={login} />
        </div>
    )
}

export default Login;