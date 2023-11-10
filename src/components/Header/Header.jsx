import styles from './Header.module.css';

function Header({ handleLogout, handleShow, currentUser, navigateTo }) {
    return (
        <div className={styles.header}>
            <div
                className={`${styles.logo}  ${styles.shift}`}
                onClick={() => {
                    navigateTo('');
                }}
            >
                Blog World
            </div>
            <div
                style={{ display: currentUser ? 'flex' : 'none' }}
                className={styles.welcome}
            >
                Welcome {currentUser ? currentUser.username : ''}
            </div>
            <div className={styles.buttons}>
                <button
                    style={{ display: !currentUser ? 'flex' : 'none' }}
                    onClick={() => {
                        handleShow('login', true);
                    }}
                >
                    Login
                </button>
                <button
                    style={{ display: !currentUser ? 'flex' : 'none' }}
                    onClick={() => {
                        handleShow('signup', true);
                    }}
                >
                    Signup
                </button>
                <button
                    style={{ display: currentUser ? 'flex' : 'none' }}
                    onClick={() => {
                        navigateTo(`User/${currentUser.id}`);
                    }}
                >
                    My Articles
                </button>
                <button
                    style={{ display: currentUser ? 'flex' : 'none' }}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Header;
