const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

const newContent = `
      <!-- ================================================================
           VIEW: OVERVIEW
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-overview" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Facility Overview</h1>
            <p class="text-sm text-muted">High-level summary of facility performance and active agent operations.</p>
          </div>
          <div style="display:flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm">Export Report</button>
          </div>
        </div>
        
        <div class="kpis-grid">
          <div class="card kpi-card">
            <div class="kpi-title-row">
              <span>Facility Health</span>
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <div class="kpi-value text-success">98.2%</div>
              <div class="kpi-trend trend-up"><span>All systems optimal</span></div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row">
              <span>Total Energy (Today)</span>
              <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div>
              <div class="kpi-value">12.4 MWh</div>
              <div class="kpi-trend trend-down"><span>-4.2% vs baseline</span></div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row">
              <span>Active Work Orders</span>
              <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <div>
              <div class="kpi-value" style="color: var(--color-warning);">14</div>
              <div class="kpi-trend trend-neutral"><span>3 High Priority</span></div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row">
              <span>Occupancy Level</span>
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div class="kpi-value">68%</div>
              <div class="kpi-trend trend-up"><span>Peak expected at 2 PM</span></div>
            </div>
          </div>
        </div>

        <div class="dashboard-grid" style="margin-top:var(--space-3);">
          <div class="grid-column" style="flex: 2;">
            <article class="card">
              <div class="card-header">
                <h2 class="card-title">System Performance Index</h2>
                <div class="chart-tabs">
                  <button class="chart-tab active">Today</button>
                  <button class="chart-tab">Week</button>
                </div>
              </div>
              <div class="chart-container" style="height: 250px; position: relative;">
                <svg class="chart-svg" viewBox="0 0 800 250" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="overview-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <line class="chart-grid-line" x1="40" y1="40" x2="780" y2="40"></line>
                  <line class="chart-grid-line" x1="40" y1="90" x2="780" y2="90"></line>
                  <line class="chart-grid-line" x1="40" y1="140" x2="780" y2="140"></line>
                  <line class="chart-grid-line" x1="40" y1="190" x2="780" y2="190"></line>
                  <line class="chart-axis-line" x1="40" y1="220" x2="780" y2="220"></line>
                  <path class="chart-line-gradient" style="fill: url(#overview-grad);" d="M 60 180 L 150 120 L 250 140 L 350 80 L 450 90 L 550 50 L 650 100 L 760 60 L 760 220 L 60 220 Z"></path>
                  <path class="chart-line" style="stroke: var(--color-primary);" d="M 60 180 L 150 120 L 250 140 L 350 80 L 450 90 L 550 50 L 650 100 L 760 60"></path>
                </svg>
              </div>
            </article>
          </div>
          <div class="grid-column" style="flex: 1;">
            <article class="card">
              <div class="card-header">
                <h2 class="card-title">Recent Agent Actions</h2>
                <span class="text-xs text-muted">Live</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:16px;">
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-accent);"></div>
                  <div><span class="text-sm font-medium">Energy Agent</span><br><span class="text-xs text-muted">Adjusted Chiller #2 setpoint to 44°F to optimize load.</span></div>
                </div>
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-warning);"></div>
                  <div><span class="text-sm font-medium">Maintenance Agent</span><br><span class="text-xs text-muted">Dispatched WO-2847 for AHU-14 filter replacement.</span></div>
                </div>
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-success);"></div>
                  <div><span class="text-sm font-medium">Occupancy Agent</span><br><span class="text-xs text-muted">Dimmed lighting in Zone C due to low occupancy.</span></div>
                </div>
                <div class="insight-item">
                  <div class="insight-dot" style="background:#8B5CF6;"></div>
                  <div><span class="text-sm font-medium">Security Agent</span><br><span class="text-xs text-muted">Verified all exterior access points secure at 18:00.</span></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ================================================================
           VIEW: AI AGENTS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-ai-agents" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>AI Agents Fleet</h1>
            <p class="text-sm text-muted">Manage, configure, and monitor your autonomous cognitive agents.</p>
          </div>
        </div>
        
        <div class="fleet-grid">
          <article class="card fleet-card" onclick="navigateToView('view-energy')" style="cursor:pointer;">
            <div class="fleet-card-header">
              <div class="fleet-card-icon"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
              <span class="badge badge-success">Active</span>
            </div>
            <div class="fleet-card-info">
              <h3>Energy Agent</h3>
              <p>Balances HVAC setbacks, chiller loading sequencing, and lighting grids to reduce demand charges.</p>
            </div>
            <div class="fleet-card-footer"><span class="text-xs text-muted">Uptime: 99.9%</span><span class="text-xs text-primary font-medium">Manage →</span></div>
          </article>

          <article class="card fleet-card" onclick="navigateToView('view-maintenance')" style="cursor:pointer;">
            <div class="fleet-card-header">
              <div class="fleet-card-icon" style="background-color: rgba(245,158,11,0.1); color: var(--color-warning);"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></div>
              <span class="badge badge-warning">Active</span>
            </div>
            <div class="fleet-card-info">
              <h3>Maintenance Agent</h3>
              <p>Analyzes compressor vibration anomalies, predicts failures, and coordinates maintenance ticketing.</p>
            </div>
            <div class="fleet-card-footer"><span class="text-xs text-muted">Uptime: 99.8%</span><span class="text-xs font-medium" style="color: var(--color-warning);">Manage →</span></div>
          </article>

          <article class="card fleet-card" onclick="navigateToView('view-occupancy')" style="cursor:pointer;">
            <div class="fleet-card-header">
              <div class="fleet-card-icon" style="background-color: rgba(16,185,129,0.1); color: var(--color-success);"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
              <span class="badge badge-success">Active</span>
            </div>
            <div class="fleet-card-info">
              <h3>Occupancy Agent</h3>
              <p>Monitors desk density, counts cafeteria occupancy, and structures ventilation rates dynamically.</p>
            </div>
            <div class="fleet-card-footer"><span class="text-xs text-muted">Uptime: 100%</span><span class="text-xs font-medium" style="color: var(--color-success);">Manage →</span></div>
          </article>

          <article class="card fleet-card" onclick="navigateToView('view-security')" style="cursor:pointer;">
            <div class="fleet-card-header">
              <div class="fleet-card-icon" style="background-color: rgba(139,92,246,0.1); color: #8B5CF6;"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
              <span class="badge badge-success">Active</span>
            </div>
            <div class="fleet-card-info">
              <h3>Security Agent</h3>
              <p>Identifies open access doors, scans thermal boundaries, and alerts guards to unexpected entries.</p>
            </div>
            <div class="fleet-card-footer"><span class="text-xs text-muted">Uptime: 100%</span><span class="text-xs font-medium" style="color: #8B5CF6;">Manage →</span></div>
          </article>
          
          <article class="card fleet-card">
            <div class="fleet-card-header">
              <div class="fleet-card-icon" style="background-color: rgba(100,116,139,0.1); color: var(--color-text-secondary);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>
              <span class="badge" style="background:var(--color-border); color:var(--color-text);">Deploying</span>
            </div>
            <div class="fleet-card-info">
              <h3>Cleaning Agent</h3>
              <p>Orchestrates automated robotic janitorial fleets and optimizes restroom cleaning schedules based on traffic.</p>
            </div>
            <div class="fleet-card-footer"><span class="text-xs text-muted">Estimated: 2 days</span><span class="text-xs font-medium text-muted">Pending Setup</span></div>
          </article>
        </div>
      </section>

      <!-- ================================================================
           VIEW: MODULES
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-modules" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Platform Modules</h1>
            <p class="text-sm text-muted">Extend your facility operations with specialized modules.</p>
          </div>
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-3);">
           <article class="card fleet-card">
              <div class="fleet-card-header">
                <h2 class="card-title">HVAC Management</h2>
                <span class="badge badge-success">Installed</span>
              </div>
              <p class="text-sm text-muted" style="margin-top:12px;">Detailed controls and overrides for AHUs, VAVs, and Chiller loops.</p>
              <button class="btn btn-secondary btn-sm" style="margin-top:16px; width:100%;">Open Module</button>
           </article>
           <article class="card fleet-card">
              <div class="fleet-card-header">
                <h2 class="card-title">Access Control</h2>
                <span class="badge badge-success">Installed</span>
              </div>
              <p class="text-sm text-muted" style="margin-top:12px;">Manage badges, visitor logs, and secure zone permissions.</p>
              <button class="btn btn-secondary btn-sm" style="margin-top:16px; width:100%;">Open Module</button>
           </article>
           <article class="card fleet-card">
              <div class="fleet-card-header">
                <h2 class="card-title">Inventory & Supply</h2>
                <span class="badge badge-primary">Update Avail</span>
              </div>
              <p class="text-sm text-muted" style="margin-top:12px;">Track spare parts, filters, and cleaning supplies in real-time.</p>
              <button class="btn btn-secondary btn-sm" style="margin-top:16px; width:100%;">Open Module</button>
           </article>
           <article class="card fleet-card">
              <div class="fleet-card-header">
                <h2 class="card-title">Smart Parking</h2>
                <span class="badge" style="background:var(--color-border); color:var(--color-text);">Not Installed</span>
              </div>
              <p class="text-sm text-muted" style="margin-top:12px;">License plate recognition and EV charging station management.</p>
              <button class="btn btn-primary btn-sm" style="margin-top:16px; width:100%;">Install Module</button>
           </article>
        </div>
      </section>

      <!-- ================================================================
           VIEW: WORK ORDERS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-work-orders" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Work Orders</h1>
            <p class="text-sm text-muted">Track and manage predictive and reactive maintenance tasks.</p>
          </div>
          <button class="btn btn-primary btn-sm">+ New Work Order</button>
        </div>
        
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:16px; flex-wrap:wrap;">
            <div class="topbar-search" style="flex:1; min-width:250px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="topbar-search-input" placeholder="Search work orders...">
            </div>
            <div style="display:flex; gap:8px;">
              <select class="topbar-search-input" style="padding:8px; border-radius:var(--radius-sm); border:1px solid var(--color-border); background:var(--color-card); color:var(--color-text);">
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select class="topbar-search-input" style="padding:8px; border-radius:var(--radius-sm); border:1px solid var(--color-border); background:var(--color-card); color:var(--color-text);">
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.875rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--color-border); color:var(--color-text-secondary);">
                  <th style="padding:12px;">ID</th>
                  <th style="padding:12px;">Asset / Task</th>
                  <th style="padding:12px;">Priority</th>
                  <th style="padding:12px;">Status</th>
                  <th style="padding:12px;">Assignee</th>
                  <th style="padding:12px;">Created</th>
                  <th style="padding:12px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">WO-2847</td>
                  <td style="padding:12px;">AHU-14 Filter Replacement</td>
                  <td style="padding:12px;"><span class="badge badge-warning">High</span></td>
                  <td style="padding:12px;"><span class="badge" style="background:#DBEAFE; color:#1D4ED8;">In Progress</span></td>
                  <td style="padding:12px;">Tech Team Alpha</td>
                  <td style="padding:12px;">Today, 14:30</td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">View</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">WO-2841</td>
                  <td style="padding:12px;">Pump P-07 Bearing Inspection</td>
                  <td style="padding:12px;"><span class="badge badge-danger">Critical</span></td>
                  <td style="padding:12px;"><span class="badge" style="background:#FEE2E2; color:#B91C1C;">Open</span></td>
                  <td style="padding:12px;">Tech Team Beta</td>
                  <td style="padding:12px;">Today, 10:15</td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">View</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">WO-2839</td>
                  <td style="padding:12px;">Chiller #1 Vibration Check</td>
                  <td style="padding:12px;"><span class="badge badge-warning">High</span></td>
                  <td style="padding:12px;"><span class="badge" style="background:#F3F4F6; color:#374151;">Scheduled</span></td>
                  <td style="padding:12px;">Senior Tech</td>
                  <td style="padding:12px;">Yesterday</td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">View</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">WO-2835</td>
                  <td style="padding:12px;">Cooling Tower Fan Belt</td>
                  <td style="padding:12px;"><span class="badge" style="background:var(--color-border); color:var(--color-text);">Medium</span></td>
                  <td style="padding:12px;"><span class="badge badge-success">Completed</span></td>
                  <td style="padding:12px;">Tech Team Alpha</td>
                  <td style="padding:12px;">Jul 28</td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">View</button></td>
                </tr>
                <tr>
                  <td style="padding:12px; font-weight:500;">WO-2831</td>
                  <td style="padding:12px;">BMS Sensor Calibration - Zone C</td>
                  <td style="padding:12px;"><span class="badge" style="background:var(--color-border); color:var(--color-text);">Low</span></td>
                  <td style="padding:12px;"><span class="badge badge-success">Completed</span></td>
                  <td style="padding:12px;">Controls Eng.</td>
                  <td style="padding:12px;">Jul 27</td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:0.875rem; color:var(--color-text-secondary);">
            <span>Showing 1 to 5 of 124 entries</span>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-secondary btn-sm" disabled>&lt;</button>
              <button class="btn btn-primary btn-sm">1</button>
              <button class="btn btn-secondary btn-sm">2</button>
              <button class="btn btn-secondary btn-sm">3</button>
              <button class="btn btn-secondary btn-sm">&gt;</button>
            </div>
          </div>
        </article>
      </section>

      <!-- ================================================================
           VIEW: ASSETS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-assets" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Asset Management</h1>
            <p class="text-sm text-muted">Complete inventory of all building systems, equipment, and sensors.</p>
          </div>
          <button class="btn btn-primary btn-sm">+ Add Asset</button>
        </div>
        
        <div class="kpis-grid">
          <div class="card kpi-card"><div class="kpi-title-row"><span>Total Assets</span></div><div><div class="kpi-value">1,250</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Healthy</span></div><div><div class="kpi-value text-success">1,050</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Needs Attention</span></div><div><div class="kpi-value text-warning">120</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Critical / Offline</span></div><div><div class="kpi-value text-danger">80</div></div></div>
        </div>
        
        <article class="card" style="margin-top:var(--space-3);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 class="card-title">Asset Registry</h2>
            <div class="topbar-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="topbar-search-input" placeholder="Search by name, ID, location...">
            </div>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.875rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--color-border); color:var(--color-text-secondary);">
                  <th style="padding:12px;">Asset Name</th>
                  <th style="padding:12px;">Category</th>
                  <th style="padding:12px;">Location</th>
                  <th style="padding:12px;">Status</th>
                  <th style="padding:12px;">Health Score</th>
                  <th style="padding:12px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">Chiller #1</td>
                  <td style="padding:12px;">HVAC</td>
                  <td style="padding:12px;">Basement Plant</td>
                  <td style="padding:12px;"><span class="badge badge-success">Online</span></td>
                  <td style="padding:12px;"><div style="display:flex; align-items:center; gap:8px;"><div style="flex:1; height:6px; background:var(--color-border); border-radius:3px;"><div style="width:92%; height:100%; background:var(--color-success); border-radius:3px;"></div></div><span>92</span></div></td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Details</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">Chiller #3</td>
                  <td style="padding:12px;">HVAC</td>
                  <td style="padding:12px;">Basement Plant</td>
                  <td style="padding:12px;"><span class="badge badge-warning">Warning</span></td>
                  <td style="padding:12px;"><div style="display:flex; align-items:center; gap:8px;"><div style="flex:1; height:6px; background:var(--color-border); border-radius:3px;"><div style="width:45%; height:100%; background:var(--color-warning); border-radius:3px;"></div></div><span>45</span></div></td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Details</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">Pump P-07</td>
                  <td style="padding:12px;">Plumbing</td>
                  <td style="padding:12px;">Mechanical Room 2</td>
                  <td style="padding:12px;"><span class="badge badge-danger">Critical</span></td>
                  <td style="padding:12px;"><div style="display:flex; align-items:center; gap:8px;"><div style="flex:1; height:6px; background:var(--color-border); border-radius:3px;"><div style="width:12%; height:100%; background:var(--color-danger); border-radius:3px;"></div></div><span>12</span></div></td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Details</button></td>
                </tr>
                <tr style="border-bottom:1px solid var(--color-border-light);">
                  <td style="padding:12px; font-weight:500;">AHU-14</td>
                  <td style="padding:12px;">HVAC</td>
                  <td style="padding:12px;">Zone B (West Wing)</td>
                  <td style="padding:12px;"><span class="badge badge-warning">Warning</span></td>
                  <td style="padding:12px;"><div style="display:flex; align-items:center; gap:8px;"><div style="flex:1; height:6px; background:var(--color-border); border-radius:3px;"><div style="width:58%; height:100%; background:var(--color-warning); border-radius:3px;"></div></div><span>58</span></div></td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Details</button></td>
                </tr>
                <tr>
                  <td style="padding:12px; font-weight:500;">Elevator A</td>
                  <td style="padding:12px;">Transport</td>
                  <td style="padding:12px;">Main Lobby</td>
                  <td style="padding:12px;"><span class="badge badge-success">Online</span></td>
                  <td style="padding:12px;"><div style="display:flex; align-items:center; gap:8px;"><div style="flex:1; height:6px; background:var(--color-border); border-radius:3px;"><div style="width:98%; height:100%; background:var(--color-success); border-radius:3px;"></div></div><span>98</span></div></td>
                  <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Details</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <!-- ================================================================
           VIEW: MONITORING
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-monitoring" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Live Monitoring</h1>
            <p class="text-sm text-muted">Real-time telemetry and environmental data streams.</p>
          </div>
        </div>
        
        <div class="kpis-grid">
          <div class="card kpi-card">
            <div class="kpi-title-row"><span>Average Temp</span></div>
            <div><div class="kpi-value">72.4°F</div><div class="kpi-trend trend-neutral"><span>Optimal</span></div></div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row"><span>Air Quality (AQI)</span></div>
            <div><div class="kpi-value text-success">42</div><div class="kpi-trend trend-neutral"><span>Good</span></div></div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row"><span>Current Demand</span></div>
            <div><div class="kpi-value">845 kW</div><div class="kpi-trend trend-down"><span>Dropping</span></div></div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-title-row"><span>Water Flow</span></div>
            <div><div class="kpi-value">12.5 GPM</div><div class="kpi-trend trend-neutral"><span>Steady</span></div></div>
          </div>
        </div>

        <div class="dashboard-grid" style="margin-top:var(--space-3);">
          <div class="grid-column" style="flex: 2;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Live Environmental Data</h2></div>
              <div class="chart-container" style="height:250px; position:relative;">
                <svg class="chart-svg" viewBox="0 0 800 250" preserveAspectRatio="none">
                  <line class="chart-grid-line" x1="40" y1="40" x2="780" y2="40"></line>
                  <line class="chart-grid-line" x1="40" y1="90" x2="780" y2="90"></line>
                  <line class="chart-grid-line" x1="40" y1="140" x2="780" y2="140"></line>
                  <line class="chart-grid-line" x1="40" y1="190" x2="780" y2="190"></line>
                  <line class="chart-axis-line" x1="40" y1="220" x2="780" y2="220"></line>
                  <!-- Temp line -->
                  <path class="chart-line" style="stroke: #F59E0B;" d="M 40 120 L 100 110 L 200 130 L 300 125 L 400 100 L 500 105 L 600 115 L 700 90 L 780 95"></path>
                  <!-- Humidity line -->
                  <path class="chart-line" style="stroke: #3B82F6; stroke-dasharray: 5,5;" d="M 40 160 L 100 165 L 200 150 L 300 155 L 400 170 L 500 165 L 600 160 L 700 175 L 780 170"></path>
                </svg>
                <div style="display:flex; justify-content:center; gap:16px; margin-top:12px;">
                  <div style="display:flex; align-items:center; gap:4px;"><span style="width:12px; height:12px; background:#F59E0B; border-radius:50%;"></span><span class="text-xs">Temperature</span></div>
                  <div style="display:flex; align-items:center; gap:4px;"><span style="width:12px; height:2px; background:#3B82F6; border-top: 2px dashed #3B82F6;"></span><span class="text-xs">Humidity</span></div>
                </div>
              </div>
            </article>
          </div>
          <div class="grid-column" style="flex: 1;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Zone Sensors</h2></div>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; padding:12px; border:1px solid var(--color-border); border-radius:var(--radius-sm);">
                  <div>
                    <div class="text-sm font-medium">Zone A (East Wing)</div>
                    <div class="text-xs text-muted">Temp: 71.8°F | CO2: 420ppm</div>
                  </div>
                  <span class="status-dot pulse" style="background:var(--color-success);"></span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:12px; border:1px solid var(--color-border); border-radius:var(--radius-sm);">
                  <div>
                    <div class="text-sm font-medium">Zone B (West Wing)</div>
                    <div class="text-xs text-muted">Temp: 74.2°F | CO2: 580ppm</div>
                  </div>
                  <span class="status-dot pulse" style="background:var(--color-warning);"></span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:12px; border:1px solid var(--color-border); border-radius:var(--radius-sm);">
                  <div>
                    <div class="text-sm font-medium">Zone C (Data Center)</div>
                    <div class="text-xs text-muted">Temp: 68.5°F | Humidity: 45%</div>
                  </div>
                  <span class="status-dot pulse" style="background:var(--color-success);"></span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ================================================================
           VIEW: ANALYTICS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-analytics" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Analytics & Insights</h1>
            <p class="text-sm text-muted">Deep dive into facility data, trends, and AI-generated insights.</p>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="grid-column" style="flex:2;">
             <article class="card">
                <div class="card-header"><h2 class="card-title">Energy Cost vs Baseline (YTD)</h2></div>
                <div class="chart-container" style="height:300px; padding:16px;">
                  <div style="display:flex; height:100%; align-items:flex-end; gap:12px; justify-content:space-between; padding-bottom:24px; border-bottom:1px solid var(--color-border);">
                    <div style="width:40px; height:60%; background:var(--color-primary); opacity:0.5; border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:50%; background:var(--color-accent); border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:70%; background:var(--color-primary); opacity:0.5; border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:55%; background:var(--color-accent); border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:80%; background:var(--color-primary); opacity:0.5; border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:65%; background:var(--color-accent); border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:90%; background:var(--color-primary); opacity:0.5; border-radius:4px 4px 0 0;"></div>
                    <div style="width:40px; height:70%; background:var(--color-accent); border-radius:4px 4px 0 0;"></div>
                  </div>
                  <div style="display:flex; justify-content:center; gap:24px; margin-top:12px;">
                    <div style="display:flex; align-items:center; gap:6px;"><div style="width:12px;height:12px;background:var(--color-primary);opacity:0.5;border-radius:2px;"></div><span class="text-xs">Baseline Cost</span></div>
                    <div style="display:flex; align-items:center; gap:6px;"><div style="width:12px;height:12px;background:var(--color-accent);border-radius:2px;"></div><span class="text-xs">Actual Cost (AI Optimized)</span></div>
                  </div>
                </div>
             </article>
          </div>
          <div class="grid-column" style="flex:1;">
             <article class="card">
                <div class="card-header"><h2 class="card-title">Savings Summary</h2></div>
                <div style="display:flex; flex-direction:column; gap:24px;">
                  <div>
                    <div class="text-sm text-muted">Total Savings (YTD)</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-success);">$42,850</div>
                  </div>
                  <div>
                    <div class="text-sm text-muted">Carbon Reduced (YTD)</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-success);">142 Tons</div>
                  </div>
                  <div>
                    <div class="text-sm text-muted">Efficiency Score</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-accent);">94 / 100</div>
                  </div>
                </div>
             </article>
          </div>
        </div>
      </section>

      <!-- ================================================================
           VIEW: REPORTS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-reports" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>Compliance & Reports</h1>
            <p class="text-sm text-muted">Generate, schedule, and download automated facility reports.</p>
          </div>
          <button class="btn btn-primary btn-sm">Generate Custom Report</button>
        </div>
        
        <div class="dashboard-grid">
          <div class="grid-column" style="flex:1;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Scheduled Reports</h2></div>
              <div style="display:flex; flex-direction:column; gap:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid var(--color-border-light);">
                  <div>
                    <div class="text-sm font-medium">Monthly Energy Summary</div>
                    <div class="text-xs text-muted">Runs 1st of every month</div>
                  </div>
                  <span class="badge badge-success">Active</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid var(--color-border-light);">
                  <div>
                    <div class="text-sm font-medium">Weekly Maintenance Log</div>
                    <div class="text-xs text-muted">Runs every Sunday</div>
                  </div>
                  <span class="badge badge-success">Active</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div class="text-sm font-medium">Quarterly Carbon Audit</div>
                    <div class="text-xs text-muted">Runs end of quarter</div>
                  </div>
                  <span class="badge badge-success">Active</span>
                </div>
              </div>
            </article>
          </div>
          
          <div class="grid-column" style="flex:2;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Recent Downloads</h2></div>
              <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.875rem;">
                <thead>
                  <tr style="border-bottom:1px solid var(--color-border); color:var(--color-text-secondary);">
                    <th style="padding:12px;">Report Name</th>
                    <th style="padding:12px;">Format</th>
                    <th style="padding:12px;">Generated Date</th>
                    <th style="padding:12px;">Size</th>
                    <th style="padding:12px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--color-border-light);">
                    <td style="padding:12px; font-weight:500;">June 2026 Energy Summary</td>
                    <td style="padding:12px;"><span class="badge" style="background:#FEE2E2; color:#B91C1C;">PDF</span></td>
                    <td style="padding:12px;">Jul 1, 2026</td>
                    <td style="padding:12px;">2.4 MB</td>
                    <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Download</button></td>
                  </tr>
                  <tr style="border-bottom:1px solid var(--color-border-light);">
                    <td style="padding:12px; font-weight:500;">Q2 Carbon Footprint Audit</td>
                    <td style="padding:12px;"><span class="badge" style="background:#FEE2E2; color:#B91C1C;">PDF</span></td>
                    <td style="padding:12px;">Jul 1, 2026</td>
                    <td style="padding:12px;">4.1 MB</td>
                    <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Download</button></td>
                  </tr>
                  <tr>
                    <td style="padding:12px; font-weight:500;">Raw Sensor Data - Last 7 Days</td>
                    <td style="padding:12px;"><span class="badge" style="background:#DCFCE7; color:#15803D;">CSV</span></td>
                    <td style="padding:12px;">Today</td>
                    <td style="padding:12px;">18.5 MB</td>
                    <td style="padding:12px;"><button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Download</button></td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
        </div>
      </section>

      <!-- ================================================================
           VIEW: ALERTS
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-alerts" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <h1>System Alerts</h1>
            <p class="text-sm text-muted">Centralized view of all facility warnings, faults, and AI notifications.</p>
          </div>
          <button class="btn btn-secondary btn-sm">Acknowledge All</button>
        </div>
        
        <article class="card">
          <div style="display:flex; gap:8px; margin-bottom:16px;">
            <button class="btn btn-primary btn-sm">All Alerts</button>
            <button class="btn btn-secondary btn-sm">Critical (2)</button>
            <button class="btn btn-secondary btn-sm">Warnings (3)</button>
            <button class="btn btn-secondary btn-sm">Info (8)</button>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="alert-item critical">
              <div class="alert-item-body">
                <span class="alert-desc" style="font-weight:600;">Data Center CRAC unit secondary backup fan offline. High vibration detected.</span>
                <span class="alert-time">Today, 18:30 • Zone C Cooling • Assigned to: Maintenance Agent</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Acknowledge</button>
            </div>
            <div class="alert-item critical">
              <div class="alert-item-body">
                <span class="alert-desc" style="font-weight:600;">Pump P-07 bearing wear anomaly detected (Critical Risk).</span>
                <span class="alert-time">Today, 10:15 • Mechanical Room 2 • Work Order WO-2841 Created</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Acknowledge</button>
            </div>
            <div class="alert-item warning">
              <div class="alert-item-body">
                <span class="alert-desc" style="font-weight:500;">Standby power usage in West Wing exceeded standard baselines.</span>
                <span class="alert-time">Today, 09:45 • Standby Load • Investigated by: Energy Agent</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Acknowledge</button>
            </div>
            <div class="alert-item warning">
              <div class="alert-item-body">
                <span class="alert-desc" style="font-weight:500;">AHU-14 Filter ΔP exceeded limit. Airflow reduced 22%.</span>
                <span class="alert-time">Yesterday, 14:20 • Zone B • Work Order WO-2847 Created</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Acknowledge</button>
            </div>
            <div class="alert-item info">
              <div class="alert-item-body">
                <span class="alert-desc">Energy Agent triggered regular chiller optimization cycle.</span>
                <span class="alert-time">Yesterday, 11:00 • System Audit</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Dismiss</button>
            </div>
            <div class="alert-item info">
              <div class="alert-item-body">
                <span class="alert-desc">Occupancy in Cafeteria normalized to 45%.</span>
                <span class="alert-time">Yesterday, 14:00 • Occupancy Agent</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding:4px 8px;">Dismiss</button>
            </div>
          </div>
        </article>
      </section>

      <!-- ================================================================
           VIEW: SECURITY AGENT (Enhanced)
           ================================================================ -->
      <section class="dashboard-content agent-view" id="view-security" style="display:none;">
        <div class="welcome-section">
          <div class="welcome-info">
            <div style="display:flex; align-items:center; gap: var(--space-15); margin-bottom: 6px;">
              <div class="brand-icon" style="background: linear-gradient(135deg,#8B5CF6,#7C3AED); width:36px; height:36px;">
                <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h1>Security Agent</h1>
              <span class="badge badge-success" style="font-size:0.8125rem;">● Running</span>
            </div>
            <p class="text-sm text-muted">Autonomous surveillance, access control management, and anomaly detection.</p>
          </div>
        </div>
        
        <div class="kpis-grid">
          <div class="card kpi-card"><div class="kpi-title-row"><span>Active Threats</span></div><div><div class="kpi-value text-success">0</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Threat Detection Accuracy</span></div><div><div class="kpi-value">99.8%</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Cameras Online</span></div><div><div class="kpi-value">124 / 125</div></div></div>
          <div class="card kpi-card"><div class="kpi-title-row"><span>Access Points Secured</span></div><div><div class="kpi-value">48 / 48</div></div></div>
        </div>
        
        <div class="dashboard-grid" style="margin-top:var(--space-3);">
          <div class="grid-column" style="flex:2;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Live Video Feeds (Simulated)</h2></div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                <div style="background:#000; height:150px; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
                  <span class="badge badge-success" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);">CAM-01 (Main Lobby)</span>
                  <div style="width:50px; height:50px; border:2px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                    <div style="width:10px; height:10px; background:#ef4444; border-radius:50%; box-shadow: 0 0 10px #ef4444;"></div>
                  </div>
                </div>
                <div style="background:#000; height:150px; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
                  <span class="badge badge-success" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);">CAM-08 (East Parking)</span>
                  <div style="width:50px; height:50px; border:2px solid rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                    <div style="width:10px; height:10px; background:#ef4444; border-radius:50%; box-shadow: 0 0 10px #ef4444;"></div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div class="grid-column" style="flex:1;">
            <article class="card">
              <div class="card-header"><h2 class="card-title">Recent Security Events</h2></div>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-warning);"></div>
                  <div><span class="text-sm font-medium">Tailgating Attempt</span><br><span class="text-xs text-muted">South Entrance • Blocked • 14:20</span></div>
                </div>
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-success);"></div>
                  <div><span class="text-sm font-medium">Patrol Completed</span><br><span class="text-xs text-muted">Perimeter checks nominal • 12:00</span></div>
                </div>
                <div class="insight-item">
                  <div class="insight-dot" style="background:var(--color-success);"></div>
                  <div><span class="text-sm font-medium">Door Left Open (Resolved)</span><br><span class="text-xs text-muted">Server Room B • Auto-closed • 09:15</span></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Schedules (Remaining stub) -->
      <section class="dashboard-content agent-view" id="view-schedules" style="display:none;"><div class="welcome-section"><div class="welcome-info"><h1>Schedules</h1><p class="text-sm text-muted">Manage automation schedules.</p></div></div></section>
      <!-- Integrations (Remaining stub) -->
      <section class="dashboard-content agent-view" id="view-integrations" style="display:none;"><div class="welcome-section"><div class="welcome-info"><h1>Integrations</h1><p class="text-sm text-muted">Manage 3rd party connections.</p></div></div></section>
      <!-- Settings (Remaining stub) -->
      <section class="dashboard-content agent-view" id="view-settings" style="display:none;"><div class="welcome-section"><div class="welcome-info"><h1>Settings</h1><p class="text-sm text-muted">Platform settings and configuration.</p></div></div></section>
`;

const startMarker = '<!-- ================================================================';
const missingViewsMarker = 'MISSING VIEWS';
const footerMarker = '<!-- Footer -->';

let startIndex = html.indexOf(startMarker, html.indexOf(missingViewsMarker) - 100);
if(startIndex === -1) {
  console.log('Failed to find start marker');
  process.exit(1);
}

let endIndex = html.indexOf(footerMarker);
if(endIndex === -1) {
  console.log('Failed to find footer marker');
  process.exit(1);
}

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);

fs.writeFileSync('dashboard.html', before + newContent + '\n      ' + after);
console.log('Successfully updated dashboard.html');
