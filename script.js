/* ==========================================================================
   Agentic FacilityOps AI Platform — Interactivity Script
   Supports: Dashboard, Energy Agent, Maintenance Agent, Occupancy Agent
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLiveDate();
  initSidebar();
  initChartTooltips();
  initConsoleLogs();
  initThemeToggle();
  initChartTabs();
  initEnergy30dChart();
  initMaintChart();
  initOccChart();
  initMaintConsoleLogs();
  initOccConsoleLogs();
  initEnergyConsoleLogs();
});

// ============================================================
// Global State (Dashboard)
// ============================================================
let currentEnergyKwh   = 42850;
let currentCostUSD     = 5142.00;
let currentCarbonTons  = 18.2;
let activeAlertsCount  = 3;
let availableActionsCount = 2;

// Energy Agent extra state
let energyActionsCount = 3;

// Occupancy Agent extra state
let occActionsCount = 3;

const UTILITY_RATE = 0.12;

// ============================================================
// Live Date
// ============================================================
function initLiveDate() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  const formatted = today.toLocaleDateString('en-US', opts);
  ['live-date', 'energy-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatted;
  });
}

// ============================================================
// SPA Navigation — View Switcher
// ============================================================
window.navigateToView = function(viewId) {
  // Hide all views
  document.querySelectorAll('.agent-view').forEach(v => { v.style.display = 'none'; });

  // Show target view
  const target = document.getElementById(viewId);
  if (target) { target.style.display = 'block'; }

  // Update sidebar active states
  document.querySelectorAll('.sidebar-menu-item').forEach(item => item.classList.remove('active'));
  const viewToMenu = {
    'view-overview':    'menu-overview',
    'view-dashboard':   'menu-dashboard',
    'view-ai-agents':   'menu-ai-agents',
    'view-modules':     'menu-modules',
    'view-work-orders': 'menu-work-orders',
    'view-assets':      'menu-assets',
    'view-monitoring':  'menu-monitoring',
    'view-energy':      'menu-energy',
    'view-maintenance': 'menu-maintenance',
    'view-occupancy':   'menu-occupancy',
    'view-security':    'menu-security',
    'view-analytics':   'menu-analytics',
    'view-reports':     'menu-reports',
    'view-alerts':      'menu-alerts',
    'view-schedules':   'menu-schedules',
    'view-integrations':'menu-integrations',
    'view-settings':    'menu-settings'
  };
  const menuId = viewToMenu[viewId];
  if (menuId) {
    const menuItem = document.getElementById(menuId);
    if (menuItem) menuItem.classList.add('active');
  }

  // Close sidebar on mobile
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth < 993) {
    sidebar.classList.remove('active');
  }
};

// ============================================================
// Sidebar — hamburger & nav item switching
// ============================================================
function initSidebar() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar    = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      sidebar.classList.toggle('active');
      e.stopPropagation();
    });
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Wire up nav items to SPA view switching
  const navItems = document.querySelectorAll('.sidebar-menu-item:not(.disabled)');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      if (viewId) {
        navigateToView(viewId);
        const label = item.querySelector('span') ? item.querySelector('span').textContent.trim() : '';
        logToConsole('System', `Navigated to section: [${label}]`, 'action');
      }
    });
  });
}

// ============================================================
// Dashboard SVG Chart — 7d Tooltips
// ============================================================
function initChartTooltips() {
  const nodes   = document.querySelectorAll('.chart-node');
  const tooltip = document.getElementById('chart-tooltip');
  const parent  = document.getElementById('chart-parent');

  if (!tooltip || !parent) return;

  nodes.forEach(node => {
    node.addEventListener('mouseover', () => {
      tooltip.innerHTML = `<strong>${node.getAttribute('data-day')}</strong><br>${node.getAttribute('data-value')}`;
      tooltip.style.opacity = '1';
      positionTooltip(node, tooltip, parent);
    });
    node.addEventListener('mousemove', () => positionTooltip(node, tooltip, parent));
    node.addEventListener('mouseout',  () => { tooltip.style.opacity = '0'; });
  });
}

function positionTooltip(node, tooltip, container) {
  const nr = node.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  tooltip.style.left = `${nr.left - cr.left + nr.width / 2}px`;
  tooltip.style.top  = `${nr.top  - cr.top}px`;
}

// ============================================================
// Chart Tab Switching (7d / 30d) — Dashboard view only
// ============================================================
function initChartTabs() {
  const tab7d  = document.getElementById('tab-7d');
  const tab30d = document.getElementById('tab-30d');
  if (!tab7d || !tab30d) return;

  tab7d.addEventListener('click', () => {
    tab7d.classList.add('active');
    tab30d.classList.remove('active');
    logToConsole('System', 'Chart view: Last 7 Days selected.', 'neutral');
  });

  tab30d.addEventListener('click', () => {
    tab30d.classList.add('active');
    tab7d.classList.remove('active');
    logToConsole('System', 'Chart view: Last 30 Days selected.', 'neutral');
  });
}

// ============================================================
// Apply Recommendation — Dashboard (original)
// ============================================================
window.applyRecommendation = function(itemId, savingsKwh, carbonKg) {
  const item = document.getElementById(itemId);
  if (!item) return;
  const btn    = item.querySelector('.btn');
  const loader = btn.querySelector('.btn-loader');
  const text   = btn.querySelector('.btn-text-content');
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  loader.style.display = 'inline-block';
  text.style.display   = 'none';

  setTimeout(() => {
    item.classList.add('applied');
    const badge = document.createElement('span');
    badge.className = 'badge badge-success';
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Applied`;
    btn.parentNode.replaceChild(badge, btn);

    currentEnergyKwh   -= savingsKwh;
    currentCostUSD     -= (savingsKwh * UTILITY_RATE);
    currentCarbonTons  -= (carbonKg / 1000);
    availableActionsCount--;

    animateValueUpdate('kpi-energy', `${currentEnergyKwh.toLocaleString()} kWh`);
    animateValueUpdate('kpi-cost',   `$${currentCostUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    animateValueUpdate('kpi-carbon', `${currentCarbonTons.toFixed(2)} Tons CO₂`);

    const countBadge = document.getElementById('actions-count');
    if (countBadge) {
      countBadge.textContent = `${availableActionsCount > 0 ? availableActionsCount : 0} Available`;
      if (availableActionsCount === 0) countBadge.className = 'badge badge-neutral';
    }

    if (itemId === 'rec-hvac') {
      const zoneBTemp   = document.getElementById('zone-b-temp');
      const zoneBStatus = document.getElementById('zone-b-status');
      if (zoneBTemp) { zoneBTemp.textContent = '72.7°F'; zoneBTemp.style.color = 'var(--color-primary)'; setTimeout(() => zoneBTemp.style.color = '', 1500); }
      if (zoneBStatus) { zoneBStatus.textContent = 'Optimized'; zoneBStatus.className = 'badge badge-success'; }
      logToConsole('EnergyAgent', 'HVAC setback applied in Zone B. Setpoint changed from 74.2°F to 72.7°F.', 'highlight');
    } else if (itemId === 'rec-chiller') {
      logToConsole('EnergyAgent', 'Chiller sequencing policy updated. Optimized staging configuration loaded.', 'highlight');
    }
  }, 1000);
};

// ============================================================
// Apply Recommendation — Energy Agent page
// ============================================================
window.applyEnergyRec = function(itemId, savingsKwh, carbonKg, consoleMsg) {
  const item = document.getElementById(itemId);
  if (!item) return;
  const btn    = item.querySelector('.btn');
  if (!btn) return;
  const loader = btn.querySelector('.btn-loader');
  const text   = btn.querySelector('.btn-text-content');
  btn.disabled = true;
  loader.style.display = 'inline-block';
  text.style.display   = 'none';

  setTimeout(() => {
    item.classList.add('applied');
    const badge = document.createElement('span');
    badge.className = 'badge badge-success';
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Applied`;
    btn.parentNode.replaceChild(badge, btn);

    energyActionsCount--;
    const badge2 = document.getElementById('energy-actions-count');
    if (badge2) {
      badge2.textContent = `${energyActionsCount > 0 ? energyActionsCount : 0} Available`;
      if (energyActionsCount === 0) badge2.className = 'badge badge-neutral';
    }

    // Animate KPI value changes
    const energySavingsEl = document.getElementById('energy-savings-val');
    if (energySavingsEl) {
      let currentVal = parseFloat(energySavingsEl.textContent);
      currentVal += 0.8;
      animateValueUpdate('energy-savings-val', `${currentVal.toFixed(1)}%`);
    }

    const costSavingsEl = document.getElementById('cost-savings-val');
    if (costSavingsEl) {
      let currentVal = parseFloat(costSavingsEl.textContent.replace('$', '').replace(',', ''));
      currentVal += Math.round(savingsKwh * UTILITY_RATE);
      animateValueUpdate('cost-savings-val', `$${currentVal.toLocaleString()}`);
    }

    logToConsole('EnergyAgent', consoleMsg, 'highlight');
  }, 1000);
};

// ============================================================
// Apply Recommendation — Maintenance Agent page
// ============================================================
window.applyMaintRec = function(itemId, consoleMsg) {
  const item = document.getElementById(itemId);
  if (!item) return;
  const btn    = item.querySelector('.btn');
  if (!btn) return;
  const loader = btn.querySelector('.btn-loader');
  const text   = btn.querySelector('.btn-text-content');
  btn.disabled = true;
  loader.style.display = 'inline-block';
  text.style.display   = 'none';

  setTimeout(() => {
    item.classList.add('applied');
    const badge = document.createElement('span');
    badge.className = 'badge badge-success';
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Dispatched`;
    btn.parentNode.replaceChild(badge, btn);

    // Animate KPI value change: increment closed work orders
    const maintClosedEl = document.getElementById('kpi-maint-closed');
    if (maintClosedEl) {
      let currentVal = parseInt(maintClosedEl.textContent);
      currentVal += 1;
      animateValueUpdate('kpi-maint-closed', currentVal.toString());
    }

    logToConsole('MaintenanceAgent', consoleMsg, 'highlight');
  }, 1000);
};

// ============================================================
// Apply Recommendation — Occupancy Agent page
// ============================================================
window.applyOccRec = function(itemId, consoleMsg) {
  const item = document.getElementById(itemId);
  if (!item) return;
  const btn    = item.querySelector('.btn');
  if (!btn) return;
  const loader = btn.querySelector('.btn-loader');
  const text   = btn.querySelector('.btn-text-content');
  btn.disabled = true;
  loader.style.display = 'inline-block';
  text.style.display   = 'none';

  setTimeout(() => {
    item.classList.add('applied');
    const badge = document.createElement('span');
    badge.className = 'badge badge-success';
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Applied`;
    btn.parentNode.replaceChild(badge, btn);

    occActionsCount--;
    const badge2 = document.getElementById('occ-actions-count');
    if (badge2) {
      badge2.textContent = `${occActionsCount > 0 ? occActionsCount : 0} Available`;
      if (occActionsCount === 0) badge2.className = 'badge badge-neutral';
    }

    // Animate KPI value change: update space utilization slightly
    const spaceUtilEl = document.getElementById('kpi-space-util');
    if (spaceUtilEl) {
      let currentVal = parseFloat(spaceUtilEl.textContent);
      currentVal = Math.min(100, currentVal + 1.5);
      animateValueUpdate('kpi-space-util', `${currentVal.toFixed(1)}%`);
    }

    logToConsole('OccupancyAgent', consoleMsg, 'highlight');
  }, 1000);
};

// ============================================================
// Alerts — Dismiss & Counters
// ============================================================
window.dismissAlert = function(alertId) {
  const alertItem = document.getElementById(alertId);
  if (!alertItem) return;
  alertItem.style.opacity   = '0';
  alertItem.style.transform = 'translateY(-10px)';
  alertItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setTimeout(() => {
    const desc = alertItem.querySelector('.alert-desc');
    const truncated = desc ? (desc.textContent.length > 30 ? desc.textContent.substring(0, 30) + '...' : desc.textContent) : '';
    alertItem.remove();
    activeAlertsCount--;
    updateAlertsCountUI();
    logToConsole('System', `Alert dismissed: "${truncated}"`, 'neutral');
  }, 300);
};

function updateAlertsCountUI() {
  const kpiAlerts  = document.getElementById('kpi-alerts');
  const alertBadge = document.getElementById('notifications-badge');
  const textAlerts = document.getElementById('alerts-count-text');

  if (kpiAlerts) {
    kpiAlerts.textContent = `${activeAlertsCount > 0 ? activeAlertsCount : 0} Active`;
    if (activeAlertsCount === 0) {
      kpiAlerts.style.color = 'var(--color-success)';
      const trend = kpiAlerts.closest('.kpi-card') && kpiAlerts.closest('.kpi-card').querySelector('.kpi-trend');
      if (trend) trend.innerHTML = `<span class="text-success">✓ Clean Health</span>`;
    }
  }
  if (alertBadge) {
    if (activeAlertsCount > 0) alertBadge.textContent = activeAlertsCount;
    else alertBadge.remove();
  }
  if (textAlerts) textAlerts.textContent = `${activeAlertsCount} Active`;
}

// ============================================================
// Animate KPI value change
// ============================================================
function animateValueUpdate(elementId, newValue) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.style.opacity   = '0.3';
  el.style.transform = 'scale(0.98)';
  el.style.transition = 'opacity 0.2s, transform 0.2s';
  setTimeout(() => {
    el.textContent     = newValue;
    el.style.opacity   = '1';
    el.style.transform = 'scale(1)';
  }, 200);
}

// ============================================================
// Console Logging — shared & per-agent
// ============================================================
function getAgentColor(agent) {
  if (agent === 'EnergyAgent') return 'var(--color-accent)';
  if (agent === 'MaintenanceAgent') return 'var(--color-warning)';
  if (agent === 'OccupancyAgent') return 'var(--color-success)';
  return null;
}

window.logToConsole = function(agent, text, type = 'normal') {
  // Always log to the central console
  writeLog('console-log', agent, text, type, getAgentColor(agent));

  // Log to specific agent console if applicable
  if (agent === 'EnergyAgent') {
    writeLog('energy-console-log', agent, text, type, 'var(--color-accent)');
  } else if (agent === 'MaintenanceAgent') {
    writeLog('maint-console-log', agent, text, type, 'var(--color-warning)');
  } else if (agent === 'OccupancyAgent') {
    writeLog('occ-console-log', agent, text, type, 'var(--color-success)');
  }
};

function logToEnergyConsole(agent, text, type = 'normal') {
  writeLog('energy-console-log', agent, text, type, 'var(--color-accent)');
}
function logToMaintConsole(agent, text, type = 'normal') {
  writeLog('maint-console-log', agent, text, type, 'var(--color-warning)');
}
function logToOccConsole(agent, text, type = 'normal') {
  writeLog('occ-console-log', agent, text, type, 'var(--color-success)');
}


function writeLog(containerId, agent, text, type, agentColor) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const line  = document.createElement('div');
  line.className = 'console-line';
  const now   = new Date();
  const ts    = `[${now.toTimeString().split(' ')[0]}]`;
  let cls = '';
  if (type === 'highlight') cls = 'highlight';
  if (type === 'action')    cls = 'action';
  if (type === 'neutral')   cls = '';

  const colorStyle = agentColor ? `style="color:${agentColor}"` : '';
  line.innerHTML = `
    <span class="console-time">${ts}</span>
    <span class="console-agent" ${colorStyle}>${agent}:</span>
    <span class="console-text ${cls}">${text}</span>
  `;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

// ============================================================
// Simulated Console Log Streams
// ============================================================
const energyLogs = [
  { agent: 'EnergyAgent', text: 'Initiating zone occupancy correlation analysis...', type: 'normal' },
  { agent: 'EnergyAgent', text: 'Zone B corridor occupancy dropping. Standby setpoints engaged.', type: 'highlight' },
  { agent: 'EnergyAgent', text: 'Peak load predictive model updated. Ambient forecast: 82°F.', type: 'normal' },
  { agent: 'EnergyAgent', text: 'Peak demand window: 2:00 PM–5:00 PM. Designing load-shift curve...', type: 'action' },
  { agent: 'EnergyAgent', text: 'Dynamic pricing threshold adjusted. Peak shaving rate set to 40%.', type: 'normal' },
  { agent: 'EnergyAgent', text: 'West Wing airflow damper matrices calibrated. Flow rate optimized.', type: 'highlight' },
  { agent: 'EnergyAgent', text: 'Chiller condenser fluid flow adjusted. ΔT: 4.8°F.', type: 'normal' },
  { agent: 'EnergyAgent', text: 'CO₂ levels stable: 420–610 ppm. Ventilation rate 100%.', type: 'normal' },
  { agent: 'EnergyAgent', text: 'Zone A heat load rising. Pre-cooling extended by 20 mins.', type: 'action' },
  { agent: 'EnergyAgent', text: 'Savings audit: Cumulative carbon mitigation this week: 2.4 tons.', type: 'highlight' },
];

const maintLogs = [
  { agent: 'MaintenanceAgent', text: 'Asset health scan running on 86 tracked nodes...', type: 'normal' },
  { agent: 'MaintenanceAgent', text: 'AHU-14: Filter differential pressure exceeded threshold. Alert generated.', type: 'highlight' },
  { agent: 'MaintenanceAgent', text: 'Vibration spectrum analysis complete on Pump P-07. Anomaly confirmed.', type: 'action' },
  { agent: 'MaintenanceAgent', text: 'Chiller #3 RMS vibration: 4.8 mm/s (limit: 3.5 mm/s). Escalating.', type: 'highlight' },
  { agent: 'MaintenanceAgent', text: 'Work order #WO-2847 auto-generated and dispatched to Tech Team Alpha.', type: 'normal' },
  { agent: 'MaintenanceAgent', text: 'Cooling tower CT-02 fan belt wear score: 0.76/1.0. Schedule replacement.', type: 'normal' },
  { agent: 'MaintenanceAgent', text: 'Predictive model recalibrated with 180 days of sensor history.', type: 'action' },
  { agent: 'MaintenanceAgent', text: 'Spare parts inventory: 12 items pre-ordered based on failure predictions.', type: 'normal' },
  { agent: 'MaintenanceAgent', text: 'MTBF improved by 31% vs 6-month baseline. Report generated.', type: 'highlight' },
  { agent: 'MaintenanceAgent', text: 'Work order completion rate: 89% this month. Avg response: 1.8h.', type: 'normal' },
];

const occLogs = [
  { agent: 'OccupancyAgent', text: 'Polling 32 occupancy sensors across 5 building zones...', type: 'normal' },
  { agent: 'OccupancyAgent', text: 'Main Office: 156/200 occupied (78%). HVAC setpoint maintained.', type: 'normal' },
  { agent: 'OccupancyAgent', text: 'Conference rooms below 50% utilization threshold. Flagging for review.', type: 'highlight' },
  { agent: 'OccupancyAgent', text: 'Peak occupancy period: 10:30 AM (312 persons detected in facility).', type: 'action' },
  { agent: 'OccupancyAgent', text: 'Ventilation rate in Break Area reduced by 30% — below density threshold.', type: 'normal' },
  { agent: 'OccupancyAgent', text: 'Meeting room no-show rate this week: 18.4%. Booking efficiency low.', type: 'highlight' },
  { agent: 'OccupancyAgent', text: "Forecast accuracy: 91.3% for today's occupancy patterns.", type: 'normal' },
  { agent: 'OccupancyAgent', text: 'Space optimization opportunity detected: Level 3 desk density suboptimal.', type: 'action' },
  { agent: 'OccupancyAgent', text: 'East cluster thermal sensor drift detected. Recalibration scheduled.', type: 'normal' },
  { agent: 'OccupancyAgent', text: 'Weekly utilization report compiled: avg 68.4% building-wide.', type: 'highlight' },
];

let energyLogIdx = 0;
let maintLogIdx  = 0;
let occLogIdx    = 0;

function initConsoleLogs() {
  setInterval(() => {
    const r = Math.random();
    if (r < 0.33) {
      const e = energyLogs[energyLogIdx];
      writeLog('console-log', e.agent, e.text, e.type, 'var(--color-accent)');
      energyLogIdx = (energyLogIdx + 1) % energyLogs.length;
    } else if (r < 0.66) {
      const m = maintLogs[maintLogIdx];
      writeLog('console-log', m.agent, m.text, m.type, 'var(--color-warning)');
      maintLogIdx = (maintLogIdx + 1) % maintLogs.length;
    } else {
      const o = occLogs[occLogIdx];
      writeLog('console-log', o.agent, o.text, o.type, 'var(--color-success)');
      occLogIdx = (occLogIdx + 1) % occLogs.length;
    }
  }, 4500);
}

function initEnergyConsoleLogs() {
  setTimeout(() => {
    setInterval(() => {
      const e = energyLogs[energyLogIdx];
      logToEnergyConsole(e.agent, e.text, e.type);
      energyLogIdx = (energyLogIdx + 1) % energyLogs.length;
    }, 4000);
  }, 600);
}

function initMaintConsoleLogs() {
  const m = maintLogs[0];
  logToMaintConsole(m.agent, m.text, m.type);
  setTimeout(() => {
    setInterval(() => {
      const entry = maintLogs[maintLogIdx];
      logToMaintConsole(entry.agent, entry.text, entry.type);
      maintLogIdx = (maintLogIdx + 1) % maintLogs.length;
    }, 5000);
  }, 1000);
}

function initOccConsoleLogs() {
  const o = occLogs[0];
  logToOccConsole(o.agent, o.text, o.type);
  setTimeout(() => {
    setInterval(() => {
      const entry = occLogs[occLogIdx];
      logToOccConsole(entry.agent, entry.text, entry.type);
      occLogIdx = (occLogIdx + 1) % occLogs.length;
    }, 5500);
  }, 1400);
}

// ============================================================
// Theme Toggle — Dark / Light Mode
// ============================================================
function initThemeToggle() {
  const buttons = document.querySelectorAll('#theme-toggle');
  const saved   = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-theme');
    updateToggleIcons(true);
  }
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateToggleIcons(isDark);
      logToConsole('System', `Theme: [${isDark ? 'Dark' : 'Light'} Mode]`, 'neutral');
    });
  });
}

function updateToggleIcons(isDark) {
  document.querySelectorAll('.theme-icon-moon').forEach(m => m.style.display = isDark ? 'none' : 'block');
  document.querySelectorAll('.theme-icon-sun').forEach(s  => s.style.display = isDark ? 'block' : 'none');
}

// ============================================================
// Dynamic SVG Chart Builder (reusable)
// params: data points array {val, label}, container parent id,
//   path id, area id, nodes group id, xlabels group id,
//   tooltip id, min, max, color, nodeClass
// ============================================================
function buildSVGChart({ data, linePath, areaPath, nodesGroup, xlabelsGroup, tooltipId, parentId, min, max, color, nodeClass, yBottom, yTop }) {
  const svgW  = 800;
  const yH    = yBottom - yTop;     // drawable height (e.g. 165 - 30 = 135)
  const xLeft = 50;
  const xRight = 790;
  const xW   = xRight - xLeft;

  const pts = data.map((d, i) => {
    const x = xLeft + (i / (data.length - 1)) * xW;
    const y = yBottom - ((d.val - min) / (max - min)) * yH;
    return { x, y, val: d.val, label: d.label };
  });

  // Build polyline d string
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = lineD + ` L ${pts[pts.length - 1].x.toFixed(1)} ${yBottom} L ${pts[0].x.toFixed(1)} ${yBottom} Z`;

  const lineEl = document.getElementById(linePath);
  const areaEl = document.getElementById(areaPath);
  const nodesEl = document.getElementById(nodesGroup);
  const xlabelsEl = document.getElementById(xlabelsGroup);

  if (lineEl) lineEl.setAttribute('d', lineD);
  if (areaEl) areaEl.setAttribute('d', areaD);

  if (nodesEl) {
    nodesEl.innerHTML = '';
    pts.forEach(p => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', p.x.toFixed(1));
      c.setAttribute('cy', p.y.toFixed(1));
      c.setAttribute('r', '5');
      c.setAttribute('class', nodeClass);
      c.setAttribute('data-value', p.val);
      c.setAttribute('data-label', p.label);

      // Tooltip
      const tooltipEl = document.getElementById(tooltipId);
      const parentEl  = document.getElementById(parentId);
      if (tooltipEl && parentEl) {
        c.addEventListener('mouseover', () => {
          tooltipEl.innerHTML = `<strong>${p.label}</strong><br>${p.val}`;
          tooltipEl.style.opacity = '1';
          positionSVGTooltip(c, tooltipEl, parentEl);
        });
        c.addEventListener('mousemove', () => positionSVGTooltip(c, tooltipEl, parentEl));
        c.addEventListener('mouseout',  () => { tooltipEl.style.opacity = '0'; });
      }
      nodesEl.appendChild(c);
    });
  }

  if (xlabelsEl) {
    xlabelsEl.innerHTML = '';
    const step = Math.ceil(data.length / 8);
    pts.forEach((p, i) => {
      if (i % step === 0 || i === pts.length - 1) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', p.x.toFixed(1));
        t.setAttribute('y', (yBottom + 18).toString());
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'chart-axis-text');
        t.textContent = p.label;
        xlabelsEl.appendChild(t);
      }
    });
  }
}

function positionSVGTooltip(circleEl, tooltip, container) {
  const nr = circleEl.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  tooltip.style.left = `${nr.left - cr.left + nr.width / 2}px`;
  tooltip.style.top  = `${nr.top  - cr.top}px`;
}

// ============================================================
// Energy Agent — 30-day Chart
// ============================================================
function initEnergy30dChart() {
  const baseKwh = [55000, 52000, 57000, 48000, 61000, 44000, 42000, 53000, 58000, 50000,
                   46000, 54000, 49000, 51000, 56000, 43000, 47000, 60000, 55000, 52000,
                   45000, 48000, 53000, 41000, 57000, 50000, 46000, 54000, 49000, 43000];
  const labels = baseKwh.map((_, i) => `D${i + 1}`);
  const data   = baseKwh.map((v, i) => ({ val: v, label: labels[i] }));

  buildSVGChart({
    data,
    linePath:    'energy-30d-line',
    areaPath:    'energy-30d-area',
    nodesGroup:  'energy-30d-nodes',
    xlabelsGroup:'energy-30d-xlabels',
    tooltipId:   'energy-30d-tooltip',
    parentId:    'energy-30d-chart-parent',
    min: 38000, max: 65000,
    yBottom: 180, yTop: 30,
    color: 'var(--color-accent)',
    nodeClass: 'dyn-chart-node',
  });
}

// ============================================================
// Maintenance Agent — Performance Chart
// ============================================================
function initMaintChart() {
  // Work orders opened per week
  const opened    = [8, 12, 6, 14, 10, 7, 9, 13, 11, 8, 15, 7];
  const completed = [7, 11, 6, 12, 9,  7, 9, 11, 10, 8, 13, 7];
  const labels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];

  const svgW = 800, xLeft = 50, xRight = 790;
  const xW  = xRight - xLeft;
  const yB  = 185, yT = 30;
  const min = 0, max = 20;

  function makeD(arr) {
    return arr.map((v, i) => {
      const x = (xLeft + (i / (arr.length - 1)) * xW).toFixed(1);
      const y = (yB - ((v - min) / (max - min)) * (yB - yT)).toFixed(1);
      return { x, y, v };
    });
  }

  const pts1 = makeD(opened);
  const pts2 = makeD(completed);

  const lineD1 = pts1.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD1 = lineD1 + ` L ${pts1[pts1.length-1].x} ${yB} L ${pts1[0].x} ${yB} Z`;
  const lineD2 = pts2.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const line1 = document.getElementById('maint-line-1');
  const area1 = document.getElementById('maint-area-1');
  const line2 = document.getElementById('maint-line-2');
  const nodesG = document.getElementById('maint-nodes');
  const xlabG  = document.getElementById('maint-xlabels');
  const tooltip = document.getElementById('maint-tooltip');
  const parent  = document.getElementById('maint-chart-parent');

  if (line1) line1.setAttribute('d', lineD1);
  if (area1) area1.setAttribute('d', areaD1);
  if (line2) line2.setAttribute('d', lineD2);

  if (nodesG) {
    nodesG.innerHTML = '';
    pts1.forEach((p, i) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', '5');
      c.setAttribute('class', 'maint-chart-node');
      if (tooltip && parent) {
        c.addEventListener('mouseover', () => {
          tooltip.innerHTML = `<strong>${labels[i]}</strong><br>Opened: ${opened[i]} | Completed: ${completed[i]}`;
          tooltip.style.opacity = '1';
          positionSVGTooltip(c, tooltip, parent);
        });
        c.addEventListener('mousemove', () => positionSVGTooltip(c, tooltip, parent));
        c.addEventListener('mouseout', () => { tooltip.style.opacity = '0'; });
      }
      nodesG.appendChild(c);
    });
  }

  if (xlabG) {
    xlabG.innerHTML = '';
    pts1.forEach((p, i) => {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', p.x); t.setAttribute('y', (yB + 18).toString());
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('class', 'chart-axis-text');
      t.textContent = labels[i];
      xlabG.appendChild(t);
    });
  }
}

// ============================================================
// Occupancy Agent — Utilization Chart
// ============================================================
function initOccChart() {
  const utilPct = [58, 62, 55, 71, 68, 64, 52, 73, 69, 67, 60, 75, 71, 63, 58, 66, 72, 68, 63, 57, 70, 74, 68, 62, 69, 73, 67, 71, 65, 68];
  const labels  = utilPct.map((_, i) => `D${i + 1}`);
  const data    = utilPct.map((v, i) => ({ val: v, label: labels[i] }));

  buildSVGChart({
    data,
    linePath:    'occ-line',
    areaPath:    'occ-area',
    nodesGroup:  'occ-nodes',
    xlabelsGroup:'occ-xlabels',
    tooltipId:   'occ-tooltip',
    parentId:    'occ-chart-parent',
    min: 40, max: 90,
    yBottom: 180, yTop: 30,
    color: 'var(--color-success)',
    nodeClass: 'occ-chart-node',
  });
}
