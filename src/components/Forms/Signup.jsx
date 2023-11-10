import styles from './Signup.module.css';

function Signup({
    setFormErrors,
    formErrors,
    currentUser,
    showSignup,
    handleSignup,
    handleShow,
}) {
    return (
        <div
            style={{
                display: !currentUser && showSignup ? 'flex' : 'none',
            }}
            className={styles.signup}
        >
            <div className={styles.wrapper}>
                <button
                    className={styles.exit}
                    onClick={() => {
                        setFormErrors([]);
                        handleShow('signup', false);
                    }}
                >
                    X
                </button>
                <form onSubmit={handleSignup} action="">
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
                    <label htmlFor="password_confirm">Confirm Password</label>
                    <input
                        name="password_confirm"
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
                    <button>Signup</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
