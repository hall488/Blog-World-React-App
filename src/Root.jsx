import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Login from './components/Forms/Login';
import Signup from './components/Forms/Signup';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CreateCategory from './components/Forms/CreateCategory';

library.add(faPlus);

function Root() {
    let [currentUser, setCurrentUser] = useState(null);
    let [formErrors, setFormErrors] = useState([]);
    let [menuType, setMenuType] = useState('Categories');
    const [menuItems, setMenuItems] = useState([]);
    let [show, setShow] = useState({
        login: false,
        signup: false,
        createArticle: false,
        createCategory: false,
        delete: false,
    });

    useEffect(() => {
        checkForUser();
    }, []);

    const checkForUser = () => {
        verifyUser().then(json => {
            if (json.id !== undefined) {
                setCurrentUser(json);
            } else {
                setCurrentUser(null);
            }
        });
    };

    const verifyUser = async () => {
        let token = localStorage.getItem('token');

        const data = new URLSearchParams();
        data.append('token', token);

        let response = await fetch(`https://bw.christopherh.org/users/verify`, {
            method: 'post',
            mode: 'cors',
            body: data,
        });

        const json = await response.json();

        return json;
    };

    const handleShow = (type, bool) => {
        if (bool) {
            const _show = structuredClone(show);
            Object.keys(_show).forEach(v => (_show[v] = false));
            setShow({ ..._show, [type]: bool });
        } else {
            setShow({ ...show, [type]: bool });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        checkForUser();
    };

    const getFormData = target => {
        const data = new URLSearchParams();
        for (const pair of new FormData(target)) {
            data.append(pair[0], pair[1]);
        }

        return data;
    };

    const handleLogin = async e => {
        e.preventDefault();

        let data = getFormData(e.target);

        const response = await fetch(
            `https://bw.christopherh.org/users/login`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        const json = await response.json();

        if (json.errors !== undefined) {
            setFormErrors(json.errors);
        } else {
            handleShow('login', false);
            localStorage.setItem('token', json.token);
            e.target.reset();
            checkForUser();
        }
    };

    const handleSignup = async e => {
        e.preventDefault();

        let data = getFormData(e.target);

        const response = await fetch(
            `https://bw.christopherh.org/users/signup`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        const json = await response.json();

        if (json.errors !== undefined) {
            setFormErrors(json.errors);
        } else {
            handleShow('signup', false);
            localStorage.setItem('token', json.token);
            e.target.reset();
            checkForUser();
        }
    };

    const navigate = useNavigate();

    const navigateTo = path => {
        navigate(`/Blog-World-React-App/${path}`);
    };

    return (
        <>
            <div
                className={`${
                    Object.values(show).some(Boolean) ? styles.blur : ''
                } ${styles.content}`}
            >
                <Header
                    handleLogout={handleLogout}
                    handleShow={handleShow}
                    currentUser={currentUser}
                    navigateTo={navigateTo}
                />
                <Outlet
                    context={{
                        currentUser,
                        menuType,
                        setMenuType,
                        navigateTo,
                        menuItems,
                        setMenuItems,
                        handleShow,
                        show,
                    }}
                />
            </div>

            <Login
                setFormErrors={setFormErrors}
                formErrors={formErrors}
                currentUser={currentUser}
                showLogin={show.login}
                handleLogin={handleLogin}
                handleShow={handleShow}
            />

            <Signup
                setFormErrors={setFormErrors}
                formErrors={formErrors}
                currentUser={currentUser}
                showSignup={show.signup}
                handleSignup={handleSignup}
                handleShow={handleShow}
            />

            <CreateCategory
                setFormErrors={setFormErrors}
                formErrors={formErrors}
                currentUser={currentUser}
                showCreateCategory={show.createCategory}
                handleShow={handleShow}
                navigateTo={navigateTo}
            />
        </>
    );
}

export default Root;
