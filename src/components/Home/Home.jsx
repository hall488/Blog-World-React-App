import styles from './Home.module.css';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import Globe from '../Globe/Globe';

function Home() {
    const { setMenuItems, currentUser, handleShow } = useOutletContext();

    useEffect(() => {
        getCategories().then(res => {
            setMenuItems(res);
        });
    }, []);

    const getCategories = async () => {
        const response = await fetch(`http://localhost:5000/categories/list`, {
            method: 'get',
            mode: 'cors',
        });

        const json = await response.json();

        return json;
    };

    return (
        <div className={styles.menu}>
            <div className={styles.title}>
                Categories
                <button
                    style={{ display: currentUser ? 'flex' : 'none' }}
                    className={styles.add}
                    onClick={() => {
                        handleShow('createCategory', true);
                    }}
                >
                    Add Category
                </button>
            </div>
            <Globe />
        </div>
    );
}

export default Home;
