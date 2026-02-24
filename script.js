let total= document.getElementById('total');
let interview = document.getElementById('interview');
let rejected = document.getElementById('rejected');

const allCardSection = document.getElementById('allcards')

function calculateCount(){
    total.innerText = allCardSection.children.length
}
calculateCount();
