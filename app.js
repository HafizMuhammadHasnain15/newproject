// --- LOCAL STORAGE DATA ENGINE ---
let financialData = JSON.parse(localStorage.getItem('myCFOData')) || {
    user: "Mughal",
    healthScore: 82,
    balance: 25000,
    income: 50000,
    expenses: 32000,
    savingsRate: 36,
    chatHistory: [
        { sender: 'bot', text: '👋 Salam Mughal! Main aapka Personal CFO hoon. Kuch bhi kharcha ho yahan likhein (e.g., "500 petrol")', type: 'normal-msg' }
    ],
    transactions: [
        { id: 1, title: 'Salary Credited', amount: 50000, type: 'income', category: 'Salary', time: '11:22 AM' },
        { id: 2, title: 'KFC Burger Meal', amount: 1200, type: 'expense', category: 'Food', time: '11:21 AM' },
        { id: 3, title: 'Petrol Refuel', amount: 500, type: 'expense', category: 'Fuel', time: '11:20 AM' }
    ],
    goals: [
        { id: 101, title: 'New Laptop', target: 150000, saved: 45000, date: '31 Dec 2026', icon: 'fa-laptop' },
        { id: 102, title: 'Emergency Fund', target: 60000, saved: 15000, date: '31 Aug 2026', icon: 'fa-shield-halved' },
        { id: 103, title: 'PS5 Console', target: 70000, saved: 21000, date: '31 Jan 2027', icon: 'fa-gamepad' }
    ]
};

function saveData() {
    if (financialData.income > 0) {
        financialData.savingsRate = Math.round(((financialData.income - financialData.expenses) / financialData.income) * 100);
    } else {
        financialData.savingsRate = 0;
    }
    localStorage.setItem('myCFOData', JSON.stringify(financialData));
}

// --- APP LAYER WINDOW SWITCHER ---
function switchScreen(screenName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${screenName}`);
    if (currentNav) currentNav.classList.add('active');

    // 1. DASHBOARD SYSTEM VIEW
    if (screenName === 'dashboard') {
        mainContent.innerHTML = `
            <div class="dashboard-header">
                <div>
                    <span class="greeting">👋 Good Morning,</span>
                    <h2 class="user-name">${financialData.user}</h2>
                    <p class="sub-text">Here is your financial overview</p>
                </div>
                <div class="notification-bell"><i class="fa-solid fa-bell"></i><span class="bell-dot"></span></div>
            </div>

            <div class="health-card">
                <div class="health-info">
                    <h3>Financial Health Score</h3>
                    <div class="score-display"><span class="score-big">${financialData.healthScore}</span><span class="score-total">/100</span></div>
                    <span class="score-tag">Good</span>
                    <p class="score-desc"><i class="fa-solid fa-circle-check"></i> System synced and live.</p>
                </div>
                <div class="health-chart-circle">
                    <svg width="80" height="80"><circle cx="40" cy="40" r="34" class="bg-circle"></circle><circle cx="40" cy="40" r="34" class="progress-circle" style="stroke-dashoffset: calc(213 - (213 * ${financialData.healthScore}) / 100);"></circle></svg>
                    <div class="circle-text">${financialData.healthScore}</div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card" id="change-balance-trigger">
                    <div class="stat-meta"><p>Current Balance ✏</p><h4>Rs. ${financialData.balance.toLocaleString()}</h4></div>
                    <div class="stat-icon blue-tint"><i class="fa-wallet fa-solid"></i></div>
                </div>
                <div class="stat-card" id="change-income-trigger">
                    <div class="stat-meta"><p>Monthly Income ✏</p><h4>Rs. ${financialData.income.toLocaleString()}</h4></div>
                    <div class="stat-icon dark-blue-tint"><i class="fa-building-columns fa-solid"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-meta"><p>Monthly Expenses</p><h4>Rs. ${financialData.expenses.toLocaleString()}</h4></div>
                    <div class="stat-icon red-tint"><i class="fa-arrow-trend-down fa-solid"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-meta"><p>Savings Rate</p><h4>${financialData.savingsRate}%</h4></div>
                    <div class="stat-icon purple-tint"><i class="fa-pie-chart fa-solid"></i></div>
                </div>
            </div>

            <div class="overview-section">
                <div class="overview-title"><h3>Month Overview</h3><span>June 2026</span></div>
                <div class="overview-labels">
                    <span class="lbl-income">Income<br><b>Rs. ${financialData.income.toLocaleString()}</b></span>
                    <span class="lbl-expense">Expenses<br><b>Rs. ${financialData.expenses.toLocaleString()}</b></span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-income" style="width: 55%"></div>
                    <div class="progress-expense" style="width: 45%"></div>
                </div>
            </div>

            <div class="quick-actions-section">
                <h3>Quick Actions</h3>
                <div class="actions-row">
                    <div class="action-btn-wrapper" id="act-exp"><div class="action-btn btn-red"><i class="fa-solid fa-plus"></i></div><span>Add Expense</span></div>
                    <div class="action-btn-wrapper" id="act-inc"><div class="action-btn btn-green"><i class="fa-solid fa-plus"></i></div><span>Add Income</span></div>
                    <div class="action-btn-wrapper" id="act-goal-dash"><div class="action-btn btn-amber"><i class="fa-solid fa-star"></i></div><span>Add Goal</span></div>
                    <div class="action-btn-wrapper" id="act-rep"><div class="action-btn btn-blue"><i class="fa-solid fa-chart-simple"></i></div><span>See Reports</span></div>
                </div>
            </div>
        `;
        document.getElementById('act-exp').addEventListener('click', () => switchScreen('chat'));
        document.getElementById('act-inc').addEventListener('click', openDirectIncomeModal); // Handled adding new money inflow
        document.getElementById('act-goal-dash').addEventListener('click', openCreateGoalModal); // Directly triggers Modal form popup
        document.getElementById('act-rep').addEventListener('click', () => switchScreen('analytics'));
        document.getElementById('change-income-trigger').addEventListener('click', openIncomeUpdateModal);
        document.getElementById('change-balance-trigger').addEventListener('click', openBalanceUpdateModal);
    }

    // 2. CFO BOT CHAT SCREEN
    else if (screenName === 'chat') {
        mainContent.innerHTML = `
            <div class="chat-screen-layout">
                <div class="chat-header">
                    <i class="fa-solid fa-arrow-left" id="back-to-dash"></i>
                    <div>
                        <h3>CFO Chat</h3>
                        <p>Your Financial Assistant</p>
                    </div>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
                <div class="chat-box" id="chat-box-area"></div>
                <div class="chat-input-container">
                    <input type="text" id="user-msg-input" placeholder="Type '500 petrol'...">
                    <button id="send-msg-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.getElementById('back-to-dash').addEventListener('click', () => switchScreen('dashboard'));
        document.getElementById('send-msg-btn').addEventListener('click', processChatMessage);
        document.getElementById('user-msg-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') processChatMessage(); });
        renderChatMessages();
    }

    // 3. GOALS SCREEN LOGIC VIEW
    else if (screenName === 'goals') {
        let goalsHTML = `
            <div class="goals-header">
                <h3>My Goals</h3>
                <div class="add-goal-icon-btn" id="create-new-goal-btn"><i class="fa-solid fa-plus"></i></div>
            </div>
        `;

        financialData.goals.forEach(goal => {
            let percentage = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
            let remaining = goal.target - goal.saved;

            goalsHTML += `
                <div class="goal-card">
                    <div class="goal-top-info">
                        <div class="goal-avatar"><i class="fa-solid ${goal.icon || 'fa-star'}"></i></div>
                        <div class="goal-details">
                            <h4>${goal.title}</h4>
                            <p>Target: Rs. ${goal.target.toLocaleString()} • Saved: Rs. ${goal.saved.toLocaleString()}</p>
                        </div>
                        <div class="goal-percentage">${percentage}%</div>
                    </div>
                    <div class="goal-progress-track">
                        <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="goal-bottom-actions">
                        <div class="goal-remaining">Remaining: <b>Rs. ${remaining.toLocaleString()}</b><br><small style="color:var(--text-muted)">Target Date: ${goal.date}</small></div>
                        <button class="save-fund-btn" onclick="openAddFundsModal(${goal.id})">Add Funds</button>
                    </div>
                </div>
            `;
        });

        mainContent.innerHTML = goalsHTML;
        document.getElementById('create-new-goal-btn').addEventListener('click', openCreateGoalModal);
    }

    // 4. TRANSACTION VIEW LOG
    else if (screenName === 'transactions') {
        let txRows = '';
        financialData.transactions.slice().reverse().forEach(tx => {
            const isIncome = tx.type === 'income';
            txRows += `
                <div class="tx-card">
                    <div class="tx-left">
                        <div class="tx-icon-frame ${isIncome ? 'frame-green' : 'frame-red'}">
                            <i class="${isIncome ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-basket-shopping'}"></i>
                        </div>
                        <div>
                            <h4>${tx.title}</h4>
                            <p>${tx.time} • ${tx.category || 'General'}</p>
                        </div>
                    </div>
                    <div class="tx-right">
                        <span class="${isIncome ? 'tx-amount-inc' : 'tx-amount-exp'}">
                            ${isIncome ? '+' : '-'} Rs. ${tx.amount.toLocaleString()}
                        </span>
                    </div>
                </div>
            `;
        });

        mainContent.innerHTML = `
            <div class="transactions-header">
                <h3>Transactions History</h3>
                <i class="fa-solid fa-sliders"></i>
            </div>
            <div class="tx-filter-bar">
                <span class="filter-tab active">All History Logs</span>
            </div>
            <div class="tx-list-container">
                ${txRows || '<p style="color:var(--text-muted);text-align:center;padding:20px;">No logs discovered.</p>'}
            </div>
        `;
    } else {
        mainContent.innerHTML = `<div style="padding:20px;text-align:center;"><h3 style="color:var(--accent-blue);">${screenName.toUpperCase()} Screen Layout</h3><p style="color:var(--text-muted);margin-top:10px;">Future system module expansion.</p></div>`;
    }
}

// --- DYNAMIC MODAL BOX LOGICS ---

// 1. Current Balance Modifier Modal Form
function openBalanceUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Update Current Balance</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apna initial wallet ya bank account total current balance adjust karein:</p>
            <input type="number" id="new-balance-val" class="modal-input-field" value="${financialData.balance}" placeholder="Enter available balance...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-balance-btn">Update Balance</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-balance-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-balance-val').value);
        if (!isNaN(amount) && amount >= 0) {
            financialData.balance = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

// 2. Monthly Budget/Income Variable Setup
function openIncomeUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Update Monthly Income Target</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apni total monthly expected baseline income change karein:</p>
            <input type="number" id="new-income-val" class="modal-input-field" value="${financialData.income}" placeholder="Enter expected salary/income...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-income-btn">Update</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-income-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-income-val').value);
        if (!isNaN(amount) && amount >= 0) {
            financialData.income = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

// 3. Add External Incoming Money (Pasay kahan se aaye aur kase save hon)
function openDirectIncomeModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>💰 Add New Income Inflow</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Pasay kahan se aaye hain? Detail aur amount enter karein:</p>
            <input type="text" id="inc-source-input" class="modal-input-field" placeholder="Source (e.g., Freelance, Gift, Pocket Money)">
            <input type="number" id="inc-amount-input" class="modal-input-field" placeholder="Rs. Amount enter karein">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-inflow-btn">Add Money</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-inflow-btn').addEventListener('click', () => {
        let source = document.getElementById('inc-source-input').value.trim() || 'External Income';
        let amount = parseFloat(document.getElementById('inc-amount-input').value);

        if (!isNaN(amount) && amount > 0) {
            financialData.balance += amount;
            financialData.income += amount; // Aggregating monthly totals too
            financialData.transactions.push({
                id: Date.now(),
                title: source,
                amount: amount,
                type: 'income',
                category: 'Income Source',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

// 4. Create Goal Form Popup Builder
function openCreateGoalModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>✨ Create New Financial Goal</h3>
            <input type="text" id="goal-title-input" class="modal-input-field" placeholder="Goal Name (e.g. New Phone, Fees)">
            <input type="number" id="goal-target-input" class="modal-input-field" placeholder="Target Target Amount (Rs.)">
            <input type="text" id="goal-date-input" class="modal-input-field" placeholder="Target Date (e.g. 31 Dec 2026)">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-create-goal">Create Goal</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('confirm-create-goal').addEventListener('click', () => {
        let name = document.getElementById('goal-title-input').value.trim();
        let target = parseFloat(document.getElementById('goal-target-input').value);
        let dateStr = document.getElementById('goal-date-input').value.trim() || 'No Limit';

        if (name && !isNaN(target) && target > 0) {
            financialData.goals.push({
                id: Date.now(),
                title: name,
                target: target,
                saved: 0,
                date: dateStr,
                icon: 'fa-star'
            });
            saveData();
            closeModal();
            switchScreen('goals');
        }
    });
}

// 5. Save/Add Funds Into Goal
window.openAddFundsModal = function (goalId) {
    const targetGoal = financialData.goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Save Money: ${targetGoal.title}</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Is goal mein kitne paise lock karne hain?</p>
            <input type="number" id="fund-amount-input" class="modal-input-field" placeholder="Rs. Amount enter karein...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-fund-btn">Add Funds</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('confirm-fund-btn').addEventListener('click', () => {
        let val = parseFloat(document.getElementById('fund-amount-input').value);
        if (!isNaN(val) && val > 0) {
            targetGoal.saved += val;
            financialData.balance -= val; // Moving cash balance to savings goal allocation
            saveData();
            closeModal();
            switchScreen('goals');
        }
    });
};

window.closeModal = function () {
    const m = document.getElementById('modal-layer');
    if (m) m.remove();
};

// --- CHAT CONTROL ENGINE SYSTEM ---
function renderChatMessages() {
    const chatBox = document.getElementById('chat-box-area');
    if (!chatBox) return;
    chatBox.innerHTML = '';
    financialData.chatHistory.forEach(msg => {
        const row = document.createElement('div');
        row.className = `chat-row-wrap ${msg.sender === 'user' ? 'align-right' : 'align-left'}`;
        row.innerHTML = `<div class="chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'} ${msg.type || ''}">${msg.text}</div>`;
        chatBox.appendChild(row);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processChatMessage() {
    const inputField = document.getElementById('user-msg-input');
    if (!inputField) return;
    const query = inputField.value.trim();
    if (!query) return;

    financialData.chatHistory.push({ sender: 'user', text: query });
    renderChatMessages();
    inputField.value = '';

    setTimeout(() => {
        let responseText = "Samajh nahi paya. Format: '500 petrol' ya 'salary 25000'";
        let responseType = 'normal-msg';
        const words = query.split(' ');

        if (!isNaN(words[0]) && words[1]) {
            let amount = parseFloat(words[0]);
            let title = words.slice(1).join(' ');

            financialData.expenses += amount;
            financialData.balance -= amount;
            financialData.transactions.push({
                id: Date.now(),
                title: title.charAt(0).toUpperCase() + title.slice(1),
                amount: amount,
                type: 'expense',
                category: 'Food/Fuel',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            responseText = `✔ <b>Expense Tracked</b><br>Amount: Rs. ${amount}<br>Category: ${title}`;
            responseType = 'expense-msg';
        } else if ((words[0].toLowerCase() === 'salary' || words[0].toLowerCase() === 'income') && !isNaN(words[1])) {
            let amount = parseFloat(words[1]);
            financialData.income += amount;
            financialData.balance += amount;
            financialData.transactions.push({
                id: Date.now(),
                title: 'Income Injected',
                amount: amount,
                type: 'income',
                category: 'Salary',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            responseText = `💰 <b>Income Logged</b><br>Amount: Rs. ${amount}`;
            responseType = 'income-msg';
        }

        financialData.chatHistory.push({ sender: 'bot', text: responseText, type: responseType });
        saveData();
        renderChatMessages();
    }, 400);
}

// --- INITIAL ENGINE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nav-dashboard').addEventListener('click', () => switchScreen('dashboard'));
    document.getElementById('nav-transactions').addEventListener('click', () => switchScreen('transactions'));
    document.getElementById('nav-chat').addEventListener('click', () => switchScreen('chat'));
    document.getElementById('nav-goals').addEventListener('click', () => switchScreen('goals'));
    document.getElementById('nav-analytics').addEventListener('click', () => switchScreen('analytics'));

    switchScreen('dashboard');
});