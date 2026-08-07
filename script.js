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
  initAuth();
  initAiHelpAssistant();
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

// ============================================================
// Authentication System (Local Frontend Auth Flow)
// ============================================================
function getAuthUser() {
  try {
    const raw = localStorage.getItem('facilityops_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuthUser(user) {
  try {
    localStorage.setItem('facilityops_auth_user', JSON.stringify(user));
  } catch (e) {}
}

function removeAuthUser() {
  try {
    localStorage.removeItem('facilityops_auth_user');
  } catch (e) {}
}

let pendingAuthAction = null;

function openAuthModal(mode = 'login', noticeText = '') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  const notice = document.getElementById('auth-notice');
  if (notice) {
    if (noticeText) {
      notice.textContent = noticeText;
      notice.style.display = 'block';
    } else {
      notice.style.display = 'none';
    }
  }

  const loginView = document.getElementById('auth-login-view');
  const signupView = document.getElementById('auth-signup-view');

  if (mode === 'signup') {
    if (loginView) loginView.style.display = 'none';
    if (signupView) signupView.style.display = 'block';
  } else {
    if (signupView) signupView.style.display = 'none';
    if (loginView) loginView.style.display = 'block';
  }

  modal.style.display = 'flex';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
}

function updateAuthUI() {
  const user = getAuthUser();

  // Landing page auth nav container
  const navContainer = document.getElementById('auth-nav-container');
  if (navContainer) {
    if (user) {
      const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      navContainer.innerHTML = `
        <div class="user-account-badge" title="${user.email || ''}">
          <span class="user-avatar-sm">${initials}</span>
          <span class="user-name-text">${user.name || 'User'}</span>
          <button class="btn-logout-link" id="nav-logout-btn" title="Log Out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      `;
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          removeAuthUser();
          updateAuthUI();
        });
      }
    } else {
      navContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="nav-login-btn">Log In</button>
        <button class="btn btn-primary btn-sm" id="nav-signup-btn">Sign Up</button>
      `;
      const loginBtn = document.getElementById('nav-login-btn');
      const signupBtn = document.getElementById('nav-signup-btn');
      if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
      if (signupBtn) signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }
  }

  // Dashboard topbar auth container
  const dashName = document.getElementById('user-name-display');
  const dashAvatar = document.getElementById('user-avatar-display');
  const dashLogoutBtn = document.getElementById('dashboard-logout-btn');
  const dashAuthBtns = document.getElementById('dashboard-auth-btns');
  const dashUserWidget = document.getElementById('user-profile-widget');

  if (dashName && dashAvatar) {
    if (user) {
      dashName.textContent = user.name || 'User';
      const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      dashAvatar.textContent = initials;
      if (dashUserWidget) dashUserWidget.style.display = 'flex';
      if (dashAuthBtns) dashAuthBtns.style.display = 'none';
    } else {
      if (dashAuthBtns) {
        dashAuthBtns.style.display = 'flex';
        if (dashUserWidget) dashUserWidget.style.display = 'none';
      }
    }
  }

  if (dashLogoutBtn) {
    dashLogoutBtn.onclick = (e) => {
      e.preventDefault();
      removeAuthUser();
      updateAuthUI();
    };
  }
}

function initAuth() {
  updateAuthUI();

  // Close modal listeners
  const closeBtn = document.getElementById('auth-modal-close');
  const modal = document.getElementById('auth-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }

  // Switch between Login and Sign Up
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');
  if (switchToSignup) switchToSignup.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('signup'); });
  if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });

  // Dashboard topbar login/signup buttons
  const dashLoginBtn = document.getElementById('dash-login-btn');
  const dashSignupBtn = document.getElementById('dash-signup-btn');
  if (dashLoginBtn) dashLoginBtn.addEventListener('click', () => openAuthModal('login'));
  if (dashSignupBtn) dashSignupBtn.addEventListener('click', () => openAuthModal('signup'));

  // Form Submissions
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const name = email.split('@')[0];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      setAuthUser({ name: formattedName, email });
      closeAuthModal();
      updateAuthUI();
      if (pendingAuthAction) {
        const action = pendingAuthAction;
        pendingAuthAction = null;
        action();
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;
      const confirmPass = document.getElementById('signup-confirm-password').value;

      if (pass !== confirmPass) {
        alert('Passwords do not match. Please try again.');
        return;
      }

      setAuthUser({ name, email });
      closeAuthModal();
      updateAuthUI();
      if (pendingAuthAction) {
        const action = pendingAuthAction;
        pendingAuthAction = null;
        action();
      }
    });
  }

  // Protect "Get Started" / "Launch Console" & Onboarding Configuration Steps
  const protectedLinks = document.querySelectorAll('#hero-get-started, #launch-console-btn, .onboarding-card');
  protectedLinks.forEach(el => {
    el.addEventListener('click', (e) => {
      const user = getAuthUser();
      if (!user) {
        e.preventDefault();
        pendingAuthAction = () => {
          window.location.href = 'dashboard.html';
        };
        openAuthModal('login', 'Please log in or sign up to access and configure your workspace.');
      }
    });
  });
}

// ============================================================
// AI Help Assistant Component
// ============================================================
function initAiHelpAssistant() {
  if (document.getElementById('ai-help-trigger')) return; // Avoid duplicate initialization

  // 1. Create HTML Elements dynamically
  const container = document.createElement('div');
  container.id = 'ai-help-assistant-container';
  container.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="ai-help-trigger" class="ai-help-trigger-btn" aria-label="Open AI Help Assistant" title="AI Help Assistant">
      <span class="ai-help-trigger-badge"></span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
      </svg>
    </button>

    <!-- Chatbot Panel -->
    <div id="ai-help-panel" class="ai-help-panel" aria-hidden="true">
      <!-- Header -->
      <div class="ai-help-header">
        <div class="ai-help-header-info">
          <div class="ai-help-avatar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
              <path d="M12 12L2.5 7.5"></path>
              <path d="M12 12v10"></path>
            </svg>
          </div>
          <div>
            <h4 class="ai-help-header-title">AI Help Assistant</h4>
            <p class="ai-help-header-subtitle">
              <span class="ai-help-status-dot"></span>
              FacilityOps Autonomous AI
            </p>
          </div>
        </div>
        <div class="ai-help-header-actions">
          <button id="ai-help-reset-btn" class="ai-help-header-btn" title="Reset Chat" aria-label="Reset Chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          <button id="ai-help-close-btn" class="ai-help-header-btn" title="Close Assistant" aria-label="Close Assistant">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Body -->
      <div id="ai-help-messages" class="ai-help-messages">
        <!-- Default Welcome Card -->
        <div id="ai-help-welcome-card" class="ai-help-welcome-card">
          <div class="ai-help-welcome-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Welcome to FacilityOps AI!
          </div>
          <p class="ai-help-welcome-desc">
            I am your intelligent operational assistant. Ask me anything about energy monitoring, predictive maintenance, occupancy agents, or workspace configuration.
          </p>
          <div class="ai-help-suggestions">
            <button class="ai-help-chip" data-query="How do I setup my workspace?">🚀 Setup Guide</button>
            <button class="ai-help-chip" data-query="What does Energy Agent do?">⚡ Energy Agent</button>
            <button class="ai-help-chip" data-query="How do work orders get created?">🛠️ Work Orders</button>
            <button class="ai-help-chip" data-query="Explain Occupancy Agent features">👥 Occupancy Agent</button>
            <button class="ai-help-chip" data-query="What security features are monitored?">🔒 Security Agent</button>
          </div>
        </div>
      </div>

      <!-- Footer / Input area -->
      <div class="ai-help-footer">
        <form id="ai-help-form" class="ai-help-form">
          <div class="ai-help-input-wrapper">
            <input type="text" id="ai-help-input" class="ai-help-input" placeholder="Ask about FacilityOps AI..." autocomplete="off">
          </div>
          <button type="submit" id="ai-help-send-btn" class="ai-help-send-btn" title="Send message" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="ai-help-disclaimer">FacilityOps AI Engine v1.2 • Autonomous Assistant</div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // 2. DOM Elements
  const triggerBtn   = document.getElementById('ai-help-trigger');
  const panel        = document.getElementById('ai-help-panel');
  const closeBtn     = document.getElementById('ai-help-close-btn');
  const resetBtn     = document.getElementById('ai-help-reset-btn');
  const messagesEl   = document.getElementById('ai-help-messages');
  const form         = document.getElementById('ai-help-form');
  const input        = document.getElementById('ai-help-input');
  const sendBtn      = document.getElementById('ai-help-send-btn');
  const welcomeCard  = document.getElementById('ai-help-welcome-card');

  // Toggle Panel
  function togglePanel(open) {
    const shouldOpen = open !== undefined ? open : !panel.classList.contains('active');
    if (shouldOpen) {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      setTimeout(() => input.focus(), 150);
    } else {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    }
  }

  triggerBtn.addEventListener('click', () => togglePanel());
  closeBtn.addEventListener('click', () => togglePanel(false));

  // Reset Chat
  resetBtn.addEventListener('click', () => {
    messagesEl.innerHTML = '';
    messagesEl.appendChild(welcomeCard);
    bindChipEvents();
    input.value = '';
    sendBtn.disabled = true;
  });

  // Enable / Disable Send Button based on input
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  // Bind Chip Clicks
  function bindChipEvents() {
    const chips = messagesEl.querySelectorAll('.ai-help-chip');
    chips.forEach(chip => {
      chip.onclick = (e) => {
        e.preventDefault();
        const text = chip.getAttribute('data-query') || chip.textContent.trim();
        handleUserSend(text);
      };
    });
  }
  bindChipEvents();

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      handleUserSend(text);
    }
  });

  // Handle User Message Sending
  function handleUserSend(userText) {
    // 1. Render User Message
    appendMessage(userText, 'user');
    input.value = '';
    sendBtn.disabled = true;
    scrollToBottom();

    // 2. Show Typing Indicator
    showTypingIndicator();
    scrollToBottom();

    // 3. Generate AI Response with slight delay
    const delay = Math.floor(Math.random() * 300) + 500;
    setTimeout(() => {
      hideTypingIndicator();
      const responseHtml = generateAiAnswer(userText);
      appendMessage(responseHtml, 'ai');
      scrollToBottom();
    }, delay);
  }

  // Render Message Bubble
  function appendMessage(content, sender) {
    const row = document.createElement('div');
    row.className = `ai-msg-row ${sender}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'user') {
      row.innerHTML = `
        <div class="ai-msg-avatar">You</div>
        <div class="ai-msg-content">
          <div class="ai-msg-bubble">${escapeHtml(content)}</div>
          <div class="ai-msg-time">${timeStr}</div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="ai-msg-avatar bot">AI</div>
        <div class="ai-msg-content">
          <div class="ai-msg-bubble">${content}</div>
          <div class="ai-msg-time">${timeStr}</div>
        </div>
      `;
    }
    messagesEl.appendChild(row);
  }

  // Typing Indicator
  let typingEl = null;
  function showTypingIndicator() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'ai-msg-row ai';
    typingEl.id = 'ai-typing-row';
    typingEl.innerHTML = `
      <div class="ai-msg-avatar bot">AI</div>
      <div class="ai-msg-content">
        <div class="ai-typing-indicator">
          <span class="ai-typing-dot"></span>
          <span class="ai-typing-dot"></span>
          <span class="ai-typing-dot"></span>
        </div>
      </div>
    `;
    messagesEl.appendChild(typingEl);
  }

  function hideTypingIndicator() {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
    typingEl = null;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Knowledge Base AI Response Engine
  function generateAiAnswer(query) {
    const q = query.toLowerCase();

    // 1. Workspace Setup & Onboarding
    if (q.includes('setup') || q.includes('start') || q.includes('config') || q.includes('onboard') || q.includes('step')) {
      return `
        <strong>FacilityOps AI Workspace Setup:</strong><br>
        Setting up your autonomous facility brain requires three quick steps:
        <ol style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Add Organization:</strong> Provide building dimensions, baseline parameters, and admin permissions.</li>
          <li><strong>Connect Data:</strong> Integrate your Smart Meters, HVAC channels, and BMS endpoints.</li>
          <li><strong>Activate AI Agents:</strong> Enable Energy, Maintenance, or Occupancy operators to begin autonomous optimization.</li>
        </ol>
        <span class="text-muted text-xs">Ready to start? Click <strong>Launch Console</strong> at top right!</span>
      `;
    }

    // 2. Energy Agent
    if (q.includes('energy') || q.includes('kwh') || q.includes('hvac') || q.includes('carbon') || q.includes('power') || q.includes('utility')) {
      return `
        <strong>⚡ Autonomous Energy Agent Capabilities:</strong>
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Real-time Monitoring:</strong> Tracks active consumption (currently averaging ~42.8k kWh/mo).</li>
          <li><strong>Dynamic Setpoints:</strong> Automatically adjusts HVAC schedules based on grid tariffs and outdoor temperatures.</li>
          <li><strong>Peak Load Shedding:</strong> Prevents utility surge penalties by throttling non-critical loads.</li>
          <li><strong>Carbon Footprint Tracking:</strong> Calculates estimated CO₂ reduction (averaging 18.2 tons/mo).</li>
        </ul>
        You can view full telemetry in the <strong>Energy Agent</strong> tab in the console.
      `;
    }

    // 3. Maintenance Agent & Work Orders
    if (q.includes('maint') || q.includes('work order') || q.includes('repair') || q.includes('alert') || q.includes('fault') || q.includes('fdd') || q.includes('ticket')) {
      return `
        <strong>🛠️ Predictive Maintenance & Work Orders:</strong><br>
        Our AI continuously inspects equipment telemetry to detect faults before breakdowns occur:
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Automated FDD:</strong> Detects anomalies like chiller vibration or filter degradation.</li>
          <li><strong>Work Order Dispatch:</strong> Automatically creates priority tickets with recommended spare parts & procedures.</li>
          <li><strong>MTBF Optimization:</strong> Prolongs asset lifespans by optimizing maintenance intervals.</li>
        </ul>
        Check the <strong>Work Orders</strong> and <strong>Maintenance Agent</strong> tabs in your dashboard for active alerts.
      `;
    }

    // 4. Occupancy Agent
    if (q.includes('occupan') || q.includes('people') || q.includes('density') || q.includes('zone') || q.includes('count')) {
      return `
        <strong>👥 Occupancy Agent Features:</strong>
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Headcount Analytics:</strong> Monitors active occupancy across floors and zones.</li>
          <li><strong>Demand Ventilation:</strong> Adjusts fresh air intake based on real-time room density to reduce waste.</li>
          <li><strong>Space Utilization:</strong> Generates heatmaps to optimize office desk & room allocation.</li>
        </ul>
        Navigate to <strong>Occupancy Agent</strong> from the sidebar to inspect floor heatmaps.
      `;
    }

    // 5. Security Agent
    if (q.includes('secur') || q.includes('camera') || q.includes('door') || q.includes('access') || q.includes('tailgat')) {
      return `
        <strong>🔒 Security Agent Overview:</strong><br>
        FacilityOps AI connects to IP camera feeds and perimeter access points:
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Tailgating Detection:</strong> Flags unauthorized multi-person entry at turnstiles.</li>
          <li><strong>Access Log Audit:</strong> Verifies badge scans against scheduled shift rotas.</li>
          <li><strong>Anomaly Escalation:</strong> Instantly alerts security staff on breaches.</li>
        </ul>
      `;
    }

    // 6. Navigation / Console
    if (q.includes('navigat') || q.includes('dashboard') || q.includes('console') || q.includes('view') || q.includes('tab') || q.includes('where')) {
      return `
        <strong>🗺️ Console Navigation Help:</strong><br>
        Use the left sidebar menu in the dashboard to access:
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>Overview / Dashboard:</strong> High-level system health metrics and summary charts.</li>
          <li><strong>Autonomous Agents:</strong> Deep dives into Energy, Maintenance, Occupancy & Security.</li>
          <li><strong>Work Orders & Assets:</strong> Manage tickets and track building asset inventory.</li>
          <li><strong>Monitoring & Analytics:</strong> Historical reports and live device telemetry.</li>
        </ul>
      `;
    }

    // 7. Theme / Dark Mode
    if (q.includes('dark') || q.includes('theme') || q.includes('color') || q.includes('light') || q.includes('mode')) {
      return `
        <strong>🌙 Theme Control:</strong><br>
        You can switch between Light and Dark mode at any time by clicking the <strong>Sun / Moon icon button</strong> located in the top navigation header bar!
      `;
    }

    // 8. Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings')) {
      return `
        Hello there! 👋 How can I assist you with your facility operations today? You can ask me about <strong>Energy Optimization</strong>, <strong>Predictive Maintenance</strong>, <strong>Occupancy Tracking</strong>, or <strong>Workspace Configuration</strong>.
      `;
    }

    // 9. Default Fallback Response
    return `
      I'm here to help with all aspects of FacilityOps AI! While I'm continuing to learn, here are a few topics I can help you with right now:
      <ul style="margin: 6px 0 6px 18px; padding: 0;">
        <li>⚡ <strong>Energy Agent</strong>: HVAC tuning & CO₂ reduction</li>
        <li>🛠️ <strong>Maintenance Agent</strong>: Predictive alerts & tickets</li>
        <li>👥 <strong>Occupancy Agent</strong>: Zone density & ventilation</li>
        <li>🚀 <strong>Onboarding</strong>: 3-step organization setup</li>
      </ul>
      <div style="margin-top: 8px;">Try typing <em>"Energy Agent"</em> or <em>"How to setup workspace"</em>!</div>
    `;
  }
}

