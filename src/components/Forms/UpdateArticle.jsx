import styles from './UpdateArticle.module.css';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import TipTap from '../TipTap/TipTap';

function UpdateArticle() {
    const { currentUser, navigateTo } = useOutletContext();
    const [categories, setCategories] = useState([]);
    const editorRef = useRef(() => {});
    const [formErrors, setFormErrors] = useState([]);
    let { id } = useParams();
    let [article, setArticle] = useState({
        title: '',
        category: '',
        user: { username: '' },
        likes: [],
        text: '',
        comments: [],
    });

    useEffect(() => {
        getCategories().then(res => {
            setCategories(res);
        });
        getArticle().then(res => {
            setArticle(res);
            console.log(res.text);
        });
    }, []);

    const getCategories = async () => {
        const response = await fetch(
            `https://bw.christopherh.org/categories/list`,
            {
                method: 'get',
                mode: 'cors',
            },
        );

        const json = await response.json();

        return json;
    };

    const getArticle = async () => {
        const response = await fetch(
            `https://bw.christopherh.org/articles/${id}`,
            {
                method: 'get',
                mode: 'cors',
            },
        );

        const json = await response.json();

        return json;
    };

    const handleUpdateArticle = async e => {
        e.preventDefault();

        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1]);
        }

        data.append('text', JSON.stringify(editorRef.current().getJSON()));

        const response = await fetch(
            `https://bw.christopherh.org/articles/${id}/update`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        let json = await response.json();

        if (json.errors !== undefined) {
            setFormErrors(json.errors);
        } else {
            navigateTo(`Article/${id}`);
        }
    };

    const getJson = cb => {
        editorRef.current = cb;
    };

    return (
        <div className={styles.updateArticle}>
            <form onSubmit={handleUpdateArticle} action="">
                <input
                    name="user"
                    type="hidden"
                    value={currentUser ? currentUser.id : ''}
                />
                <input
                    name="token"
                    type="hidden"
                    value={localStorage.getItem('token')}
                />
                <label htmlFor="title">Title</label>
                <input
                    name="title"
                    onChange={e => {
                        if (formErrors.length != 0) setFormErrors([]);
                        setArticle({ ...article, title: e.target.value });
                    }}
                    value={article.title}
                />
                <label htmlFor="category">Category</label>
                <select
                    name="category"
                    value={article.category.name}
                    onChange={e => {
                        if (formErrors.length != 0) setFormErrors([]);
                        setArticle({ ...article, category: e.target.value });
                    }}
                >
                    {categories.map(c => (
                        <option key={c._id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <TipTap getJson={getJson} type={'article'} filler={article} />
                {formErrors.map((e, index) => (
                    <div className={styles.errors} key={index}>
                        {e.msg}
                    </div>
                ))}
                <button>Update</button>
            </form>
        </div>
    );
}

export default UpdateArticle;
