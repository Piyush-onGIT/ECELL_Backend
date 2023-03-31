import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Posts = () => {
    const [posts, setPost] = useState([]);
    const [users, setUsers] = useState([]);
    const [cookie, setCookie] = useCookies();
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState(false);
    const [upload, setUpload] = useState(false);
    const [form, setForm] = useState({
        title: "",
        content: ""
    });

    const [form1, setForm1] = useState({
        user: cookie['id'],
        title: "",
        content: ""
    });

    const [form2, setForm2] = useState({
        id: ""
    });

    useEffect(() => {
        async function getUsers() {
            await fetch('http://localhost:8000/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(res => {
                    setUsers(res);
                });
        }
        getUsers();
    }, [users.length]);

    function handle(e) {
        const ndata = { ...form };
        ndata[e.target.name] = e.target.value;
        setForm(ndata);
    }

    function handle1(e) {
        const ndata = { ...form1 };
        ndata[e.target.name] = e.target.value;
        setForm1(ndata);
    }

    function handle2(e) {
        const ndata = { ...form2 };
        ndata[e.target.name] = e.target.value;
        setForm2(ndata);
    }

    async function create() {
        await fetch('http://localhost:8000/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form1)
        })
            .then(res => res.json())
            .then(res => {
                if (res === 0) {
                    alert("Uploaded");
                    window.location.reload();
                }
                else {
                    alert("Error");
                    window.location.reload();
                }
            });
    }

    async function delPost(id) {
        const obj = {
            id: id
        };
        await fetch('http://localhost:8000/delPost', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                if (res === 0) {
                    alert("Deleted");
                    window.location.reload();
                }
                else {
                    alert("Error");
                    window.location.reload();
                }
            });
    }

    async function editPost(id) {
        form.id = id;
        await fetch('http://localhost:8000/editPost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(res => {
                if (res === 0) {
                    alert("Edited");
                    window.location.reload();
                }
                else {
                    alert("Error");
                    window.location.reload();
                }
            });
    }

    function showPosts(val) {
        // if (!val) {
            return posts.map(p => {
                const id = p.user;
                var name = "";
                for (let i = 0; i < users.length; i++) {
                    if (users[i].id === id) {
                        if (id.toString() === cookie['id']) {
                            name = "You";
                        }
                        else {
                            name = users[i].username;
                        }
                        break;
                    }
                }
                return (
                    <div>
                        <h2>
                            {p.title}
                        </h2>
                        {p.content}
                        <br />
                        Author: {name}
                        {name === "You" ?
                            <div>
                                <input type="button" value={edit ? "Cancel" : "Edit"} onClick={() => { setEdit(!edit) }} />
                                {edit ? <div>
                                    <form>
                                        <input type="text" placeholder="New Title" name="title" onChange={(e) => handle(e)} />
                                        <br />
                                        <textarea type="text" placeholder="New Content" name="content" onChange={(e) => handle(e)} />
                                        <br />
                                        <input type="button" value="Save" onClick={() => { editPost(p.id) }} />
                                    </form>
                                </div> : <></>}
                                <input type="button" value="Delete" onClick={() => { delPost(p.id) }} />
                            </div>
                            : <></>
                        }
                    </div>
                )
            })
        // }
        // else {

        // }
    }

    async function filterFunc() {
        await fetch('http://localhost:8000/filter', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form2)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setPost(res);
            })
    }

    async function allPosts() {
        await fetch('http://localhost:8000/posts', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setPost(res);
            })
    }

    return (
        <div>
            <h1>
                All posts
            </h1>
            <input type="button" value={upload ? "Cancel" : "Create Post"} onClick={() => { setUpload(!upload) }} />
            {upload ? <div>
                <form>
                    <input type="text" placeholder="New Title" name="title" onChange={(e) => handle1(e)} />
                    <br />
                    <textarea type="text" placeholder="New Content" name="content" onChange={(e) => handle1(e)} />
                    <br />
                    <input type="button" value="Upload" onClick={create} />
                </form>
            </div> : <></>}
            <div>
                <input type="button" value={filter ? "Cancel" : "Apply filter"} onClick={() => { setFilter(!filter) }} />
                {filter ? <div>
                    <form>
                        <input type="text" placeholder="User Id" name="id" onChange={(e) => handle2(e)} />
                        <input type="button" value="Apply" onClick={filterFunc} />
                    </form>
                </div> : <></>}
            </div>
            <div>
                {showPosts(filter)}
            </div>
            <div>
                <input type="button" value="Show All" onClick={allPosts} />
            </div>
        </div>
    )
}

export default Posts;