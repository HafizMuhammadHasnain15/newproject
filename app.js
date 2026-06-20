// --- CENTRAL STATE STORAGE ENGINE ---
let financialData = JSON.parse(localStorage.getItem('myCFOData')) || {
    // New Profile Extension Objects
    profile: {
        name: "Mughal",
        age: "21",
        bestLine: "Building assets, breaking patterns.",
        status: "Student" // Student or Employee
    },
    healthScore: 55,
    balance: 16868,
    income: 83000,
    expenses: 12800,
    savingsRate: -142,
    chatHistory: [
        { sender: 'bot', text: '👋 Salam! Main aapka Personal CFO hoon. Koi bhi kharcha ho yahan track karein.', type: 'normal-msg' }
    ],
    transactions: [
        { id: 1, title: 'Freelance Baseline Inflow', amount: 8300, type: 'income', category: 'Salary', time: '10:00 AM', date: '2026-06-01' },
        { id: 2, title: 'Hostel Mess & Food', amount: 12300, type: 'expense', category: 'Food', time: '02:15 PM', date: '2026-06-15' },
        { id: 3, title: 'Bike Fuel', amount: 500, type: 'expense', category: 'Fuel', time: '06:40 PM', date: '2026-06-18' }
    ],
    goals: [
        { id: 101, title: 'New Laptop', target: 150000, saved: 45000, date: '31 Dec 2026', icon: 'fa-laptop' }
    ]
};

// Auto Recalculation Core Functionality Engine
function performFinancialCalculations() {
    let computedIncome = 0;
    let computedExpense = 0;

    financialData.transactions.forEach(t => {
        if (t.type === 'income') computedIncome += t.amount;
        if (t.type === 'expense') computedExpense += t.amount;
    });

    financialData.income = computedIncome || 8300; // Safeguard configuration fallback
    financialData.expenses = computedExpense;

    // Dynamic calculation formula setup
    if (financialData.income > 0) {
        financialData.savingsRate = Math.round(((financialData.income - financialData.expenses) / financialData.income) * 100);
    } else {
        financialData.savingsRate = 0;
    }

    // Set interactive metrics scores
    if (financialData.savingsRate > 30) financialData.healthScore = 85;
    else if (financialData.savingsRate >= 0) financialData.healthScore = 70;
    else financialData.healthScore = 55; // Matches critical status criteria 
}

function saveData() {
    performFinancialCalculations();
    localStorage.setItem('myCFOData', JSON.stringify(financialData));
}

// --- APP WINDOW NAVIGATION VIEW TEMPLATES ---
function switchScreen(screenName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${screenName}`);
    if (currentNav) currentNav.classList.add('active');

    // Make sure latest updates from transactions scale down inside template engine
    performFinancialCalculations();

    // 1. DASHBOARD OVERVIEW PANEL SCREEN
    if (screenName === 'dashboard') {
        mainContent.innerHTML = `
            <div class="dashboard-header">
                <div class="header-left">
                    <span class="greeting">⚡ "${financialData.profile.bestLine || 'No motto configured'}"</span>
                    <h2 class="user-name">${financialData.profile.name}</h2>
                    <p class="sub-text">Status: ${financialData.profile.status} (${financialData.profile.age} Years Old)</p>
                </div>
                <div class="header-actions-right">
                    <div class="profile-config-btn" id="trigger-profile-edit" title="Edit Profile"><i class="fa-solid fa-user-gear"></i></div>
                    <div class="notification-bell"><i class="fa-solid fa-bell"></i><span class="bell-dot"></span></div>
                </div>
            </div>

            <div class="health-card">
                <div class="health-info">
                    <h3>Financial Health Score</h3>
                    <div class="score-display"><span class="score-big">${financialData.healthScore}</span><span class="score-total">/100</span></div>
                    <span class="score-tag">${financialData.healthScore > 65 ? 'Good' : 'Critical'}</span>
                    <p class="score-desc"><i class="fa-solid fa-circle-check"></i> System synchronized perfectly.</p>
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
                    <div class="progress-income" style="width: 50%"></div>
                    <div class="progress-expense" style="width: 50%"></div>
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

        // Safe Non-leaking Event Attachments
        document.getElementById('trigger-profile-edit').addEventListener('click', openProfileConfigurationModal);
        document.getElementById('act-exp').addEventListener('click', () => switchScreen('chat'));
        document.getElementById('act-inc').addEventListener('click', openDirectIncomeModal);
        document.getElementById('act-goal-dash').addEventListener('click', openCreateGoalModal);
        document.getElementById('act-rep').addEventListener('click', () => switchScreen('analytics'));
        document.getElementById('change-income-trigger').addEventListener('click', openIncomeUpdateModal);
        document.getElementById('change-balance-trigger').addEventListener('click', openBalanceUpdateModal);
    }

    // 2. CFO CHAT TERMINAL SCREEN
    else if (screenName === 'chat') {
        mainContent.innerHTML = `
            <div class="chat-screen-layout">
                <div class="chat-header">
                    <i class="fa-solid fa-arrow-left" id="back-to-dash"></i>
                    <div>
                        <h3>CFO Chat Engine</h3>
                        <p>Active profile: ${financialData.profile.name}</p>
                    </div>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
                <div class="chat-box" id="chat-box-area"></div>
                <div class="chat-input-container">
                    <input type="text" id="user-msg-input" placeholder="Type '1500 food'...">
                    <button id="send-msg-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.getElementById('back-to-dash').addEventListener('click', () => switchScreen('dashboard'));
        document.getElementById('send-msg-btn').addEventListener('click', processChatMessage);
        document.getElementById('user-msg-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') processChatMessage(); });
        renderChatMessages();
    }

    // 3. TARGET GOALS CONFIGURATION VIEW
    else if (screenName === 'goals') {
        let goalsHTML = `<div class="goals-header"><h3>Target Goals</h3><div class="add-goal-icon-btn" id="create-new-goal-btn"><i class="fa-solid fa-plus"></i></div></div>`;
        financialData.goals.forEach(goal => {
            let percentage = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
            goalsHTML += `
                <div class="goal-card">
                    <div class="goal-top-info">
                        <div class="goal-avatar"><i class="fa-solid ${goal.icon || 'fa-star'}"></i></div>
                        <div class="goal-details">
                            <h4>${goal.title}</h4>
                            <p>Target: Rs. ${goal.target.toLocaleString()} • Saved: Rs. ${goal.saved.toLocaleString()}</p>
                        </div>
                        <div class="goal-header-right">
                            <span class="goal-percentage">${percentage}%</span>
                            <i class="fa-solid fa-trash goal-action-icon delete-icon" onclick="deleteGoal(${goal.id})"></i>
                        </div>
                    </div>
                    <div class="goal-progress-track"><div class="goal-progress-fill" style="width: ${percentage}%"></div></div>
                    <div class="goal-bottom-actions">
                        <div class="goal-remaining">Remaining: <b>Rs. ${(goal.target - goal.saved).toLocaleString()}</b></div>
                        <button class="save-fund-btn" onclick="openAddFundsModal(${goal.id})">Lock Money</button>
                    </div>
                </div>
            `;
        });
        mainContent.innerHTML = goalsHTML;
        document.getElementById('create-new-goal-btn').addEventListener('click', openCreateGoalModal);
    }

    // 4. TRANSACTION LOG LIST
    else if (screenName === 'transactions') {
        let txRows = '';
        financialData.transactions.slice().reverse().forEach(tx => {
            const isIncome = tx.type === 'income';
            txRows += `
                <div class="tx-card">
                    <div class="tx-left">
                        <div class="tx-icon-frame ${isIncome ? 'frame-green' : 'frame-red'}"><i class="fa-solid ${isIncome ? 'fa-arrow-trend-up' : 'fa-basket-shopping'}"></i></div>
                        <div><h4>${tx.title}</h4><p>${tx.time} • ${tx.category || 'General'}</p></div>
                    </div>
                    <div class="tx-right"><span class="${isIncome ? 'tx-amount-inc' : 'tx-amount-exp'}">${isIncome ? '+' : '-'} Rs. ${tx.amount.toLocaleString()}</span></div>
                </div>
            `;
        });
        mainContent.innerHTML = `<div class="transactions-header"><h3>Ledger Records</h3></div><div class="tx-list-container">${txRows || '<p>No records located.</p>'}</div>`;
    }

    // 5. LIVE REPORTS ANALYTICS SYSTEM VIEW 
    else if (screenName === 'analytics') {
        let foodSum = 0, fuelSum = 0, otherSum = 0;
        financialData.transactions.forEach(t => {
            if (t.type === 'expense') {
                let cat = (t.category || '').toLowerCase();
                if (cat.includes('food')) foodSum += t.amount;
                else if (cat.includes('fuel')) fuelSum += t.amount;
                else otherSum += t.amount;
            }
        });

        let totalCalculatedExpenses = foodSum + fuelSum + otherSum || 1;
        let foodPercent = Math.round((foodSum / totalCalculatedExpenses) * 100);
        let fuelPercent = Math.round((fuelSum / totalCalculatedExpenses) * 100);
        let otherPercent = Math.round((otherSum / totalCalculatedExpenses) * 100);

        let currentDay = new Date().getDate();
        let currentDailyBurnAvg = Math.round(financialData.expenses / currentDay);

        let maxVal = Math.max(financialData.income, financialData.expenses) || 1;
        let incBarHeight = Math.round((financialData.income / maxVal) * 130) + 10;
        let expBarHeight = Math.round((financialData.expenses / maxVal) * 130) + 10;

        mainContent.innerHTML = `
            <div class="analytics-header-row"><h3>Live Analytics</h3><span class="time-filter-badge">This Month</span></div>
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-meta"><p>Net Monthly Savings</p><h4 style="color:var(--primary-green)">Rs. ${(financialData.income - financialData.expenses).toLocaleString()}</h4></div></div>
                <div class="stat-card"><div class="stat-meta"><p>Daily Burn Avg</p><h4>Rs. ${currentDailyBurnAvg.toLocaleString()}</h4></div></div>
            </div>
            <div class="chart-wrapper-card">
                <div class="chart-title-area">Cash Flow Comparison (Rs.)</div>
                <div class="css-bar-chart-container">
                    <div class="chart-bar-column">
                        <span class="bar-value-label">${Math.round(financialData.income / 1000)}k</span>
                        <div class="actual-bar-fill fill-income-color" style="height: ${incBarHeight}px"></div>
                        <span class="column-title-label">Income</span>
                    </div>
                    <div class="chart-bar-column">
                        <span class="bar-value-label">${Math.round(financialData.expenses / 1000)}k</span>
                        <div class="actual-bar-fill fill-expense-color" style="height: ${expBarHeight}px"></div>
                        <span class="column-title-label">Expenses</span>
                    </div>
                </div>
            </div>
            <div class="category-breakdown-card">
                <h4>Category Wise Share</h4>
                <div class="category-row-item">
                    <div class="category-row-meta"><span>🍔 Food & Drinks</span><span>Rs. ${foodSum.toLocaleString()} (${foodPercent}%)</span></div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${foodPercent}%; background:#ff9800;"></div></div>
                </div>
                <div class="category-row-item">
                    <div class="category-row-meta"><span>⛽ Fuel & Transport</span><span>Rs. ${fuelSum.toLocaleString()} (${fuelPercent}%)</span></div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${fuelPercent}%; background:var(--accent-blue);"></div></div>
                </div>
                <div class="category-row-item">
                    <div class="category-row-meta"><span>📦 Others / Misc</span><span>Rs. ${otherSum.toLocaleString()} (${otherPercent}%)</span></div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${otherPercent}%; background:#9c27b0;"></div></div>
                </div>
            </div>
        `;
    }
}

// ==========================================
// 🛠️ DYNAMIC PROFILE CONFIGURATION MODAL 
// ==========================================
function openProfileConfigurationModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>👤 Setup Profile Details</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">App par apna dynamic layout display customize karein:</p>
            
            <label style="font-size:11px; color:var(--text-muted);">Your Name:</label>
            <input type="text" id="prof-name-input" class="modal-input-field" value="${financialData.profile.name || ''}" placeholder="Enter name...">
            
            <label style="font-size:11px; color:var(--text-muted);">Age:</label>
            <input type="number" id="prof-age-input" class="modal-input-field" value="${financialData.profile.age || ''}" placeholder="Enter age...">
            
            <label style="font-size:11px; color:var(--text-muted);">Best Line (Motto Show instead of Morning greeting):</label>
            <input type="text" id="prof-line-input" class="modal-input-field" value="${financialData.profile.bestLine || ''}" placeholder="Enter your financial quote...">
            
            <label style="font-size:11px; color:var(--text-muted);">Status Classification:</label>
            <select id="prof-status-input" class="modal-select-field">
                <option value="Student" ${financialData.profile.status === 'Student' ? 'selected' : ''}>Student</option>
                <option value="Employee" ${financialData.profile.status === 'Employee' ? 'selected' : ''}>Employee</option>
            </select>

            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-profile-engine-btn">Save Configurations</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-profile-engine-btn').addEventListener('click', () => {
        let inputName = document.getElementById('prof-name-input').value.trim();
        let inputAge = document.getElementById('prof-age-input').value.trim();
        let inputLine = document.getElementById('prof-line-input').value.trim();
        let inputStatus = document.getElementById('prof-status-input').value;

        if (!inputName) { alert("Name field is mandatory!"); return; }

        // Inject inside core architecture storage context
        financialData.profile = {
            name: inputName,
            age: inputAge || "N/A",
            bestLine: inputLine || "Keep tracking assets.",
            status: inputStatus
        };

        saveData();
        closeModal();
        switchScreen('dashboard');
    });
}

// --- STANDARD OPERATIONAL INPUT POPUPS ---
function openBalanceUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Update Wallet Balance</h3>
            <input type="number" id="new-balance-val" class="modal-input-field" value="${financialData.balance}">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-balance-btn">Update</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-balance-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-balance-val').value);
        if (!isNaN(amount)) { financialData.balance = amount; saveData(); closeModal(); switchScreen('dashboard'); }
    });
}

function openIncomeUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Reset Base Salary Inflow</h3>
            <input type="number" id="new-income-val" class="modal-input-field" value="${financialData.income}">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-income-btn">Apply changes</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-income-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-income-val').value);
        if (!isNaN(amount)) {
            financialData.transactions = financialData.transactions.filter(t => t.title !== 'Freelance Baseline Inflow');
            financialData.transactions.push({ id: Date.now(), title: 'Freelance Baseline Inflow', amount: amount, type: 'income', category: 'Salary', time: '10:00 AM', date: '2026-06-01' });
            saveData(); closeModal(); switchScreen('dashboard');
        }
    });
}

function openDirectIncomeModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>💰 Add Inflow Cash</h3>
            <input type="text" id="inc-source-input" class="modal-input-field" placeholder="Source Label">
            <input type="number" id="inc-amount-input" class="modal-input-field" placeholder="Rs. Amount">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-inflow-btn">Add Cash</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-inflow-btn').addEventListener('click', () => {
        let src = document.getElementById('inc-source-input').value.trim() || 'Extra Cash Inflow';
        let val = parseFloat(document.getElementById('inc-amount-input').value);
        if (!isNaN(val) && val > 0) {
            financialData.balance += val;
            financialData.transactions.push({ id: Date.now(), title: src, amount: val, type: 'income', category: 'Salary', time: '12:00 PM', date: '2026-06-19' });
            saveData(); closeModal(); switchScreen('dashboard');
        }
    });
}

function openCreateGoalModal() {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>🎯 Establish Target Goal</h3>
            <input type="text" id="goal-title-input" class="modal-input-field" placeholder="Goal Description">
            <input type="number" id="goal-target-input" class="modal-input-field" placeholder="Target Target Cost (Rs.)">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-create-goal">Build Goal</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('confirm-create-goal').addEventListener('click', () => {
        let title = document.getElementById('goal-title-input').value.trim();
        let target = parseFloat(document.getElementById('goal-target-input').value);
        if (title && !isNaN(target)) {
            financialData.goals.push({ id: Date.now(), title: title, target: target, saved: 0, date: 'End Month', icon: 'fa-star' });
            saveData(); closeModal(); switchScreen('goals');
        }
    });
}

window.openAddFundsModal = function (goalId) {
    let goal = financialData.goals.find(g => g.id === goalId);
    if (!goal) return;
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Add Cash Savings inside: ${goal.title}</h3>
            <input type="number" id="fund-amount-input" class="modal-input-field" placeholder="Rs. Amount to lock">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-fund-btn">Allocate Funds</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('confirm-fund-btn').addEventListener('click', () => {
        let val = parseFloat(document.getElementById('fund-amount-input').value);
        if (!isNaN(val) && val > 0 && financialData.balance >= val) {
            goal.saved += val;
            financialData.balance -= val;
            financialData.transactions.push({ id: Date.now(), title: `Fund Allocation: ${goal.title}`, amount: val, type: 'expense', category: 'Savings', time: '04:00 PM', date: '2026-06-20' });
            saveData(); closeModal(); switchScreen('goals');
        } else { alert("Insufficient funds/invalid entry!"); }
    });
};

window.deleteGoal = function (goalId) {
    financialData.goals = financialData.goals.filter(g => g.id !== goalId);
    saveData(); switchScreen('goals');
};

window.closeModal = function () { const m = document.getElementById('modal-layer'); if (m) m.remove(); };

// --- CHAT INTERACTION PARSING LOGIC ENGINE ---
function renderChatMessages() {
    const chatBox = document.getElementById('chat-box-area');
    if (!chatBox) return; chatBox.innerHTML = '';
    financialData.chatHistory.forEach(msg => {
        let row = document.createElement('div');
        row.className = `chat-row-wrap ${msg.sender === 'user' ? 'align-right' : 'align-left'}`;
        row.innerHTML = `<div class="chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'} ${msg.type || ''}">${msg.text}</div>`;
        chatBox.appendChild(row);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processChatMessage() {
    const inputField = document.getElementById('user-msg-input');
    const query = inputField ? inputField.value.trim() : '';
    if (!query) return;

    financialData.chatHistory.push({ sender: 'user', text: query });
    renderChatMessages();
    inputField.value = '';

    setTimeout(() => {
        let responseText = "Invalid ledger notation syntax. Example: '500 dinner'";
        let responseType = 'normal-msg';
        const words = query.split(' ');

        if (!isNaN(words[0]) && words[1]) {
            let amount = parseFloat(words[0]);
            let title = words.slice(1).join(' ');
            let targetCategory = "Others";

            if (title.toLowerCase().includes('food') || title.toLowerCase().includes('dinner') || title.toLowerCase().includes('kfc')) targetCategory = "Food";
            else if (title.toLowerCase().includes('petrol') || title.toLowerCase().includes('fuel')) targetCategory = "Fuel";

            financialData.balance -= amount;
            financialData.transactions.push({ id: Date.now(), title: title, amount: amount, type: 'expense', category: targetCategory, time: 'Now', date: '2026-06-20' });
            responseText = `✔ Expense Logged successfully inside category ${targetCategory}!`;
            responseType = 'expense-msg';
        }
        financialData.chatHistory.push({ sender: 'bot', text: responseText, type: responseType });
        saveData(); renderChatMessages();
    }, 300);
}

// --- INITIAL TEMPLATE SEEDING TRIGGER ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nav-dashboard').addEventListener('click', () => switchScreen('dashboard'));
    document.getElementById('nav-transactions').addEventListener('click', () => switchScreen('transactions'));
    document.getElementById('nav-chat').addEventListener('click', () => switchScreen('chat'));
    document.getElementById('nav-goals').addEventListener('click', () => switchScreen('goals'));
    document.getElementById('nav-analytics').addEventListener('click', () => switchScreen('analytics'));

    switchScreen('dashboard');
});