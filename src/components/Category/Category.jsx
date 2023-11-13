import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './Category.module.css';
import Globe from '../Globe/Globe';

function Category() {
    let { id } = useParams();
    let { menuType, setMenuType, setMenuItems, currentUser, navigateTo } =
        useOutletContext();

    useEffect(() => {
        getCategoryArticles(id).then(res => {
            setMenuType(res.name);
            setMenuItems(res.articles);
        });
    }, []);

    const getCategoryArticles = async id => {
        const response = await fetch(
            `https://bw.christopherh.org/categories/${id}`,
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
                <div
                    className={styles.back}
                    onClick={() => {
                        navigateTo('/');
                    }}
                >
                    Back to Categories
                </div>
                {menuType}
                <button
                    style={{ display: currentUser ? 'flex' : 'none' }}
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

export default Category;
