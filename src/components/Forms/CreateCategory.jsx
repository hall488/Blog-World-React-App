import styles from './CreateCategory.module.css';

function CreateCategory({
    setFormErrors,
    formErrors,
    currentUser,
    showCreateCategory,
    handleShow,
    navigateTo,
}) {
    const handleCreateCategory = async e => {
        e.preventDefault();

        const data = new URLSearchParams();
        for (const pair of new FormData(e.target)) {
            data.append(pair[0], pair[1]);
        }

        data.append('token', localStorage.getItem('token'));

        const response = await fetch(
            `http://localhost:5000/categories/create`,
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
            navigateTo(`Category/${json.id}`);
            handleShow('createCategory', false);
        }
    };

    return (
        <div
            style={{
                display: currentUser && showCreateCategory ? 'flex' : 'none',
            }}
            className={styles.createCategory}
        >
            <div className={styles.wrapper}>
                <button
                    className={styles.exit}
                    onClick={() => {
                        setFormErrors([]);
                        handleShow('createCategory', false);
                    }}
                >
                    X
                </button>
                <form onSubmit={handleCreateCategory} action="">
                    <label htmlFor="name">Category</label>
                    <input
                        name="name"
                        type="text"
                        onChange={() => {
                            if (formErrors.length != 0) setFormErrors([]);
                        }}
                    />
                    {formErrors.map(e => (
                        <div className={styles.errors} key={e.path}>
                            {e.msg}
                        </div>
                    ))}
                    <button>Create</button>
                </form>
            </div>
        </div>
    );
}

export default CreateCategory;
