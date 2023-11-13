import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './User.module.css';
import Globe from '../Globe/Globe';

function User() {
    let { id } = useParams();
    let { menuType, setMenuType, setMenuItems, currentUser, navigateTo } =
        useOutletContext();

    useEffect(() => {
        getUserArticles(id).then(res => {
            setMenuType(res.username);
            setMenuItems(res.articles);
        });
    }, []);

    const getUserArticles = async id => {
        const response = await fetch(
            `https://bw.christopherh.org/users/${id}`,
            {
                method: 'get',
                mode: 'cors',
            },
        );

        const json = await response.json();

        return json;
    };
    return (
        <div className={styles.menu}>
            <div className={styles.title}>
                {currentUser && currentUser.id == id
                    ? 'My Articles'
                    : `${menuType}'s Articles`}
                <button
                    style={{
                        display:
                            currentUser && currentUser.id == id
                                ? 'flex'
                                : 'none',
                    }}
                    onClick={() => {
                        navigateTo('Article/create');
                    }}
                    className={styles.add}
                >
                    Add Article
                </button>
            </div>
            <Globe />
        </div>
    );
}

export default User;
