import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>ECELL ASSIGNMENT</h1>
            <Link to='/register'>
                <input type="button" value="Register" />
            </Link>
            <Link to='/login'>
                <input type="button" value="Login" />
            </Link>
        </div>
    )
}

export default Home;