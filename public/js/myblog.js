let activated = false;
const activateEditor = async (event) => {
    event.preventDefault();

    Title = document.querySelector('.title-input');
    Body = document.querySelector('.body-textarea');

    if (!activated) {
        Title.removeAttribute('readonly');
        Body.removeAttribute('readonly');
        editBTN.textContent = 'Save'
        Title.value = Title.placeholder;
        Body.value = Body.placeholder;
        activated = true;
    } else {
        if (editBTN.textContent == 'Save') {

            const title = document.querySelector('.title-input').value.trim();
            const body = document.querySelector('.body-textarea').value.trim();
            const blog_id = window.location.toString().split('/')[
                window.location.toString().split('/').length - 1
            ];
            if (title && body) {
                const response = await fetch(`/api/blog/${blog_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ title, body }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    location.reload();
                } else {
                    alert(response.statusText);
                }
            }
        }

    }
};
const deleteBlog = async (event) => {
    event.preventDefault();
    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/blog/${blog_id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        document.location.replace(`/`);
    } else {
        alert(response.statusText);
    }
};
const editBTN = document.querySelector('#edit-btn');

if (editBTN) {
    editBTN.addEventListener('click', activateEditor);
}
const deleteBTN = document.querySelector('#delete-btn');

if (deleteBTN) {
    deleteBTN.addEventListener('click', deleteBlog);
}