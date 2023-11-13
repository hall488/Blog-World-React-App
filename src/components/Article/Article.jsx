import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import styles from './Article.module.css';
import { useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import hrp from 'html-react-parser';
import TipTap from '../TipTap/TipTap';

function Category() {
    let { id } = useParams();
    let { currentUser, navigateTo } = useOutletContext();
    let [leaveAComment, setLeaveAComment] = useState(false);
    let [showDelete, setShowDelete] = useState(false);
    let [deleteErrors, setDeleteErrors] = useState([]);
    const editorRef = useRef(() => {});
    let [article, setArticle] = useState({
        title: '',
        user: { username: '' },
        likes: [],
        text: '',
        comments: [],
    });

    useEffect(() => {
        getArticle(id).then(res => {
            setArticle(res);
        });
    }, []);

    const getArticle = async id => {
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

    const extensions = [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false,
            },
        }),
    ];

    function GenText() {
        const output = useMemo(() => {
            if (article.text == '') {
                return '';
            } else {
                return generateHTML(
                    JSON.parse(
                        article.text
                            .replace(/&quot;/gi, '"')
                            .replace(/&#x5C;n/gi, `\\n`)
                            .replace(/&gt;/gi, `>`)
                            .replace(/&lt;/gi, `<`),
                    ),
                    extensions,
                );
            }
        }, []);

        return <div>{hrp(output)}</div>;
    }

    const handleDeleteComment = async (e, cid) => {
        e.preventDefault();
        const data = new URLSearchParams();

        data.append('token', localStorage.getItem('token'));

        const response = await fetch(
            `https://bw.christopherh.org/articles//${id}/comments/${cid}/delete`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        await response.json();

        window.location.reload();
    };

    function GenComment(comment) {
        const output = () => {
            if (comment == '') {
                return '';
            } else {
                return generateHTML(
                    JSON.parse(
                        comment.text
                            .replace(/&quot;/gi, '"')
                            .replace(/&#x5C;n/gi, `\\n`)
                            .replace(/&gt;/gi, `>`)
                            .replace(/&lt;/gi, `<`),
                    ),
                    extensions,
                );
            }
        };

        return (
            <>
                <div className={styles.cUsername}>
                    {comment.user.username}{' '}
                    <button
                        style={{
                            display:
                                currentUser &&
                                currentUser.id == comment.user._id
                                    ? 'flex'
                                    : 'none',
                        }}
                        className={styles.exit}
                        onClick={e => {
                            handleDeleteComment(e, comment._id);
                        }}
                    >
                        X
                    </button>
                </div>
                {hrp(output())}
            </>
        );
    }

    const handleLike = async e => {
        e.preventDefault();
        const data = new URLSearchParams();
        data.append('token', localStorage.getItem('token'));

        const response = await fetch(
            `https://bw.christopherh.org/articles/${id}/like`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        await response.json();

        window.location.reload();
    };

    const getJson = cb => {
        editorRef.current = cb;
    };

    const handleLeaveAComment = () => {
        setLeaveAComment(!leaveAComment);
    };

    const handleComment = async e => {
        e.preventDefault();
        const data = new URLSearchParams();

        data.append('token', localStorage.getItem('token'));
        data.append('text', JSON.stringify(editorRef.current().getJSON()));

        const response = await fetch(
            `https://bw.christopherh.org/articles/${id}/comments/create`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        await response.json();

        setLeaveAComment(false);
        window.location.reload();
    };

    const handleDeleteBox = () => {
        setShowDelete(!showDelete);
    };

    const handleDelete = async e => {
        e.preventDefault();
        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1]);
        }

        data.append('token', localStorage.getItem('token'));

        const response = await fetch(
            `https://bw.christopherh.org/articles/${id}/delete`,
            {
                method: 'post',
                mode: 'cors',
                body: data,
            },
        );

        let json = await response.json();

        if (json.errors !== undefined) {
            setDeleteErrors(json.errors);
        } else {
            navigateTo('');
        }
    };

    return (
        <>
            <div
                className={`${styles.article} ${showDelete ? styles.blur : ''}`}
            >
                <div className={styles.title}>{article.title}</div>
                <div
                    className={styles.author}
                    onClick={() => {
                        navigateTo(`User/${article.user._id}`);
                    }}
                >
                    {' '}
                    by {article.user.username}
                </div>
                <div className={styles.likes}>
                    Likes: {article.likes.length}
                </div>
                <div className="">
                    {currentUser && article.likes.includes(currentUser.id)
                        ? 'You liked this!'
                        : ''}
                </div>
                <div className={styles.text}>
                    <GenText />
                </div>
                <div
                    style={{ display: currentUser ? 'flex' : 'none' }}
                    className={styles.actions}
                >
                    <button onClick={handleLike}>Like</button>
                    <button onClick={handleLeaveAComment}>Comment</button>
                    <button
                        onClick={() => {
                            navigateTo(`Article/${id}/update`);
                        }}
                        style={{
                            display:
                                currentUser &&
                                currentUser.id == article.user._id
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteBox}
                        style={{
                            display:
                                currentUser &&
                                currentUser.id == article.user._id
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        Delete
                    </button>
                </div>
                <form
                    className={styles.leaveComment}
                    style={{
                        display: leaveAComment ? 'flex' : 'none',
                    }}
                >
                    <TipTap getJson={getJson} />
                    <button onClick={handleComment}>Submit</button>
                </form>
                <ul className={styles.comments}>
                    {article.comments.map(comment => (
                        <li key={comment._id}>{GenComment(comment)}</li>
                    ))}
                </ul>
            </div>
            <div
                style={{
                    display: showDelete ? 'flex' : 'none',
                }}
                className={styles.delete}
            >
                <div className={styles.wrapper}>
                    <button
                        className={styles.exit}
                        onClick={() => {
                            handleDeleteBox();
                        }}
                    >
                        X
                    </button>
                    <form onSubmit={handleDelete} action="">
                        <label htmlFor="title">
                            Type the Title of the Article to Delete
                        </label>
                        <input
                            name="title"
                            type="text"
                            onChange={() => {
                                if (deleteErrors.length != 0)
                                    setDeleteErrors([]);
                            }}
                        />
                        {deleteErrors.map((e, index) => (
                            <div className={styles.errors} key={index}>
                                {e.msg}
                            </div>
                        ))}
                        <button>Delete</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Category;
