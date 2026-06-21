// --- LOCAL STORAGE DATA ENGINE ---
let financialData = JSON.parse(localStorage.getItem('myCFOData')) || {
    user: "Mughal",
    userAge: 22,
    userStatus: "Student",
    bestLine: "Consistently learning, endlessly building.",
    healthScore: 82,
    balance: 25000,
    income: 50000, 
    expenses: 32000,
    savingsAmount: 18000,        
    savingsRate: 36,
    customSavingsOverride: null, 
    chatHistory: [
        { sender: 'bot', text: '👋 Salam Mughal! Main aapka Personal CFO hoon. Kuch bhi kharcha ho yahan likhein (e.g., "500 petrol")', type: 'normal-msg' }
    ],
    transactions: [
        { id: 1, title: 'Salary Credited', amount: 50000, type: 'income', category: 'Salary', time: '11:22 AM', date: '2026-06-01' },
        { id: 2, title: 'KFC Burger Meal', amount: 1200, type: 'expense', category: 'Food', time: '11:21 AM', date: '2026-06-19' },
        { id: 3, title: 'Petrol Refuel', amount: 500, type: 'expense', category: 'Fuel', time: '11:20 AM', date: '2026-06-19' }
    ],
    goals: [
        { id: 101, title: 'New Laptop', target: 150000, saved: 45000, date: '31 Dec 2026', icon: 'fa-laptop' },
        { id: 102, title: 'Emergency Fund', target: 60000, saved: 15000, date: '31 Aug 2026', icon: 'fa-shield-halved' },
        { id: 103, title: 'PS5 Console', target: 70000, saved: 21000, date: '31 Jan 2027', icon: 'fa-gamepad' }
    ]
};

function saveData() {
    if (financialData.customSavingsOverride === null || financialData.customSavingsOverride === undefined) {
        financialData.savingsAmount = financialData.income - financialData.expenses;
    } else {
        financialData.savingsAmount = financialData.customSavingsOverride;
    }

    if (financialData.income > 0) {
        financialData.savingsRate = Math.round((financialData.savingsAmount / financialData.income) * 100);
    } else {
        financialData.savingsRate = 0;
    }
    
    if(financialData.savingsRate > 40) financialData.healthScore = 88;
    else if(financialData.savingsRate > 20) financialData.healthScore = 79;
    else financialData.healthScore = 55;

    localStorage.setItem('myCFOData', JSON.stringify(financialData));
}

// --- APP LAYER WINDOW SWITCHER ---
function switchScreen(screenName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${screenName}`);
    if (currentNav) currentNav.classList.add('active');

    if (screenName === 'dashboard') {
        const displayName = financialData.user || "User";
        const displayBestLine = financialData.bestLine || "Track your financial freedom seamlessly.";
        const displayStatus = financialData.userStatus ? ` • ${financialData.userStatus}` : "";

        // Dynamic side-by-side calculation for Savings Card
        let autoCalculatedRate = 0;
        if (financialData.income > 0) {
            autoCalculatedRate = Math.round(((financialData.income - financialData.expenses) / financialData.income) * 100);
        }
        let enteredValueDisplay = financialData.customSavingsOverride !== null ? `${financialData.customSavingsOverride}%` : "Not Set";
        let rateColor = financialData.savingsRate >= 0 ? 'var(--primary-green)' : 'var(--danger-red)';

        mainContent.innerHTML = `
            <div class="dashboard-header">
                <div class="user-profile-trigger-zone" id="profile-management-trigger">
                    <div class="profile-avatar-circle">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <span class="greeting">${displayBestLine}</span>
                        <h2 class="user-name">${displayName}</h2>
                        <p class="sub-text">Age: ${financialData.userAge || 'N/A'}${displayStatus}</p>
                    </div>
                </div>
                <div class="notification-bell"><i class="fa-solid fa-bell"></i><span class="bell-dot"></span></div>
            </div>

            <div class="health-card">
                <div class="health-info">
                    <h3>Financial Health Score</h3>
                    <div class="score-display"><span class="score-big">${financialData.healthScore}</span><span class="score-total">/100</span></div>
                    <span class="score-tag">${financialData.healthScore > 70 ? 'Good' : 'Critical'}</span>
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
                <div class="stat-card" id="change-expenses-trigger">
                    <div class="stat-meta"><p>Monthly Expenses ✏</p><h4>Rs. ${financialData.expenses.toLocaleString()}</h4></div>
                    <div class="stat-icon red-tint"><i class="fa-arrow-trend-down fa-solid"></i></div>
                </div>
                
                <div class="stat-card" id="change-savings-trigger">
                    <div class="stat-meta">
                        <p>Monthly Savings ✏</p>
                        <h4 style="font-size: 15px; margin-bottom: 2px; color: ${rateColor};">Live: ${financialData.savingsRate}%</h4>
                        <div style="font-size: 10px; color: var(--text-muted); display: flex; flex-direction: column; gap: 1px;">
                            <span>🤖 Auto Calc: <b style="color: var(--primary-green);">${autoCalculatedRate}%</b></span>
                            <span>👤 Entered: <b style="color: var(--accent-blue);">${enteredValueDisplay}</b></span>
                        </div>
                    </div>
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
                    <div class="progress-income" style="width: ${Math.min(100, Math.round((financialData.balance/financialData.income)*100))}%"></div>
                    <div class="progress-expense" style="width: ${Math.min(100, Math.round((financialData.expenses/financialData.income)*100))}%"></div>
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
        // Reactivate Profile Trigger Event
        document.getElementById('profile-management-trigger').addEventListener('click', openUserProfileModal);
        document.getElementById('act-exp').addEventListener('click', () => switchScreen('chat'));
        document.getElementById('act-inc').addEventListener('click', openDirectIncomeModal);
        document.getElementById('act-goal-dash').addEventListener('click', openCreateGoalModal);
        document.getElementById('act-rep').addEventListener('click', () => switchScreen('analytics'));
        document.getElementById('change-income-trigger').addEventListener('click', openIncomeUpdateModal);
        document.getElementById('change-balance-trigger').addEventListener('click', openBalanceUpdateModal);
        document.getElementById('change-expenses-trigger').addEventListener('click', openExpensesUpdateModal);
        document.getElementById('change-savings-trigger').addEventListener('click', openSavingsUpdateModal);
    } 
    
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
        document.getElementById('user-msg-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') processChatMessage(); });
        renderChatMessages();
    } 
    
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
                        <div class="goal-header-right">
                            <span class="goal-percentage">${percentage}%</span>
                            <i class="fa-solid fa-pen goal-action-icon edit-icon" title="Edit Goal" onclick="openEditGoalModal(${goal.id})"></i>
                            <i class="fa-solid fa-trash goal-action-icon delete-icon" title="Delete Goal" onclick="deleteGoal(${goal.id})"></i>
                        </div>
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
    } 
    
    else if (screenName === 'analytics') {
        let foodSum = 0, fuelSum = 0, otherSum = 0;
        let dynamicIncome = 0, dynamicExpense = 0;

        financialData.transactions.forEach(t => {
            if (t.type === 'income') {
                dynamicIncome += t.amount;
            } else if (t.type === 'expense') {
                dynamicExpense += t.amount;
                let cat = (t.category || '').toLowerCase();
                let title = t.title.toLowerCase();
                
                if (cat.includes('food') || title.includes('kfc') || title.includes('burger') || title.includes('khana') || title.includes('dinner')) {
                    foodSum += t.amount;
                } else if (cat.includes('fuel') || title.includes('petrol') || title.includes('bike')) {
                    fuelSum += t.amount;
                } else {
                    otherSum += t.amount;
                }
            }
        });

        financialData.income = dynamicIncome > 0 ? dynamicIncome : financialData.income;
        if (!localStorage.getItem('expensesOverridden')) {
            financialData.expenses = dynamicExpense; 
        }

        let absoluteNetSavings = financialData.income - financialData.expenses;
        let calculatedTotalExpenses = foodSum + fuelSum + otherSum || 1; 

        let foodPercent = Math.round((foodSum / calculatedTotalExpenses) * 100);
        let fuelPercent = Math.round((fuelSum / calculatedTotalExpenses) * 100);
        let otherPercent = Math.round((otherSum / calculatedTotalExpenses) * 100);

        let currentDay = new Date().getDate(); 
        let currentDailyBurnAvg = Math.round(financialData.expenses / currentDay);

        let maxVal = Math.max(financialData.income, financialData.expenses) || 1;
        let incBarHeight = Math.round((financialData.income / maxVal) * 130) + 10;
        let expBarHeight = Math.round((financialData.expenses / maxVal) * 130) + 10;

        mainContent.innerHTML = `
            <div class="analytics-header-row">
                <h3>Live Analytics</h3>
                <span class="time-filter-badge">This Month</span>
            </div>

            <div class="stats-grid" style="margin-bottom: 15px;">
                <div class="stat-card" style="padding:12px;">
                    <div class="stat-meta"><p>Net Savings</p><h4 style="color:var(--primary-green)">Rs. ${absoluteNetSavings.toLocaleString()}</h4></div>
                </div>
                <div class="stat-card" style="padding:12px;">
                    <div class="stat-meta"><p>Daily Burn Avg</p><h4>Rs. ${currentDailyBurnAvg.toLocaleString()}</h4></div>
                </div>
            </div>

            <div class="chart-wrapper-card">
                <div class="chart-title-area">Cash Flow Comparison (Rs.)</div>
                <div class="css-bar-chart-container">
                    <div class="chart-bar-column">
                        <span class="bar-value-label">${Math.round(financialData.income/1000)}k</span>
                        <div class="actual-bar-fill fill-income-color" style="height: ${incBarHeight}px"></div>
                        <span class="column-title-label">Income</span>
                    </div>
                    <div class="chart-bar-column">
                        <span class="bar-value-label">${Math.round(financialData.expenses/1000)}k</span>
                        <div class="actual-bar-fill fill-expense-color" style="height: ${expBarHeight}px"></div>
                        <span class="column-title-label">Expenses</span>
                    </div>
                </div>
            </div>

            <div class="category-breakdown-card">
                <h4>Category Wise Share</h4>
                
                <div class="category-row-item">
                    <div class="category-row-meta">
                        <span class="cat-name-wrap"><i class="fa-solid fa-utensils" style="color:#ff9800"></i> Food & Drinks</span>
                        <span class="cat-amount-val">Rs. ${foodSum.toLocaleString()} (${foodPercent}%)</span>
                    </div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${foodPercent}%; background:#ff9800;"></div></div>
                </div>

                <div class="category-row-item">
                    <div class="category-row-meta">
                        <span class="cat-name-wrap"><i class="fa-solid fa-gas-pump" style="color:var(--accent-blue)"></i> Fuel & Transport</span>
                        <span class="cat-amount-val">Rs. ${fuelSum.toLocaleString()} (${fuelPercent}%)</span>
                    </div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${fuelPercent}%; background:var(--accent-blue);"></div></div>
                </div>

                <div class="category-row-item">
                    <div class="category-row-meta">
                        <span class="cat-name-wrap"><i class="fa-solid fa-asterisk" style="color:#9c27b0"></i> Others / Misc</span>
                        <span class="cat-amount-val">Rs. ${otherSum.toLocaleString()} (${otherPercent}%)</span>
                    </div>
                    <div class="cat-progress-track"><div class="cat-progress-bar" style="width: ${otherPercent}%; background:#9c27b0;"></div></div>
                </div>
            </div>
        `;
    }
}

function openExpensesUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Update Monthly Expenses</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apna custom monthly expense total adjust karein:</p>
            <input type="number" id="new-expenses-val" class="modal-input-field" value="${financialData.expenses}" placeholder="Enter total expenses...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-expenses-btn">Update Expenses</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-expenses-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-expenses-val').value);
        if(!isNaN(amount) && amount >= 0) {
            financialData.expenses = amount;
            localStorage.setItem('expensesOverridden', 'true'); 
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

function openSavingsUpdateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>Update Monthly Savings (Rs.)</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apni custom savings amount enter karein. System percentage rate automatic calculate karega:</p>
            <input type="number" id="new-savings-val" class="modal-input-field" value="${financialData.savingsAmount}" placeholder="Enter Rs. amount (e.g. 5000)...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" id="reset-savings-btn" style="background:#1a0f0f; color:var(--danger-red); margin-right:auto;">Auto Calc</button>
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-savings-btn">Save Value</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    
    document.getElementById('reset-savings-btn').addEventListener('click', () => {
        financialData.customSavingsOverride = null;
        saveData();
        closeModal();
        switchScreen('dashboard');
    });

    document.getElementById('save-savings-btn').addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('new-savings-val').value);
        if(!isNaN(amount)) {
            financialData.customSavingsOverride = amount;
            financialData.savingsAmount = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

function openUserProfileModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>⚙ Update Profile Settings</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Apna complete display profile manage karein:</p>
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Full Name:</label>
            <input type="text" id="profile-name-input" class="modal-input-field" value="${financialData.user || ''}" placeholder="Enter your name...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Age:</label>
            <input type="number" id="profile-age-input" class="modal-input-field" value="${financialData.userAge || ''}" placeholder="Enter your age...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Best Line / Custom Motto:</label>
            <input type="text" id="profile-bestline-input" class="modal-input-field" value="${financialData.bestLine || ''}" placeholder="Enter your custom greeting text...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Professional Status:</label>
            <select id="profile-status-input" class="modal-input-field" style="background:#0d1923; color:#fff;">
                <option value="Student" ${financialData.userStatus === 'Student' ? 'selected' : ''}>Student</option>
                <option value="Employee" ${financialData.userStatus === 'Employee' ? 'selected' : ''}>Employee</option>
            </select>

            <div class="modal-actions-row" style="margin-top:15px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-profile-btn">Save Configuration</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('save-profile-btn').addEventListener('click', () => {
        const uName = document.getElementById('profile-name-input').value.trim();
        const uAge = parseInt(document.getElementById('profile-age-input').value);
        const uLine = document.getElementById('profile-bestline-input').value.trim();
        const uStatus = document.getElementById('profile-status-input').value;

        if(!uName || !uLine) {
            alert("Name aur Best Line complete fill karein!");
            return;
        }

        financialData.user = uName;
        financialData.userAge = !isNaN(uAge) ? uAge : "";
        financialData.bestLine = uLine;
        financialData.userStatus = uStatus;

        saveData();
        closeModal();
        switchScreen('dashboard');
    });
}

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
        if(!isNaN(amount) && amount >= 0) {
            financialData.balance = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

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
        if(!isNaN(amount) && amount >= 0) {
            financialData.income = amount;
            let salTx = financialData.transactions.find(t => t.category === 'Salary');
            if(salTx) salTx.amount = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        }
    });
}

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

        if(!isNaN(amount) && amount > 0) {
            financialData.balance += amount;
            financialData.income += amount; 
            financialData.transactions.push({
                id: Date.now(),
                title: source,
                amount: amount,
                type: 'income',
                category: 'Salary',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toISOString().split('T')[0]
            });
            saveData();
            closeModal();
            switchScreen('dashboard');
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
            <h3>✨ Create New Financial Goal</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Apna naya bachat target yahan save karein:</p>
            <input type="text" id="goal-title-input" class="modal-input-field" placeholder="Goal Name (e.g. University Fees, Laptop)">
            <input type="number" id="goal-target-input" class="modal-input-field" placeholder="Target Amount (Rs.)">
            <input type="text" id="goal-date-input" class="modal-input-field" placeholder="Target Date (e.g. 30 Dec 2026)">
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

        if (!name || isNaN(target) || target <= 0) {
            alert("Valid Details Enter karein.");
            return;
        }

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
        showGoalConfirmationToast(`Goal "${name}" Created!`);
    });
}

window.openAddFundsModal = function(goalId) {
    const targetGoal = financialData.goals.find(g => g.id === goalId);
    if(!targetGoal) return;

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
        if(!isNaN(val) && val > 0) {
            targetGoal.saved += val;
            financialData.balance -= val; 
            saveData();
            closeModal();
            switchScreen('goals');
        }
    });
};

window.deleteGoal = function(goalId) {
    const goalIndex = financialData.goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return;
    const goalTitle = financialData.goals[goalIndex].title;
    if (confirm(`Kya aap "${goalTitle}" delete karna chahte hain?`)) {
        financialData.goals.splice(goalIndex, 1);
        saveData();
        switchScreen('goals'); 
        showGoalConfirmationToast(`Deleted "${goalTitle}"`);
    }
};

window.openEditGoalModal = function(goalId) {
    closeModal(); 
    const targetGoal = financialData.goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = `
        <div class="cfo-modal-box">
            <h3>✏️ Modify Financial Goal</h3>
            <label style="font-size:11px; color:var(--text-muted);">Goal Title:</label>
            <input type="text" id="edit-goal-title" class="modal-input-field" value="${targetGoal.title}">
            <label style="font-size:11px; color:var(--text-muted);">Target Amount (Rs.):</label>
            <input type="number" id="edit-goal-target" class="modal-input-field" value="${targetGoal.target}">
            <label style="font-size:11px; color:var(--text-muted);">Target Date:</label>
            <input type="text" id="edit-goal-date" class="modal-input-field" value="${targetGoal.date}">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-modify-goal">Save Changes</button>
            </div>
        </div>
    `;
    document.querySelector('.app-container').appendChild(overlay);
    document.getElementById('confirm-modify-goal').addEventListener('click', () => {
        let updatedName = document.getElementById('edit-goal-title').value.trim();
        let updatedTarget = parseFloat(document.getElementById('edit-goal-target').value);
        let updatedDate = document.getElementById('edit-goal-date').value.trim() || 'No Limit';

        if (!updatedName || isNaN(updatedTarget) || updatedTarget <= 0) {
            alert("Valid details enter karein!");
            return;
        }
        targetGoal.title = updatedName;
        targetGoal.target = updatedTarget;
        targetGoal.date = updatedDate;
        saveData();
        closeModal();
        switchScreen('goals'); 
        showGoalConfirmationToast(`Updated "${updatedName}"`);
    });
};

window.closeModal = function() {
    const m = document.getElementById('modal-layer');
    if(m) m.remove();
};

function showGoalConfirmationToast(textMessage) {
    const toast = document.createElement('div');
    toast.style.position = 'absolute';
    toast.style.bottom = '90px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#00e676';
    toast.style.color = '#030a10';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '999';
    toast.innerHTML = `🎯 ${textMessage}`;
    document.querySelector('.app-container').appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
}

function renderChatMessages() {
    const chatBox = document.getElementById('chat-box-area');
    if(!chatBox) return;
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
    if(!inputField) return;
    const query = inputField.value.trim();
    if(!query) return;

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
            let targetCategory = "Others";
            
            if(title.toLowerCase().includes('burger') || title.toLowerCase().includes('kfc') || title.toLowerCase().includes('khana') || title.toLowerCase().includes('dinner')) {
                targetCategory = "Food";
            } else if(title.toLowerCase().includes('petrol') || title.toLowerCase().includes('fuel') || title.toLowerCase().includes('bike')) {
                targetCategory = "Fuel";
            }

            financialData.expenses += amount;
            financialData.balance -= amount;
            financialData.transactions.push({
                id: Date.now(),
                title: title.charAt(0).toUpperCase() + title.slice(1),
                amount: amount,
                type: 'expense',
                category: targetCategory,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toISOString().split('T')[0]
            });
            responseText = `✔ <b>Expense Tracked</b><br>Amount: Rs. ${amount}<br>Category: ${targetCategory}`;
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
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toISOString().split('T')[0]
            });
            responseText = `💰 <b>Income Logged</b><br>Amount: Rs. ${amount}`;
            responseType = 'income-msg';
        }

        financialData.chatHistory.push({ sender: 'bot', text: responseText, type: responseType });
        saveData();
        renderChatMessages();
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('nav-dashboard').addEventListener('click', () => switchScreen('dashboard'));
    document.getElementById('nav-transactions').addEventListener('click', () => switchScreen('transactions'));
    document.getElementById('nav-chat').addEventListener('click', () => switchScreen('chat'));
    document.getElementById('nav-goals').addEventListener('click', () => switchScreen('goals'));
    document.getElementById('nav-analytics').addEventListener('click', () => switchScreen('analytics'));

    switchScreen('dashboard');
});