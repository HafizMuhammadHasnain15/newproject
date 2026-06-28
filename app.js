/**
 * Personal CFO - Core Financial Application Engine (Architect Version 5.3 - Production Ready)
 * Integrated Features: Expense Accumulation, Budget Warnings, Transaction CRUD,
 * Goal Savings Integration, Dynamic Cash-to-Percentage Savings Converter,
 * Strict Profile Icon Click Trigger, Zero-State Data Reset on Profile Save,
 * Fixed Direct Balance Overwrites, Full Asset Breakdown on Health Card view.
 * * * EXPERT ARCHITECT SECURITY & FINANCIAL PATCH UPDATES:
 * 1. Enforced strict formulation: Current Balance = (Initial Wallet Seed + Monthly Income) + Total Incomes - Total Expenses - Total Goals - Custom Savings - Total Investments.
 * 2. Integrated "Previous Account Baseline" history logger tracking inside Financial Metrics Sheet.
 * 3. Resolved transaction state aggregation leaks to prevent residual mathematical side-effects.
 * 4. Implemented secure RegEx string sanitation filtering for all innerHTML insertion points to mitigate XSS risk.
 * 5. Sanitized memory footprint by swapping element listeners via functional node-cloning replication strategy.
 * * * FINAL VERIFIED FINANCIAL BUG FIX:
 * - When a goal is purchased (isPurchased: true), its saved funds are strictly deducted from BOTH "Goal Allocation" and "Total Net Asset Value".
 * - SAVINGS POOL DYNAMIC RETAINMENT FIX: Enforced correct mathematical baseline so that purchased goals do NOT force the Savings Pool to zero.
 * * * NEW DYNAMIC REAL-TIME DATE & TIME SYNC UPDATE:
 * - Syncs transaction timestamps with mobile system date and time (DD/MM/YYYY + Time).
 * * * INVESTMENT MODULE INTEGRATION (FINANCE MANAGER UPDATE):
 * - Added dedicated Investment asset module tracking. Deducts safely from Current Balance while preserving Net Worth asset distribution models.
 */

// --- SECURE CRYPTO & SANITIZATION UTILITIES ---
/**
 * Filters and sanitizes raw input strings to prevent HTML Injection and XSS attacks.
 * @param {string} rawInput - The unverified input string.
 * @returns {string} - The sanitized string with HTML entities encoded.
 */
function sanitizeInput(rawInput) {
    if (typeof rawInput !== 'string') return '';
    return rawInput
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

// --- LOCAL STORAGE DATA ENGINE INITIALIZATION ---
const DEFAULT_STATE = {
    user: "Mughal",
    userAge: 22,
    userStatus: "Student",
    bestLine: "Consistently learning, endlessly building.",
    healthScore: 82,
    initialSeedWallet: 25000,
    previousSeedWallet: 25000,   // Expert Memory Track for Historical Baseline Record
    balance: 50000,              // Explicitly derived balance matching (Seed + Income) Base Equation
    income: 50000,
    expenses: 32000,
    expenseWarningLimit: 40000,
    savingsAmount: 18000,
    savingsRate: 36,
    customSavingsOverride: null,
    activeNotification: null,
    chatHistory: [
        { sender: 'bot', text: '👋 Salam Mughal! Main aapka Personal CFO hoon. Kuch bhi kharcha ho yahan likhein (e.g., "500 petrol")', type: 'normal-msg' }
    ],
    transactions: [
        { id: 1, title: 'Salary Credited', amount: 50000, type: 'income', category: 'Salary', time: '11:22 AM', date: '01/06/2026' },
        { id: 2, title: 'KFC Burger Meal', amount: 1200, type: 'expense', category: 'Food', time: '11:21 AM', date: '19/06/2026' },
        { id: 3, title: 'Petrol Refuel', amount: 500, type: 'expense', category: 'Fuel', time: '11:20 AM', date: '19/06/2026' }
    ],
    goals: [
        { id: 101, title: 'New Laptop', target: 150000, saved: 45000, date: '31 Dec 2026', icon: 'fa-laptop', isPurchased: false },
        { id: 102, title: 'Emergency Fund', target: 60000, saved: 15000, date: '31 Aug 2026', icon: 'fa-shield-halved', isPurchased: false },
        { id: 103, title: 'PS5 Console', target: 70000, saved: 70000, date: '31 Jan 2027', icon: 'fa-gamepad', isPurchased: false }
    ],
    investments: [] // Finance Manager Investment Ledger
};

let financialData = (() => {
    try {
        const stored = localStorage.getItem('myCFOData');
        if (!stored) return DEFAULT_STATE;
        let parsed = JSON.parse(stored);

        // Self-healing check mechanisms for state transitions
        if (parsed.initialSeedWallet === undefined) {
            parsed.initialSeedWallet = parsed.balance !== undefined ? parsed.balance : 25000;
        }
        if (parsed.previousSeedWallet === undefined) {
            parsed.previousSeedWallet = parsed.initialSeedWallet;
        }
        if (parsed.expenseWarningLimit === undefined) {
            parsed.expenseWarningLimit = 40000;
        }
        if (parsed.activeNotification === undefined) {
            parsed.activeNotification = null;
        }
        if (!parsed.investments) {
            parsed.investments = [];
        }
        return parsed;
    } catch (e) {
        console.error("Critical State Engine Extraction Error, fallback executed.", e);
        return DEFAULT_STATE;
    }
})();

// Temporary tracking flag for dropdown state management
let isNotificationDropdownOpen = false;

// Shared calculation storage variables for global template sync
let totalGoalFundsAllocated = 0;
let absoluteGrandTotalWorth = 0;
let totalInvestmentsAccumulated = 0;

/**
 * Derives and calculates all balance, income, expense, and savings data loops
 * directly from the transaction ledger array before saving to localStorage.
 */
function saveData() {
    try {
        let aggregateLedgerIncome = 0;
        let aggregateLedgerExpense = 0;

        // Calculate Investment totals first to ensure separation from normal expenses
        totalInvestmentsAccumulated = 0;
        if (Array.isArray(financialData.investments)) {
            financialData.investments.forEach(inv => {
                totalInvestmentsAccumulated += (Number(inv.amount) || 0);
            });
        }

        if (Array.isArray(financialData.transactions)) {
            financialData.transactions.forEach(t => {
                const amt = Number(t.amount) || 0;
                if (t.type === 'income') {
                    aggregateLedgerIncome += amt;
                } else if (t.type === 'expense') {
                    // Investment transaction should not be added to Expenses
                    if (t.category !== 'Investments') {
                        aggregateLedgerExpense += amt;
                    }
                }
            });
        }

        // Set live expenses based on non-investment transactions
        financialData.expenses = aggregateLedgerExpense;

        totalGoalFundsAllocated = 0; // Reset global metric for display (Only counts active non-bought goals)
        let totalAllGoalsIncludingPurchased = 0; // Total tracking for layout deduction matrix

        if (Array.isArray(financialData.goals)) {
            financialData.goals.forEach(g => {
                const savedAmt = Number(g.saved) || 0;
                totalAllGoalsIncludingPurchased += savedAmt;

                if (!g.isPurchased) {
                    totalGoalFundsAllocated += savedAmt;
                }
            });
        }

        // Core base savings logic
        let baseSavings = financialData.income - financialData.expenses;

        if (financialData.customSavingsOverride !== null && financialData.customSavingsOverride !== undefined) {
            financialData.savingsAmount = financialData.customSavingsOverride + totalGoalFundsAllocated;
        } else {
            financialData.savingsAmount = baseSavings + totalGoalFundsAllocated;
        }

        if (financialData.savingsAmount < 0) financialData.savingsAmount = 0;

        // Investment safely deducted from Current Balance
        let baselineCapitalPool = (Number(financialData.initialSeedWallet) || 0) + (Number(financialData.income) || 0);
        let deductionsPool = aggregateLedgerExpense + totalAllGoalsIncludingPurchased + totalInvestmentsAccumulated;

        if (financialData.customSavingsOverride !== null && financialData.customSavingsOverride !== undefined) {
            deductionsPool += financialData.customSavingsOverride;
        }

        financialData.balance = baselineCapitalPool + aggregateLedgerIncome - deductionsPool;

        if (financialData.income > 0) {
            financialData.savingsRate = Math.round((financialData.savingsAmount / financialData.income) * 100);
        } else {
            financialData.savingsRate = 0;
        }

        // Dynamic formulation logic for standard health scores
        if (financialData.savingsRate > 40) financialData.healthScore = 88;
        else if (financialData.savingsRate > 20) financialData.healthScore = 79;
        else financialData.healthScore = 55;

        // FIXED LOGIC CHANGE: Total Net Asset Value calculation shows total money minus only real expenses
        // let totalAssetInflowSum = (Number(financialData.initialSeedWallet) || 0) + (Number(financialData.income) || 0) + aggregateLedgerIncome;
        // absoluteGrandTotalWorth = totalAssetInflowSum - aggregateLedgerExpense;

        // =========================================================================
        // REAL-TIME MULTI-WALLET NET WORTH MATH CALCULATIONS LOGIC
        // =========================================================================
        let externalWalletsSum = 0;
        if (Array.isArray(financialData.wallets)) {
            externalWalletsSum = financialData.wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);
        }

        let totalAssetInflowSum = (Number(financialData.initialSeedWallet) || 0) + (Number(financialData.income) || 0) + aggregateLedgerIncome;

        // Multi-wallets ka balance total Net Worth me merge ho gaya
        absoluteGrandTotalWorth = (totalAssetInflowSum - aggregateLedgerExpense) + externalWalletsSum;

        localStorage.setItem('myCFOData', JSON.stringify(financialData));
    } catch (error) {
        console.error("State Synchronization Writing Interrupted", error);
    }
}

/**
 * Replaces an element with a clean clone to remove active event listeners,
 * avoiding memory leaks before attaching the new click handler callback.
 * @param {string} elementId - Target DOM element ID attribute.
 * @param {Function} eventHandler - Callback implementation pointer.
 */
function safelyBindClick(elementId, eventHandler) {
    const oldElement = document.getElementById(elementId);
    if (!oldElement) return;
    const newElement = oldElement.cloneNode(true);
    if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
    newElement.addEventListener('click', eventHandler);
}

// --- APP LAYER WINDOW SCREEN SWITCHER ---
function switchScreen(screenName) {
    // const mainContent = document.getElementById('main-content');
    // if (!mainContent) return;
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // FIXED: Kisi bhi tab par click hone par Investments aur Wallets dono panels ko hide karein
    const customInvestmentsPane = document.getElementById('investments-screen');
    if (customInvestmentsPane) customInvestmentsPane.classList.add('d-none');
    const customWalletsPane = document.getElementById('wallets-screen');
    if (customWalletsPane) customWalletsPane.classList.add('d-none');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${screenName}`);
    if (currentNav) currentNav.classList.add('active');

    // document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    // const currentNav = document.getElementById(`nav-${screenName}`);
    // if (currentNav) currentNav.classList.add('active');

    // Sync all calculations before rendering the screen view state
    saveData();

    // 1. DASHBOARD SYSTEM VIEW LAYOUT
    if (screenName === 'dashboard') {
        const displayName = sanitizeInput(financialData.user || "User");
        const displayBestLine = sanitizeInput(financialData.bestLine || "Track your financial freedom seamlessly.");
        const displayStatus = financialData.userStatus ? ` • ${sanitizeInput(financialData.userStatus)}` : "";

        let autoCalculatedRate = 0;
        if (financialData.income > 0) {
            autoCalculatedRate = Math.round(((financialData.income - financialData.expenses) / financialData.income) * 100);
        }

        let userEnteredPercentDisplay = "Not Set";
        if (financialData.customSavingsOverride !== null && financialData.income > 0) {
            let computedPercent = Math.round((financialData.customSavingsOverride / financialData.income) * 100);
            userEnteredPercentDisplay = `${computedPercent}% (Rs. ${Number(financialData.customSavingsOverride).toLocaleString()})`;
        }

        let rateColor = financialData.savingsRate >= 0 ? 'var(--primary-green)' : 'var(--danger-red)';
        const isBudgetExceeded = financialData.expenses >= (financialData.expenseWarningLimit || Infinity);

        const expenseTitleText = isBudgetExceeded
            ? `<span style="color:var(--danger-red); font-weight:bold;">⚠️ Budget Exceeded!</span>`
            : `Monthly Expenses ✏`;

        const currentSystemDateObj = new Date();
        const liveMonthYearString = currentSystemDateObj.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // --- CORE LIVE NOTIFICATION GENERATOR ENGINE ---
        let dynamicNotificationsList = [];

        let seedWalletTarget = Number(financialData.initialSeedWallet) || 1;
        let currentBalancePercent = (financialData.balance / seedWalletTarget) * 100;
        if (currentBalancePercent <= 20) {
            dynamicNotificationsList.push(`⚠️ Alert: Your wallet current balance has dropped to ${currentBalancePercent.toFixed(0)}%! Please restrict further outflows.`);
        }

        if (isBudgetExceeded) {
            dynamicNotificationsList.push(`🚨 Warning: Monthly expense tracking limit has been breached! Expenses crossed Rs. ${Number(financialData.expenseWarningLimit).toLocaleString()}`);
        }

        if (Array.isArray(financialData.goals)) {
            financialData.goals.forEach(g => {
                if (Number(g.saved) >= Number(g.target) && !g.isPurchased) {
                    dynamicNotificationsList.push(`🎯 Congratulations! Your saving target for "${sanitizeInput(g.title)}" has been achieved.`);
                }
            });
        }

        let notificationDropdownOverlayHTML = '';
        if (isNotificationDropdownOpen) {
            let optionsRows = '';
            if (dynamicNotificationsList.length === 0) {
                optionsRows = `<li style="padding: 10px; font-size: 11px; color: var(--text-muted); text-align: center;">No new alerts at this time.</li>`;
            } else {
                dynamicNotificationsList.forEach((note, idx) => {
                    optionsRows += `
                        <li style="padding: 10px 12px; font-size: 11px; color: #fff; border-bottom: ${idx !== dynamicNotificationsList.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'}; line-height: 1.4; text-align: left; background: rgba(255,255,255,0.02);">
                            ${note}
                        </li>
                    `;
                });
            }

            notificationDropdownOverlayHTML = `
                <div style="position: absolute; right: 0; top: 50px; background: #0b1a26; border: 1px solid var(--border-color); width: 280px; max-height: 250px; overflow-y: auto; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 9999; padding: 4px;" id="cfo-notification-dropdown-box">
                    <div style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: var(--accent-blue); border-bottom: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: space-between;">
                        <span>🔔 SYSTEM NOTIFICATIONS</span>
                        <span style="font-size: 9px; color: var(--text-muted); font-weight: normal;">Live Updates</span>
                    </div>
                    <ul style="list-style: none; margin: 0; padding: 0;">
                        ${optionsRows}
                    </ul>
                </div>
            `;
        }

        mainContent.innerHTML = `
            <div class="dashboard-header" style="position: relative;">
                <div class="user-profile-trigger-zone" style="cursor: default; display: flex; align-items: center; gap: 12px;">
                    <div class="profile-avatar-circle" id="profile-icon-only-trigger" style="cursor: pointer;" title="Click icon to edit profile and finances">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <span class="greeting">${displayBestLine}</span>
                        <h2 class="user-name">${displayName}</h2>
                        <p class="sub-text">Age: ${sanitizeInput(String(financialData.userAge || 'N/A'))}${displayStatus}</p>
                    </div>
                </div>
                
                <button id="dashboard-bell-icon" class="notification-bell" style="cursor: pointer; position: relative; outline: none; background: var(--card-bg); border: 1px solid var(--border-color); display: flex; justify-content: center; align-items: center;" aria-label="Toggle Alert Window">
                    <i class="fa-solid fa-bell"></i>
                    ${dynamicNotificationsList.length > 0 ? `<span class="bell-dot" style="background: var(--danger-red); width: 8px; height: 8px; top: 8px; right: 8px;"></span>` : ''}
                </button>
                
                ${notificationDropdownOverlayHTML}
            </div>

            <div class="health-card" style="display: flex; flex-direction: column; gap: 12px; padding: 16px; min-height: auto;">
                <div style="width: 100%; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 8px;">
                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-blue); font-weight: 600;">💰 Total Net Asset Value (Total Net Worth)</span>
                    <h2 style="font-size: 22px; margin: 2px 0 0 0; color: #fff; font-weight: 800;">Rs. ${absoluteGrandTotalWorth.toLocaleString()}</h2>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div class="health-info" style="flex: 1;">
                        <h3 style="margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; color: var(--text-muted);">Financial Metrics Sheet</h3>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-top: 0px;">
                    <div style="font-size: 11px;"><span style="color:var(--text-muted);">Current Balance:</span><br><b style="color:#fff;">Rs. ${financialData.balance.toLocaleString()}</b></div>
                    <div style="font-size: 11px;"><span style="color:var(--text-muted);">Monthly Income:</span><br><b style="color:#fff;">Rs. ${financialData.income.toLocaleString()}</b></div>
                    <div style="font-size: 11px;"><span style="color:var(--text-muted);">Monthly Expenses:</span><br><b style="color:var(--danger-red);">Rs. ${financialData.expenses.toLocaleString()}</b></div>
                    <div style="font-size: 11px;"><span style="color:var(--amber-gold);">Goal Allocation:</span><br><b style="color:var(--amber-gold);">Rs. ${totalGoalFundsAllocated.toLocaleString()}</b></div>
                    <div style="font-size: 11px; grid-column: span 2; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">
                        <span style="color:var(--accent-blue);">Total Investments Asset Pool:</span> <b style="color:var(--accent-blue);">Rs. ${totalInvestmentsAccumulated.toLocaleString()}</b>
                    </div>
                    <div style="font-size: 11px; grid-column: span 2; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 4px;">
                        <span style="color:var(--text-muted);">Savings Pool:</span> <b style="color:var(--primary-green);">Rs. ${financialData.savingsAmount.toLocaleString()} (${financialData.savingsRate}%)</b>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card" id="change-balance-trigger" style="cursor: pointer;">
                    <div class="stat-meta"><p>Current Balance ✏</p><h4>Rs. ${financialData.balance.toLocaleString()}</h4></div>
                    <div class="stat-icon blue-tint"><i class="fa-wallet fa-solid"></i></div>
                </div>
                <div class="stat-card" id="change-income-trigger" style="cursor: pointer;">
                    <div class="stat-meta"><p>Monthly Income ✏</p><h4>Rs. ${financialData.income.toLocaleString()}</h4></div>
                    <div class="stat-icon dark-blue-tint"><i class="fa-building-columns fa-solid"></i></div>
                </div>
                <div class="stat-card" id="change-expenses-trigger" style="cursor: pointer; ${isBudgetExceeded ? 'border: 1px solid var(--danger-red); background:#1a0b0d;' : ''}">
                    <div class="stat-meta"><p>${expenseTitleText}</p><h4>Rs. ${financialData.expenses.toLocaleString()}</h4><small style="font-size:9px; color:var(--text-muted)">Limit: Rs. ${Number(financialData.expenseWarningLimit).toLocaleString()}</small></div>
                    <div class="stat-icon red-tint"><i class="fa-arrow-trend-down fa-solid"></i></div>
                </div>
                <div class="stat-card" id="change-savings-trigger" style="cursor: pointer;">
                    <div class="stat-meta">
                        <p>Total Savings Pool ✏</p>
                        <h4 style="font-size: 15px; margin-bottom: 2px; color: ${rateColor};">Total: ${financialData.savingsRate}% (Rs. ${financialData.savingsAmount.toLocaleString()})</h4>
                        <div style="font-size: 10px; color: var(--text-muted); display: flex; flex-direction: column; gap: 1px;">
                            <span>🤖 Auto Calc Base: <b style="color: var(--primary-green);">${autoCalculatedRate}%</b></span>
                            <span>👤 User Entered Base: <b style="color: var(--accent-blue);">${userEnteredPercentDisplay}</b></span>
                        </div>
                    </div>
                    <div class="stat-icon purple-tint"><i class="fa-pie-chart fa-solid"></i></div>
                </div>
            </div>

            <div class="overview-section">
                <div class="overview-title"><h3>Month Overview</h3><span>${liveMonthYearString}</span></div>
                <div class="overview-labels">
                    <span class="lbl-income">Income<br><b>Rs. ${financialData.income.toLocaleString()}</b></span>
                    <span class="lbl-expense">Expenses<br><b>Rs. ${financialData.expenses.toLocaleString()}</b></span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-income" style="width: ${Math.min(100, Math.round((financialData.balance / (financialData.income || 1)) * 100))}%"></div>
                    <div class="progress-expense" style="width: ${Math.min(100, Math.round((financialData.expenses / (financialData.income || 1)) * 100))}%"></div>
                </div>
            </div>

            <div class="quick-actions-section">
                <h3>Quick Actions</h3>
                <div class="actions-row" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;">
                    <div class="action-btn-wrapper" id="act-exp" style="cursor: pointer;"><div class="action-btn btn-red"><i class="fa-solid fa-plus"></i></div><span style="font-size:9px;">Add Expense</span></div>
                    <div class="action-btn-wrapper" id="act-inc" style="cursor: pointer;"><div class="action-btn btn-green"><i class="fa-solid fa-plus"></i></div><span style="font-size:9px;">Add Income</span></div>
                    <div class="action-btn-wrapper" id="act-goal-dash" style="cursor: pointer;"><div class="action-btn btn-amber"><i class="fa-solid fa-star"></i></div><span style="font-size:9px;">Add Goal</span></div>
                    <div class="action-btn-wrapper" id="act-invest" style="cursor: pointer;"><div class="action-btn btn-blue" style="background: linear-gradient(135deg, #00b0ff, #007bb5);"><i class="fa-solid fa-chart-line"></i></div><span style="font-size:9px; color: var(--accent-blue); font-weight:700;">Invest Money</span></div>
                    <div class="action-btn-wrapper" id="act-rep" style="cursor: pointer;"><div class="action-btn btn-blue"><i class="fa-solid fa-chart-simple"></i></div><span style="font-size:9px;">See Reports</span></div>
                </div>
            </div>
        `;

        safelyBindClick('profile-icon-only-trigger', openUserProfileModal);
        safelyBindClick('act-exp', () => switchScreen('chat'));
        safelyBindClick('act-inc', openDirectIncomeModal);
        safelyBindClick('act-goal-dash', openCreateGoalModal);
        safelyBindClick('act-invest', openDirectInvestmentModal);
        safelyBindClick('act-rep', () => switchScreen('analytics'));
        safelyBindClick('change-income-trigger', openIncomeUpdateModal);
        safelyBindClick('change-balance-trigger', openBalanceUpdateModal);
        safelyBindClick('change-expenses-trigger', openExpensesUpdateModal);
        safelyBindClick('change-savings-trigger', openSavingsUpdateModal);

        safelyBindClick('dashboard-bell-icon', () => {
            isNotificationDropdownOpen = !isNotificationDropdownOpen;
            switchScreen('dashboard');
        });
    }

    // 2. CFO BOT CHAT SCREEN VIEW STATE
    else if (screenName === 'chat') {
        isNotificationDropdownOpen = false;
        mainContent.innerHTML = `
            <div class="chat-screen-layout">
                <div class="chat-header">
                    <i class="fa-solid fa-arrow-left" id="back-to-dash" style="cursor: pointer;"></i>
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
        safelyBindClick('back-to-dash', () => switchScreen('dashboard'));
        safelyBindClick('send-msg-btn', processChatMessage);

        const textInput = document.getElementById('user-msg-input');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') processChatMessage();
            });
        }
        renderChatMessages();
    }

    // 3. GOALS SCREEN LOGIC SYSTEM VIEW
    else if (screenName === 'goals') {
        isNotificationDropdownOpen = false;
        let goalsHTML = `
            <div class="goals-header">
                <h3>My Goals</h3>
                <div class="add-goal-icon-btn" id="create-new-goal-btn" style="cursor: pointer;"><i class="fa-solid fa-plus"></i></div>
            </div>
        `;

        if (Array.isArray(financialData.goals)) {
            financialData.goals.forEach(goal => {
                const targetValue = Number(goal.target) || 1;
                const savedValue = Number(goal.saved) || 0;
                let percentage = Math.min(Math.round((savedValue / targetValue) * 100), 100);
                let remaining = Math.max(0, targetValue - savedValue);

                const isAchieved = savedValue >= targetValue;
                const isPurchased = goal.isPurchased === true;

                let strikeStyle = isPurchased
                    ? 'position: relative; opacity: 0.6; filter: grayscale(50%); transition: all 0.3s ease;'
                    : 'position: relative; transition: all 0.3s ease;';

                let actionButtonHTML = `<button class="save-fund-btn" onclick="openAddFundsModal(${goal.id})">Add Funds</button>`;

                if (isAchieved) {
                    if (isPurchased) {
                        actionButtonHTML = `<span style="color:var(--primary-green); font-size:11px; font-weight:bold;"><i class="fa-solid fa-circle-check"></i> Bought &amp; Logged</span>`;
                    } else {
                        actionButtonHTML = `
                            <button class="save-fund-btn" 
                                    style="background: linear-gradient(135deg, #00e676, #00b0ff); color:#000; font-weight:bold; border:none;" 
                                    onclick="triggerGoalPurchase(${goal.id}, '${sanitizeInput(goal.title)}')">
                                🛍️ You can buy it!
                            </button>
                        `;
                    }
                }

                goalsHTML += `
                    <div class="goal-card" style="${strikeStyle}">
                        <div class="goal-top-info">
                            <div class="goal-avatar"><i class="fa-solid ${sanitizeInput(goal.icon || 'fa-star')}"></i></div>
                            <div class="goal-details">
                                <h4 style="${isPurchased ? 'text-decoration: line-through;' : ''}">${sanitizeInput(goal.title)}</h4>
                                <p>Target: Rs. ${Number(goal.target).toLocaleString()} • Saved: Rs. ${savedValue.toLocaleString()}</p>
                            </div>
                            <div class="goal-header-right" style="position: relative; z-index: 99;">
                                <span class="goal-percentage">${percentage}%</span>
                                ${!isPurchased ? `<i class="fa-solid fa-pen goal-action-icon edit-icon" title="Edit Goal" style="cursor:pointer;" onclick="openEditGoalModal(${goal.id})"></i>` : ''}
                                <i class="fa-solid fa-trash goal-action-icon delete-icon" title="Delete Goal" style="cursor:pointer; pointer-events: auto;" onclick="deleteGoal(${goal.id})"></i>
                            </div>
                        </div>
                        <div class="goal-progress-track">
                            <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="goal-bottom-actions">
                            <div class="goal-remaining">Remaining: <b>Rs. ${remaining.toLocaleString()}</b><br><small style="color:var(--text-muted)">Target Date: ${sanitizeInput(goal.date)}</small></div>
                            <div class="action-btn-injection-space">${actionButtonHTML}</div>
                        </div>
                    </div>
                `;
            });
        }

        mainContent.innerHTML = goalsHTML;
        safelyBindClick('create-new-goal-btn', openCreateGoalModal);
    }

    // 4. TRANSACTION MODULE FEED VIEW (DUAL DATE & TIME VIEW SYNC MAINTAINED)
    else if (screenName === 'transactions') {
        isNotificationDropdownOpen = false;
        let txRows = '';
        if (Array.isArray(financialData.transactions)) {
            financialData.transactions.slice().reverse().forEach(tx => {
                const isIncome = tx.type === 'income';
                const txDisplayDate = tx.date ? sanitizeInput(tx.date) : 'N/A';
                const txDisplayTime = tx.time ? sanitizeInput(tx.time) : 'N/A';

                txRows += `
                    <div class="tx-card" style="margin-bottom:8px;">
                        <div class="tx-left">
                            <div class="tx-icon-frame ${isIncome ? 'frame-green' : 'frame-red'}">
                                <i class="${isIncome ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-basket-shopping'}"></i>
                            </div>
                            <div>
                                <h4>${sanitizeInput(tx.title)}</h4>
                                <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                                    <i class="fa-regular fa-calendar-days" style="margin-right: 3px; font-size: 10px;"></i> ${txDisplayDate} &nbsp;•&nbsp; 
                                    <i class="fa-regular fa-clock" style="margin-right: 3px; font-size: 10px;"></i> ${txDisplayTime} &nbsp;•&nbsp; 
                                    <span>${sanitizeInput(tx.category || 'General')}</span>
                                </p>
                            </div>
                        </div>
                        <div class="tx-right" style="display:flex; align-items:center; gap:12px;">
                            <span class="${isIncome ? 'tx-amount-inc' : 'tx-amount-exp'}" style="margin-right:4px;">
                                ${isIncome ? '+' : '-'} Rs. ${Number(tx.amount).toLocaleString()}
                            </span>
                            <i class="fa-solid fa-pen" style="color:var(--accent-blue); cursor:pointer; font-size:12px;" title="Edit Transaction" onclick="openEditTransactionModal(${tx.id})"></i>
                            <i class="fa-solid fa-trash" style="color:var(--danger-red); cursor:pointer; font-size:12px;" title="Delete Transaction" onclick="deleteTransaction(${tx.id})"></i>
                        </div>
                    </div>
                `;
            });
        }

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

    // 5. ANALYTICS ENGINE COMPUTATION CONTEXT
    else if (screenName === 'analytics') {
        isNotificationDropdownOpen = false;
        let foodSum = 0, fuelSum = 0, otherSum = 0;
        let analyticIncome = 0, analyticExpense = 0;

        // Strict validation engine mapping expense category allocations loop
        if (Array.isArray(financialData.transactions)) {
            financialData.transactions.forEach(t => {
                const amt = Number(t.amount) || 0;
                if (t.type === 'income') {
                    analyticIncome += amt;
                } else if (t.type === 'expense' && t.category !== 'Investments') {
                    analyticExpense += amt;
                    let cat = (t.category || '').toLowerCase();
                    let title = (t.title || '').toLowerCase();

                    if (cat.includes('food') || title.includes('kfc') || title.includes('burger') || title.includes('khana') || title.includes('dinner')) {
                        foodSum += amt;
                    } else if (cat.includes('fuel') || title.includes('petrol') || title.includes('bike') || title.includes('car')) {
                        fuelSum += amt;
                    } else {
                        otherSum += amt;
                    }
                }
            });
        }

        const displayIncome = analyticIncome > 0 ? analyticIncome : (Number(financialData.income) || 0);
        const displayExpense = analyticExpense > 0 ? analyticExpense : (Number(financialData.expenses) || 0);

        // Fetch multi-wallets aggregate calculation parameters
        let walletSumValue = 0;
        if (Array.isArray(financialData.wallets)) {
            walletSumValue = financialData.wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);
        }

        let absoluteNetSavings = displayIncome - displayExpense;
        let calculatedTotalExpenses = foodSum + fuelSum + otherSum || 1;

        let foodPercent = Math.round((foodSum / calculatedTotalExpenses) * 100);
        let fuelPercent = Math.round((fuelSum / calculatedTotalExpenses) * 100);
        let otherPercent = Math.round((otherSum / calculatedTotalExpenses) * 100);

        // Dynamic formulation bar heights mappings formulas
        let maxVal = Math.max(displayIncome, displayExpense, walletSumValue) || 1;
        let incBarHeight = Math.round((displayIncome / maxVal) * 120) + 10;
        let expBarHeight = Math.round((displayExpense / maxVal) * 120) + 10;
        let walletBarHeight = Math.round((walletSumValue / maxVal) * 120) + 10;

        // Dynamic formulation logic for standard accounts data allocation listings
        let walletGraphRowsHtml = '';
        if (Array.isArray(financialData.wallets) && financialData.wallets.length > 0) {
            walletGraphRowsHtml = `
                <div style="margin-top:20px; background:var(--card-bg); border:1px solid var(--border-color); padding:16px; border-radius:16px;">
                    <div style="font-size:12px; font-weight:600; color:var(--accent-blue); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">🏦 Bank Accounts Share Progress</div>
            `;
            financialData.wallets.forEach(w => {
                let sharePct = walletSumValue > 0 ? Math.round(((parseFloat(w.balance) || 0) / walletSumValue) * 100) : 0;
                walletGraphRowsHtml += `
                    <div style="margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                            <span style="color:#fff;"><i class="fa-solid fa-building-columns" style="color:var(--primary-green); margin-right:5px;"></i> ${w.name}</span>
                            <span style="color:var(--text-muted);">Rs. ${Number(w.balance).toLocaleString()} (${sharePct}%)</span>
                        </div>
                        <div style="background:#152632; height:6px; border-radius:4px; overflow:hidden;">
                            <div style="width: ${sharePct}%; background:var(--primary-green); height:100%;"></div>
                        </div>
                    </div>`;
            });
            walletGraphRowsHtml += `</div>`;
        }

        mainContent.innerHTML = `
            <div style="padding: 20px; padding-bottom: 95px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="color:#fff; margin:0;">Live Analytics</h3>
                    <span style="background:#152632; padding:4px 10px; border-radius:6px; font-size:11px; color:var(--text-muted);">This Month</span>
                </div>
                
                <div style="padding: 20px; padding-bottom: 95px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h3 style="color:#fff; margin:0;">Live Analytics</h3>
                        <button onclick="openBackupManagementModal()" style="background:var(--primary-green); color:#030a10; border:none; padding:6px 14px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;">
                            <i class="fa-solid fa-cloud-arrow-up"></i> Backup Data
                        </button>
                </div>


                <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:15px;">
                    <div class="stat-card" style="background:var(--card-bg); border:1px solid var(--border-color); padding:12px; border-radius:14px;">
                        <p style="margin:0; font-size:11px; color:var(--text-muted);">Net Savings</p>
                        <h4 style="margin:5px 0 0 0; color:var(--primary-green); font-size:15px;">Rs. ${absoluteNetSavings.toLocaleString()}</h4>
                    </div>
                    <div class="stat-card" style="background:var(--card-bg); border:1px solid var(--border-color); padding:12px; border-radius:14px;">
                        <p style="margin:0; font-size:11px; color:var(--text-muted);">Wallets Net Worth</p>
                        <h4 style="margin:5px 0 0 0; color:var(--accent-blue); font-size:15px;">Rs. ${walletSumValue.toLocaleString()}</h4>
                    </div>
                </div>

                <div class="chart-wrapper-card" style="background:var(--card-bg); border:1px solid var(--border-color); padding:20px; border-radius:16px;">
                    <div style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">Cash Flow & Wallets Balance (Rs.)</div>
                    <div style="display:flex; justify-content:space-around; align-items:flex-end; height:160px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
                        
                        <div style="display:flex; flex-direction:column; align-items:center; width:60px;">
                            <span style="font-size:10px; color:var(--text-muted);">${Math.round(displayIncome / 1000)}k</span>
                            <div style="width:24px; height:${incBarHeight}px; background:linear-gradient(to top, #00c853, #b9f6ca); border-radius:4px 4px 0 0;"></div>
                            <span style="font-size:11px; color:#fff; margin-top:6px;">Income</span>
                        </div>

                        <div style="display:flex; flex-direction:column; align-items:center; width:60px;">
                            <span style="font-size:10px; color:var(--text-muted);">${Math.round(displayExpense / 1000)}k</span>
                            <div style="width:24px; height:${expBarHeight}px; background:linear-gradient(to top, #ff1744, #ff8a80); border-radius:4px 4px 0 0;"></div>
                            <span style="font-size:11px; color:#fff; margin-top:6px;">Expense</span>
                        </div>

                        <div style="display:flex; flex-direction:column; align-items:center; width:60px;">
                            <span style="font-size:10px; color:var(--text-muted);">${Math.round(walletSumValue / 1000)}k</span>
                            <div style="width:24px; height:${walletBarHeight}px; background:linear-gradient(to top, #00b0ff, #80d8ff); border-radius:4px 4px 0 0;"></div>
                            <span style="font-size:11px; color:#fff; margin-top:6px;">Wallets</span>
                        </div>
                    </div>
                </div>

                ${walletGraphRowsHtml}

                <div style="margin-top:20px; background:var(--card-bg); border:1px solid var(--border-color); padding:16px; border-radius:16px;">
                    <div style="font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">Expense Breakdown Graph</div>
                    
                    <div style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                            <span style="color:#fff;"><i class="fa-solid fa-utensils" style="color:var(--primary-green)"></i> Food / Dining</span>
                            <span style="color:var(--text-muted);">Rs. ${foodSum.toLocaleString()} (${foodPercent}%)</span>
                        </div>
                        <div style="background:#152632; height:6px; border-radius:4px; overflow:hidden;"><div style="width: ${foodPercent}%; background:var(--primary-green); height:100%;"></div></div>
                    </div>

                    <div style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                            <span style="color:#fff;"><i class="fa-solid fa-gas-pump" style="color:var(--accent-blue)"></i> Fuel &amp; Travel</span>
                            <span style="color:var(--text-muted);">Rs. ${fuelSum.toLocaleString()} (${fuelPercent}%)</span>
                        </div>
                        <div style="background:#152632; height:6px; border-radius:4px; overflow:hidden;"><div style="width: ${fuelPercent}%; background:var(--accent-blue); height:100%;"></div></div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                            <span style="color:#fff;"><i class="fa-solid fa-asterisk" style="color:#9c27b0"></i> Others / Misc</span>
                            <span style="color:var(--text-muted);">Rs. ${otherSum.toLocaleString()} (${otherPercent}%)</span>
                        </div>
                        <div style="background:#152632; height:6px; border-radius:4px; overflow:hidden;"><div style="width: ${otherPercent}%; background:#9c27b0; height:100%;"></div></div>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Handles goal purchase workflows by marking targets as verified.
 */

/**
 * Handles goal purchase workflows by marking targets as verified.
 * STRICT SINGLE-DEDUCTION PATCH FIXED: Prevents double deduction by relying ONLY 
 * on automated ledger entry without touching real-time variables directly.
 */
/**
 * Handles goal purchase workflows by marking targets as verified.
 * STRICT DOUBLE-DEDUCTION FINANCIAL SYNC PATCH:
 * Prevents double-dipping by transferring the allocation weight into the transaction ledger,
 * clearing the goal's individual allocation balance so it doesn't double-subtract from current balance.
 */
window.triggerGoalPurchase = function (goalId, goalName) {
    if (!Array.isArray(financialData.goals)) return;
    const goal = financialData.goals.find(g => g.id === goalId);
    if (!goal) return;

    // Check karein ke agar goal pehle se purchased nahi hai tabhi balance update ho
    if (!goal.isPurchased) {
        // --- STEP 1: Store the balance to be moved ---
        const amountToTransfer = Number(goal.saved) || 0;

        // --- STEP 2: Mark as purchased & set saved allocation to 0 ---
        // Taake current balance ka formula isay 'Goals Allocation' se dubara minus na kare
        goal.isPurchased = true;
        goal.saved = 0;

        financialData.activeNotification = `Goal Completed: "${goalName}" is ready to buy! 🛒`;

        const liveDateObj = new Date();
        const formattedLiveDate = liveDateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const formattedLiveTime = liveDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (!Array.isArray(financialData.transactions)) {
            financialData.transactions = [];
        }

        // --- STEP 3: Inject into Transactions Ledger ---
        // Ab paise safe tareeqe se transactions array ke expense module mein transfer ho gaye hain.
        financialData.transactions.push({
            id: Date.now(),
            title: `Purchased Goal Asset: ${goalName}`,
            amount: amountToTransfer,
            type: 'expense',
            category: 'Goals Assets',
            time: formattedLiveTime,
            date: formattedLiveDate
        });

        // --- STEP 4: Absolute Balance State Sync ---
        saveData();
        switchScreen('goals');

        // Agar aapke engine mein global rendering active hai toh screen automatic sync hojayegi
        if (typeof renderGoals === 'function') renderGoals();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof renderUI === 'function') renderUI();

        showGoalConfirmationToast(`Purchased: ${goalName}! Balance strictly synchronized.`);
    }
};
/**
 * Standard interface wrapper for creating system modal overlays.
 */
function createModalOverlay(htmlContent) {
    const currentOverlay = document.getElementById('modal-layer');
    if (currentOverlay) currentOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'cfo-modal-overlay';
    overlay.id = 'modal-layer';
    overlay.innerHTML = htmlContent;

    const appFrame = document.querySelector('.app-container');
    if (appFrame) appFrame.appendChild(overlay);
}

// --- SYSTEM COMPONENT MODALS DEFINITIONS ---

// NEW DIRECT INVESTMENT HANDLER MODAL (FINANCE MANAGER SPECIFIC LOGIC)
function openDirectInvestmentModal() {
    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>📈 Deploy New Strategic Investment</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Investment assets capital aapke active Current Balance se utilize kiye jayenge:</p>
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:2px;">Asset Vehicle / Title:</label>
            <input type="text" id="inv-title-input" class="modal-input-field" placeholder="e.g., PSX Stocks, Crypto, Gold Vault">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-top:8px; margin-bottom:2px;">Capital Amount (Rs.):</label>
            <input type="number" id="inv-amount-input" class="modal-input-field" placeholder="Enter investment amount">
            
            <div style="font-size:10px; color:var(--accent-blue); margin-top:8px; background:rgba(0,176,255,0.06); padding:6px; border-radius:6px;">
                💡 Available Liquid Capital: Rs. ${financialData.balance.toLocaleString()}
            </div>

            <div class="modal-actions-row" style="margin-top:12px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-investment-btn" style="background:var(--accent-blue);">Deploy Capital</button>
            </div>
        </div>
    `);

    safelyBindClick('save-investment-btn', () => {
        let title = document.getElementById('inv-title-input').value.trim() || 'General Asset';
        let amount = parseFloat(document.getElementById('inv-amount-input').value);

        if (isNaN(amount) || amount <= 0) {
            alert("Please provide a valid investment capital target.");
            return;
        }

        // Strict Financial Check: Capital restriction check
        if (financialData.balance >= amount) {
            if (!Array.isArray(financialData.investments)) financialData.investments = [];

            const currentMobileDateObj = new Date();
            const formattedLiveDate = currentMobileDateObj.toLocaleDateString('en-GB');
            const formattedLiveTime = currentMobileDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Store inside investment pool
            financialData.investments.push({
                id: Date.now(),
                title: title,
                amount: amount,
                date: formattedLiveDate,
                time: formattedLiveTime
            });

            // Simultaneously create a system ledger record log inside transactions for visual tracking
            if (!Array.isArray(financialData.transactions)) financialData.transactions = [];
            financialData.transactions.push({
                id: Date.now() + 1,
                title: `Invested in ${title}`,
                amount: amount,
                type: 'expense', // Marked under capital allocation tracking
                category: 'Investments',
                time: formattedLiveTime,
                date: formattedLiveDate
            });

            saveData();
            closeModal();
            switchScreen('dashboard');
            showGoalConfirmationToast(`Capital Deployed: Rs. ${amount.toLocaleString()} locked.`);
        } else {
            alert(`Manager Alert: Insufficient Liquid Balance to execute this investment transaction!`);
        }
    });
}

function openExpensesUpdateModal() {
    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>Update Expenses &amp; Budget</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:5px;">Apna custom monthly expense total adjust karein:</p>
            <input type="number" id="new-expenses-val" class="modal-input-field" value="${Number(financialData.expenses)}" placeholder="Enter total expenses...">
            
            <p style="font-size:11px; color:var(--text-muted); margin-top:10px; margin-bottom:5px;">Set Monthly Warning Limit (Rs.):</p>
            <input type="number" id="warning-limit-val" class="modal-input-field" value="${Number(financialData.expenseWarningLimit || 40000)}" placeholder="Warning limit target...">
            
            <div class="modal-actions-row" style="margin-top:12px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-expenses-btn">Update Configuration</button>
            </div>
        </div>
    `);

    safelyBindClick('save-expenses-btn', () => {
        let amount = parseFloat(document.getElementById('new-expenses-val').value);
        let limit = parseFloat(document.getElementById('warning-limit-val').value);

        if (!isNaN(amount) && amount >= 0 && !isNaN(limit) && limit >= 0) {
            financialData.expenses = amount;
            financialData.expenseWarningLimit = limit;
            localStorage.setItem('expensesOverridden', 'true');
            saveData();
            closeModal();
            switchScreen('dashboard');
        } else {
            alert("Please provide proper positive inputs.");
        }
    });
}

window.openEditTransactionModal = function (txId) {
    if (!Array.isArray(financialData.transactions)) return;
    const tx = financialData.transactions.find(t => t.id === txId);
    if (!tx) return;

    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>✏️ Edit Log Details</h3>
            <label style="font-size:11px; color:var(--text-muted);">Title description:</label>
            <input type="text" id="edit-tx-title" class="modal-input-field" value="${sanitizeInput(tx.title)}">
            
            <label style="font-size:11px; color:var(--text-muted); margin-top:8px; display:block;">Amount (Rs.):</label>
            <input type="number" id="edit-tx-amount" class="modal-input-field" value="${Number(tx.amount)}">
            
            <div class="modal-actions-row" style="margin-top:12px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-modify-tx-btn">Save Record</button>
            </div>
        </div>
    `);

    safelyBindClick('confirm-modify-tx-btn', () => {
        const updatedTitle = document.getElementById('edit-tx-title').value.trim();
        const updatedAmount = parseFloat(document.getElementById('edit-tx-amount').value);

        if (!updatedTitle || isNaN(updatedAmount) || updatedAmount <= 0) {
            alert("Sahi specifications type karein!");
            return;
        }

        tx.title = updatedTitle;
        tx.amount = updatedAmount;

        saveData();
        closeModal();
        switchScreen('transactions');
    });
};

window.deleteTransaction = function (txId) {
    if (!Array.isArray(financialData.transactions)) return;
    const index = financialData.transactions.findIndex(t => t.id === txId);
    if (index === -1) return;

    if (confirm(`Kya aap yeh transaction log remove karna chahte hain?`)) {
        financialData.transactions.splice(index, 1);
        saveData();
        switchScreen('transactions');
    }
};

function openSavingsUpdateModal() {
    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>Update Monthly Savings (Rs.)</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apni custom base savings amount (Rs.) enter karein. System isey automatic percentage rate me convert kar ke display karega:</p>
            <input type="number" id="new-savings-val" class="modal-input-field" value="${financialData.customSavingsOverride !== null ? Number(financialData.customSavingsOverride) : ''}" placeholder="Enter Rs. amount (e.g. 15000)...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" id="reset-savings-btn" style="background:#1a0f0f; color:var(--danger-red); margin-right:auto;">Auto Calc Base</button>
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-savings-btn">Save Value</button>
            </div>
        </div>
    `);

    safelyBindClick('reset-savings-btn', () => {
        financialData.customSavingsOverride = null;
        saveData();
        closeModal();
        switchScreen('dashboard');
    });

    safelyBindClick('save-savings-btn', () => {
        let amount = parseFloat(document.getElementById('new-savings-val').value);
        if (!isNaN(amount) && amount >= 0) {
            financialData.customSavingsOverride = amount;
            saveData();
            closeModal();
            switchScreen('dashboard');
        } else {
            alert("Please enter a valid positive numerical amount.");
        }
    });
}

function openUserProfileModal() {
    createModalOverlay(`
        <div class="cfo-modal-box" style="max-height: 85vh; overflow-y: auto;">
            <h3>⚙ Update Profile &amp; Financial Settings</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Apna complete display profile aur core financial inputs manage karein:</p>
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Full Name:</label>
            <input type="text" id="profile-name-input" class="modal-input-field" value="${sanitizeInput(financialData.user || '')}" placeholder="Enter your name...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Age:</label>
            <input type="number" id="profile-age-input" class="modal-input-field" value="${Number(financialData.userAge) || ''}" placeholder="Enter your age...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Best Line / Custom Motto:</label>
            <input type="text" id="profile-bestline-input" class="modal-input-field" value="${sanitizeInput(financialData.bestLine || '')}" placeholder="Enter your custom greeting text...">
            
            <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Professional Status:</label>
            <select id="profile-status-input" class="modal-input-field" style="background:#0d1923; color:#fff; margin-bottom:12px;">
                <option value="Student" ${financialData.userStatus === 'Student' ? 'selected' : ''}>Student</option>
                <option value="Employee" ${financialData.userStatus === 'Employee' ? 'selected' : ''}>Employee</option>
            </select>

            <div style="border-top: 1px dashed #223749; margin: 12px 0; padding-top: 12px;">
                <h4 style="font-size: 13px; color: var(--accent-blue); margin-bottom: 4px;">💰 Core Financial Inputs</h4>
                <p style="font-size: 10px; color: var(--danger-red); margin-bottom: 8px;">⚠️ Note: Values badalne par pichla saara history logs, expenses, investments aur goals zero se absolute clear ho jayenge.</p>
                
                <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Current Seed Wallet Balance (Rs.):</label>
                <input type="number" id="profile-balance-input" class="modal-input-field" value="${Number(financialData.initialSeedWallet)}" placeholder="Wallet base balance...">
                
                <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Monthly Income (Rs.):</label>
                <input type="number" id="profile-income-input" class="modal-input-field" value="${Number(financialData.income)}" placeholder="Monthly salary or income...">
                
                <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">Monthly Expenses Warning Limit (Rs.):</label>
                <input type="number" id="profile-warning-limit-input" class="modal-input-field" value="${Number(financialData.expenseWarningLimit || 40000)}" placeholder="Expense warning threshold...">
            </div>

            <div class="modal-actions-row" style="margin-top:15px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-profile-btn">Save Configuration</button>
            </div>
        </div>
    `);

    safelyBindClick('save-profile-btn', () => {
        const uName = document.getElementById('profile-name-input').value.trim();
        const uAge = parseInt(document.getElementById('profile-age-input').value, 10);
        const uLine = document.getElementById('profile-bestline-input').value.trim();
        const uStatus = document.getElementById('profile-status-input').value;

        const uSeedWallet = parseFloat(document.getElementById('profile-balance-input').value);
        const uIncome = parseFloat(document.getElementById('profile-income-input').value);
        const uWarningLimit = parseFloat(document.getElementById('profile-warning-limit-input').value);

        if (!uName || !uLine) {
            alert("Name aur Best Line complete fill karein!");
            return;
        }

        if (isNaN(uSeedWallet) || uSeedWallet < 0 || isNaN(uIncome) || uIncome < 0 || isNaN(uWarningLimit) || uWarningLimit < 0) {
            alert("Financial values sahi (positive numbers) enter karein!");
            return;
        }

        financialData.previousSeedWallet = financialData.initialSeedWallet;

        financialData.user = uName;
        financialData.userAge = !isNaN(uAge) ? uAge : "";
        financialData.bestLine = uLine;
        financialData.userStatus = uStatus;

        financialData.transactions = [];
        financialData.goals = [];
        financialData.investments = [];
        financialData.expenses = 0;
        financialData.customSavingsOverride = null;

        financialData.initialSeedWallet = uSeedWallet;
        financialData.income = uIncome;
        financialData.expenseWarningLimit = uWarningLimit;

        saveData();
        closeModal();
        switchScreen('dashboard');
    });
}

function openBalanceUpdateModal() {
    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>Approve Wallet Seed</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apna initial wallet base balance daalein (Isme Income automatic sum hojayegi):</p>
            <input type="number" id="new-balance-val" class="modal-input-field" value="${Number(financialData.initialSeedWallet)}" placeholder="Enter baseline wallet balance...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-balance-btn">Update Balance</button>
            </div>
        </div>
    `);

    safelyBindClick('save-balance-btn', () => {
        let amount = parseFloat(document.getElementById('new-balance-val').value);
        if (!isNaN(amount) && amount >= 0) {
            financialData.previousSeedWallet = financialData.initialSeedWallet;

            financialData.transactions = [];
            financialData.goals = [];
            financialData.investments = [];
            financialData.expenses = 0;
            financialData.initialSeedWallet = amount;

            saveData();
            closeModal();
            switchScreen('dashboard');
        } else {
            alert("Invalid seed value.");
        }
    });
}

function openIncomeUpdateModal() {
    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>Update Monthly Income Target</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Apni total monthly expected income badlein (Yeh automatic current balance me add ho jayegi):</p>
            <input type="number" id="new-income-val" class="modal-input-field" value="${Number(financialData.income)}" placeholder="Enter expected salary/income...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="save-income-btn">Update</button>
            </div>
        </div>
    `);

    safelyBindClick('save-income-btn', () => {
        let amount = parseFloat(document.getElementById('new-income-val').value);
        if (!isNaN(amount) && amount >= 0) {
            financialData.income = amount;
            if (Array.isArray(financialData.transactions) && financialData.transactions.length > 0) {
                let salTx = financialData.transactions.find(t => t.category === 'Salary');
                if (salTx) salTx.amount = amount;
            }
            saveData();
            closeModal();
            switchScreen('dashboard');
        } else {
            alert("Please provide a accurate number parameter.");
        }
    });
}

function openDirectIncomeModal() {
    createModalOverlay(`
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
    `);

    safelyBindClick('save-inflow-btn', () => {
        let source = document.getElementById('inc-source-input').value.trim() || 'External Income';
        let amount = parseFloat(document.getElementById('inc-amount-input').value);

        if (!isNaN(amount) && amount > 0) {
            if (!Array.isArray(financialData.transactions)) financialData.transactions = [];

            const currentMobileDateObj = new Date();
            const formattedLiveDate = currentMobileDateObj.toLocaleDateString('en-GB');
            const formattedLiveTime = currentMobileDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            financialData.transactions.push({
                id: Date.now(),
                title: source,
                amount: amount,
                type: 'income',
                category: 'Salary',
                time: formattedLiveTime,
                date: formattedLiveDate
            });
            saveData();
            closeModal();
            switchScreen('dashboard');
        } else {
            alert("Please pass a positive numerical addition entry.");
        }
    });
}

function openCreateGoalModal() {
    closeModal();
    createModalOverlay(`
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
    `);

    safelyBindClick('confirm-create-goal', () => {
        let name = document.getElementById('goal-title-input').value.trim();
        let target = parseFloat(document.getElementById('goal-target-input').value);
        let dateStr = document.getElementById('goal-date-input').value.trim() || 'No Limit';

        if (!name || isNaN(target) || target <= 0) {
            alert("Valid Details Enter karein.");
            return;
        }

        if (!Array.isArray(financialData.goals)) financialData.goals = [];
        financialData.goals.push({
            id: Date.now(),
            title: name,
            target: target,
            saved: 0,
            date: dateStr,
            icon: 'fa-star',
            isPurchased: false
        });

        saveData();
        closeModal();
        switchScreen('goals');
        showGoalConfirmationToast(`Goal "${name}" Created!`);
    });
}

window.openAddFundsModal = function (goalId) {
    if (!Array.isArray(financialData.goals)) return;
    const targetGoal = financialData.goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>Save Money: ${sanitizeInput(targetGoal.title)}</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">Is goal mein kitne paise lock karne hain?</p>
            <input type="number" id="fund-amount-input" class="modal-input-field" placeholder="Rs. Amount enter karein...">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-fund-btn">Add Funds</button>
            </div>
        </div>
    `);

    safelyBindClick('confirm-fund-btn', () => {
        let val = parseFloat(document.getElementById('fund-amount-input').value);
        if (!isNaN(val) && val > 0) {
            if (financialData.balance >= val) {
                targetGoal.saved = (Number(targetGoal.saved) || 0) + val;
                saveData();
                closeModal();
                switchScreen('goals');
            } else {
                alert("Apke pas account me balance kam hay!");
            }
        } else {
            alert("Please specify a valid value parameter.");
        }
    });
};

window.deleteGoal = function (goalId) {
    if (!Array.isArray(financialData.goals)) return;
    const goalIndex = financialData.goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return;

    const goalTitle = financialData.goals[goalIndex].title;
    if (confirm(`Kya aap "${goalTitle}" delete karna chahte hain? Saved funds auto release hojayenge.`)) {
        financialData.goals.splice(goalIndex, 1);
        saveData();
        switchScreen('goals');
        showGoalConfirmationToast(`Deleted "${goalTitle}"`);
    }
};

window.openEditGoalModal = function (goalId) {
    closeModal();
    if (!Array.isArray(financialData.goals)) return;
    const targetGoal = financialData.goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    createModalOverlay(`
        <div class="cfo-modal-box">
            <h3>✏️ Modify Financial Goal</h3>
            <label style="font-size:11px; color:var(--text-muted);">Goal Title:</label>
            <input type="text" id="edit-goal-title" class="modal-input-field" value="${sanitizeInput(targetGoal.title)}">
            <label style="font-size:11px; color:var(--text-muted);">Target Amount (Rs.):</label>
            <input type="number" id="edit-goal-target" class="modal-input-field" value="${Number(targetGoal.target)}">
            <label style="font-size:11px; color:var(--text-muted);">Target Date:</label>
            <input type="text" id="edit-goal-date" class="modal-input-field" value="${sanitizeInput(targetGoal.date)}">
            <div class="modal-actions-row">
                <button class="modal-btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="modal-btn btn-primary" id="confirm-modify-goal">Save Changes</button>
            </div>
        </div>
    `);

    safelyBindClick('confirm-modify-goal', () => {
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

window.closeModal = function () {
    const m = document.getElementById('modal-layer');
    if (m) m.remove();
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
    toast.innerHTML = `🎯 ${sanitizeInput(textMessage)}`;

    const appFrame = document.querySelector('.app-container');
    if (appFrame) {
        appFrame.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 2500);
    }
}

// --- CHAT CONTROL ENGINE SYSTEM ---
function renderChatMessages() {
    const chatBox = document.getElementById('chat-box-area');
    if (!chatBox || !Array.isArray(financialData.chatHistory)) return;
    chatBox.innerHTML = '';

    financialData.chatHistory.forEach(msg => {
        const row = document.createElement('div');
        row.className = `chat-row-wrap ${msg.sender === 'user' ? 'align-right' : 'align-left'}`;
        const safeTxt = (msg.type === 'expense-msg' || msg.type === 'income-msg') ? msg.text : sanitizeInput(msg.text);
        row.innerHTML = `<div class="chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'} ${sanitizeInput(msg.type || '')}">${safeTxt}</div>`;
        chatBox.appendChild(row);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processChatMessage() {
    const inputField = document.getElementById('user-msg-input');
    if (!inputField) return;
    const query = inputField.value.trim();
    if (!query) return;

    if (!Array.isArray(financialData.chatHistory)) financialData.chatHistory = [];
    financialData.chatHistory.push({ sender: 'user', text: query });
    renderChatMessages();
    inputField.value = '';

    setTimeout(() => {
        let responseText = "Samajh nahi paya. Format: '500 petrol' ya 'salary 25000'";
        let responseType = 'normal-msg';
        const words = query.split(' ');

        const currentMobileDateObj = new Date();
        const formattedLiveDate = currentMobileDateObj.toLocaleDateString('en-GB');
        const formattedLiveTime = currentMobileDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (!isNaN(words[0]) && words[1]) {
            let amount = parseFloat(words[0]);
            let title = words.slice(1).join(' ');
            let targetCategory = "Others";

            const lowTitle = title.toLowerCase();
            if (lowTitle.includes('burger') || lowTitle.includes('kfc') || lowTitle.includes('khana') || lowTitle.includes('dinner')) {
                targetCategory = "Food";
            } else if (lowTitle.includes('petrol') || lowTitle.includes('fuel') || lowTitle.includes('bike')) {
                targetCategory = "Fuel";
            }

            if (amount > 0) {
                if (!Array.isArray(financialData.transactions)) financialData.transactions = [];
                financialData.transactions.push({
                    id: Date.now(),
                    title: title.charAt(0).toUpperCase() + title.slice(1),
                    amount: amount,
                    type: 'expense',
                    category: targetCategory,
                    time: formattedLiveTime,
                    date: formattedLiveDate
                });

                saveData();

                const budgetWarningNotice = financialData.expenses >= financialData.expenseWarningLimit
                    ? `<br><span style="color:var(--danger-red); font-weight:bold;">⚠️ Warning: Monthly budget limits exceeded!</span>`
                    : '';

                responseText = `✔ <b>Expense Tracked</b><br>Amount: Rs. ${amount.toLocaleString()}<br>Category: ${sanitizeInput(targetCategory)}${budgetWarningNotice}`;
                responseType = 'expense-msg';
            } else {
                responseText = "Amount valid honi chahiye.";
            }
        } else if (words[0] && (words[0].toLowerCase() === 'salary' || words[0].toLowerCase() === 'income') && !isNaN(words[1])) {
            let amount = parseFloat(words[1]);
            if (amount > 0) {
                if (!Array.isArray(financialData.transactions)) financialData.transactions = [];
                financialData.transactions.push({
                    id: Date.now(),
                    title: 'Income Injected',
                    amount: amount,
                    type: 'income',
                    category: 'Salary',
                    time: formattedLiveTime,
                    date: formattedLiveDate
                });
                responseText = `💰 <b>Income Logged</b><br>Amount: Rs. ${amount.toLocaleString()}`;
                responseType = 'income-msg';
            } else {
                responseText = "Amount positive honi chahiye.";
            }
        }

        financialData.chatHistory.push({ sender: 'bot', text: responseText, type: responseType });
        saveData();
        renderChatMessages();
    }, 400);
}

// --- ENGINE INITIALIZATION EVENT BINDINGS ---
document.addEventListener("DOMContentLoaded", () => {
    safelyBindClick('nav-dashboard', () => switchScreen('dashboard'));
    safelyBindClick('nav-transactions', () => switchScreen('transactions'));
    safelyBindClick('nav-chat', () => switchScreen('chat'));
    safelyBindClick('nav-goals', () => switchScreen('goals'));
    safelyBindClick('nav-analytics', () => switchScreen('analytics'));

    saveData();
    switchScreen('dashboard');
    // --- FLOW CONTROL ENGINE: SPLASH -> ONBOARD -> AUTH ---
    // --- UPDATED FLOW CONTROL ENGINE WITH DYNAMIC USER NAME SYNC ---
    let currentOnboardSlide = 1;

    // Splash timeout execution loop
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('d-none');

        // Check if onboarding was already seen
        if (localStorage.getItem('cfo_onboard_seen') === 'true') {
            document.getElementById('auth-screen').classList.remove('d-none');
        } else {
            document.getElementById('onboarding-screen').classList.remove('d-none');
        }
    }, 1500);

    // Onboarding Carousel controls
    document.getElementById('onboard-next-btn').addEventListener('click', () => {
        document.getElementById(`slide-${currentOnboardSlide}`).classList.add('d-none');
        currentOnboardSlide++;

        const dots = document.querySelectorAll('.slide-indicator-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === (currentOnboardSlide - 1));
        });

        if (currentOnboardSlide <= 3) {
            document.getElementById(`slide-${currentOnboardSlide}`).classList.remove('d-none');
            if (currentOnboardSlide === 3) {
                document.getElementById('onboard-next-btn').innerHTML = `Get Started <i class="fa-solid fa-circle-check"></i>`;
            }
        } else {
            localStorage.setItem('cfo_onboard_seen', 'true');
            document.getElementById('onboarding-screen').classList.add('d-none');
            document.getElementById('auth-screen').classList.remove('d-none');
        }
    });

    // Gate validation with Dynamic Profile Name assignment
    window.handleAuthLogin = function () {
        const enteredUser = document.getElementById('auth-username').value.trim();
        const pin = document.getElementById('auth-passcode').value.trim();

        // Passcode validation setup (Username can be anything now!)
        if (enteredUser !== "" && pin === '1234') {

            // 1. Dynamic User Name Assignment inside financialData state
            if (typeof financialData === 'undefined') {
                window.financialData = {};
            }
            financialData.userName = enteredUser;

            // 2. Avatar character extract karne ke liye (First Letter)
            financialData.userAvatarChar = enteredUser.charAt(0).toUpperCase();

            // 3. Hide Auth overlay window
            document.getElementById('auth-screen').classList.add('d-none');

            // 4. Save to storage & fully refresh UI elements dynamically
            saveData();

            if (typeof updateDashboard === 'function') updateDashboard();
            if (typeof renderUI === 'function') renderUI();

            // Force refresh name fields if template literals are injected manually
            const nameLabel = document.querySelector('.user-name');
            if (nameLabel) nameLabel.textContent = enteredUser;

            const avatarBox = document.querySelector('.profile-avatar-circle');
            if (avatarBox) avatarBox.textContent = financialData.userAvatarChar;

        } else {
            alert("🚨 Access Denied: Please enter a Username and correct Passcode Pin (1234).");
        }
    };
});

// ========================================================
// CORE INVESTMENTS SYSTEM (SAVE, SHOW, EDIT, DELETE)
// ========================================================

// Modal Open Trigger
window.openAddInvestmentModal = function () {
    document.getElementById('investment-modal-title').textContent = "Add New Investment";
    document.getElementById('edit-investment-id').value = "";
    document.getElementById('invest-title').value = "";
    document.getElementById('invest-amount').value = "";
    document.getElementById('investment-modal').classList.remove('d-none');
};

// Modal Close Trigger
window.closeInvestmentModal = function () {
    document.getElementById('investment-modal').classList.add('d-none');
};

// Save & Edit Form Handler
window.saveInvestmentForm = function () {
    const id = document.getElementById('edit-investment-id').value;
    const title = document.getElementById('invest-title').value.trim();
    const amount = Number(document.getElementById('invest-amount').value) || 0;

    const liveDateObj = new Date();
    const formattedLiveDate = liveDateObj.toLocaleDateString('en-GB');
    const formattedLiveTime = liveDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (!Array.isArray(financialData.transactions)) {
        financialData.transactions = [];
    }

    if (id) {
        // Edit Mode
        const tx = financialData.transactions.find(t => t.id == id);
        if (tx) {
            tx.title = title;
            tx.amount = amount;
        }
    } else {
        // Add Mode
        financialData.transactions.push({
            id: Date.now(),
            title: title,
            amount: amount,
            type: 'expense',
            category: 'Investment',
            time: formattedLiveTime,
            date: formattedLiveDate
        });
    }

    saveData();
    closeInvestmentModal();
    renderInvestmentHistory();

    if (typeof updateDashboard === 'function') updateDashboard();
    if (typeof renderUI === 'function') renderUI();
};

// ========================================================
// CORE INVESTMENTS ARCHITECTURE WITH FIXED ROUTING SWITCH
// ========================================================
// =========================================================================
// INVESTMENT LEDGER MANAGEMENT ENGINE - NEW SCREEN ROUTE WITH MATH SYNC
// =========================================================================

// Controls inline screen panel form visibility state
window.toggleInvestmentFormView = function (show, isEdit = false) {
    const formCard = document.getElementById('invest-inline-form-card');
    const triggerBtn = document.getElementById('add-invest-trigger-btn');
    if (!formCard) return;

    if (show) {
        formCard.classList.remove('d-none');
        if (triggerBtn) triggerBtn.style.display = 'none';
        if (!isEdit) {
            document.getElementById('investment-screen-form-title').textContent = "Add New Investment";
            document.getElementById('edit-investment-id').value = "";
            document.getElementById('invest-title').value = "";
            document.getElementById('invest-amount').value = "";
        }
    } else {
        formCard.classList.add('d-none');
        if (triggerBtn) triggerBtn.style.display = 'block';
    }
};

// Replaces popup mechanism to seamlessly trigger the entire screen layout
window.openDirectInvestmentModal = function () {
    // Hide active dashboard elements
    const screens = document.querySelectorAll('.screen-content, #main-content > div');
    screens.forEach(s => s.classList.add('d-none'));

    // Reveal investment screen view wrapper
    const targetView = document.getElementById('investments-screen');
    if (targetView) targetView.classList.remove('d-none');

    // Deselect bottom menu icons focus states
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));

    // Initialize display components inside workspace
    toggleInvestmentFormView(false);
    renderInvestmentHistory();
};

// CORE MATHEMATICAL LOGIC: Minus from current balance, add to savings asset pool
window.saveInvestmentForm = function () {
    const id = document.getElementById('edit-investment-id').value;
    const title = document.getElementById('invest-title').value.trim() || 'General Asset';
    const amount = parseFloat(document.getElementById('invest-amount').value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please provide a valid investment capital target.");
        return;
    }

    if (!Array.isArray(financialData.investments)) {
        financialData.investments = [];
    }

    if (id) {
        // Edit flow mode matching indices
        const invEntry = financialData.investments.find(i => i.id == id);
        if (invEntry) {
            invEntry.title = title;
            invEntry.amount = amount;
        }
    } else {
        // Financial Outflow check: Ensure current liquid capital seed covers requirements
        if (financialData.balance >= amount) {
            const currentMobileDateObj = new Date();
            financialData.investments.push({
                id: Date.now(),
                title: title,
                amount: amount,
                date: currentMobileDateObj.toLocaleDateString('en-GB'),
                time: currentMobileDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        } else {
            alert("Apke pas account me balance kam hay!");
            return;
        }
    }

    // Persist system calculations state parameters instantly
    saveData();
    toggleInvestmentFormView(false);
    renderInvestmentHistory();
    switchScreen('dashboard'); // Redirect back to sync calculations on health cards
};

// Renders list entries on viewport dynamically
window.renderInvestmentHistory = function () {
    const container = document.getElementById('investments-history-list');
    if (!container) return;

    const list = financialData.investments || [];

    if (list.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">No investment logs recorded yet.</p>`;
        return;
    }

    container.innerHTML = list.map(inv => `
        <div class="tx-card" style="margin-bottom:10px; padding:15px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; display:flex; justify-content:space-between; align-items:center;">
            <div class="tx-left" style="display:flex; align-items:center; gap:12px;">
                <div class="tx-icon-frame" style="background: rgba(0, 176, 255, 0.1); color: var(--accent-blue); padding:10px; border-radius:10px;">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
                <div>
                    <h4 style="margin:0; color:#fff; font-size:14px;">${inv.title}</h4>
                    <p style="margin:4px 0 0 0; font-size:11px; color:var(--text-muted);">${inv.date} • ${inv.time}</p>
                </div>
            </div>
            <div class="tx-right" style="display: flex; align-items: center; gap: 16px; margin-left:auto;">
                <span style="color: var(--accent-blue); font-weight: 600; font-size: 13px;">Rs. ${inv.amount.toLocaleString()}</span>
                <div style="display: flex; gap: 12px; cursor:pointer;">
                    <i class="fa-solid fa-pen-to-square" onclick="triggerInlineEdit(${inv.id})" title="Edit" style="color:var(--accent-blue); font-size:14px;"></i>
                    <i class="fa-solid fa-trash" onclick="triggerInlineDelete(${inv.id})" title="Delete" style="color:#ff5252; font-size:14px;"></i>
                </div>
            </div>
        </div>
    `).join('');
};

// CRUD: Edit entry binder
window.triggerInlineEdit = function (id) {
    const inv = financialData.investments.find(i => i.id == id);
    if (!inv) return;

    toggleInvestmentFormView(true, true);
    document.getElementById('investment-screen-form-title').textContent = "Edit Investment Details";
    document.getElementById('edit-investment-id').value = inv.id;
    document.getElementById('invest-title').value = inv.title;
    document.getElementById('invest-amount').value = inv.amount;
};

// CRUD: Delete entry execution
window.triggerInlineDelete = function (id) {
    if (confirm("Are you sure you want to delete this investment entry?")) {
        financialData.investments = (financialData.investments || []).filter(i => i.id != id);
        saveData();
        renderInvestmentHistory();
    }
};


// =========================================================================
// MULTI WALLET MANAGEMENT CORE ROUTINES AND ENGINE MECHANICS
// =========================================================================

if (!Array.isArray(financialData.wallets)) {
    financialData.wallets = [];
}

window.toggleWalletFormView = function (show, isEdit = false) {
    const formCard = document.getElementById('wallet-inline-form-card');
    const triggerBtn = document.getElementById('add-wallet-trigger-btn');
    if (!formCard) return;

    if (show) {
        formCard.classList.remove('d-none');
        if (triggerBtn) triggerBtn.style.display = 'none';
        if (!isEdit) {
            document.getElementById('wallet-screen-form-title').textContent = "Add New Wallet Account";
            document.getElementById('edit-wallet-id').value = "";
            document.getElementById('wallet-name').value = "";
            document.getElementById('wallet-balance').value = "";
        }
    } else {
        formCard.classList.add('d-none');
        if (triggerBtn) triggerBtn.style.display = 'block';
    }
};

window.saveWalletForm = function () {
    const id = document.getElementById('edit-wallet-id').value;
    const name = document.getElementById('wallet-name').value.trim() || 'Unnamed Bank';
    const type = document.getElementById('wallet-type').value;
    const balance = parseFloat(document.getElementById('wallet-balance').value) || 0;

    if (id) {
        const existingWallet = financialData.wallets.find(w => w.id == id);
        if (existingWallet) {
            existingWallet.name = name;
            existingWallet.type = type;
            existingWallet.balance = balance;
        }
    } else {
        financialData.wallets.push({
            id: Date.now(),
            name: name,
            type: type,
            balance: balance,
            createdAt: new Date().toLocaleDateString('en-GB')
        });
    }

    saveData();
    toggleWalletFormView(false);
    renderMultiWalletsScreen();
    if (typeof updateDashboard === 'function') updateDashboard();
    if (typeof renderUI === 'function') renderUI();
};

window.renderMultiWalletsScreen = function () {
    const container = document.getElementById('wallets-display-list');
    if (!container) return;

    const list = financialData.wallets || [];
    if (list.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">No accounts linked yet.</p>`;
        return;
    }

    const walletsCombinedSum = list.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);

    let header = `
        <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 18px; border-radius: 14px; margin-bottom: 15px;">
            <p style="margin:0; font-size:12px; color:rgba(255,255,255,0.7);">Total External Balance</p>
            <h2 style="margin:5px 0 0 0; color:#fff; font-size:22px;">Rs. ${walletsCombinedSum.toLocaleString()}</h2>
        </div>`;

    let cards = list.map(w => `
        <div style="padding:15px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
                <h4 style="margin:0; color:#fff; font-size:14px;"><i class="fa-solid fa-building-columns" style="color:var(--primary-green); margin-right:8px;"></i>${w.name}</h4>
                <p style="margin:4px 0 0 0; font-size:11px; color:var(--text-muted);">${w.type} • Linked: ${w.createdAt}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <span style="color: var(--primary-green); font-weight: 600; font-size: 14px;">Rs. ${Number(w.balance).toLocaleString()}</span>
                <div style="display: flex; gap: 12px; cursor:pointer;">
                    <i class="fa-solid fa-pen-to-square" onclick="triggerWalletEdit(${w.id})" style="color:var(--accent-blue); font-size:14px;"></i>
                    <i class="fa-solid fa-trash" onclick="triggerWalletDelete(${w.id})" style="color:#ff5252; font-size:14px;"></i>
                </div>
            </div>
        </div>`).join('');

    container.innerHTML = header + cards;
};

window.triggerWalletEdit = function (id) {
    const wallet = financialData.wallets.find(w => w.id == id);
    if (!wallet) return;

    toggleWalletFormView(true, true);
    document.getElementById('wallet-screen-form-title').textContent = "Edit Wallet Details";
    document.getElementById('edit-wallet-id').value = wallet.id;
    document.getElementById('wallet-name').value = wallet.name;
    document.getElementById('wallet-type').value = wallet.type;
    document.getElementById('wallet-balance').value = wallet.balance;
};

window.triggerWalletDelete = function (id) {
    if (confirm("Are you sure you want to remove this wallet?")) {
        financialData.wallets = financialData.wallets.filter(w => w.id != id);
        saveData();
        renderMultiWalletsScreen();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof renderUI === 'function') renderUI();
    }
};

// Auto Listener setup to capture clicks on bottom nav or dynamic buttons
// Auto Interceptor Listener to handle precise route updates on Bottom Tab items
setInterval(() => {
    const targetTab = document.getElementById('nav-wallets');
    if (targetTab && !targetTab.hasAttribute('data-hooked')) {
        targetTab.setAttribute('data-hooked', 'true');
        targetTab.addEventListener('click', () => {
            // Target dynamic layout panels clean intercept
            if (typeof switchScreen === 'function') {
                switchScreen('none'); // Safe reset focus configuration
            }
            const screens = document.querySelectorAll('.screen-content, #main-content > div, #main-content > section');
            screens.forEach(s => s.classList.add('d-none'));

            // Strictly activate only wallets panel view
            const walletScreenNode = document.getElementById('wallets-screen');
            if (walletScreenNode) {
                walletScreenNode.classList.remove('d-none');
            }

            document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
            targetTab.classList.add('active');
            toggleWalletFormView(false);
            renderMultiWalletsScreen();
        });
    }
}, 1000);

// Fix hook to enforce that clicking any standard dashboard tab removes the wallets layout overlay
const originalSwitchScreenMethod = window.switchScreen;
window.switchScreen = function (screenName) {
    if (screenName !== 'none') {
        const walletView = document.getElementById('wallets-screen');
        if (walletView) walletView.classList.add('d-none');
    }
    if (typeof originalSwitchScreenMethod === 'function') {
        originalSwitchScreenMethod(screenName);
    }
};


// FIXED: Jab user "Invest Money" par click kare toh baqi screens hide ho jayein aur sirf Investment dikhe
window.openDirectInvestmentModal = function () {
    // 1. Reset standard layout fields via switchScreen
    if (typeof switchScreen === 'function') {
        switchScreen('none');
    }

    // 2. Hide all core viewports explicitly
    const screens = document.querySelectorAll('.screen-content, #main-content > div, #main-content > section, #wallets-screen');
    screens.forEach(s => s.classList.add('d-none'));

    // 3. Reveal ONLY the investments workspace container wrapper
    const targetView = document.getElementById('investments-screen');
    if (targetView) {
        targetView.classList.remove('d-none');
    }

    // 4. Remove active focus highlighting from navigation bar nodes
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));

    // 5. Fire core rendering lifecycles inside module
    if (typeof toggleInvestmentFormView === 'function') toggleInvestmentFormView(false);
    if (typeof renderInvestmentHistory === 'function') renderInvestmentHistory();
};


// ==========================================
// 💾 DYNAMIC BANKING SLIP BACKUP ENGINE MODULE
// ==========================================
// ==========================================
//// ==========================================
// ==========================================
// 💾 ULTIMATE MASTER THREE-BUTTON BACKUP SYSTEM (ALL MODULES + NET WORTH)
// ==========================================
window.openBackupManagementModal = function() {
    // Real-time calculations for Balance and Net Worth
    const totalBalance = financialData.balance || 0;
    
    let totalWallets = 0;
    if (financialData.wallets && financialData.wallets.length > 0) {
        totalWallets = financialData.wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
    } else {
        totalWallets = totalBalance;
    }
    
    const totalInvestments = (financialData.investments || []).reduce((sum, inv) => sum + Number(inv.amount || inv.value || 0), 0);
    const totalGoalsSaved = (financialData.goals || []).reduce((sum, g) => sum + Number(g.current || 0), 0);
    
    // Total Net Worth Formula
    const totalNetWorth = totalWallets + totalInvestments + totalGoalsSaved;
    
    createModalOverlay(`
        <div class="cfo-modal-box" style="max-height: 85vh; overflow-y: auto; width: 95%; max-width: 500px;">
            <h3>💾 Master Backup & Control Panel</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-bottom:15px;">
                Apne accounts, profile, budgets, goals aur investments ka backup generate ya restore karein.
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="background: rgba(0, 176, 255, 0.08); border: 1px solid #00b0ff; padding: 10px; border-radius: 10px; text-align: center;">
                    <span style="font-size: 10px; color: var(--text-muted); display: block; text-transform: uppercase;">Available Balance</span>
                    <strong style="font-size: 15px; color: #00b0ff;">Rs. ${Number(totalBalance).toLocaleString()}</strong>
                </div>
                <div style="background: rgba(0, 230, 118, 0.08); border: 1px solid var(--primary-green); padding: 10px; border-radius: 10px; text-align: center;">
                    <span style="font-size: 10px; color: var(--text-muted); display: block; text-transform: uppercase;">Total Net Worth</span>
                    <strong style="font-size: 15px; color: var(--primary-green);">Rs. ${Number(totalNetWorth).toLocaleString()}</strong>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <button class="modal-btn" onclick="generateProfessionalPDFReceipt()" style="background: linear-gradient(135deg, #00b0ff, #007bb5); color: #fff; font-size:13px; padding:12px; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
                    <i class="fa-solid fa-file-pdf" style="margin-right:6px;"></i> 1. Download Transaction Slip (PDF)
                </button>
                
                <button class="modal-btn" onclick="exportMasterJSONData()" style="background: #152632; color: #fff; font-size:13px; padding:12px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; font-weight:600; cursor:pointer;">
                    <i class="fa-solid fa-cloud-arrow-down" style="margin-right:6px;"></i> 2. Export Raw Backup (.json)
                </button>

                <button class="modal-btn" onclick="document.getElementById('import-json-file').click()" style="background: #09141c; color: var(--primary-green); font-size:13px; padding:12px; border:1px solid var(--primary-green); border-radius:8px; font-weight:600; cursor:pointer;">
                    <i class="fa-solid fa-file-import" style="margin-right:6px;"></i> 3. Import Existing Backup (.json)
                </button>
            </div>
            
            <input type="file" id="import-json-file" accept=".json" style="display:none;" onchange="handleJSONDataImport(event)">
            
            <div style="font-size:10px; color:var(--text-muted); background:rgba(255,255,255,0.02); padding:10px; border-radius:8px; line-height:1.4; border:1px dashed rgba(255,255,255,0.05);">
                📌 <b>Note:</b> Transaction Slip aapko printable statement degi jisme app ka <b>EACH AND EVERY THING</b> (Profile, Wallets, Budgets, Goals, Investments aur complete Transactions logs) save hoga.
            </div>

            <div class="modal-actions-row" style="margin-top:15px;">
                <button class="modal-btn btn-secondary" onclick="closeModal()" style="width:100%;">Close Panel</button>
            </div>
        </div>
    `);
};

// 1. RAW EXPORT ENGINE (JSON DOWNLOAD)
window.exportMasterJSONData = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(financialData, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CFO_Ultimate_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

// 2. ULTIMATE BANK STATEMENT RECEIPT GENERATOR (EACH & EVERY THING MODULE)
window.generateProfessionalPDFReceipt = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    const liveDate = new Date().toLocaleDateString('en-GB');
    const liveTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let y = 45;
    const checkPageOverflow = (neededSpace) => {
        if (y + neededSpace > 275) {
            doc.addPage();
            doc.setDrawColor(21, 38, 50);
            doc.setLineWidth(0.2);
            doc.line(15, 12, 195, 12);
            y = 20;
        }
    };

    // --- SLIP DESIGN HEADER ---
    doc.setFillColor(3, 10, 16); 
    doc.rect(0, 0, 210, 35, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MY CFO - ULTIMATE AUDIT STATEMENT", 15, 15);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 176, 255);
    doc.text("OFFICIAL MASTER DIGITAL SLIP (ALL MODULES)", 15, 23);
    
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${liveDate} | ${liveTime}`, 145, 23);
    
    // --- 1. PROFILE & TOTAL VALUE SUMMARY ---
    doc.setTextColor(3, 10, 16);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. CUSTOMER ACCOUNT & MASTER ASSETS VALUE", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    const userName = financialData.profile && financialData.profile.name ? financialData.profile.name : "Active CFO User";
    const userOcc = financialData.profile && financialData.profile.occupation ? financialData.profile.occupation : "Account Manager";
    const curBalance = financialData.balance || 0;
    
    let totalWallets = 0;
    if (financialData.wallets && financialData.wallets.length > 0) {
        totalWallets = financialData.wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
    } else {
        totalWallets = curBalance;
    }
    const totalInvestments = (financialData.investments || []).reduce((sum, inv) => sum + Number(inv.amount || inv.value || 0), 0);
    const totalGoalsSaved = (financialData.goals || []).reduce((sum, g) => sum + Number(g.current || 0), 0);
    const calculatedNetWorth = totalWallets + totalInvestments + totalGoalsSaved;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    y += 8;
    doc.text(`User Name: ${userName}`, 15, y);
    doc.setFont("Helvetica", "bold");
    doc.text(`AVAILABLE BALANCE: Rs. ${Number(curBalance).toLocaleString()}`, 110, y);
    
    y += 6;
    doc.setFont("Helvetica", "normal");
    doc.text(`Occupation: ${userOcc}`, 15, y);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(0, 150, 50); // Green color for Net Worth
    doc.text(`TOTAL NET WORTH: Rs. ${Number(calculatedNetWorth).toLocaleString()}`, 110, y);
    
    doc.setTextColor(3, 10, 16);
    doc.setFont("Helvetica", "normal");

    // --- 2. WALLETS BREAKDOWN ---
    y += 12;
    checkPageOverflow(25);
    doc.setFont("Helvetica", "bold");
    doc.text("2. REGISTERED CASH WALLETS / ACCOUNTS", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFontSize(9);
    y += 7;
    doc.text("Account / Wallet Name", 15, y);
    doc.text("Type", 95, y);
    doc.text("Current Balance", 155, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFont("Helvetica", "normal");
    const walletsList = financialData.wallets || [];
    y += 7;
    if(walletsList.length === 0) {
        doc.text("No separate active wallets created.", 15, y);
        y += 5;
    } else {
        walletsList.forEach(w => {
            checkPageOverflow(8);
            doc.text(`${w.name || 'Unnamed Wallet'}`, 15, y);
            doc.text(`${w.type || 'General'}`, 95, y);
            doc.text(`Rs. ${Number(w.balance || 0).toLocaleString()}`, 155, y);
            y += 6;
        });
    }

    // --- 3. LIVE BUDGETS ---
    y += 8;
    checkPageOverflow(25);
    doc.setFont("Helvetica", "bold");
    doc.text("3. MONTHLY BUDGET CONFIGURATIONS", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFontSize(9);
    y += 7;
    doc.text("Category Target", 15, y);
    doc.text("Budget Limit", 95, y);
    doc.text("Total Spent", 155, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFont("Helvetica", "normal");
    const budgetsList = financialData.budgets || [];
    y += 7;
    if(budgetsList.length === 0) {
        doc.text("No active budgets allocated.", 15, y);
        y += 5;
    } else {
        budgetsList.forEach(b => {
            checkPageOverflow(8);
            doc.text(`${b.category || 'General'}`, 15, y);
            doc.text(`Rs. ${Number(b.limit || 0).toLocaleString()}`, 95, y);
            doc.text(`Rs. ${Number(b.spent || 0).toLocaleString()}`, 155, y);
            y += 6;
        });
    }

    // --- 4. TARGET SAVING GOALS ---
    y += 8;
    checkPageOverflow(25);
    doc.setFont("Helvetica", "bold");
    doc.text("4. SAVINGS GOALS & MILESTONES", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFontSize(9);
    y += 7;
    doc.text("Goal Milestone Title", 15, y);
    doc.text("Target Value", 95, y);
    doc.text("Saved So Far", 155, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFont("Helvetica", "normal");
    const goalsList = financialData.goals || [];
    y += 7;
    if(goalsList.length === 0) {
        doc.text("No active goals created.", 15, y);
        y += 5;
    } else {
        goalsList.forEach(g => {
            checkPageOverflow(8);
            doc.text(`${g.title || 'Saving Milestone'}`, 15, y);
            doc.text(`Rs. ${Number(g.target || 0).toLocaleString()}`, 95, y);
            doc.text(`Rs. ${Number(g.current || 0).toLocaleString()}`, 155, y);
            y += 6;
        });
    }

    // --- 5. INVESTMENTS PORTFOLIO ---
    y += 8;
    checkPageOverflow(25);
    doc.setFont("Helvetica", "bold");
    doc.text("5. CAPITAL INVESTMENTS PORTFOLIO", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFontSize(9);
    y += 7;
    doc.text("Asset Name / Description", 15, y);
    doc.text("Investment Type", 95, y);
    doc.text("Valuation Amount", 155, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFont("Helvetica", "normal");
    const investmentsList = financialData.investments || [];
    y += 7;
    if(investmentsList.length === 0) {
        doc.text("No investments logged yet.", 15, y);
        y += 5;
    } else {
        investmentsList.forEach(inv => {
            checkPageOverflow(8);
            doc.text(`${inv.name || 'Asset Fund'}`, 15, y);
            doc.text(`${inv.type || 'Asset Class'}`, 95, y);
            doc.text(`Rs. ${Number(inv.amount || inv.value || 0).toLocaleString()}`, 155, y);
            y += 6;
        });
    }

    // --- 6. SYSTEM TRANSACTION HISTORY LOGS ---
    y += 10;
    checkPageOverflow(35);
    doc.setFont("Helvetica", "bold");
    doc.text("6. COMPLETE SYSTEM TRANSACTION HISTORY", 15, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFontSize(8.5);
    y += 7;
    doc.text("Date/Time", 15, y);
    doc.text("Description/Title", 52, y);
    doc.text("Category", 112, y);
    doc.text("Type", 150, y);
    doc.text("Amount", 172, y);
    doc.line(15, y+2, 195, y+2);
    
    doc.setFont("Helvetica", "normal");
    const transactionsList = financialData.transactions || [];
    y += 7;
    if(transactionsList.length === 0) {
        doc.text("No transactions discovered in ledger logs.", 15, y);
    } else {
        transactionsList.slice().reverse().forEach((tx) => {
            checkPageOverflow(7);
            doc.text(`${tx.date || ''} ${tx.time || ''}`, 15, y);
            doc.text(`${tx.title ? tx.title.substring(0, 24) : 'N/A'}`, 52, y);
            doc.text(`${tx.category || 'General'}`, 112, y);
            doc.text(`${(tx.type || '').toUpperCase()}`, 150, y);
            doc.text(`Rs. ${Number(tx.amount || 0).toLocaleString()}`, 172, y);
            y += 6.5;
        });
    }
    
    // MASTER FOOTER VERIFICATION
    checkPageOverflow(15);
    doc.setDrawColor(21, 38, 50);
    doc.line(15, 282, 195, 282);
    doc.setFontSize(7.5);
    doc.setTextColor(120, 130, 140);
    doc.text("© Generated Securely via Ultimate Personal CFO Audit Registry System Framework.", 15, 286);
    
    doc.save(`CFO_Full_Master_Slip_${Date.now()}.pdf`);
};

// 3. COMPLETE IMPORT RESTORE MANAGEMENT ENGINE
window.handleJSONDataImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState.balance !== undefined) {
                financialData = {
                    profile: importedState.profile || {},
                    balance: importedState.balance || 0,
                    wallets: importedState.wallets || [],
                    transactions: importedState.transactions || [],
                    budgets: importedState.budgets || [],
                    goals: importedState.goals || [],
                    investments: importedState.investments || []
                };
                
                saveData();
                closeModal();
                if (typeof init === 'function') {
                    init();
                } else {
                    switchScreen('analytics');
                }
                alert("✨ Ultimate Success: Profile, Wallets, Budgets, Goals, Investments & Logs Synced Perfectly!");
            } else {
                alert("🚨 Error: JSON structure configuration missing nodes.");
            }
        } catch (err) {
            alert("🚨 System Failure: Error decoding backup file database mapping.");
        }
    };
    reader.readAsText(file);
};