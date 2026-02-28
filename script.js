let interviewList = [];
let rejectedList  = [];

const totalEl        = document.getElementById('total');
const interviewEl    = document.getElementById('interviewCount');
const rejectedEl     = document.getElementById('rejectedCount');

const allCardSection = document.getElementById('allcards');
const filteredSection = document.getElementById('filteredSection');
const mainContainer  = document.querySelector('main');

const allFilterBtn       = document.getElementById('all-filter-btn');
const interviewFilterBtn = document.getElementById('interview-filter-btn');
const rejectedFilterBtn  = document.getElementById('rejected-filter-btn');
// track active 
let activeTab = 'all';

// ─── CALCULATE & UPDATE COUNTS ─
function calculateCount() {
    totalEl.innerText     = allCardSection.children.length;
    interviewEl.innerText = interviewList.length;
    rejectedEl.innerText  = rejectedList.length;
}
calculateCount();

function toggleStyle(id) {
    // Reset all 
    allFilterBtn.classList.remove('bg-blue-400', 'text-white');
    interviewFilterBtn.classList.remove('bg-blue-400', 'text-white');
    rejectedFilterBtn.classList.remove('bg-blue-400', 'text-white');

    allFilterBtn.classList.add('bg-white');
    interviewFilterBtn.classList.add('bg-white');
    rejectedFilterBtn.classList.add('bg-white');

    const selected = document.getElementById(id);
    selected.classList.remove('bg-white');
    selected.classList.add('bg-blue-400', 'text-white');

    if (id === 'all-filter-btn') {
        activeTab = 'all';
        allCardSection.classList.remove('hidden');
        filteredSection.classList.add('hidden');

    } else if (id === 'interview-filter-btn') {
        activeTab = 'interview';
        allCardSection.classList.add('hidden');
        filteredSection.classList.remove('hidden');
        renderFiltered(interviewList); // render interview cards into filteredSection

    } else if (id === 'rejected-filter-btn') {
        activeTab = 'rejected';
        allCardSection.classList.add('hidden');
        filteredSection.classList.remove('hidden');
        renderFiltered(rejectedList); // render rejected cards filteredSection
    }
}
function renderFiltered(list) {
    filteredSection.innerHTML = '';

    if (list.length === 0) {
        filteredSection.innerHTML = `
            <div class="text-center py-16 text-gray-400">
                <p class="text-4xl mb-3">📋</p>
                <p class="font-semibold text-lg text-gray-600">No jobs available</p>
                <p class="text-sm">Check back soon for new job opportunities</p>
            </div>`;
        return;
    }

    for (let item of list) {
        const statusColor = item.status === 'INTERVIEW'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';

        const div = document.createElement('div');
        div.className = 'card flex justify-between shadow-md bg-white rounded-lg p-8';
        div.innerHTML = `
            <div class="space-y-3 flex-1">
                <div>
                    <p class="companyName font-bold text-lg">${item.companyName}</p>
                    <p class="jobTitle text-gray-600">${item.jobTitle}</p>
                </div>
                <div>
                    <p class="info text-sm text-gray-400">${item.info}</p>
                </div>
                <div class="space-y-2">
                    <button class="status ${statusColor} font-semibold rounded-xl px-3 py-1 text-sm">${item.status}</button>
                    <p class="notes text-sm text-gray-500">${item.notes}</p>
                </div>
                <div class="flex gap-2">
                    <button class="interview-btn text-green-500 font-semibold border-2 border-green-500 hover:bg-green-100 rounded-md px-3 py-2 text-sm">INTERVIEW</button>
                    <button class="rejected-btn text-red-500 font-semibold border-2 border-red-500 hover:bg-red-100 rounded-md px-3 py-2 text-sm">REJECTED</button>
                </div>
            </div>
            <div class="ml-4">
                <button class="delete-btn text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
            </div>`;

        filteredSection.appendChild(div);
    }
}

// ─── MAIN EVENT 
mainContainer.addEventListener('click', function(event) {

    if (event.target.classList.contains('interview-btn')) {
        const card = event.target.closest('.card');

        const companyName = card.querySelector('.companyName').innerText;
        const jobTitle    = card.querySelector('.jobTitle').innerText;
        const info        = card.querySelector('.info').innerText;
        const notes       = card.querySelector('.notes').innerText;

        const cardInfo = { companyName, jobTitle, info, notes, status: 'INTERVIEW' };

        // Remove from rejected list
        rejectedList = rejectedList.filter(item => item.companyName !== companyName);

        // Add to intervie
        const alreadyInterview = interviewList.find(item => item.companyName === companyName);
        if (!alreadyInterview) {
            interviewList.push(cardInfo);
        }

        // Update status
        const statusBtn = card.querySelector('.status');
        statusBtn.innerText = 'INTERVIEW';
        statusBtn.className = 'status bg-green-100 text-green-700 font-semibold rounded-xl px-3 py-1 text-sm';

        calculateCount();

        if (activeTab === 'interview') renderFiltered(interviewList);
        if (activeTab === 'rejected')  renderFiltered(rejectedList);
    }

    if (event.target.classList.contains('rejected-btn')) {
        const card = event.target.closest('.card');

        const companyName = card.querySelector('.companyName').innerText;
        const jobTitle    = card.querySelector('.jobTitle').innerText;
        const info        = card.querySelector('.info').innerText;
        const notes       = card.querySelector('.notes').innerText;

        const cardInfo = { companyName, jobTitle, info, notes, status: 'REJECTED' };

        // Remove from interview list
        interviewList = interviewList.filter(item => item.companyName !== companyName);

        // Add to rejected
        const alreadyRejected = rejectedList.find(item => item.companyName === companyName);
        if (!alreadyRejected) {
            rejectedList.push(cardInfo);
        }

        // Update status badge
        const statusBtn = card.querySelector('.status');
        statusBtn.innerText = 'REJECTED';
        statusBtn.className = 'status bg-red-100 text-red-700 font-semibold rounded-xl px-3 py-1 text-sm';

        calculateCount();

        if (activeTab === 'interview') renderFiltered(interviewList);
        if (activeTab === 'rejected')  renderFiltered(rejectedList);
    }

    // ── DELETE BUTTON ────
    if (event.target.classList.contains('delete-btn')) {
        const card        = event.target.closest('.card');
        const companyName = card.querySelector('.companyName').innerText;

        interviewList = interviewList.filter(item => item.companyName !== companyName);
        rejectedList  = rejectedList.filter(item  => item.companyName !== companyName);

        card.remove();

        calculateCount();

        if (activeTab === 'interview') renderFiltered(interviewList);
        if (activeTab === 'rejected')  renderFiltered(rejectedList);
    }
});
