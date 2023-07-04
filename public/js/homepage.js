
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', function () {
        const id = (card.id).split('-')
        console.log('card_id: '+id[1]);
        document.location.replace(`blog/${id[1]}`);
    });
});
