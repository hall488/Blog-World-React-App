import styles from './Login.module.css';

function Login({
    setFormErrors,
    formErrors,
    currentUser,
    showLogin,
    handleLogin,
    handleShow,
}) {
    return (
        <div
            style={{
                display: !currentUser && showLogin ? 'flex' : 'none',
            }}
            className={styles.login}
        >
            <div className={styles.wrapper}>
                <button
                    className={styles.exit}
                    onClick={() => {
                        setFormErrors([]);
                        handleShow('login', false);
                    }}
                >
                    X
                </button>
                <form onSubmit={handleLogin} action="">
                    <label htmlFor="username">Username</label>
                    <input
                        name="username"
                        type="text"
                        onChange={() => {
                            if (formErrors.length != 0) setFormErrors([]);
                        }}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        onChange={() => {
                            if (formErrors.length != 0) setFormErrors([]);
                        }}
                    />
                    {formErrors.map(e => (
                        <div className={styles.errors} key={e.path}>
                            {e.msg}
                        </div>
                    ))}
                    <button>Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
