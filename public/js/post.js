const blogFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#blog-name').value.trim();
    const body = document.querySelector('#blog-content').value.trim();

    if (title && body) {
        const response = await fetch('/api/blog', {
            method: 'POST',
            body: JSON.stringify({ title, body }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
};

const commentFormHandler = async (event) => {
    event.preventDefault();

    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const comment = document.querySelector('#comment-content').value.trim();

    if (blog_id && comment) {
        const response = await fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify({ blog_id, comment }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace(`/blog/${blog_id}`);
        } else {
            alert(response.statusText);
        }
    }
};

const blogForm = document.querySelector('.blog-form');
const blogBTN = document.querySelector('#postbtn');

if (blogForm) {
    blogForm.addEventListener('submit', blogFormHandler);
    blogBTN.addEventListener('click', blogFormHandler);
}

const commentForm = document.querySelector('.comment-form');
const commentBTN = document.querySelector('#commentbtn');

if (commentForm) {
    commentForm.addEventListener('submit', commentFormHandler);
    commentBTN.addEventListener('click', commentFormHandler);
}