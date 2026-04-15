
const FILES = {
  macro: 'output/macro_mhi_summary.csv',
  latestQuarter: 'output/latest_quarter_temporal.csv',
  compare: 'output/compare_2019_2022_2025.csv',
  baseMHI: 'output/baseline_compare_mhi.csv',
  baseG: 'output/baseline_compare_g.csv',
  baseTexas: 'output/baseline_compare_texas_proxy.csv',
  failed: 'output/failed_bank_leadtime_summary.csv',
  validation: 'output/validation_summary.csv'
};

async function fetchText(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.text();
}
function parseCSV(text){
  const rows=[]; let i=0, field='', row=[], inQuotes=false;
  while(i<text.length){
    const c=text[i];
    if(inQuotes){
      if(c === '"'){ if(text[i+1] === '"'){ field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if(c === '"') inQuotes = true;
      else if(c === ','){ row.push(field); field=''; }
      else if(c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; }
      else if(c !== '\r'){ field += c; }
    }
    i++;
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }
  const header = rows.shift() || [];
  return rows.filter(r => r.length && !(r.length===1 && r[0]==='')).map(r => {
    const obj={}; header.forEach((h, idx)=> obj[h] = r[idx] ?? ''); return obj;
  });
}
function toNum(v){ if(v===''||v===null||v===undefined) return NaN; const n=Number(String(v).replace(/,/g,'')); return Number.isFinite(n)?n:NaN; }
function fmtNum(v,d=2){ return (v===null||v===undefined||Number.isNaN(v)) ? '—' : Number(v).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d}); }
function fmtInt(v){ return (v===null||v===undefined||Number.isNaN(v)) ? '—' : Math.round(Number(v)).toLocaleString(); }
function latestPeriod(rows){ return rows.reduce((a,b)=> String(a.Period) > String(b.Period) ? a : b).Period; }
function setLoadStatus(msg){ document.getElementById('loadStatus').innerHTML = msg; }
function makeStats(items){ return items.map(x => `<div class="stat"><div class="label">${x.label}</div><div class="value">${x.value}</div></div>`).join(''); }
function renderTable(elId, rows, cols, compact=false){
  const head = `<tr>${cols.map(c=>`<th class="${c.className||''}">${c.label}</th>`).join('')}</tr>`;
  const body = rows.map(r => `<tr>${cols.map(c => `<td class="${c.className||''}" title="${(r[c.key] ?? '')}">${c.format ? c.format(r[c.key], r) : (r[c.key] ?? '—')}</td>`).join('')}</tr>`).join('');
  document.getElementById(elId).innerHTML = `<div class="table-wrap"><table class="${compact ? 'compact' : ''}"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}
function countBy(rows, key){
  const m = new Map(); rows.forEach(r => m.set(r[key], (m.get(r[key])||0)+1));
  return [...m.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>({key:k,count:v}));
}
function drawLineChart(svgId, series, labels, opts={}){
  const svg=document.getElementById(svgId), width=svg.viewBox.baseVal.width||800, height=svg.viewBox.baseVal.height||280;
  const pad={l:50,r:20,t:18,b:36}; let vals=[]; series.forEach(s=> vals=vals.concat(s.values.filter(v=>Number.isFinite(v))));
  const min=opts.min ?? Math.min(...vals), max=opts.max ?? Math.max(...vals), xr=width-pad.l-pad.r, yr=height-pad.t-pad.b;
  const x=i=> pad.l + (i/(labels.length-1||1))*xr, y=v=> pad.t + (1-((v-min)/(max-min||1)))*yr;
  let html='';
  for(let j=0;j<5;j++){ const yy=pad.t+yr*j/4; html += `<line x1="${pad.l}" y1="${yy}" x2="${width-pad.r}" y2="${yy}" stroke="#313746" stroke-width="1"/>`; const val=max-(max-min)*j/4; html += `<text x="8" y="${yy+4}" fill="#a9b0be" font-size="11">${fmtNum(val,2)}</text>`; }
  const step=Math.max(1,Math.floor(labels.length/8)); for(let i=0;i<labels.length;i+=step){ html += `<text x="${x(i)}" y="${height-12}" fill="#a9b0be" font-size="11" text-anchor="middle">${labels[i]}</text>`; }
  const colors=['#7aa2f7','#76c893','#ffd166'];
  series.forEach((s, idx) => {
    const pts=s.values.map((v,i)=> Number.isFinite(v) ? `${x(i)},${y(v)}` : null).filter(Boolean).join(' ');
    html += `<polyline fill="none" stroke="${colors[idx % colors.length]}" stroke-width="2.6" points="${pts}"/>`;
    html += `<text x="${width-155}" y="${24+idx*16}" fill="${colors[idx % colors.length]}" font-size="12">${s.name}</text>`;
  });
  svg.innerHTML = html;
}
function buildInterp(containerId, sections){
  document.getElementById(containerId).innerHTML = sections.map(s => `<p class="prose-line"><strong>${s.title}:</strong> ${s.text}</p>`).join('');
}
function median(arr){ if(!arr.length) return NaN; const s=[...arr].sort((a,b)=>a-b), m=Math.floor(s.length/2); return s.length%2 ? s[m] : (s[m-1]+s[m])/2; }
function spread(arr){ return arr.length ? Math.max(...arr)-Math.min(...arr) : NaN; }

async function main(){
  try{
    setLoadStatus('Loading CSV outputs…');
    const [macroTxt, latestTxt, compareTxt, mhiTxt, gTxt, texasTxt, failedTxt, validationTxt] = await Promise.all([
      fetchText(FILES.macro), fetchText(FILES.latestQuarter), fetchText(FILES.compare),
      fetchText(FILES.baseMHI), fetchText(FILES.baseG), fetchText(FILES.baseTexas), fetchText(FILES.failed),
      fetchText(FILES.validation)
    ]);

    const macro = parseCSV(macroTxt).map(r => ({...r,banks:toNum(r.banks),mean_G:toNum(r.mean_G),median_G:toNum(r.median_G),median_MHI:toNum(r.median_MHI),p95_MHI:toNum(r.p95_MHI),critical:toNum(r.critical),watch:toNum(r.watch),diverging:toNum(r.diverging),stable:toNum(r.stable)}));
    const latestRows = parseCSV(latestTxt).map(r => ({...r,ASSET:toNum(r.ASSET),MHI:toNum(r.MHI),delta_MHI:toNum(r.delta_MHI),watch_run:toNum(r.watch_run)}));
    const compare = parseCSV(compareTxt).map(r => ({...r,mean_G:toNum(r.mean_G),median_MHI_finite:toNum(r.median_MHI_finite)}));
    const baseMHI = parseCSV(mhiTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const baseG = parseCSV(gTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const baseTexas = parseCSV(texasTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const failed = parseCSV(failedTxt).map(r => ({...r,watch_lead_q:toNum(r.watch_lead_q),critical_lead_q:toNum(r.critical_lead_q)}));
    const val = parseCSV(validationTxt).map(r => {const o={}; for(const k in r) o[k]=toNum(r[k]); return o;})[0];

    const latest = latestPeriod(macro);
    const current = macro.find(r => r.Period === latest);

    document.getElementById('headerMeta').innerHTML = `<span class="badge">Loaded ${fmtInt(latestRows.length)} latest-quarter rows</span>`;
    setLoadStatus(`<span class="ok">Loaded all required files</span> — ${latest} · ${fmtInt(current.banks)} banks scored`);
    document.getElementById('currentQuarterMeta').textContent = `Latest quarter: ${latest}`;

    document.getElementById('summaryStats').innerHTML = makeStats([
      {label:'Banks scored', value:fmtInt(current.banks)},
      {label:'Critical', value:fmtInt(current.critical)},
      {label:'Watch', value:fmtInt(current.watch)},
      {label:'Diverging', value:fmtInt(current.diverging)},
      {label:'Stable', value:fmtInt(current.stable)},
      {label:'Mean G', value:fmtNum(current.mean_G,3)},
      {label:'Median G', value:fmtNum(current.median_G,3)},
      {label:'Median finite MHI', value:fmtNum(current.median_MHI,3)},
      {label:'P95 finite MHI', value:fmtNum(current.p95_MHI,3)}
    ]);

    buildInterp('summaryInterp', [
      {title:'Observation', text:`${latest} has ${fmtInt(current.critical)} Critical (G < 0.1), ${fmtInt(current.watch)} Watch (low G with surface outrunning structure), and ${fmtInt(current.diverging)} Diverging banks. Mean G (structural viability) is ${fmtNum(current.mean_G,3)}. Median finite MHI (divergence ratio) is ${fmtNum(current.median_MHI,3)}.`},
      {title:'Two channels', text:'G measures structural viability — low G predicts external failure. MHI measures divergence between surface performance and structural condition — high MHI flags performed continuation, not failure risk directly.'},
      {title:'Constraint', text:'Tier classifications are structural diagnostics. They qualify traditional risk measures, not replace them.'}
    ]);

    drawLineChart('gTrend', [{name:'Mean G', values:macro.map(r=>r.mean_G)}, {name:'Median G', values:macro.map(r=>r.median_G)}], macro.map(r=>r.Period));
    drawLineChart('mhiTrend', [{name:'Median finite MHI', values:macro.map(r=>r.median_MHI)}, {name:'P95 finite MHI', values:macro.map(r=>r.p95_MHI)}], macro.map(r=>r.Period));
    drawLineChart('tierTrend', [{name:'Critical', values:macro.map(r=>r.critical)}, {name:'Watch', values:macro.map(r=>r.watch)}, {name:'Diverging', values:macro.map(r=>r.diverging)}], macro.map(r=>r.Period));

    const c2022 = compare.find(r=>r.Period==='2022Q4');
    const c2019 = compare.find(r=>r.Period==='2019Q4');
    buildInterp('trendInterp', [
      {title:'Observation', text:`Relative to the 2022Q4 structural high-water mark, ${latest} is softer: mean G (structural viability) fell from ${fmtNum(c2022?.mean_G,3)} to ${fmtNum(current.mean_G,3)}. Median finite MHI (divergence) rose from ${fmtNum(c2022?.median_MHI_finite,3)} to ${fmtNum(current.median_MHI,3)}, indicating widening surface-over-structure gaps.`},
      {title:'Reading G vs MHI', text:'Falling G means the structural floor is declining across the system. Rising MHI means surface performance is holding up relative to that declining structure — the gap is growing. These move independently because the two channels share no variables.'},
      {title:'Constraint', text:`Compared with 2019Q4 (${fmtNum(c2019?.mean_G,3)} mean G), current conditions sit between 2019 and 2022. The charts show direction and magnitude, not cause.`}
    ]);

    const criticalRows = latestRows.filter(r=>r.Tier==='Critical').sort((a,b)=>(b.MHI-a.MHI)).slice(0,10);
    const watchRows = latestRows.filter(r=>r.Tier==='Watch').sort((a,b)=>(b.MHI-a.MHI)).slice(0,10);
    const rankCols = [
      {key:'CERT',label:'CERT',className:'col-nowrap'},
      {key:'NAME',label:'NAME',className:'col-name'},
      {key:'ASSET',label:'ASSET',format:v=>fmtInt(v),className:'col-nowrap'},
      {key:'MHI',label:'MHI',format:v=>Number.isFinite(v)?fmtNum(v,2):'inf',className:'col-nowrap'},
      {key:'G_binding',label:'Binding',className:'col-binding'},
      {key:'trajectory_class',label:'Trajectory',className:'col-nowrap'}
    ];
    renderTable('criticalTable', criticalRows, rankCols, true);
    renderTable('watchTable', watchRows, rankCols, true);

    buildInterp('rankInterp', [
      {title:'Observation', text:'Critical banks are sorted by MHI (widest divergence first). Watch banks are sorted likewise. High MHI means surface performance most exceeds structural condition — it identifies the largest gap, not the highest failure probability.'},
      {title:'Constraint', text:'G level determines structural severity. MHI ordering within a tier separates banks by how much their surface conceals their structural position. Both matter; they measure different things.'},
      {title:'Relevance', text:'The ranking separates structurally compromised banks (low G) from structurally compromised banks whose surface metrics mask the compromise (low G, high MHI).'}
    ]);

    const currentWatch = latestRows.filter(r=>r.Tier==='Watch');
    currentWatch.forEach(r => { const a=toNum(r.ASSET); r.asset_bin = a < 5e5 ? '<500M' : (a <= 1e7 ? '500M-10B' : '>10B'); });
    renderTable('watchTrajectory', countBy(currentWatch,'trajectory_class').map(r=>({Metric:r.key,Count:r.count})), [{key:'Metric',label:'trajectory'},{key:'Count',label:'count',format:v=>fmtInt(v)}], true);
    renderTable('watchBinding', countBy(currentWatch,'G_binding').map(r=>({Metric:r.key,Count:r.count})), [{key:'Metric',label:'binding'},{key:'Count',label:'count',format:v=>fmtInt(v)}], true);
    renderTable('watchAssetBin', countBy(currentWatch,'asset_bin').map(r=>({Metric:r.key,Count:r.count})), [{key:'Metric',label:'asset bin'},{key:'Count',label:'count',format:v=>fmtInt(v)}], true);
    const worsening = [...currentWatch].filter(r=>Number.isFinite(r.delta_MHI)).sort((a,b)=>(b.delta_MHI-a.delta_MHI)||(b.watch_run-a.watch_run)).slice(0,10);
    renderTable('watchWorsening', worsening, [
      {key:'CERT',label:'CERT',className:'col-nowrap'},
      {key:'NAME',label:'NAME',className:'col-name'},
      {key:'ASSET',label:'ASSET',format:v=>fmtInt(v),className:'col-nowrap'},
      {key:'delta_MHI',label:'ΔMHI',format:v=>fmtNum(v,2),className:'col-nowrap'},
      {key:'watch_run',label:'Run',format:v=>fmtInt(v),className:'col-nowrap'},
      {key:'G_binding',label:'Binding',className:'col-binding'}
    ], true);

    const trajCounts = countBy(currentWatch,'trajectory_class');
    const pw=(trajCounts.find(r=>r.key==='Persistent_Watch')||{}).count||0;
    const nw=(trajCounts.find(r=>r.key==='New_Watch')||{}).count||0;
    const bindCounts = countBy(currentWatch,'G_binding');
    buildInterp('cohortInterp', [
      {title:'Observation', text:`The ${latest} Watch cohort includes ${fmtInt(pw)} persistent Watch banks and ${fmtInt(nw)} new Watch entries. The dominant binding constraint is ${bindCounts[0]?.key || 'the leading component'} — the structural dimension setting each bank's G floor.`},
      {title:'Constraint', text:'Watch status means surface exceeds structure (MHI > 1.2) while G is between 0.1 and 0.5. It does not mean imminent failure — many Watch banks persist for years. The binding component identifies which structural weakness is most severe.'},
      {title:'Relevance', text:'Trajectory class (persistent vs. new vs. escalating) and binding component together describe the character of each bank\'s structural position, not just a single risk score.'}
    ]);

    // Baseline characterization — computed from loaded data, not hardcoded
    const mhiSpread = val.mhi_spread;
    const gSpread = val.g_spread;
    const txSpread = val.texas_spread;
    const mhiMono = val.mhi_monotonic;
    const gMono = val.g_monotonic;
    const txMono = val.texas_monotonic;
    // MHI and G-only have comparable endpoint spreads; MHI's primary advantage is same-band discrimination (Test A).
    // Texas proxy is materially weaker. Determine which model has the widest monotonic spread.
    let baselineLabel, baselineSub;
    if (mhiMono && gMono) {
      if (Math.abs(mhiSpread - gSpread) < 1.0) {
        baselineLabel = 'MHI and G-only comparable';
        baselineSub = 'MHI adds internal same-band lift; Texas weaker';
      } else if (mhiSpread > gSpread) {
        baselineLabel = 'MHI widest monotonic spread';
        baselineSub = 'G-only close on internal target; Texas weaker';
      } else {
        baselineLabel = 'G-only widest spread';
        baselineSub = 'MHI adds internal same-band lift; Texas weaker';
      }
    } else {
      baselineLabel = `MHI spread ${fmtNum(mhiSpread,1)} pp`;
      baselineSub = `G ${fmtNum(gSpread,1)} pp · Texas ${fmtNum(txSpread,1)} pp`;
    }

    const medWatchLead = val.median_watch_lead_q;
    const medCritLead = val.median_critical_lead_q;
    document.getElementById('validationMetrics').innerHTML = `
      <div class="metric-card"><div class="label">Test A <span class="tag-internal">internal</span></div><div class="value">${fmtNum(val.test_a_lift,2)}x</div><div class="sub">Same-G-band lift (own-tier outcome)</div></div>
      <div class="metric-card"><div class="label">Baseline <span class="tag-internal">internal</span></div><div class="value">${baselineLabel}</div><div class="sub">${baselineSub} (own-tier outcome)</div></div>
      <div class="metric-card"><div class="label">Watch lead <span class="tag-external">external</span></div><div class="value">${fmtNum(medWatchLead,0)} quarters</div><div class="sub">Median lead before actual FDIC failure</div></div>
      <div class="metric-card"><div class="label">Critical lead <span class="tag-external">external</span></div><div class="value">${fmtNum(medCritLead,0)} quarter</div><div class="sub">Median lead before actual FDIC failure</div></div>
    `;
    document.getElementById('failedBankSummary').innerHTML = `
      <div class="anchor-highlight">
        <div class="anchor-box"><div class="label">Watch layer <span class="tag-external">external</span></div><div class="value">${fmtNum(medWatchLead,0)} quarters</div><div class="sub">Median lead before FDIC failure</div></div>
        <div class="anchor-box"><div class="label">Critical layer <span class="tag-external">external</span></div><div class="value">${fmtNum(medCritLead,0)} quarter</div><div class="sub">Median lead before FDIC failure</div></div>
      </div>
      <p class="prose-line"><strong>External anchor:</strong> Failed-bank cross-reference (${fmtInt(val.failed_banks_matched)} matched against FDIC failed bank list) shows Watch as the medium-horizon layer and Critical as the near-failure layer. These lead times are measured against actual closure events, not the system's own tier transitions.</p>
      <p class="prose-line"><strong>Internal persistence:</strong> Consecutive Watch quarters vs. future Critical entry (own-tier outcome): run 1 = ${fmtNum(val.test_c_run1,2)}%, run 5 = ${fmtNum(val.test_c_run5,2)}%, run 10 = ${fmtNum(val.test_c_run10,2)}%.</p>`;

    const matrixRows = [
      {Model:'MHI', D1:baseMHI[0]?.future_deterioration_rate, D10:baseMHI[9]?.future_deterioration_rate, Spread:spread(baseMHI.map(r=>r.future_deterioration_rate))},
      {Model:'G-only', D1:baseG[0]?.future_deterioration_rate, D10:baseG[9]?.future_deterioration_rate, Spread:spread(baseG.map(r=>r.future_deterioration_rate))},
      {Model:'Texas proxy', D1:baseTexas[0]?.future_deterioration_rate, D10:baseTexas[9]?.future_deterioration_rate, Spread:spread(baseTexas.map(r=>r.future_deterioration_rate))}
    ];
    renderTable('baselineMatrix', matrixRows, [
      {key:'Model',label:'Model',className:'col-nowrap'},
      {key:'D1',label:'Decile 1',format:v=>fmtNum(v,2)},
      {key:'D10',label:'Decile 10',format:v=>fmtNum(v,2)},
      {key:'Spread',label:'Spread',format:v=>fmtNum(v,2)}
    ], true);

    drawLineChart('baselineChart', [
      {name:'MHI', values:baseMHI.map(r=>r.future_deterioration_rate)},
      {name:'G-only', values:baseG.map(r=>r.future_deterioration_rate)},
      {name:'Texas proxy', values:baseTexas.map(r=>r.future_deterioration_rate)}
    ], baseMHI.map(r=>String(r.decile)), {min:0});
    document.getElementById('baselineCaption').textContent = `Internal-target comparison (own-tier deterioration within 4Q). Decile 10 = worst. MHI spread: ${fmtNum(mhiSpread,1)} pp (monotonic: ${mhiMono?'yes':'no'}). G-only: ${fmtNum(gSpread,1)} pp (monotonic: ${gMono?'yes':'no'}). Texas proxy: ${fmtNum(txSpread,1)} pp (monotonic: ${txMono?'yes':'no'}). MHI and G-only have comparable spread; Texas is materially weaker.`;
    buildInterp('validationInterp', [
      {title:'Two validation layers', text:'Internal tests (A, B, C, baseline comparison) confirm that MHI\'s divergence signal is temporally stable, monotonically ordered, and persistent — using the system\'s own tier transitions as outcome. External anchoring (failed-bank lead times, walk-forward testing) confirms that G predicts actual FDIC closure independently of the tier system.'},
      {title:'What each channel validates', text:'G (structural viability) is the externally validated channel: 13pp decile spread on GFC failure, only metric with full monotonicity on that target. MHI (divergence ratio) is the internally validated channel: strongest monotonic discriminator on own-tier transitions. These are distinct constructs with distinct validation profiles.'},
      {title:'Constraint', text:'The system qualifies traditional structural risk. G provides a structural viability ranking. MHI identifies where surface performance conceals structural weakness. Neither replaces supervisory or proprietary models.'}
    ]);

  } catch(err){
    console.error(err);
    setLoadStatus(`<span class="bad">Error:</span> ${err.message}`);
  }
}
main();
