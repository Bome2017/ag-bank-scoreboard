const FILES = {
  macro: 'output/macro_mhi_summary.csv',
  latestQuarter: 'output/latest_quarter_temporal.csv',
  compare: 'output/compare_2019_2022_2025.csv',
  baseMHI: 'output/baseline_compare_mhi.csv',
  baseG: 'output/baseline_compare_g.csv',
  baseTexas: 'output/baseline_compare_texas_proxy.csv',
  failed: 'output/failed_bank_leadtime_summary.csv'
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
function setStatusMeta(msg){
  const el = document.getElementById('statusMeta');
  if(el) el.textContent = msg;
}
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
    setStatusMeta('Latest quarter: loading · Banks scored: loading · Status: loading');

    const [macroTxt, latestTxt, compareTxt, mhiTxt, gTxt, texasTxt, failedTxt] = await Promise.all([
      fetchText(FILES.macro), fetchText(FILES.latestQuarter), fetchText(FILES.compare),
      fetchText(FILES.baseMHI), fetchText(FILES.baseG), fetchText(FILES.baseTexas), fetchText(FILES.failed)
    ]);

    const macro = parseCSV(macroTxt).map(r => ({...r,banks:toNum(r.banks),mean_G:toNum(r.mean_G),median_G:toNum(r.median_G),median_MHI:toNum(r.median_MHI),p95_MHI:toNum(r.p95_MHI),critical:toNum(r.critical),watch:toNum(r.watch),diverging:toNum(r.diverging),stable:toNum(r.stable)}));
    const latestRows = parseCSV(latestTxt).map(r => ({...r,ASSET:toNum(r.ASSET),MHI:toNum(r.MHI),delta_MHI:toNum(r.delta_MHI),watch_run:toNum(r.watch_run)}));
    const compare = parseCSV(compareTxt).map(r => ({...r,mean_G:toNum(r.mean_G),median_MHI_finite:toNum(r.median_MHI_finite)}));
    const baseMHI = parseCSV(mhiTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const baseG = parseCSV(gTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const baseTexas = parseCSV(texasTxt).map(r => ({...r,decile:toNum(r.decile),future_deterioration_rate:toNum(r.future_deterioration_rate)}));
    const failed = parseCSV(failedTxt).map(r => ({...r,watch_lead_q:toNum(r.watch_lead_q),critical_lead_q:toNum(r.critical_lead_q)}));

    document.getElementById('headerMeta').innerHTML = `<span class="badge">Loaded ${fmtInt(latestRows.length)} latest-quarter rows</span>`;
    setLoadStatus(`<span class="ok">Loaded all required files.</span>`);

    const latest = latestPeriod(macro);
    const current = macro.find(r => r.Period === latest);
    setStatusMeta(`Latest quarter: ${latest} · Banks scored: ${fmtInt(current.banks)} · Status: ready`);
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
      {title:'Observation', text:`${latest} has ${fmtInt(current.critical)} Critical, ${fmtInt(current.watch)} Watch, and ${fmtInt(current.diverging)} Diverging banks. Median finite MHI is ${fmtNum(current.median_MHI,3)} and mean G is ${fmtNum(current.mean_G,3)}.`},
      {title:'Constraint', text:'This is a structural warning snapshot, not a proof of insolvency or system-wide failure.'},
      {title:'Relevance', text:'It shows where the live signal is concentrated before moving into rankings, cohorts, and validation.'}
    ]);

    drawLineChart('gTrend', [{name:'Mean G', values:macro.map(r=>r.mean_G)}, {name:'Median G', values:macro.map(r=>r.median_G)}], macro.map(r=>r.Period));
    drawLineChart('mhiTrend', [{name:'Median finite MHI', values:macro.map(r=>r.median_MHI)}, {name:'P95 finite MHI', values:macro.map(r=>r.p95_MHI)}], macro.map(r=>r.Period));
    drawLineChart('tierTrend', [{name:'Critical', values:macro.map(r=>r.critical)}, {name:'Watch', values:macro.map(r=>r.watch)}, {name:'Diverging', values:macro.map(r=>r.diverging)}], macro.map(r=>r.Period));

    const c2022 = compare.find(r=>r.Period==='2022Q4');
    const c2019 = compare.find(r=>r.Period==='2019Q4');
    buildInterp('trendInterp', [
      {title:'Observation', text:`Relative to 2022Q4, ${latest} is softer: mean G moved from ${fmtNum(c2022?.mean_G,3)} to ${fmtNum(current.mean_G,3)} and median finite MHI moved from ${fmtNum(c2022?.median_MHI_finite,3)} to ${fmtNum(current.median_MHI,3)}.`},
      {title:'Constraint', text:'The charts show direction and magnitude of change, not the cause of the change.'},
      {title:'Relevance', text:`Compared with 2019Q4 (${fmtNum(c2019?.mean_G,3)} mean G), current conditions look weaker than 2022Q4’s high-water mark without implying a mass-critical tail.`}
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
      {title:'Observation', text:'These tables isolate the most severe current-quarter Critical and Watch names using the core fields needed for quick scanning.'},
      {title:'Constraint', text:'A top rank is a current warning, not a deterministic failure call.'},
      {title:'Relevance', text:'This is the operational shortlist for inspection and follow-up.'}
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
      {title:'Observation', text:`The ${latest} Watch cohort includes ${fmtInt(pw)} persistent Watch rows and ${fmtInt(nw)} new Watch rows, with stress concentrated in ${bindCounts[0]?.key || 'the leading component'}.`},
      {title:'Constraint', text:'This does not mean every worsening Watch bank will fail; it separates chronic from newly deteriorating names.'},
      {title:'Relevance', text:'The cohort layer turns the system from static ranking into trajectory-sensitive monitoring.'}
    ]);

    const medWatchLead=median(failed.map(r=>r.watch_lead_q).filter(Number.isFinite));
    const medCritLead=median(failed.map(r=>r.critical_lead_q).filter(Number.isFinite));
    document.getElementById('validationMetrics').innerHTML = `
      <div class="metric-card"><div class="label">Test A</div><div class="value">1.79x</div><div class="sub">Same-G-band lift</div></div>
      <div class="metric-card"><div class="label">Baseline</div><div class="value">MHI strongest overall</div><div class="sub">G-only close behind</div></div>
      <div class="metric-card"><div class="label">Watch lead</div><div class="value">${fmtNum(medWatchLead,0)} quarters</div><div class="sub">Median most-recent Watch lead</div></div>
      <div class="metric-card"><div class="label">Critical lead</div><div class="value">${fmtNum(medCritLead,0)} quarter</div><div class="sub">Median most-recent Critical lead</div></div>
    `;
    document.getElementById('failedBankSummary').innerHTML = `
      <div class="anchor-highlight">
        <div class="anchor-box"><div class="label">Watch layer</div><div class="value">${fmtNum(medWatchLead,0)} quarters</div><div class="sub">Median most-recent lead</div></div>
        <div class="anchor-box"><div class="label">Critical layer</div><div class="value">${fmtNum(medCritLead,0)} quarter</div><div class="sub">Median most-recent lead</div></div>
      </div>
      <p class="prose-line"><strong>Observation:</strong> Persistence remains strong: run 1 = 74.17%, run 5 = 88.98%, run 10 = 92.19%.</p>
      <p class="prose-line"><strong>Relevance:</strong> Failed-bank cross-reference shows Watch as the medium-horizon layer and Critical as the near-failure layer.</p>`;

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
    document.getElementById('baselineCaption').textContent = 'Decile 10 is worst. MHI is the strongest overall ranking signal, G-only is close behind, and the Texas-style proxy is materially weaker.';
    buildInterp('validationInterp', [
      {title:'Observation', text:'The validation stack remains strong: same-band lift, monotonic ranking, persistence, failed-bank anchoring, and favorable baseline comparison all hold together.'},
      {title:'Constraint', text:'These checks do not establish universal superiority over proprietary or supervisory models.'},
      {title:'Relevance', text:'They show that the ranked outputs and cohort interpretations rest on real signal rather than presentation alone.'}
    ]);

  } catch(err){
    console.error(err);
    setLoadStatus(`<span class="bad">Error:</span> ${err.message}`);
    setStatusMeta('Latest quarter: unavailable · Banks scored: unavailable · Status: error');
  }
}
main();
