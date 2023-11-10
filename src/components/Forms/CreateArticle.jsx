import styles from './CreateArticle.module.css';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TipTap from '../TipTap/TipTap';

function CreateArticle() {
    const { currentUser, navigateTo } = useOutletContext();
    const [categories, setCategories] = useState([]);
    const [formErrors, setFormErrors] = useState([]);
    const editorRef = useRef(() => {});

    useEffect(() => {
        getCategories().then(res => {
            setCategories(res);
        });
    }, []);

    const getCategories = async () => {
        const response = await fetch(
            `http://bw.christopherh.org/categories/list`,
            {
                method: 'get',
                mode: 'cors',
            },
        );

        const json = await response.json();

        return json;
    };

    const handleCreateArticle = async e => {
        e.preventDefault();

        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1]);
        }

        data.append('text', JSON.stringify(editorRef.current().getJSON()));

        const response = await fetch(
            `http://bw.christopherh.org/articles/create`,
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
            navigateTo(`Article/${json.id}`);
        }
    };

    const getJson = cb => {
        editorRef.current = cb;
    };

    return (
        <div className={styles.createArticle}>
            <form onSubmit={handleCreateArticle} action="">
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
                    onChange={() => {
                        if (formErrors.length != 0) setFormErrors([]);
                    }}
                />
                <label htmlFor="category">Category</label>
                <select
                    name="category"
                    onChange={() => {
                        if (formErrors.length != 0) setFormErrors([]);
                    }}
                >
                    {categories.map(c => (
                        <option key={c._id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <TipTap getJson={getJson} type={'article'} />
                {formErrors.map((e, index) => (
                    <div className={styles.errors} key={index}>
                        {e.msg}
                    </div>
                ))}
                <button>Create</button>
            </form>
        </div>
    );
}

export default CreateArticle;
