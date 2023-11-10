import { useState, useEffect } from 'react';
import './App.css';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Login from './components/Forms/Login';
import Signup from './components/Forms/Signup';
import Globe from './components/Globe/Globe';
import Option from './components/Globe/Option';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);

function App() {
    let [currentUser, setCurrentUser] = useState(null);
    let [showLogin, setShowLogin] = useState(false);
    let [showSignup, setShowSignup] = useState(false);
    let [formErrors, setFormErrors] = useState([]);
    let [menuType, setMenuType] = useState('Categories');

    let titles = ['Categories', 'Articles'];
    let titleIndex = 0;

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

        let response = await fetch(`http://bw.christopherh.org/users/verify`, {
            method: 'post',
            mode: 'cors',
            body: data,
        });

        const json = await response.json();

        return json;
    };

    const handleShowLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    };

    const handleHideLogin = () => {
        setShowLogin(false);
    };

    const handleShowSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };

    const handleHideSignup = () => {
        setShowSignup(false);
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

        const response = await fetch(`http://bw.christopherh.org/users/login`, {
            method: 'post',
            mode: 'cors',
            body: data,
        });

        const json = await response.json();

        if (json.errors !== undefined) {
            setFormErrors(json.errors);
        } else {
            handleHideLogin();
            localStorage.setItem('token', json.token);
            e.target.reset();
            checkForUser();
        }
    };

    const handleSignup = async e => {
        e.preventDefault();

        let data = getFormData(e.target);

        const response = await fetch(
            `http://bw.christopherh.org/users/signup`,
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
            handleHideSignup();
            localStorage.setItem('token', json.token);
            e.target.reset();
            checkForUser();
        }
    };

    const handleTitleLeft = () => {
        titleIndex++;

        if (titleIndex < 0) titleIndex = titles.length;
    };

    const handleTitleRight = () => {};

    checkForUser();

    return (
        <>
            <div
                className={`${showLogin || showSignup ? styles.blur : ''} ${
                    styles.content
                }`}
            >
                <Header
                    handleLogout={handleLogout}
                    handleShowLogin={handleShowLogin}
                    handleShowSignup={handleShowSignup}
                    currentUser={currentUser}
                />
                {/* <Select /> */}
                <div className={styles.menu}>
                    {/* <Option word={'abcdefghijklmnopqrstuvxyz'} /> */}
                    <div className={styles.title}>
                        {menuType}
                        <button className={styles.add}>Add Category</button>
                    </div>
                    <Globe setMenuType={setMenuType} />
                </div>
            </div>

            <Login
                setFormErrors={setFormErrors}
                formErrors={formErrors}
                currentUser={currentUser}
                showLogin={showLogin}
                handleLogin={handleLogin}
                handleHideLogin={handleHideLogin}
            />

            <Signup
                setFormErrors={setFormErrors}
                formErrors={formErrors}
                currentUser={currentUser}
                showSignup={showSignup}
                handleSignup={handleSignup}
                handleHideSignup={handleHideSignup}
            />
        </>
    );
}

export default App;
