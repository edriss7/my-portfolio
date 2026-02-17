const { useState, useRef, useEffect, useCallback, useMemo } = React;

// ============ COMPONENT DEMOS: INPUTS (1-20) ============

function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  const handleLoad = () => { setLoading(true); setTimeout(() => setLoading(false), 2000); };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Variants</h4>
      <div style={demo.row}>
        <button style={{...ui.btn, ...ui.btnPrimary}}>Primary</button>
        <button style={{...ui.btn, ...ui.btnSecondary}}>Secondary</button>
        <button style={{...ui.btn, ...ui.btnOutline}}>Outlined</button>
        <button style={{...ui.btn, ...ui.btnText}}>Text</button>
        <button style={{...ui.btn, ...ui.btnDanger}}>Danger</button>
      </div>
      <h4 style={demo.label}>Sizes</h4>
      <div style={demo.row}>
        <button style={{...ui.btn, ...ui.btnPrimary, ...ui.btnSm}}>Small</button>
        <button style={{...ui.btn, ...ui.btnPrimary}}>Medium</button>
        <button style={{...ui.btn, ...ui.btnPrimary, ...ui.btnLg}}>Large</button>
      </div>
      <h4 style={demo.label}>States</h4>
      <div style={demo.row}>
        <button style={{...ui.btn, ...ui.btnPrimary}} disabled>Disabled</button>
        <button style={{...ui.btn, ...ui.btnPrimary, opacity: loading ? 0.7 : 1}} onClick={handleLoad}>
          {loading ? '... Loading' : 'Click to Load'}
        </button>
        <button style={{...ui.btn, ...ui.btnPrimary, borderRadius: 20}}>Rounded</button>
        <button style={{...ui.btn, background:'linear-gradient(135deg,#e91e63,#9c27b0)', color:'#fff', border:'none'}}>Gradient</button>
      </div>
      <h4 style={demo.label}>Icon Buttons</h4>
      <div style={demo.row}>
        <button style={{...ui.btn, ...ui.btnPrimary}}>+ Add Item</button>
        <button style={{...ui.btn, ...ui.btnOutline}}>^ Upload</button>
        <button style={{...ui.btn, ...ui.btnDanger}}>X Delete</button>
      </div>
    </div>
  );
}

function IconButtonDemo() {
  const icons = [{i:'*', c:'#2196f3'},{i:'+', c:'#4caf50'},{i:'X', c:'#ef5350'},{i:'#', c:'#ff9800'},{i:'@', c:'#9c27b0'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Sizes</h4>
      <div style={demo.row}>
        {[28,36,44,52].map(sz =>
          <button key={sz} style={{width:sz,height:sz,borderRadius:'50%',background:'#2196f3',border:'none',color:'#fff',fontSize:sz*0.4,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>+</button>
        )}
      </div>
      <h4 style={demo.label}>Colors</h4>
      <div style={demo.row}>
        {icons.map((b,i) =>
          <button key={i} style={{width:40,height:40,borderRadius:'50%',background:b.c,border:'none',color:'#fff',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{b.i}</button>
        )}
      </div>
      <h4 style={demo.label}>Outlined</h4>
      <div style={demo.row}>
        {icons.map((b,i) =>
          <button key={i} style={{width:40,height:40,borderRadius:'50%',background:'transparent',border:'2px solid '+b.c,color:b.c,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{b.i}</button>
        )}
      </div>
    </div>
  );
}

function ButtonGroupDemo() {
  const [active, setActive] = useState(1);
  const [align, setAlign] = useState('left');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Button Group</h4>
      <div style={{display:'inline-flex',borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.15)'}}>
        {['Day','Week','Month','Year'].map((l,i) =>
          <button key={l} onClick={() => setActive(i)} style={{padding:'8px 16px',fontSize:13,fontWeight:600,border:'none',borderRight:i<3?'1px solid rgba(255,255,255,0.1)':'none',background:active===i?'#2196f3':'rgba(255,255,255,0.04)',color:active===i?'#fff':'rgba(255,255,255,0.5)',cursor:'pointer'}}>{l}</button>
        )}
      </div>
      <h4 style={demo.label}>Alignment</h4>
      <div style={{display:'inline-flex',borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.15)'}}>
        {['left','center','right'].map(a =>
          <button key={a} onClick={() => setAlign(a)} style={{padding:'8px 14px',fontSize:12,fontWeight:600,border:'none',borderRight:a!=='right'?'1px solid rgba(255,255,255,0.1)':'none',background:align===a?'#4caf50':'rgba(255,255,255,0.04)',color:align===a?'#fff':'rgba(255,255,255,0.5)',cursor:'pointer',textTransform:'capitalize'}}>{a}</button>
        )}
      </div>
    </div>
  );
}

function TextFieldDemo() {
  const [val, setVal] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Variants</h4>
      <div style={{display:'flex', flexDirection:'column', gap:12, maxWidth:350}}>
        <input style={ui.input} placeholder="Standard input" value={val} onChange={e => setVal(e.target.value)} />
        <input style={{...ui.input, ...ui.inputFilled}} placeholder="Filled variant" />
        <input style={{...ui.input, borderColor:'#2196f3', boxShadow:'0 0 0 1px #2196f3'}} placeholder="Outlined focused" />
        <div style={{position:'relative'}}>
          <input style={ui.input} type={showPw ? 'text' : 'password'} placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} />
          <button style={{position:'absolute',right:8,top:8,background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:14}} onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
        </div>
        <input style={{...ui.input, borderColor:'#ef5350'}} placeholder="Error state" />
        <div style={{fontSize:11, color:'#ef5350', marginTop:-8}}>This field is required</div>
        <input style={ui.input} placeholder="Disabled" disabled />
        <textarea style={{...ui.input, minHeight:80, resize:'vertical'}} placeholder="Multiline textarea..." />
      </div>
    </div>
  );
}

function SelectDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [multi, setMulti] = useState([]);
  const opts = ['React','Vue','Angular','Svelte','Solid'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Single Select</h4>
      <div style={{position:'relative',display:'inline-block',maxWidth:300}}>
        <div style={{...ui.input,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}} onClick={() => setOpen(!open)}>
          <span style={{color:selected?'#fff':'rgba(255,255,255,0.35)'}}>{selected || 'Choose framework...'}</span>
          <span style={{fontSize:10}}>▼</span>
        </div>
        {open && <div style={ui.dropdown}>
          {opts.map(o => <div key={o} style={{...ui.dropdownItem,background:selected===o?'rgba(33,150,243,0.2)':'transparent'}} onClick={() => {setSelected(o);setOpen(false);}}>{o}</div>)}
        </div>}
      </div>
      <h4 style={demo.label}>Multi Select</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
        {opts.map(o => <span key={o} onClick={() => setMulti(multi.includes(o)?multi.filter(x=>x!==o):[...multi,o])} style={{...ui.chip,background:multi.includes(o)?'rgba(33,150,243,0.3)':'rgba(255,255,255,0.08)',color:multi.includes(o)?'#64b5f6':'rgba(255,255,255,0.6)',cursor:'pointer'}}>{multi.includes(o)?'v ':''}{o}</span>)}
      </div>
    </div>
  );
}

function CheckboxDemo() {
  const [checks, setChecks] = useState({a:true,b:false,c:true,d:false});
  const allChecked = Object.values(checks).every(Boolean);
  const someChecked = Object.values(checks).some(Boolean) && !allChecked;
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Checkboxes</h4>
      <label style={ui.checkLabel} onClick={() => {const v = !allChecked; setChecks({a:v,b:v,c:v,d:v});}}>
        <div style={{...ui.checkbox, background:allChecked?'#4caf50':someChecked?'#4caf50':'transparent', borderColor:allChecked||someChecked?'#4caf50':'rgba(255,255,255,0.3)'}}>{allChecked?'v':someChecked?'-':''}</div>
        Select All
      </label>
      <div style={{marginLeft:24,display:'flex',flexDirection:'column',gap:8}}>
        {Object.entries({a:'Notifications',b:'Dark mode',c:'Auto-save',d:'Analytics'}).map(([k,v]) =>
          <label key={k} style={ui.checkLabel} onClick={() => setChecks({...checks,[k]:!checks[k]})}>
            <div style={{...ui.checkbox, background:checks[k]?'#4caf50':'transparent', borderColor:checks[k]?'#4caf50':'rgba(255,255,255,0.3)'}}>{checks[k] && 'v'}</div>
            {v}
          </label>
        )}
      </div>
      <h4 style={demo.label}>Disabled</h4>
      <label style={{...ui.checkLabel, opacity:0.4}}>
        <div style={{...ui.checkbox, borderColor:'rgba(255,255,255,0.2)'}}>v</div>
        Disabled checked
      </label>
    </div>
  );
}

function RadioDemo() {
  const [val, setVal] = useState('sm');
  const [color, setColor] = useState('blue');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Size Selection</h4>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {[{k:'sm',v:'Small'},{k:'md',v:'Medium'},{k:'lg',v:'Large'},{k:'xl',v:'X-Large'}].map(({k,v}) =>
          <label key={k} style={ui.checkLabel} onClick={() => setVal(k)}>
            <div style={{...ui.radio, borderColor:val===k?'#2196f3':'rgba(255,255,255,0.3)'}}>
              {val===k && <div style={{width:10,height:10,borderRadius:'50%',background:'#2196f3'}} />}
            </div>
            {v}
          </label>
        )}
      </div>
      <h4 style={demo.label}>Color Selection</h4>
      <div style={{display:'flex',gap:12}}>
        {[{k:'blue',c:'#2196f3'},{k:'green',c:'#4caf50'},{k:'red',c:'#ef5350'},{k:'purple',c:'#9c27b0'}].map(({k,c}) =>
          <label key={k} style={ui.checkLabel} onClick={() => setColor(k)}>
            <div style={{...ui.radio, borderColor:color===k?c:'rgba(255,255,255,0.3)'}}>
              {color===k && <div style={{width:10,height:10,borderRadius:'50%',background:c}} />}
            </div>
            <span style={{textTransform:'capitalize'}}>{k}</span>
          </label>
        )}
      </div>
    </div>
  );
}

function SwitchDemo() {
  const [toggles, setToggles] = useState({a:true,b:false,c:true,d:false});
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Sizes</h4>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        {[{w:36,h:20,t:16},{w:44,h:24,t:20},{w:52,h:28,t:24}].map((sz,i) =>
          <div key={i} onClick={() => setToggles({...toggles,['s'+i]:!toggles['s'+i]})} style={{width:sz.w,height:sz.h,borderRadius:sz.h/2,padding:2,cursor:'pointer',background:toggles['s'+i]?'#4caf50':'rgba(255,255,255,0.15)',transition:'background 0.2s',position:'relative'}}>
            <div style={{width:sz.t,height:sz.t,borderRadius:'50%',background:'#fff',transition:'transform 0.2s',transform:toggles['s'+i]?'translateX('+(sz.w-sz.t-4)+'px)':'translateX(0)',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}} />
          </div>
        )}
      </div>
      <h4 style={demo.label}>Colors with Labels</h4>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[{k:'a',l:'Wi-Fi',c:'#4caf50'},{k:'b',l:'Bluetooth',c:'#2196f3'},{k:'c',l:'Location',c:'#ff9800'},{k:'d',l:'Airplane',c:'#e91e63'}].map(({k,l,c}) =>
          <label key={k} style={{...ui.checkLabel, justifyContent:'space-between', maxWidth:220}}>
            {l}
            <div style={{...ui.toggle, background:toggles[k]?c:'rgba(255,255,255,0.15)'}} onClick={() => setToggles({...toggles,[k]:!toggles[k]})}>
              <div style={{...ui.toggleThumb, transform:toggles[k]?'translateX(20px)':'translateX(0)'}} />
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

function SliderDemo() {
  const [v1, setV1] = useState(50);
  const [v2, setV2] = useState(75);
  const [v3, setV3] = useState(30);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Range Sliders</h4>
      <div style={{maxWidth:300, display:'flex', flexDirection:'column', gap:16}}>
        {[{l:'Volume',v:v1,s:setV1,c:'#4caf50',min:0,max:100},{l:'Brightness',v:v2,s:setV2,c:'#2196f3',min:0,max:100},{l:'Temperature',v:v3,s:setV3,c:'#ff9800',min:0,max:50}].map(sl =>
          <div key={sl.l}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:4}}><span>{sl.l}</span><span>{sl.v}{sl.l==='Temperature'?'C':'%'}</span></div>
            <input type="range" min={sl.min} max={sl.max} value={sl.v} onChange={e => sl.s(+e.target.value)} style={{width:'100%',accentColor:sl.c}} />
          </div>
        )}
      </div>
    </div>
  );
}

function RatingDemo() {
  const [rating, setRating] = useState(3);
  const [hover, setHover] = useState(0);
  const [rating2, setRating2] = useState(3.5);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Interactive Rating</h4>
      <div style={{display:'flex',gap:4}}>
        {[1,2,3,4,5].map(i =>
          <span key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)} style={{fontSize:28,cursor:'pointer',color:(hover||rating)>=i?'#ffb300':'rgba(255,255,255,0.15)',transition:'color 0.15s'}}>{(hover||rating)>=i?'\u2605':'\u2606'}</span>
        )}
        <span style={{color:'rgba(255,255,255,0.5)',fontSize:14,marginLeft:8,alignSelf:'center'}}>{rating}/5</span>
      </div>
      <h4 style={demo.label}>Read Only</h4>
      <div style={{display:'flex',gap:4}}>
        {[1,2,3,4,5].map(i =>
          <span key={i} style={{fontSize:28,color:rating2>=i?'#ffb300':rating2>=i-0.5?'#ffb300':'rgba(255,255,255,0.15)'}}>{rating2>=i?'\u2605':rating2>=i-0.5?'\u2BEA':'\u2606'}</span>
        )}
        <span style={{color:'rgba(255,255,255,0.5)',fontSize:14,marginLeft:8,alignSelf:'center'}}>{rating2}</span>
      </div>
    </div>
  );
}

function AutocompleteDemo() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const items = ['JavaScript','TypeScript','Python','Ruby','Rust','Go','Java','Kotlin','Swift','C++'];
  const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Autocomplete Input</h4>
      <div style={{position:'relative',maxWidth:300}}>
        <input style={ui.input} placeholder="Search languages..." value={query} onChange={e => {setQuery(e.target.value);setOpen(true);}} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false),200)} />
        {open && query && filtered.length > 0 && <div style={ui.dropdown}>
          {filtered.map(i => <div key={i} style={ui.dropdownItem} onMouseDown={() => {setQuery(i);setOpen(false);}}>{i}</div>)}
        </div>}
        {open && query && filtered.length === 0 && <div style={{...ui.dropdown,padding:12,color:'rgba(255,255,255,0.4)',fontSize:13}}>No results found</div>}
      </div>
    </div>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState({y:2026,m:2,d:17});
  const days = new Array(28).fill(0).map((_,i) => i+1);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Date Picker</h4>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:12,padding:16,maxWidth:280,border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setDate({...date,m:date.m>1?date.m-1:12})}>&lt;</button>
          <span style={{color:'#fff',fontWeight:600,fontSize:14}}>February {date.y}</span>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setDate({...date,m:date.m<12?date.m+1:1})}>&gt;</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,textAlign:'center'}}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{fontSize:10,color:'rgba(255,255,255,0.3)',padding:4,fontWeight:600}}>{d}</div>)}
          {[0,0,0,0,0,0].map((_,i) => <div key={'e'+i} />)}
          {days.map(d => <div key={d} onClick={() => setDate({...date,d})} style={{padding:6,fontSize:12,borderRadius:6,cursor:'pointer',background:date.d===d?'#2196f3':'transparent',color:date.d===d?'#fff':'rgba(255,255,255,0.6)',fontWeight:date.d===d?700:400}}>{d}</div>)}
        </div>
      </div>
    </div>
  );
}

function TimePickerDemo() {
  const [h, setH] = useState(10);
  const [m, setM] = useState(30);
  const [ampm, setAmpm] = useState('AM');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Time Picker</h4>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setH(h<12?h+1:1)}>^</button>
          <span style={{fontSize:24,fontWeight:700,color:'#fff',width:40,textAlign:'center'}}>{String(h).padStart(2,'0')}</span>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setH(h>1?h-1:12)}>v</button>
        </div>
        <span style={{fontSize:24,color:'#fff',fontWeight:700}}>:</span>
        <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setM(m<59?m+1:0)}>^</button>
          <span style={{fontSize:24,fontWeight:700,color:'#fff',width:40,textAlign:'center'}}>{String(m).padStart(2,'0')}</span>
          <button style={{...ui.btn,...ui.btnText,...ui.btnSm}} onClick={() => setM(m>0?m-1:59)}>v</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <button onClick={() => setAmpm('AM')} style={{...ui.btn,...ui.btnSm,background:ampm==='AM'?'#2196f3':'rgba(255,255,255,0.06)',color:ampm==='AM'?'#fff':'rgba(255,255,255,0.5)',border:'none'}}>AM</button>
          <button onClick={() => setAmpm('PM')} style={{...ui.btn,...ui.btnSm,background:ampm==='PM'?'#2196f3':'rgba(255,255,255,0.06)',color:ampm==='PM'?'#fff':'rgba(255,255,255,0.5)',border:'none'}}>PM</button>
        </div>
      </div>
    </div>
  );
}

function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Drag & Drop Zone</h4>
      <div onDragOver={e => {e.preventDefault();setDrag(true);}} onDragLeave={() => setDrag(false)} onDrop={e => {e.preventDefault();setDrag(false);setFiles([...files,...Array.from(e.dataTransfer.files).map(f=>f.name)]);}} style={{border:'2px dashed '+(drag?'#2196f3':'rgba(255,255,255,0.15)'),borderRadius:12,padding:32,textAlign:'center',background:drag?'rgba(33,150,243,0.05)':'transparent',transition:'all 0.2s',cursor:'pointer'}} onClick={() => setFiles([...files,'document_'+(files.length+1)+'.pdf'])}>
        <div style={{fontSize:32,marginBottom:8}}>+</div>
        <div style={{color:'rgba(255,255,255,0.5)',fontSize:14}}>Drag files here or click to browse</div>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:12,marginTop:4}}>PDF, DOC, PNG up to 10MB</div>
      </div>
      {files.length > 0 && <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
        {files.map((f,i) => <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.04)',borderRadius:6,fontSize:13,color:'rgba(255,255,255,0.6)'}}>
          <span>{f}</span>
          <button style={{background:'none',border:'none',color:'#ef5350',cursor:'pointer',fontSize:14}} onClick={() => setFiles(files.filter((_,j)=>j!==i))}>X</button>
        </div>)}
      </div>}
    </div>
  );
}

function OTPInputDemo() {
  const [otp4, setOtp4] = useState(['','','','']);
  const [otp6, setOtp6] = useState(['','','','','','']);
  const handleOtp = (arr, setArr, idx, val) => {
    if (val.length <= 1) {
      const n = [...arr]; n[idx] = val; setArr(n);
    }
  };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>4-Digit Code</h4>
      <div style={{display:'flex',gap:8}}>
        {otp4.map((v,i) => <input key={i} maxLength={1} value={v} onChange={e => handleOtp(otp4,setOtp4,i,e.target.value)} style={{width:48,height:56,textAlign:'center',fontSize:22,fontWeight:700,background:'rgba(255,255,255,0.06)',border:'2px solid '+(v?'#2196f3':'rgba(255,255,255,0.15)'),borderRadius:8,color:'#fff',outline:'none'}} />)}
      </div>
      <h4 style={demo.label}>6-Digit Code</h4>
      <div style={{display:'flex',gap:6}}>
        {otp6.map((v,i) => <input key={i} maxLength={1} value={v} onChange={e => handleOtp(otp6,setOtp6,i,e.target.value)} style={{width:40,height:48,textAlign:'center',fontSize:18,fontWeight:700,background:'rgba(255,255,255,0.06)',border:'2px solid '+(v?'#4caf50':'rgba(255,255,255,0.15)'),borderRadius:8,color:'#fff',outline:'none'}} />)}
      </div>
    </div>
  );
}

function SearchBarDemo() {
  const [q, setQ] = useState('');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Search Input</h4>
      <div style={{position:'relative',maxWidth:350}}>
        <span style={{position:'absolute',left:12,top:10,color:'rgba(255,255,255,0.3)',fontSize:14}}>O</span>
        <input style={{...ui.input,paddingLeft:32,paddingRight:32}} placeholder="Search components..." value={q} onChange={e => setQ(e.target.value)} />
        {q && <button style={{position:'absolute',right:8,top:8,background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:14}} onClick={() => setQ('')}>X</button>}
      </div>
      <h4 style={demo.label}>With Button</h4>
      <div style={{display:'flex',maxWidth:350}}>
        <input style={{...ui.input,borderRadius:'8px 0 0 8px'}} placeholder="Search..." />
        <button style={{...ui.btn,...ui.btnPrimary,borderRadius:'0 8px 8px 0'}}>Search</button>
      </div>
    </div>
  );
}

function ColorPickerDemo() {
  const [selected, setSelected] = useState('#2196f3');
  const colors = ['#ef5350','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Color Swatches</h4>
      <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:6,maxWidth:280}}>
        {colors.map(c => <div key={c} onClick={() => setSelected(c)} style={{width:30,height:30,borderRadius:6,background:c,cursor:'pointer',border:selected===c?'3px solid #fff':'3px solid transparent',transition:'border 0.15s'}} />)}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginTop:8}}>
        <div style={{width:40,height:40,borderRadius:8,background:selected}} />
        <span style={{color:'rgba(255,255,255,0.6)',fontSize:14,fontFamily:'monospace'}}>{selected}</span>
      </div>
    </div>
  );
}

function NumberInputDemo() {
  const [v1, setV1] = useState(5);
  const [v2, setV2] = useState(1);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Number Input</h4>
      <div style={{display:'flex',alignItems:'center',gap:4}}>
        <button onClick={() => setV1(v1-1)} style={{width:36,height:36,borderRadius:6,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:18,cursor:'pointer'}}>-</button>
        <input value={v1} onChange={e => setV1(+e.target.value||0)} style={{width:60,height:36,textAlign:'center',fontSize:16,fontWeight:700,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,color:'#fff',outline:'none'}} />
        <button onClick={() => setV1(v1+1)} style={{width:36,height:36,borderRadius:6,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:18,cursor:'pointer'}}>+</button>
      </div>
      <h4 style={demo.label}>Quantity Selector</h4>
      <div style={{display:'inline-flex',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,overflow:'hidden'}}>
        <button onClick={() => setV2(Math.max(1,v2-1))} style={{width:36,height:36,border:'none',borderRight:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:16,cursor:'pointer'}}>-</button>
        <div style={{width:48,height:36,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:600}}>{v2}</div>
        <button onClick={() => setV2(v2+1)} style={{width:36,height:36,border:'none',borderLeft:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:16,cursor:'pointer'}}>+</button>
      </div>
    </div>
  );
}

function TagInputDemo() {
  const [tags, setTags] = useState(['React','JavaScript']);
  const [input, setInput] = useState('');
  const add = () => { if (input.trim() && !tags.includes(input.trim())) { setTags([...tags,input.trim()]); setInput(''); } };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Tag Input</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:8,background:'rgba(255,255,255,0.04)',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',maxWidth:400}}>
        {tags.map(t => <span key={t} style={{...ui.chip,background:'rgba(33,150,243,0.2)',color:'#64b5f6'}}>{t} <span style={{cursor:'pointer',marginLeft:4}} onClick={() => setTags(tags.filter(x=>x!==t))}>x</span></span>)}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && add()} placeholder="Add tag..." style={{border:'none',background:'none',color:'#fff',outline:'none',fontSize:13,flex:1,minWidth:80}} />
      </div>
    </div>
  );
}

function PasswordStrengthDemo() {
  const [pw, setPw] = useState('');
  const strength = pw.length === 0 ? 0 : pw.length < 4 ? 1 : pw.length < 8 ? 2 : /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3;
  const labels = ['','Weak','Fair','Good','Strong'];
  const colors = ['','#ef5350','#ff9800','#ffeb3b','#4caf50'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Password with Strength Meter</h4>
      <div style={{maxWidth:300}}>
        <input style={ui.input} type="password" placeholder="Enter password..." value={pw} onChange={e => setPw(e.target.value)} />
        <div style={{display:'flex',gap:4,marginTop:8}}>
          {[1,2,3,4].map(i => <div key={i} style={{flex:1,height:4,borderRadius:2,background:strength>=i?colors[strength]:'rgba(255,255,255,0.08)',transition:'background 0.3s'}} />)}
        </div>
        {strength > 0 && <div style={{fontSize:12,color:colors[strength],marginTop:4}}>{labels[strength]}</div>}
      </div>
    </div>
  );
}

// ============ COMPONENT DEMOS: DATA DISPLAY (21-40) ============

function TypographyDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Headings</h4>
      <h1 style={{color:'#fff',margin:'4px 0',fontSize:32}}>Heading 1</h1>
      <h2 style={{color:'#fff',margin:'4px 0',fontSize:26}}>Heading 2</h2>
      <h3 style={{color:'#fff',margin:'4px 0',fontSize:22}}>Heading 3</h3>
      <h4 style={{color:'#fff',margin:'4px 0',fontSize:18}}>Heading 4</h4>
      <h5 style={{color:'#fff',margin:'4px 0',fontSize:15}}>Heading 5</h5>
      <h6 style={{color:'#fff',margin:'4px 0',fontSize:13}}>Heading 6</h6>
      <h4 style={demo.label}>Body and Caption</h4>
      <p style={{color:'rgba(255,255,255,0.7)',fontSize:14,margin:'4px 0',lineHeight:1.6}}>Body text - The quick brown fox jumps over the lazy dog.</p>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,margin:'4px 0'}}>Caption text - Secondary information.</p>
      <p style={{color:'rgba(255,255,255,0.3)',fontSize:10,margin:'4px 0',textTransform:'uppercase',letterSpacing:1,fontWeight:600}}>Overline Text</p>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Sizes</h4>
      <div style={demo.row}>
        {[24,32,40,48,56].map(sz => <div key={sz} style={{width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#e91e63,#9c27b0)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:sz*0.4}}>E</div>)}
      </div>
      <h4 style={demo.label}>Shapes</h4>
      <div style={demo.row}>
        <div style={{width:44,height:44,borderRadius:'50%',background:'#2196f3',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>R</div>
        <div style={{width:44,height:44,borderRadius:8,background:'#4caf50',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>S</div>
        <div style={{width:44,height:44,borderRadius:0,background:'#ff9800',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>Q</div>
      </div>
      <h4 style={demo.label}>Group</h4>
      <div style={{display:'flex'}}>
        {['#4caf50','#2196f3','#ff9800','#e91e63','#9c27b0'].map((c,i) => <div key={i} style={{width:40,height:40,borderRadius:'50%',background:c,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:15,border:'2px solid #0a0a1a',marginLeft:i>0?-10:0,zIndex:5-i}}>{'ABCDE'[i]}</div>)}
        <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:12,fontWeight:600,marginLeft:-10}}>+5</div>
      </div>
      <h4 style={demo.label}>Status</h4>
      <div style={demo.row}>
        {[{c:'#4caf50',l:'Online'},{c:'#ff9800',l:'Away'},{c:'#ef5350',l:'Busy'},{c:'#888',l:'Offline'}].map(st => <div key={st.l} style={{textAlign:'center'}}><div style={{position:'relative',display:'inline-block'}}><div style={{width:44,height:44,borderRadius:'50%',background:'#333',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:18}}>U</div><div style={{position:'absolute',bottom:0,right:0,width:12,height:12,borderRadius:'50%',background:st.c,border:'2px solid #0a0a1a'}} /></div><div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:4}}>{st.l}</div></div>)}
      </div>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Color Variants</h4>
      <div style={demo.row}>
        {[{l:'Default',c:'rgba(255,255,255,0.1)',t:'rgba(255,255,255,0.6)'},{l:'Primary',c:'#2196f3',t:'#fff'},{l:'Success',c:'#4caf50',t:'#fff'},{l:'Warning',c:'#ff9800',t:'#fff'},{l:'Error',c:'#ef5350',t:'#fff'},{l:'Info',c:'#00bcd4',t:'#fff'}].map(b => <span key={b.l} style={{...ui.badge, background:b.c, color:b.t}}>{b.l}</span>)}
      </div>
      <h4 style={demo.label}>Notification Dots</h4>
      <div style={demo.row}>
        {[{icon:'B',count:3,c:'#ef5350'},{icon:'M',count:12,c:'#2196f3'},{icon:'C',count:'9+',c:'#4caf50'}].map(b => <div key={b.icon} style={{position:'relative',display:'inline-block',marginRight:12}}><div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{b.icon}</div><span style={{position:'absolute',top:-4,right:-6,minWidth:18,height:18,borderRadius:9,background:b.c,fontSize:10,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,padding:'0 4px'}}>{b.count}</span></div>)}
      </div>
    </div>
  );
}

function ChipDemo() {
  const [chips, setChips] = useState(['React','TypeScript','Node.js','GraphQL','Docker']);
  const [selected, setSelected] = useState(['React']);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Deletable Chips</h4>
      <div style={demo.row}>{chips.map(t => <span key={t} style={ui.chip}>{t} <span style={{cursor:'pointer'}} onClick={() => setChips(chips.filter(c=>c!==t))}>x</span></span>)}</div>
      <h4 style={demo.label}>Selectable Chips</h4>
      <div style={demo.row}>{['Small','Medium','Large','XL'].map(sz => <span key={sz} onClick={() => setSelected(selected.includes(sz)?selected.filter(x=>x!==sz):[...selected,sz])} style={{...ui.chip,background:selected.includes(sz)?'rgba(33,150,243,0.3)':'rgba(255,255,255,0.08)',color:selected.includes(sz)?'#64b5f6':'rgba(255,255,255,0.6)',cursor:'pointer'}}>{selected.includes(sz)?'v ':''}{sz}</span>)}</div>
      <h4 style={demo.label}>Color Variants</h4>
      <div style={demo.row}>{[{l:'Success',c:'#4caf50'},{l:'Warning',c:'#ff9800'},{l:'Error',c:'#ef5350'},{l:'Info',c:'#2196f3'}].map(ch => <span key={ch.l} style={{...ui.chip,background:ch.c+'33',color:ch.c}}>{ch.l}</span>)}</div>
    </div>
  );
}

function DividerDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Horizontal</h4>
      <div style={{maxWidth:400}}><p style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>Content above</p><div style={{height:1,background:'rgba(255,255,255,0.1)',margin:'12px 0'}} /><p style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>Content below</p></div>
      <h4 style={demo.label}>With Text</h4>
      <div style={{display:'flex',alignItems:'center',gap:12,maxWidth:400}}><div style={{flex:1,height:1,background:'rgba(255,255,255,0.1)'}} /><span style={{color:'rgba(255,255,255,0.35)',fontSize:12}}>OR</span><div style={{flex:1,height:1,background:'rgba(255,255,255,0.1)'}} /></div>
      <h4 style={demo.label}>Vertical</h4>
      <div style={{display:'flex',alignItems:'center',gap:12,height:40}}><span style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>Item A</span><div style={{width:1,height:'100%',background:'rgba(255,255,255,0.1)'}} /><span style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>Item B</span><div style={{width:1,height:'100%',background:'rgba(255,255,255,0.1)'}} /><span style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>Item C</span></div>
    </div>
  );
}

function ListDemo() {
  const items = [{t:'Dashboard',sub:'Overview of metrics'},{t:'Analytics',sub:'View detailed stats'},{t:'Settings',sub:'Manage preferences'},{t:'Help',sub:'Get support'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Simple List</h4>
      <div style={{maxWidth:320,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
        {items.map((it,i) => <div key={i} style={{padding:'10px 14px',borderBottom:i<items.length-1?'1px solid rgba(255,255,255,0.06)':'none',cursor:'pointer'}}><div style={{color:'#fff',fontSize:14}}>{it.t}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>{it.sub}</div></div>)}
      </div>
      <h4 style={demo.label}>Avatar List</h4>
      <div style={{maxWidth:320}}>
        {['Alice','Bob','Charlie'].map((n,i) => <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0'}}><div style={{width:36,height:36,borderRadius:'50%',background:['#e91e63','#2196f3','#4caf50'][i],display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>{n[0]}</div><div><div style={{color:'#fff',fontSize:13}}>{n}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>Member</div></div></div>)}
      </div>
    </div>
  );
}

function TableDemo() {
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState(1);
  const data = [{name:'Edris',role:'Admin',status:'Active',email:'edris@test.com'},{name:'Alice',role:'Editor',status:'Active',email:'alice@test.com'},{name:'Bob',role:'Viewer',status:'Inactive',email:'bob@test.com'},{name:'Sara',role:'Editor',status:'Active',email:'sara@test.com'}];
  const sorted = [...data].sort((a,b) => a[sortCol] > b[sortCol] ? sortDir : -sortDir);
  const toggleSort = (col) => { if(sortCol===col) setSortDir(-sortDir); else { setSortCol(col); setSortDir(1); } };
  return (
    <div style={demo.wrap}><div style={{overflowX:'auto'}}><table style={ui.table}><thead><tr>{['name','role','status','email'].map(h => <th key={h} style={{...ui.th,cursor:'pointer'}} onClick={() => toggleSort(h)}>{h.charAt(0).toUpperCase()+h.slice(1)} {sortCol===h?(sortDir===1?'^':'v'):''}</th>)}</tr></thead><tbody>{sorted.map((r,i) => <tr key={i} style={{...ui.tr,background:i%2===0?'rgba(255,255,255,0.02)':'transparent'}}><td style={ui.td}><strong style={{color:'#fff'}}>{r.name}</strong></td><td style={ui.td}>{r.role}</td><td style={ui.td}><span style={{...ui.badge, background:r.status==='Active'?'rgba(76,175,80,0.2)':'rgba(255,255,255,0.08)', color:r.status==='Active'?'#4caf50':'rgba(255,255,255,0.4)', fontSize:11}}>{r.status}</span></td><td style={ui.td}>{r.email}</td></tr>)}</tbody></table></div></div>
  );
}

function TooltipDemo() {
  const [show, setShow] = useState(null);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Positions</h4>
      <div style={{...demo.row, gap:16, padding:20}}>
        {['Top','Right','Bottom','Left'].map(d => <div key={d} style={{position:'relative', display:'inline-block'}}><button style={{...ui.btn,...ui.btnOutline}} onMouseEnter={() => setShow(d)} onMouseLeave={() => setShow(null)}>{d}</button>{show === d && <div style={{...ui.tooltip, ...(d==='Top'?{bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'}:d==='Bottom'?{top:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'}:d==='Left'?{right:'calc(100% + 8px)',top:'50%',transform:'translateY(-50%)'}:{left:'calc(100% + 8px)',top:'50%',transform:'translateY(-50%)'})}}>{d} tooltip</div>}</div>)}
      </div>
      <h4 style={demo.label}>Themes</h4>
      <div style={demo.row}>
        <div style={{position:'relative'}}><button style={{...ui.btn,...ui.btnSecondary}} onMouseEnter={() => setShow('dark')} onMouseLeave={() => setShow(null)}>Dark</button>{show==='dark' && <div style={{...ui.tooltip,bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)',background:'#333'}}>Dark tooltip</div>}</div>
        <div style={{position:'relative'}}><button style={{...ui.btn,...ui.btnSecondary}} onMouseEnter={() => setShow('light')} onMouseLeave={() => setShow(null)}>Light</button>{show==='light' && <div style={{...ui.tooltip,bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)',background:'#f5f5f5',color:'#333'}}>Light tooltip</div>}</div>
      </div>
    </div>
  );
}

function CardDemo() {
  return (
    <div style={demo.wrap}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14}}>
        <div style={ui.card}><div style={{height:100, background:'linear-gradient(135deg,#1e88e5,#42a5f5)', borderRadius:'10px 10px 0 0'}} /><div style={{padding:14}}><h4 style={{color:'#fff', margin:'0 0 4px'}}>Media Card</h4><p style={{color:'rgba(255,255,255,0.5)', fontSize:13, margin:0}}>Card with media header.</p><button style={{...ui.btn, ...ui.btnPrimary, ...ui.btnSm, marginTop:10, width:'100%'}}>Action</button></div></div>
        <div style={{...ui.card, padding:16}}><h4 style={{color:'#fff', margin:'0 0 8px'}}>Stats</h4><div style={{fontSize:32, fontWeight:700, color:'#4caf50'}}>2,847</div><div style={{fontSize:12, color:'rgba(255,255,255,0.4)'}}>Active Users</div><div style={{fontSize:12, color:'#4caf50', marginTop:4}}>^ 12.5%</div></div>
        <div style={{...ui.card, padding:16, display:'flex', alignItems:'center', gap:12}}><div style={{width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#ff9800,#e91e63)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'#fff', flexShrink:0}}>E</div><div><h4 style={{color:'#fff', margin:0}}>Profile</h4><div style={{fontSize:12, color:'rgba(255,255,255,0.4)'}}>Developer</div></div></div>
      </div>
    </div>
  );
}

function ImageListDemo() {
  const colors = ['#e91e63','#2196f3','#4caf50','#ff9800','#9c27b0','#00bcd4'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Image Grid</h4>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,maxWidth:400}}>
        {colors.map((c,i) => <div key={i} style={{position:'relative',paddingBottom:'100%',background:c,borderRadius:8,overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,right:0,padding:'8px',background:'linear-gradient(transparent,rgba(0,0,0,0.6))'}}><div style={{color:'#fff',fontSize:11,fontWeight:600}}>Image {i+1}</div></div></div>)}
      </div>
    </div>
  );
}

function TimelineDemo() {
  const events = [{t:'Project Started',d:'Jan 2026',c:'#2196f3'},{t:'Design Complete',d:'Feb 2026',c:'#4caf50'},{t:'Development',d:'Mar 2026',c:'#ff9800'},{t:'Launch',d:'Apr 2026',c:'#e91e63'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Vertical Timeline</h4>
      <div style={{position:'relative',paddingLeft:28}}>
        <div style={{position:'absolute',left:8,top:4,bottom:4,width:2,background:'rgba(255,255,255,0.1)'}} />
        {events.map((e,i) => <div key={i} style={{position:'relative',marginBottom:20}}><div style={{position:'absolute',left:-24,top:2,width:12,height:12,borderRadius:'50%',background:e.c,border:'2px solid #0a0a1a'}} /><div style={{color:'#fff',fontSize:14,fontWeight:600}}>{e.t}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>{e.d}</div></div>)}
      </div>
    </div>
  );
}

function TreeViewDemo() {
  const [open, setOpen] = useState({src:true,comp:false});
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>File Tree</h4>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.6)'}}>
        <div style={{cursor:'pointer',padding:'2px 0'}} onClick={() => setOpen({...open,src:!open.src})}>{open.src?'v':'>'} src/</div>
        {open.src && <div style={{paddingLeft:16}}>
          <div style={{cursor:'pointer',padding:'2px 0'}} onClick={() => setOpen({...open,comp:!open.comp})}>{open.comp?'v':'>'} components/</div>
          {open.comp && <div style={{paddingLeft:16}}><div style={{padding:'2px 0',color:'#4caf50'}}>- Button.jsx</div><div style={{padding:'2px 0',color:'#4caf50'}}>- Card.jsx</div><div style={{padding:'2px 0',color:'#4caf50'}}>- Modal.jsx</div></div>}
          <div style={{padding:'2px 0',color:'#2196f3'}}>- App.jsx</div>
          <div style={{padding:'2px 0',color:'#ff9800'}}>- index.js</div>
        </div>}
        <div style={{padding:'2px 0',color:'#e91e63'}}>- package.json</div>
        <div style={{padding:'2px 0',color:'rgba(255,255,255,0.4)'}}>- README.md</div>
      </div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState(0);
  const items = [{q:'What is React?', a:'React is a JavaScript library for building user interfaces using a virtual DOM.'},{q:'What are hooks?', a:'Hooks let you use state and lifecycle features in functional components.'},{q:'What is JSX?', a:'JSX is a syntax extension for JavaScript that looks similar to HTML.'}];
  return (
    <div style={demo.wrap}>
      {items.map((item, i) => <div key={i} style={ui.accordionItem}><div style={ui.accordionHeader} onClick={() => setOpen(open===i?-1:i)}><span>{item.q}</span><span style={{transform:open===i?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s'}}>V</span></div>{open===i && <div style={ui.accordionBody}>{item.a}</div>}</div>)}
    </div>
  );
}

function DataGridDemo() {
  const [sort, setSort] = useState({col:'id',dir:1});
  const rows = [{id:1,product:'Widget A',price:29.99,qty:150},{id:2,product:'Widget B',price:49.99,qty:89},{id:3,product:'Widget C',price:19.99,qty:320}];
  const sorted = [...rows].sort((a,b) => a[sort.col] > b[sort.col] ? sort.dir : -sort.dir);
  return (
    <div style={demo.wrap}><div style={{overflowX:'auto'}}><table style={ui.table}><thead><tr>{['id','product','price','qty'].map(c => <th key={c} style={{...ui.th,cursor:'pointer'}} onClick={() => setSort({col:c,dir:sort.col===c?-sort.dir:1})}>{c.toUpperCase()} {sort.col===c?(sort.dir===1?'^':'v'):''}</th>)}</tr></thead><tbody>{sorted.map(r => <tr key={r.id} style={ui.tr}><td style={ui.td}>{r.id}</td><td style={{...ui.td,color:'#fff',fontWeight:600}}>{r.product}</td><td style={ui.td}>${r.price}</td><td style={ui.td}>{r.qty}</td></tr>)}</tbody></table></div></div>
  );
}

function EmptyStateDemo() {
  return (
    <div style={demo.wrap}><div style={{textAlign:'center',padding:40}}><div style={{width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.04)',margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,color:'rgba(255,255,255,0.2)'}}>?</div><h3 style={{color:'#fff',margin:'0 0 8px'}}>No Data Found</h3><p style={{color:'rgba(255,255,255,0.4)',fontSize:14,margin:'0 0 16px'}}>There are no items to display.</p><button style={{...ui.btn,...ui.btnPrimary}}>+ Create New</button></div></div>
  );
}

function StatDemo() {
  const stats = [{label:'Revenue',value:'$48.2K',change:'+12.5%',up:true,c:'#4caf50'},{label:'Users',value:'2,847',change:'+5.3%',up:true,c:'#2196f3'},{label:'Bounce',value:'34.2%',change:'-2.1%',up:false,c:'#ef5350'}];
  return (
    <div style={demo.wrap}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>{stats.map(st => <div key={st.label} style={{...ui.card,padding:16}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:4}}>{st.label}</div><div style={{color:'#fff',fontSize:24,fontWeight:700}}>{st.value}</div><div style={{color:st.c,fontSize:12,marginTop:4}}>{st.up?'^':'v'} {st.change}</div></div>)}</div></div>
  );
}

function KeyValueDemo() {
  const pairs = [{k:'Name',v:'Edris'},{k:'Email',v:'edris@example.com'},{k:'Role',v:'Admin'},{k:'Status',v:'Active'},{k:'Joined',v:'Jan 2026'}];
  return (
    <div style={demo.wrap}><h4 style={demo.label}>Key-Value Pairs</h4><div style={{maxWidth:350}}>{pairs.map(p => <div key={p.k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}><span style={{color:'rgba(255,255,255,0.4)',fontSize:13}}>{p.k}</span><span style={{color:'#fff',fontSize:13,fontWeight:500}}>{p.v}</span></div>)}</div></div>
  );
}

function UserCardDemo() {
  return (
    <div style={demo.wrap}><div style={{display:'flex',gap:16,flexWrap:'wrap'}}>{[{name:'Alice',role:'Designer',c:'#e91e63'},{name:'Bob',role:'Developer',c:'#2196f3'},{name:'Carol',role:'Manager',c:'#4caf50'}].map(u => <div key={u.name} style={{...ui.card,padding:16,display:'flex',alignItems:'center',gap:12,minWidth:200}}><div style={{width:44,height:44,borderRadius:'50%',background:u.c,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:18,flexShrink:0}}>{u.name[0]}</div><div><div style={{color:'#fff',fontSize:14,fontWeight:600}}>{u.name}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>{u.role}</div></div></div>)}</div></div>
  );
}

function PriceTagDemo() {
  return (
    <div style={demo.wrap}><div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
      <div style={{...ui.card,padding:20,textAlign:'center',minWidth:140}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:12,textDecoration:'line-through'}}>$99.99</div><div style={{color:'#4caf50',fontSize:28,fontWeight:700}}>$59.99</div><div style={{...ui.badge,background:'#ef5350',color:'#fff',fontSize:10,marginTop:4}}>40% OFF</div></div>
      <div style={{...ui.card,padding:20,textAlign:'center',minWidth:140}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>Starting at</div><div style={{color:'#fff',fontSize:28,fontWeight:700}}>$9<span style={{fontSize:14}}>/mo</span></div></div>
      <div style={{...ui.card,padding:20,textAlign:'center',minWidth:140,border:'1px solid #2196f3'}}><div style={{...ui.badge,background:'#2196f3',color:'#fff',fontSize:10,marginBottom:8}}>BEST VALUE</div><div style={{color:'#fff',fontSize:28,fontWeight:700}}>$29</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>per month</div></div>
    </div></div>
  );
}

function CodeBlockDemo() {
  const [copied, setCopied] = useState(false);
  const code = 'const greeting = "Hello";\nconsole.log(greeting);';
  return (
    <div style={demo.wrap}><h4 style={demo.label}>Code Block</h4><div style={{position:'relative',background:'rgba(0,0,0,0.3)',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.04)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}><span style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>javascript</span><button onClick={() => {setCopied(true);setTimeout(() => setCopied(false),2000);}} style={{...ui.btn,...ui.btnText,...ui.btnSm,fontSize:11}}>{copied?'Copied!':'Copy'}</button></div><pre style={{padding:16,margin:0,color:'#e0e0e0',fontSize:13,lineHeight:1.5,fontFamily:'monospace',overflowX:'auto'}}>{code}</pre></div></div>
  );
}

// ============ COMPONENT DEMOS: FEEDBACK (41-55) ============

function AlertDemo() {
  const [show, setShow] = useState({s:true,w:true,e:true,i:true});
  return (
    <div style={demo.wrap}>
      {show.s && <div style={{...ui.alert, borderLeft:'4px solid #4caf50', background:'rgba(76,175,80,0.1)'}}><span style={{flex:1}}>Success - Operation completed!</span><button style={ui.alertClose} onClick={() => setShow({...show,s:false})}>x</button></div>}
      {show.w && <div style={{...ui.alert, borderLeft:'4px solid #ff9800', background:'rgba(255,152,0,0.1)'}}><span style={{flex:1}}>Warning - Please review settings.</span><button style={ui.alertClose} onClick={() => setShow({...show,w:false})}>x</button></div>}
      {show.e && <div style={{...ui.alert, borderLeft:'4px solid #ef5350', background:'rgba(239,83,80,0.1)'}}><span style={{flex:1}}>Error - Something went wrong.</span><button style={ui.alertClose} onClick={() => setShow({...show,e:false})}>x</button></div>}
      {show.i && <div style={{...ui.alert, borderLeft:'4px solid #2196f3', background:'rgba(33,150,243,0.1)'}}><span style={{flex:1}}>Info - A new version is available.</span><button style={ui.alertClose} onClick={() => setShow({...show,i:false})}>x</button></div>}
      {(!show.s||!show.w||!show.e||!show.i) && <button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => setShow({s:true,w:true,e:true,i:true})}>Reset All</button>}
    </div>
  );
}

function SnackbarDemo() {
  const [snack, setSnack] = useState(null);
  const showSnack = (msg, c) => { setSnack({msg,c}); setTimeout(() => setSnack(null), 3000); };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Snackbar Notifications</h4>
      <div style={demo.row}>
        <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => showSnack('Item saved successfully','#4caf50')}>Success</button>
        <button style={{...ui.btn,...ui.btnDanger}} onClick={() => showSnack('Failed to save item','#ef5350')}>Error</button>
        <button style={{...ui.btn,...ui.btnSecondary}} onClick={() => showSnack('Processing your request...','#2196f3')}>Info</button>
      </div>
      {snack && <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:snack.c,color:'#fff',padding:'12px 24px',borderRadius:8,fontSize:14,fontWeight:500,boxShadow:'0 4px 16px rgba(0,0,0,0.3)',zIndex:2000,display:'flex',alignItems:'center',gap:12}}>{snack.msg}<button style={{background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:14}} onClick={() => setSnack(null)}>x</button></div>}
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(null);
  return (
    <div style={demo.wrap}>
      <div style={demo.row}>
        <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => setOpen('confirm')}>Confirm Dialog</button>
        <button style={{...ui.btn,...ui.btnOutline}} onClick={() => setOpen('form')}>Form Dialog</button>
      </div>
      {open && <div style={ui.modalOverlay} onClick={() => setOpen(null)}><div style={ui.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><h3 style={{color:'#fff',margin:0}}>{open==='confirm'?'Confirm Action':'Edit Profile'}</h3><button style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:18,cursor:'pointer'}} onClick={() => setOpen(null)}>x</button></div>
        {open==='confirm' && <p style={{color:'rgba(255,255,255,0.6)',fontSize:14}}>Are you sure you want to proceed? This action cannot be undone.</p>}
        {open==='form' && <div style={{display:'flex',flexDirection:'column',gap:10}}><input style={ui.input} placeholder="Name" /><input style={ui.input} placeholder="Email" /><textarea style={{...ui.input,minHeight:60}} placeholder="Bio" /></div>}
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}><button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => setOpen(null)}>Cancel</button><button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm}} onClick={() => setOpen(null)}>Confirm</button></div>
      </div></div>}
    </div>
  );
}

function CircularProgressDemo() {
  const [val, setVal] = useState(75);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Determinate</h4>
      <div style={demo.row}>
        {[{v:val,c:'#4caf50'},{v:45,c:'#2196f3'},{v:90,c:'#ff9800'}].map((p,i) => <div key={i} style={{position:'relative',width:70,height:70}}><svg viewBox="0 0 36 36" style={{width:70,height:70,transform:'rotate(-90deg)'}}><circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke={p.c} strokeWidth="3" strokeDasharray={p.v + ' 100'} strokeLinecap="round" /></svg><div style={{position:'absolute',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>{p.v}%</div></div>)}
      </div>
      <input type="range" min="0" max="100" value={val} onChange={e => setVal(+e.target.value)} style={{width:200,marginTop:8}} />
      <h4 style={demo.label}>Indeterminate</h4>
      <div style={{width:40,height:40,border:'3px solid rgba(255,255,255,0.1)',borderTop:'3px solid #2196f3',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
    </div>
  );
}

function LinearProgressDemo() {
  const [val, setVal] = useState(65);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Determinate with Label</h4>
      <div style={{maxWidth:400}}>
        {[{v:val,c:'#4caf50',l:'Download'},{v:45,c:'#2196f3',l:'Upload'},{v:80,c:'#ff9800',l:'Storage'}].map(p => <div key={p.l} style={{marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:4}}><span>{p.l}</span><span>{p.v}%</span></div><div style={ui.progressTrack}><div style={{...ui.progressFill, width:p.v+'%', background:p.c}} /></div></div>)}
      </div>
      <input type="range" min="0" max="100" value={val} onChange={e => setVal(+e.target.value)} style={{width:200}} />
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Loading Placeholders</h4>
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
        <div style={{...ui.skeleton, width:48,height:48,borderRadius:'50%'}} />
        <div style={{flex:1}}><div style={{...ui.skeleton, width:'60%',height:14,marginBottom:8}} /><div style={{...ui.skeleton, width:'40%',height:10}} /></div>
      </div>
      <div style={{...ui.skeleton, width:'100%',height:12,marginBottom:8}} />
      <div style={{...ui.skeleton, width:'90%',height:12,marginBottom:8}} />
      <div style={{...ui.skeleton, width:'75%',height:12}} />
      <h4 style={demo.label}>Card Skeleton</h4>
      <div style={{...ui.skeleton, width:200,height:120,borderRadius:8,marginBottom:8}} />
      <div style={{...ui.skeleton, width:200,height:14,marginBottom:6}} />
      <div style={{...ui.skeleton, width:140,height:10}} />
    </div>
  );
}

function LoadingButtonDemo() {
  const [loading, setLoading] = useState({a:false,b:false,c:false});
  const click = (k) => { setLoading({...loading,[k]:true}); setTimeout(() => setLoading({...loading,[k]:false}), 2000); };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Loading Buttons</h4>
      <div style={demo.row}>
        <button style={{...ui.btn,...ui.btnPrimary,opacity:loading.a?0.7:1}} onClick={() => click('a')}>{loading.a?'Saving...':'Save'}</button>
        <button style={{...ui.btn,...ui.btnOutline,opacity:loading.b?0.7:1}} onClick={() => click('b')}>{loading.b?'Loading...':'Load Data'}</button>
        <button style={{...ui.btn,...ui.btnDanger,opacity:loading.c?0.7:1}} onClick={() => click('c')}>{loading.c?'Deleting...':'Delete'}</button>
      </div>
    </div>
  );
}

function ToastDemo() {
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, c) => { const id = Date.now(); setToasts(t => [...t,{id,msg,c}]); setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), 3000); };
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Stacked Toasts</h4>
      <div style={demo.row}>
        <button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm}} onClick={() => addToast('Item saved!','#4caf50')}>Success</button>
        <button style={{...ui.btn,...ui.btnDanger,...ui.btnSm}} onClick={() => addToast('Error occurred!','#ef5350')}>Error</button>
        <button style={{...ui.btn,...ui.btnSecondary,...ui.btnSm}} onClick={() => addToast('Notification','#2196f3')}>Info</button>
      </div>
      <div style={{position:'fixed',top:20,right:20,display:'flex',flexDirection:'column',gap:8,zIndex:2000}}>
        {toasts.map(t => <div key={t.id} style={{background:t.c,color:'#fff',padding:'10px 16px',borderRadius:8,fontSize:13,fontWeight:500,boxShadow:'0 4px 12px rgba(0,0,0,0.3)',minWidth:200,display:'flex',justifyContent:'space-between',alignItems:'center'}}>{t.msg}<span style={{cursor:'pointer',marginLeft:12}} onClick={() => setToasts(ts => ts.filter(x=>x.id!==t.id))}>x</span></div>)}
      </div>
    </div>
  );
}

function BannerDemo() {
  const [show, setShow] = useState(true);
  return (
    <div style={demo.wrap}>
      {show && <div style={{background:'linear-gradient(90deg,#2196f3,#1976d2)',borderRadius:8,padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{color:'#fff',fontSize:14}}>New feature available! Check out our latest update.</span>
        <div style={{display:'flex',gap:8}}><button style={{...ui.btn,...ui.btnSm,background:'rgba(255,255,255,0.2)',color:'#fff',border:'none'}}>Learn More</button><button style={{background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer'}} onClick={() => setShow(false)}>x</button></div>
      </div>}
      {!show && <button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => setShow(true)}>Show Banner</button>}
    </div>
  );
}

function LoadingOverlayDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div style={demo.wrap}>
      <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => {setLoading(true);setTimeout(() => setLoading(false),2000);}}>Show Loading Overlay</button>
      <div style={{position:'relative',marginTop:12,padding:20,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',minHeight:100}}>
        <p style={{color:'rgba(255,255,255,0.6)',fontSize:14}}>Content that gets overlaid during loading state.</p>
        {loading && <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(10,10,26,0.8)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8}}>
          <div style={{width:32,height:32,border:'3px solid rgba(255,255,255,0.1)',borderTop:'3px solid #2196f3',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
          <span style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>Loading...</span>
        </div>}
      </div>
    </div>
  );
}

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  return (
    <div style={demo.wrap}>
      <button style={{...ui.btn,...ui.btnDanger}} onClick={() => setOpen(true)}>Delete Item</button>
      {result && <div style={{color:result==='yes'?'#4caf50':'rgba(255,255,255,0.4)',fontSize:13,marginTop:8}}>You clicked: {result==='yes'?'Confirmed':'Cancelled'}</div>}
      {open && <div style={ui.modalOverlay} onClick={() => {setOpen(false);setResult('no');}}><div style={{...ui.modalBox,maxWidth:340}} onClick={e => e.stopPropagation()}>
        <h3 style={{color:'#fff',margin:'0 0 8px'}}>Confirm Delete</h3>
        <p style={{color:'rgba(255,255,255,0.6)',fontSize:14,margin:'0 0 16px'}}>Are you sure? This cannot be undone.</p>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => {setOpen(false);setResult('no');}}>Cancel</button><button style={{...ui.btn,...ui.btnDanger,...ui.btnSm}} onClick={() => {setOpen(false);setResult('yes');}}>Delete</button></div>
      </div></div>}
    </div>
  );
}

function StatusIndicatorDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Status Indicators</h4>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[{l:'Online',c:'#4caf50'},{l:'Away',c:'#ff9800'},{l:'Busy',c:'#ef5350'},{l:'Offline',c:'#888'},{l:'Do Not Disturb',c:'#e91e63'}].map(st => <div key={st.l} style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:10,height:10,borderRadius:'50%',background:st.c,boxShadow:'0 0 6px '+st.c+'66'}} /><span style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>{st.l}</span></div>)}
      </div>
    </div>
  );
}

function ProgressStepsDemo() {
  const [step, setStep] = useState(2);
  const steps = ['Account','Profile','Settings','Review'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Progress Steps</h4>
      <div style={{display:'flex',alignItems:'center',maxWidth:400}}>
        {steps.map((s,i) => <React.Fragment key={s}>
          <div onClick={() => setStep(i)} style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',minWidth:60}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:i<=step?'#2196f3':'rgba(255,255,255,0.1)',color:i<=step?'#fff':'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{i<step?'v':i+1}</div>
            <span style={{fontSize:10,color:i<=step?'#2196f3':'rgba(255,255,255,0.3)',marginTop:4}}>{s}</span>
          </div>
          {i < steps.length-1 && <div style={{flex:1,height:2,background:i<step?'#2196f3':'rgba(255,255,255,0.1)',margin:'0 4px'}} />}
        </React.Fragment>)}
      </div>
    </div>
  );
}

function NotificationBellDemo() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(3);
  const notifs = [{t:'New message from Alice',time:'2m ago'},{t:'Your report is ready',time:'1h ago'},{t:'System update available',time:'3h ago'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Notification Bell</h4>
      <div style={{position:'relative',display:'inline-block'}}>
        <button onClick={() => {setOpen(!open);setCount(0);}} style={{width:40,height:40,borderRadius:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',fontSize:18,cursor:'pointer',position:'relative'}}>B
          {count > 0 && <span style={{position:'absolute',top:-4,right:-4,width:18,height:18,borderRadius:9,background:'#ef5350',fontSize:10,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{count}</span>}
        </button>
        {open && <div style={{...ui.dropdown,right:0,left:'auto',minWidth:260}}>
          <div style={{padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:600,color:'#fff',fontSize:13}}>Notifications</div>
          {notifs.map((n,i) => <div key={i} style={{...ui.dropdownItem,display:'flex',justifyContent:'space-between'}}><span>{n.t}</span><span style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>{n.time}</span></div>)}
        </div>}
      </div>
    </div>
  );
}

function ErrorBoundaryDemo() {
  const [err, setErr] = useState(true);
  return (
    <div style={demo.wrap}>
      {err ? <div style={{textAlign:'center',padding:32,background:'rgba(239,83,80,0.05)',borderRadius:12,border:'1px solid rgba(239,83,80,0.2)'}}>
        <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(239,83,80,0.1)',margin:'0 auto 12px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#ef5350'}}>!</div>
        <h3 style={{color:'#ef5350',margin:'0 0 8px'}}>Something went wrong</h3>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,margin:'0 0 16px'}}>An unexpected error occurred.</p>
        <button style={{...ui.btn,...ui.btnDanger}} onClick={() => setErr(false)}>Retry</button>
      </div> : <div style={{textAlign:'center',padding:32,color:'#4caf50',fontSize:14}}>Content loaded successfully! <button style={{...ui.btn,...ui.btnOutline,...ui.btnSm,marginLeft:8}} onClick={() => setErr(true)}>Simulate Error</button></div>}
    </div>
  );
}

// ============ COMPONENT DEMOS: SURFACES (56-65) ============

function PaperDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Elevation Levels</h4>
      <div style={demo.row}>
        {[0,1,2,3,4].map(e => <div key={e} style={{width:100,height:80,borderRadius:8,background:'rgba(255,255,255,0.03)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:12,boxShadow:'0 '+e*2+'px '+e*6+'px rgba(0,0,0,'+(0.1+e*0.1)+')',border:'1px solid rgba(255,255,255,'+(0.04+e*0.02)+')'}}>Level {e}</div>)}
      </div>
    </div>
  );
}

function AppBarDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Top Navigation Bar</h4>
      <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{color:'#2196f3',fontWeight:700,fontSize:16}}>AppLogo</span></div>
        <div style={{display:'flex',gap:16}}>{['Home','About','Contact'].map(l => <span key={l} style={{color:'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer'}}>{l}</span>)}</div>
        <div style={{width:32,height:32,borderRadius:'50%',background:'#2196f3',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13}}>U</div>
      </div>
    </div>
  );
}

function ToolbarDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Toolbar</h4>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 12px',display:'flex',alignItems:'center',gap:8,border:'1px solid rgba(255,255,255,0.06)'}}>
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>B</button>
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>I</button>
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>U</button>
        <div style={{width:1,height:24,background:'rgba(255,255,255,0.1)',margin:'0 4px'}} />
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>L</button>
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>C</button>
        <button style={{...ui.btn,...ui.btnSm,...ui.btnSecondary}}>R</button>
        <div style={{flex:1}} />
        <button style={{...ui.btn,...ui.btnSm,...ui.btnPrimary}}>Save</button>
      </div>
    </div>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => setOpen(true)}>Open Drawer</button>
      {open && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000}} onClick={() => setOpen(false)}>
        <div style={{position:'absolute',top:0,right:0,bottom:0,width:300,background:'#1e1e3a',padding:24,borderLeft:'1px solid rgba(255,255,255,0.08)',boxShadow:'-4px 0 20px rgba(0,0,0,0.3)'}} onClick={e => e.stopPropagation()}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h3 style={{color:'#fff',margin:0}}>Drawer Panel</h3><button style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:18,cursor:'pointer'}} onClick={() => setOpen(false)}>x</button></div>
          {['Dashboard','Profile','Settings','Help'].map(i => <div key={i} style={{padding:'10px 0',color:'rgba(255,255,255,0.6)',fontSize:14,borderBottom:'1px solid rgba(255,255,255,0.06)',cursor:'pointer'}}>{i}</div>)}
        </div>
      </div>}
    </div>
  );
}

function FABDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Floating Action Buttons</h4>
      <div style={demo.row}>
        <button style={{width:56,height:56,borderRadius:'50%',background:'#2196f3',border:'none',color:'#fff',fontSize:24,cursor:'pointer',boxShadow:'0 4px 12px rgba(33,150,243,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
        <button style={{width:48,height:48,borderRadius:'50%',background:'#4caf50',border:'none',color:'#fff',fontSize:20,cursor:'pointer',boxShadow:'0 4px 12px rgba(76,175,80,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>v</button>
        <button style={{width:40,height:40,borderRadius:'50%',background:'#e91e63',border:'none',color:'#fff',fontSize:16,cursor:'pointer',boxShadow:'0 4px 12px rgba(233,30,99,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>*</button>
      </div>
      <h4 style={demo.label}>Extended FAB</h4>
      <button style={{padding:'12px 24px',borderRadius:28,background:'#2196f3',border:'none',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 4px 12px rgba(33,150,243,0.4)',display:'flex',alignItems:'center',gap:8}}>+ Add New</button>
    </div>
  );
}

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => setOpen(!open)}>Toggle Bottom Sheet</button>
      {open && <div style={{marginTop:12,background:'rgba(255,255,255,0.04)',borderRadius:'12px 12px 0 0',border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden'}}>
        <div style={{width:40,height:4,borderRadius:2,background:'rgba(255,255,255,0.2)',margin:'8px auto'}} />
        <div style={{padding:16}}>
          <h4 style={{color:'#fff',margin:'0 0 8px'}}>Bottom Sheet</h4>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>This is a pull-up bottom panel content area.</p>
          {['Option 1','Option 2','Option 3'].map(o => <div key={o} style={{padding:'10px 0',color:'rgba(255,255,255,0.6)',fontSize:14,borderBottom:'1px solid rgba(255,255,255,0.06)',cursor:'pointer'}}>{o}</div>)}
        </div>
      </div>}
    </div>
  );
}

function PopoverDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Click Popover</h4>
      <div style={{position:'relative',display:'inline-block'}}>
        <button style={{...ui.btn,...ui.btnPrimary}} onClick={() => setOpen(!open)}>Toggle Popover</button>
        {open && <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,background:'#1e1e3a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:16,minWidth:200,boxShadow:'0 8px 24px rgba(0,0,0,0.3)',zIndex:100}}>
          <h4 style={{color:'#fff',margin:'0 0 8px',fontSize:14}}>Popover Content</h4>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,margin:0}}>This content appears on click.</p>
        </div>}
      </div>
    </div>
  );
}

function GlassCardDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Glassmorphism Cards</h4>
      <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
        <div style={{background:'rgba(255,255,255,0.05)',backdropFilter:'blur(10px)',borderRadius:16,padding:24,border:'1px solid rgba(255,255,255,0.1)',minWidth:200}}>
          <h4 style={{color:'#fff',margin:'0 0 8px'}}>Glass Card</h4>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,margin:0}}>Frosted glass effect with blur.</p>
        </div>
        <div style={{background:'linear-gradient(135deg,rgba(33,150,243,0.1),rgba(156,39,176,0.1))',backdropFilter:'blur(10px)',borderRadius:16,padding:24,border:'1px solid rgba(255,255,255,0.08)',minWidth:200}}>
          <h4 style={{color:'#fff',margin:'0 0 8px'}}>Gradient Glass</h4>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,margin:0}}>With subtle gradient tint.</p>
        </div>
      </div>
    </div>
  );
}

function CollapsiblePanelDemo() {
  const [panels, setPanels] = useState({a:true,b:false});
  return (
    <div style={demo.wrap}>
      {[{k:'a',t:'Panel One',c:'Content for the first collapsible panel goes here.'},{k:'b',t:'Panel Two',c:'Content for the second collapsible panel goes here.'}].map(p =>
        <div key={p.k} style={{background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',marginBottom:8,overflow:'hidden'}}>
          <div onClick={() => setPanels({...panels,[p.k]:!panels[p.k]})} style={{padding:'12px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{color:'#fff',fontWeight:600,fontSize:14}}>{p.t}</span><span style={{color:'rgba(255,255,255,0.4)',transform:panels[p.k]?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s'}}>V</span></div>
          {panels[p.k] && <div style={{padding:'0 16px 12px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{p.c}</div>}
        </div>
      )}
    </div>
  );
}

function SplitPaneDemo() {
  const [split, setSplit] = useState(50);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Resizable Split View</h4>
      <div style={{display:'flex',height:150,borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{width:split+'%',background:'rgba(33,150,243,0.05)',padding:12,borderRight:'2px solid rgba(255,255,255,0.1)',overflow:'hidden'}}><div style={{color:'#fff',fontSize:13,fontWeight:600}}>Left Panel</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:4}}>{split}%</div></div>
        <div style={{flex:1,background:'rgba(76,175,80,0.05)',padding:12}}><div style={{color:'#fff',fontSize:13,fontWeight:600}}>Right Panel</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:4}}>{100-split}%</div></div>
      </div>
      <input type="range" min="20" max="80" value={split} onChange={e => setSplit(+e.target.value)} style={{width:200,marginTop:8}} />
    </div>
  );
}

// ============ COMPONENT DEMOS: NAVIGATION (66-85) ============

function TabsDemo() {
  const [tab, setTab] = useState(0);
  const [vtab, setVtab] = useState(0);
  const tabs = ['Dashboard','Settings','Profile'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Basic Tabs</h4>
      <div style={{display:'flex', borderBottom:'1px solid rgba(255,255,255,0.1)', marginBottom:12}}>
        {tabs.map((t,i) => <button key={t} onClick={() => setTab(i)} style={{...ui.tab, color: tab===i?'#2196f3':'rgba(255,255,255,0.4)', borderBottom: tab===i?'2px solid #2196f3':'2px solid transparent'}}>{t}</button>)}
      </div>
      <div style={{color:'rgba(255,255,255,0.6)', fontSize:14}}>{['Welcome to your dashboard.','Manage your preferences.','View your profile.'][tab]}</div>
      <h4 style={demo.label}>Icon Tabs</h4>
      <div style={{display:'flex',gap:4}}>
        {[{l:'Home',i:'H'},{l:'Search',i:'S'},{l:'User',i:'U'}].map((t,i) => <button key={t.l} onClick={() => setVtab(i)} style={{...ui.btn,...ui.btnSm,background:vtab===i?'#2196f3':'rgba(255,255,255,0.04)',color:vtab===i?'#fff':'rgba(255,255,255,0.4)',border:'none'}}>{t.i} {t.l}</button>)}
      </div>
    </div>
  );
}

function BreadcrumbDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Standard</h4>
      <div style={{display:'flex',gap:8,alignItems:'center',fontSize:13}}>
        {['Home','Components','Breadcrumb'].map((b,i,a) => <React.Fragment key={b}><span style={{color:i<a.length-1?'#2196f3':'rgba(255,255,255,0.6)',cursor:i<a.length-1?'pointer':'default'}}>{b}</span>{i<a.length-1 && <span style={{color:'rgba(255,255,255,0.3)'}}>/</span>}</React.Fragment>)}
      </div>
      <h4 style={demo.label}>With Icons</h4>
      <div style={{display:'flex',gap:8,alignItems:'center',fontSize:13}}>
        {[{l:'Home',i:'~'},{l:'Users',i:'@'},{l:'Profile',i:'#'}].map((b,i,a) => <React.Fragment key={b.l}><span style={{color:i<a.length-1?'#2196f3':'rgba(255,255,255,0.6)',cursor:i<a.length-1?'pointer':'default'}}>{b.i} {b.l}</span>{i<a.length-1 && <span style={{color:'rgba(255,255,255,0.3)'}}>></span>}</React.Fragment>)}
      </div>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Page Numbers</h4>
      <div style={{display:'flex',gap:4}}>
        <button style={{...ui.pageBtn, opacity:page===1?0.3:1}} onClick={() => setPage(Math.max(1,page-1))}>&lt;</button>
        {[1,2,3,4,5].map(p => <button key={p} style={{...ui.pageBtn, background:page===p?'#2196f3':'rgba(255,255,255,0.06)', color:page===p?'#fff':'rgba(255,255,255,0.5)'}} onClick={() => setPage(p)}>{p}</button>)}
        <button style={{...ui.pageBtn}} onClick={() => setPage(Math.min(5,page+1))}>&gt;</button>
      </div>
      <h4 style={demo.label}>With Dots</h4>
      <div style={{display:'flex',gap:4,alignItems:'center'}}>
        <button style={{...ui.pageBtn}} onClick={() => setPage(Math.max(1,page-1))}>&lt;</button>
        <button style={{...ui.pageBtn,background:page===1?'#2196f3':'rgba(255,255,255,0.06)',color:page===1?'#fff':'rgba(255,255,255,0.5)'}} onClick={() => setPage(1)}>1</button>
        <span style={{color:'rgba(255,255,255,0.3)',padding:'0 4px'}}>...</span>
        <button style={{...ui.pageBtn,background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.5)'}} onClick={() => setPage(5)}>5</button>
        <button style={{...ui.pageBtn}} onClick={() => setPage(Math.min(5,page+1))}>&gt;</button>
      </div>
    </div>
  );
}

function StepperDemo() {
  const [step, setStep] = useState(1);
  const steps = ['Cart','Shipping','Payment','Confirm'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Horizontal Stepper</h4>
      <div style={{display:'flex',alignItems:'center',maxWidth:500,marginBottom:16}}>
        {steps.map((s,i) => <React.Fragment key={s}><div style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:70}}><div style={{width:32,height:32,borderRadius:'50%',background:i<=step?'#2196f3':'rgba(255,255,255,0.08)',color:i<=step?'#fff':'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,transition:'all 0.3s'}}>{i<step?'v':i+1}</div><span style={{fontSize:11,color:i<=step?'#2196f3':'rgba(255,255,255,0.3)',marginTop:4}}>{s}</span></div>{i<steps.length-1 && <div style={{flex:1,height:2,background:i<step?'#2196f3':'rgba(255,255,255,0.08)',margin:'0 4px',transition:'background 0.3s'}} />}</React.Fragment>)}
      </div>
      <div style={demo.row}><button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => setStep(Math.max(0,step-1))}>Back</button><button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm}} onClick={() => setStep(Math.min(3,step+1))}>Next</button></div>
    </div>
  );
}

function BottomNavigationDemo() {
  const [active, setActive] = useState(0);
  const items = [{l:'Home',i:'H'},{l:'Search',i:'S'},{l:'Add',i:'+'},{l:'Inbox',i:'I'},{l:'Profile',i:'P'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Bottom Navigation</h4>
      <div style={{display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden',maxWidth:400}}>
        {items.map((it,i) => <div key={it.l} onClick={() => setActive(i)} style={{flex:1,padding:'10px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',background:active===i?'rgba(33,150,243,0.1)':'transparent',transition:'background 0.2s'}}><span style={{fontSize:18,color:active===i?'#2196f3':'rgba(255,255,255,0.4)'}}>{it.i}</span><span style={{fontSize:10,color:active===i?'#2196f3':'rgba(255,255,255,0.3)'}}>{it.l}</span></div>)}
      </div>
    </div>
  );
}

function MenuDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Context Menu</h4>
      <div style={{position:'relative',display:'inline-block'}}>
        <button style={{...ui.btn,...ui.btnSecondary}} onClick={() => setOpen(!open)}>Open Menu</button>
        {open && <div style={{...ui.dropdown,minWidth:200}}>
          {[{l:'Cut',k:'Ctrl+X'},{l:'Copy',k:'Ctrl+C'},{l:'Paste',k:'Ctrl+V'},{l:'---'},{l:'Delete',k:'Del'},{l:'Select All',k:'Ctrl+A'}].map((it,i) =>
            it.l==='---' ? <div key={i} style={{height:1,background:'rgba(255,255,255,0.06)',margin:'4px 0'}} /> :
            <div key={i} style={{...ui.dropdownItem,display:'flex',justifyContent:'space-between'}} onClick={() => setOpen(false)}><span>{it.l}</span><span style={{color:'rgba(255,255,255,0.25)',fontSize:11}}>{it.k}</span></div>
          )}
        </div>}
      </div>
    </div>
  );
}

function SpeedDialDemo() {
  const [open, setOpen] = useState(false);
  const actions = [{l:'Copy',c:'#2196f3'},{l:'Save',c:'#4caf50'},{l:'Print',c:'#ff9800'},{l:'Share',c:'#e91e63'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Speed Dial</h4>
      <div style={{position:'relative',display:'inline-flex',flexDirection:'column',alignItems:'center'}}>
        {open && <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:8}}>
          {actions.map(a => <button key={a.l} style={{width:40,height:40,borderRadius:'50%',background:a.c,border:'none',color:'#fff',fontSize:12,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>{a.l[0]}</button>)}
        </div>}
        <button onClick={() => setOpen(!open)} style={{width:56,height:56,borderRadius:'50%',background:'#2196f3',border:'none',color:'#fff',fontSize:24,cursor:'pointer',boxShadow:'0 4px 12px rgba(33,150,243,0.4)',transition:'transform 0.2s',transform:open?'rotate(45deg)':'rotate(0)'}}>+</button>
      </div>
    </div>
  );
}

function NavBarDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid rgba(255,255,255,0.06)'}}>
        <span style={{color:'#fff',fontWeight:700,fontSize:16}}>Brand</span>
        <div style={{display:'flex',gap:16}}>{['Home','About','Blog','Contact'].map(l => <span key={l} style={{color:'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer'}}>{l}</span>)}</div>
        <button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm}}>Sign Up</button>
      </div>
    </div>
  );
}

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const items = [{l:'Dashboard',i:'D'},{l:'Analytics',i:'A'},{l:'Users',i:'U'},{l:'Settings',i:'S'}];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Collapsible Sidebar</h4>
      <div style={{display:'flex',gap:0,borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{width:collapsed?50:180,background:'rgba(255,255,255,0.03)',transition:'width 0.3s',overflow:'hidden',borderRight:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{padding:8}}><button onClick={() => setCollapsed(!collapsed)} style={{...ui.btn,...ui.btnText,...ui.btnSm,width:'100%'}}>{collapsed?'>':'<'}</button></div>
          {items.map(it => <div key={it.l} style={{padding:collapsed?'8px':'8px 12px',display:'flex',alignItems:'center',gap:8,color:'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer',whiteSpace:'nowrap'}}><span style={{fontWeight:700,width:20,textAlign:'center'}}>{it.i}</span>{!collapsed && it.l}</div>)}
        </div>
        <div style={{flex:1,padding:16,minHeight:120}}><div style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>Main content area</div></div>
      </div>
    </div>
  );
}

function LinkDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Link Styles</h4>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <span style={{color:'#2196f3',cursor:'pointer',fontSize:14}}>Standard Link</span>
        <span style={{color:'#2196f3',cursor:'pointer',fontSize:14,textDecoration:'underline'}}>Underlined Link</span>
        <span style={{color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:14}}>External Link ^</span>
        <span style={{color:'#ef5350',cursor:'pointer',fontSize:14}}>Danger Link</span>
        <span style={{color:'rgba(255,255,255,0.3)',fontSize:14}}>Disabled Link</span>
      </div>
    </div>
  );
}

function ScrollToTopDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Scroll to Top Button</h4>
      <p style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>Appears when scrolling down the page.</p>
      <button style={{width:44,height:44,borderRadius:'50%',background:'#2196f3',border:'none',color:'#fff',fontSize:16,cursor:'pointer',boxShadow:'0 4px 12px rgba(33,150,243,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>^</button>
    </div>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const cmds = ['Go to Dashboard','Open Settings','Create New File','Search Users','Toggle Dark Mode'];
  const filtered = cmds.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={demo.wrap}>
      <button style={{...ui.btn,...ui.btnOutline}} onClick={() => setOpen(true)}>Ctrl+K to Open</button>
      {open && <div style={ui.modalOverlay} onClick={() => setOpen(false)}><div style={{...ui.modalBox,maxWidth:480,padding:0}} onClick={e => e.stopPropagation()}>
        <input autoFocus style={{...ui.input,borderRadius:'12px 12px 0 0',border:'none',borderBottom:'1px solid rgba(255,255,255,0.08)',fontSize:16,padding:16}} placeholder="Type a command..." value={q} onChange={e => setQ(e.target.value)} />
        <div style={{maxHeight:200,overflow:'auto'}}>
          {filtered.map(c => <div key={c} style={{padding:'10px 16px',color:'rgba(255,255,255,0.6)',fontSize:14,cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.04)'}} onClick={() => setOpen(false)}>{c}</div>)}
          {filtered.length===0 && <div style={{padding:16,color:'rgba(255,255,255,0.3)',fontSize:14,textAlign:'center'}}>No results</div>}
        </div>
      </div></div>}
    </div>
  );
}

function MegaMenuDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={demo.wrap}>
      <div style={{position:'relative'}}>
        <button style={{...ui.btn,...ui.btnSecondary}} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>Products V</button>
        {open && <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} style={{position:'absolute',top:'100%',left:0,background:'#1e1e3a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:16,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,minWidth:400,boxShadow:'0 8px 24px rgba(0,0,0,0.3)',zIndex:100}}>
          {['Frontend','Backend','DevOps'].map(cat => <div key={cat}><div style={{color:'#2196f3',fontSize:12,fontWeight:600,marginBottom:8,textTransform:'uppercase'}}>{cat}</div>{['Tool A','Tool B','Tool C'].map(t => <div key={t} style={{color:'rgba(255,255,255,0.6)',fontSize:13,padding:'4px 0',cursor:'pointer'}}>{t}</div>)}</div>)}
        </div>}
      </div>
    </div>
  );
}

function VerticalNavDemo() {
  const [active, setActive] = useState(0);
  const items = [{l:'Dashboard',i:'D'},{l:'Analytics',i:'A'},{l:'Messages',i:'M'},{l:'Calendar',i:'C'},{l:'Settings',i:'S'}];
  return (
    <div style={demo.wrap}>
      <div style={{maxWidth:220,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',padding:8}}>
        {items.map((it,i) => <div key={it.l} onClick={() => setActive(i)} style={{padding:'8px 12px',borderRadius:6,display:'flex',alignItems:'center',gap:8,cursor:'pointer',background:active===i?'rgba(33,150,243,0.15)':'transparent',color:active===i?'#2196f3':'rgba(255,255,255,0.6)',fontSize:13,fontWeight:active===i?600:400,marginBottom:2}}><span style={{fontWeight:700}}>{it.i}</span>{it.l}</div>)}
      </div>
    </div>
  );
}

function WizardDemo() {
  const [step, setStep] = useState(0);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Multi-Step Form</h4>
      <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',padding:20,maxWidth:400}}>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {['Details','Address','Review'].map((s,i) => <div key={s} style={{flex:1,textAlign:'center'}}><div style={{width:24,height:24,borderRadius:'50%',background:i<=step?'#2196f3':'rgba(255,255,255,0.08)',color:i<=step?'#fff':'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,margin:'0 auto 4px'}}>{i<step?'v':i+1}</div><span style={{fontSize:10,color:i<=step?'#2196f3':'rgba(255,255,255,0.3)'}}>{s}</span></div>)}
        </div>
        {step===0 && <div><input style={{...ui.input,marginBottom:8}} placeholder="Full Name" /><input style={ui.input} placeholder="Email" /></div>}
        {step===1 && <div><input style={{...ui.input,marginBottom:8}} placeholder="Address" /><input style={ui.input} placeholder="City" /></div>}
        {step===2 && <div style={{color:'rgba(255,255,255,0.6)',fontSize:14}}>Review your information and confirm.</div>}
        <div style={{display:'flex',justifyContent:'space-between',marginTop:16}}><button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}} onClick={() => setStep(Math.max(0,step-1))} disabled={step===0}>Back</button><button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm}} onClick={() => setStep(Math.min(2,step+1))}>{step===2?'Submit':'Next'}</button></div>
      </div>
    </div>
  );
}

function SegmentedControlDemo() {
  const [val, setVal] = useState(0);
  const [val2, setVal2] = useState(1);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Segmented Control</h4>
      <div style={{display:'inline-flex',background:'rgba(255,255,255,0.06)',borderRadius:8,padding:3}}>
        {['Daily','Weekly','Monthly'].map((s,i) => <button key={s} onClick={() => setVal(i)} style={{padding:'6px 16px',borderRadius:6,border:'none',fontSize:13,fontWeight:600,cursor:'pointer',background:val===i?'#2196f3':'transparent',color:val===i?'#fff':'rgba(255,255,255,0.5)',transition:'all 0.2s'}}>{s}</button>)}
      </div>
      <h4 style={demo.label}>Pill Style</h4>
      <div style={{display:'inline-flex',background:'rgba(255,255,255,0.06)',borderRadius:20,padding:3}}>
        {['List','Grid','Map'].map((s,i) => <button key={s} onClick={() => setVal2(i)} style={{padding:'6px 16px',borderRadius:20,border:'none',fontSize:13,fontWeight:600,cursor:'pointer',background:val2===i?'#4caf50':'transparent',color:val2===i?'#fff':'rgba(255,255,255,0.5)',transition:'all 0.2s'}}>{s}</button>)}
      </div>
    </div>
  );
}

function BackButtonDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Back Button Styles</h4>
      <div style={demo.row}>
        <button style={{...ui.btn,...ui.btnOutline,...ui.btnSm}}>&lt; Back</button>
        <button style={{...ui.btn,...ui.btnText,...ui.btnSm,color:'rgba(255,255,255,0.5)'}}>&lt;- Go Back</button>
        <button style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>&lt;</button>
      </div>
    </div>
  );
}

function TabBarDemo() {
  const [active, setActive] = useState(0);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Mobile Tab Bar</h4>
      <div style={{display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',maxWidth:360}}>
        {[{l:'Home',i:'H'},{l:'Explore',i:'E'},{l:'Cart',i:'C'},{l:'Profile',i:'P'}].map((it,i) => <div key={it.l} onClick={() => setActive(i)} style={{flex:1,padding:'10px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',borderBottom:active===i?'2px solid #2196f3':'2px solid transparent'}}><span style={{fontSize:16,color:active===i?'#2196f3':'rgba(255,255,255,0.4)'}}>{it.i}</span><span style={{fontSize:10,color:active===i?'#2196f3':'rgba(255,255,255,0.3)'}}>{it.l}</span></div>)}
      </div>
    </div>
  );
}

function DropdownMenuDemo() {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);
  return (
    <div style={demo.wrap}>
      <div style={{position:'relative',display:'inline-block'}}>
        <button style={{...ui.btn,...ui.btnSecondary}} onClick={() => setOpen(!open)}>Menu V</button>
        {open && <div style={ui.dropdown}>
          <div style={ui.dropdownItem} onClick={() => setOpen(false)}>New File</div>
          <div style={ui.dropdownItem} onClick={() => setOpen(false)}>Open File</div>
          <div style={{...ui.dropdownItem,position:'relative'}} onMouseEnter={() => setSub(true)} onMouseLeave={() => setSub(false)}>
            Export >
            {sub && <div style={{...ui.dropdown,left:'100%',top:0}}><div style={ui.dropdownItem}>PDF</div><div style={ui.dropdownItem}>CSV</div><div style={ui.dropdownItem}>JSON</div></div>}
          </div>
          <div style={{height:1,background:'rgba(255,255,255,0.06)',margin:'4px 0'}} />
          <div style={{...ui.dropdownItem,color:'#ef5350'}}>Delete</div>
        </div>}
      </div>
    </div>
  );
}

function FilterBarDemo() {
  const [filters, setFilters] = useState(['Active','Admin']);
  const allFilters = ['Active','Inactive','Admin','Editor','Viewer'];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Active Filters</h4>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        {filters.map(f => <span key={f} style={{...ui.chip,background:'rgba(33,150,243,0.2)',color:'#64b5f6'}}>{f} <span style={{cursor:'pointer',marginLeft:4}} onClick={() => setFilters(filters.filter(x=>x!==f))}>x</span></span>)}
        {filters.length > 0 && <button style={{...ui.btn,...ui.btnText,...ui.btnSm,color:'#ef5350'}} onClick={() => setFilters([])}>Clear All</button>}
      </div>
      <h4 style={demo.label}>Add Filters</h4>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {allFilters.filter(f => !filters.includes(f)).map(f => <span key={f} onClick={() => setFilters([...filters,f])} style={{...ui.chip,cursor:'pointer'}}>+ {f}</span>)}
      </div>
    </div>
  );
}

// ============ COMPONENT DEMOS: LAYOUT (86-100) ============

function GridDemo() {
  const [cols, setCols] = useState(3);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Responsive Grid</h4>
      <div style={demo.row}>{[2,3,4].map(c => <button key={c} onClick={() => setCols(c)} style={{...ui.btn,...ui.btnSm,background:cols===c?'#2196f3':'rgba(255,255,255,0.06)',color:cols===c?'#fff':'rgba(255,255,255,0.5)',border:'none'}}>{c} Cols</button>)}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat('+cols+',1fr)',gap:8,marginTop:8}}>
        {Array(6).fill(0).map((_,i) => <div key={i} style={{background:'rgba(33,150,243,0.1)',borderRadius:6,padding:16,textAlign:'center',color:'rgba(255,255,255,0.5)',fontSize:12,border:'1px solid rgba(33,150,243,0.2)'}}>Cell {i+1}</div>)}
      </div>
    </div>
  );
}

function StackDemo() {
  const [dir, setDir] = useState('column');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Stack Direction</h4>
      <div style={demo.row}>{['column','row'].map(d => <button key={d} onClick={() => setDir(d)} style={{...ui.btn,...ui.btnSm,background:dir===d?'#2196f3':'rgba(255,255,255,0.06)',color:dir===d?'#fff':'rgba(255,255,255,0.5)',border:'none',textTransform:'capitalize'}}>{d}</button>)}</div>
      <div style={{display:'flex',flexDirection:dir,gap:8,marginTop:8}}>
        {[1,2,3,4].map(i => <div key={i} style={{background:'rgba(76,175,80,0.1)',borderRadius:6,padding:'10px 16px',color:'rgba(255,255,255,0.5)',fontSize:12,border:'1px solid rgba(76,175,80,0.2)',textAlign:'center'}}>Item {i}</div>)}
      </div>
    </div>
  );
}

function ContainerDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Max-Width Containers</h4>
      {[{w:200,l:'sm'},{w:400,l:'md'},{w:'100%',l:'fluid'}].map(c => <div key={c.l} style={{maxWidth:c.w,width:'100%',margin:'0 auto 8px',background:'rgba(255,255,255,0.04)',borderRadius:6,padding:12,textAlign:'center',border:'1px dashed rgba(255,255,255,0.1)'}}><span style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>Container {c.l} ({typeof c.w==='number'?c.w+'px':c.w})</span></div>)}
    </div>
  );
}

function AspectRatioDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Aspect Ratios</h4>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        {[{r:'1/1',l:'1:1',w:80},{r:'16/9',l:'16:9',w:120},{r:'4/3',l:'4:3',w:100}].map(a => <div key={a.l} style={{width:a.w,aspectRatio:a.r,background:'rgba(233,30,99,0.1)',borderRadius:6,border:'1px solid rgba(233,30,99,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>{a.l}</span></div>)}
      </div>
    </div>
  );
}

function MasonryDemo() {
  const heights = [80,120,60,100,140,70,90,110];
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Masonry Grid</h4>
      <div style={{columns:3,gap:8,maxWidth:400}}>
        {heights.map((h,i) => <div key={i} style={{height:h,background:['rgba(33,150,243,0.15)','rgba(76,175,80,0.15)','rgba(233,30,99,0.15)','rgba(255,152,0,0.15)'][i%4],borderRadius:6,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)',fontSize:11,border:'1px solid rgba(255,255,255,0.06)',breakInside:'avoid'}}>{h}px</div>)}
      </div>
    </div>
  );
}

function ResponsiveDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Responsive Breakpoints (Visual)</h4>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {[{l:'Mobile',w:120,c:'#ef5350'},{l:'Tablet',w:200,c:'#ff9800'},{l:'Desktop',w:320,c:'#4caf50'},{l:'Wide',w:'100%',c:'#2196f3'}].map(b => <div key={b.l} style={{width:b.w,maxWidth:'100%',background:b.c+'22',borderRadius:6,padding:'8px 12px',border:'1px solid '+b.c+'44',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{color:b.c,fontSize:12,fontWeight:600}}>{b.l}</span><span style={{color:'rgba(255,255,255,0.3)',fontSize:10}}>{typeof b.w==='number'?b.w+'px':'100%'}</span></div>)}
      </div>
    </div>
  );
}

function SpacerDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Spacing Scale</h4>
      {[4,8,12,16,24,32].map(sp => <div key={sp} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
        <span style={{color:'rgba(255,255,255,0.4)',fontSize:11,width:30}}>{sp}px</span>
        <div style={{width:sp,height:16,background:'#2196f3',borderRadius:2}} />
      </div>)}
    </div>
  );
}

function CenterDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Centered Content</h4>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:120,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px dashed rgba(255,255,255,0.1)'}}>
        <div style={{textAlign:'center'}}><div style={{color:'#fff',fontSize:14,fontWeight:600}}>Centered Box</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>Horizontally and vertically centered</div></div>
      </div>
    </div>
  );
}

function WrapDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Flex Wrap</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {Array(12).fill(0).map((_,i) => <div key={i} style={{background:'rgba(156,39,176,0.15)',borderRadius:6,padding:'8px 16px',color:'rgba(255,255,255,0.5)',fontSize:12,border:'1px solid rgba(156,39,176,0.2)'}}>Tag {i+1}</div>)}
      </div>
    </div>
  );
}

function FlexDemo() {
  const [justify, setJustify] = useState('center');
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Justify Content</h4>
      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
        {['flex-start','center','flex-end','space-between','space-around'].map(j => <button key={j} onClick={() => setJustify(j)} style={{...ui.btn,...ui.btnSm,background:justify===j?'#2196f3':'rgba(255,255,255,0.06)',color:justify===j?'#fff':'rgba(255,255,255,0.5)',border:'none',fontSize:10}}>{j.replace('flex-','')}</button>)}
      </div>
      <div style={{display:'flex',justifyContent:justify,gap:8,padding:12,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px dashed rgba(255,255,255,0.1)'}}>
        {[1,2,3].map(i => <div key={i} style={{width:50,height:50,background:'rgba(33,150,243,0.15)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:12,border:'1px solid rgba(33,150,243,0.2)'}}>{i}</div>)}
      </div>
    </div>
  );
}

function StickyDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Sticky Header (scroll inside)</h4>
      <div style={{height:150,overflow:'auto',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{position:'sticky',top:0,background:'rgba(33,150,243,0.15)',padding:'8px 12px',color:'#2196f3',fontSize:13,fontWeight:600,zIndex:1,backdropFilter:'blur(10px)'}}>Sticky Header</div>
        {Array(10).fill(0).map((_,i) => <div key={i} style={{padding:'10px 12px',color:'rgba(255,255,255,0.5)',fontSize:13,borderBottom:'1px solid rgba(255,255,255,0.04)'}}>Scrollable row {i+1}</div>)}
      </div>
    </div>
  );
}

function OverlayDemo() {
  const [show, setShow] = useState(false);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Overlay Positioning</h4>
      <div style={{position:'relative',height:120,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
        <div style={{padding:16,color:'rgba(255,255,255,0.5)',fontSize:13}}>Base content layer</div>
        <button style={{...ui.btn,...ui.btnPrimary,...ui.btnSm,position:'absolute',bottom:12,right:12}} onClick={() => setShow(!show)}>Toggle Overlay</button>
        {show && <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14}}>Overlay Content</div>}
      </div>
    </div>
  );
}

function ZStackDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Layered Elements</h4>
      <div style={{position:'relative',height:120,width:200}}>
        <div style={{position:'absolute',top:0,left:0,width:120,height:80,background:'rgba(33,150,243,0.2)',borderRadius:8,border:'1px solid rgba(33,150,243,0.3)'}} />
        <div style={{position:'absolute',top:20,left:20,width:120,height:80,background:'rgba(76,175,80,0.2)',borderRadius:8,border:'1px solid rgba(76,175,80,0.3)'}} />
        <div style={{position:'absolute',top:40,left:40,width:120,height:80,background:'rgba(233,30,99,0.2)',borderRadius:8,border:'1px solid rgba(233,30,99,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:11}}>Top Layer</div>
      </div>
    </div>
  );
}

function ScrollAreaDemo() {
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Custom Scroll Area</h4>
      <div style={{height:160,overflow:'auto',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.02)'}}>
        {Array(15).fill(0).map((_,i) => <div key={i} style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.6)',fontSize:13,display:'flex',justifyContent:'space-between'}}><span>Item {i+1}</span><span style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>Detail</span></div>)}
      </div>
    </div>
  );
}

function ResizableDemo() {
  const [width, setWidth] = useState(250);
  return (
    <div style={demo.wrap}>
      <h4 style={demo.label}>Resizable Container</h4>
      <div style={{width:width,minWidth:100,maxWidth:500,background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',padding:16,position:'relative'}}>
        <div style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>Resizable box: {width}px wide</div>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:11,marginTop:4}}>Use the slider below to resize</div>
      </div>
      <input type="range" min="100" max="500" value={width} onChange={e => setWidth(+e.target.value)} style={{width:300,marginTop:8}} />
    </div>
  );
}

// ============ COMPONENT REGISTRY ============
const COMPONENTS = [
  { id:'button', name:'Button', icon:'\u25CF', cat:'inputs', comp: ButtonDemo },
  { id:'iconbutton', name:'IconButton', icon:'\u25CB', cat:'inputs', comp: IconButtonDemo },
  { id:'buttongroup', name:'ButtonGroup', icon:'\u2261', cat:'inputs', comp: ButtonGroupDemo },
  { id:'textfield', name:'TextField', icon:'T', cat:'inputs', comp: TextFieldDemo },
  { id:'select', name:'Select', icon:'\u25BE', cat:'inputs', comp: SelectDemo },
  { id:'checkbox', name:'Checkbox', icon:'\u2611', cat:'inputs', comp: CheckboxDemo },
  { id:'radio', name:'Radio', icon:'\u25C9', cat:'inputs', comp: RadioDemo },
  { id:'switch', name:'Switch', icon:'\u25C0', cat:'inputs', comp: SwitchDemo },
  { id:'slider', name:'Slider', icon:'\u2014', cat:'inputs', comp: SliderDemo },
  { id:'rating', name:'Rating', icon:'\u2605', cat:'inputs', comp: RatingDemo },
  { id:'autocomplete', name:'Autocomplete', icon:'A', cat:'inputs', comp: AutocompleteDemo },
  { id:'datepicker', name:'DatePicker', icon:'D', cat:'inputs', comp: DatePickerDemo },
  { id:'timepicker', name:'TimePicker', icon:'\u231A', cat:'inputs', comp: TimePickerDemo },
  { id:'fileupload', name:'FileUpload', icon:'\u2191', cat:'inputs', comp: FileUploadDemo },
  { id:'otpinput', name:'OTPInput', icon:'#', cat:'inputs', comp: OTPInputDemo },
  { id:'searchbar', name:'SearchBar', icon:'Q', cat:'inputs', comp: SearchBarDemo },
  { id:'colorpicker', name:'ColorPicker', icon:'\u25A0', cat:'inputs', comp: ColorPickerDemo },
  { id:'numberinput', name:'NumberInput', icon:'\u00B1', cat:'inputs', comp: NumberInputDemo },
  { id:'taginput', name:'TagInput', icon:'\u2295', cat:'inputs', comp: TagInputDemo },
  { id:'passwordstrength', name:'PasswordStrength', icon:'\u26BF', cat:'inputs', comp: PasswordStrengthDemo },
  { id:'typography', name:'Typography', icon:'Aa', cat:'display', comp: TypographyDemo },
  { id:'avatar', name:'Avatar', icon:'\u263A', cat:'display', comp: AvatarDemo },
  { id:'badge', name:'Badge', icon:'\u2B24', cat:'display', comp: BadgeDemo },
  { id:'chip', name:'Chip', icon:'~', cat:'display', comp: ChipDemo },
  { id:'divider', name:'Divider', icon:'\u2500', cat:'display', comp: DividerDemo },
  { id:'list', name:'List', icon:'\u2630', cat:'display', comp: ListDemo },
  { id:'table', name:'Table', icon:'\u2637', cat:'display', comp: TableDemo },
  { id:'tooltip', name:'Tooltip', icon:'\u24D8', cat:'display', comp: TooltipDemo },
  { id:'card', name:'Card', icon:'\u25A1', cat:'display', comp: CardDemo },
  { id:'imagelist', name:'ImageList', icon:'\u25A3', cat:'display', comp: ImageListDemo },
  { id:'timeline', name:'Timeline', icon:'\u2502', cat:'display', comp: TimelineDemo },
  { id:'treeview', name:'TreeView', icon:'\u251C', cat:'display', comp: TreeViewDemo },
  { id:'accordion', name:'Accordion', icon:'\u25B7', cat:'display', comp: AccordionDemo },
  { id:'datagrid', name:'DataGrid', icon:'\u2593', cat:'display', comp: DataGridDemo },
  { id:'emptystate', name:'EmptyState', icon:'?', cat:'display', comp: EmptyStateDemo },
  { id:'stat', name:'Stat', icon:'\u2197', cat:'display', comp: StatDemo },
  { id:'keyvalue', name:'KeyValue', icon:'=', cat:'display', comp: KeyValueDemo },
  { id:'usercard', name:'UserCard', icon:'\u2302', cat:'display', comp: UserCardDemo },
  { id:'pricetag', name:'PriceTag', icon:'$', cat:'display', comp: PriceTagDemo },
  { id:'codeblock', name:'CodeBlock', icon:'<>', cat:'display', comp: CodeBlockDemo },
  { id:'alert', name:'Alert', icon:'!', cat:'feedback', comp: AlertDemo },
  { id:'snackbar', name:'Snackbar', icon:'\u2328', cat:'feedback', comp: SnackbarDemo },
  { id:'dialog', name:'Dialog', icon:'\u25A2', cat:'feedback', comp: DialogDemo },
  { id:'circularprogress', name:'CircularProgress', icon:'O', cat:'feedback', comp: CircularProgressDemo },
  { id:'linearprogress', name:'LinearProgress', icon:'\u2501', cat:'feedback', comp: LinearProgressDemo },
  { id:'skeleton', name:'Skeleton', icon:'\u2592', cat:'feedback', comp: SkeletonDemo },
  { id:'loadingbutton', name:'LoadingButton', icon:'\u21BB', cat:'feedback', comp: LoadingButtonDemo },
  { id:'toast', name:'Toast', icon:'\u2709', cat:'feedback', comp: ToastDemo },
  { id:'banner', name:'Banner', icon:'\u2691', cat:'feedback', comp: BannerDemo },
  { id:'loadingoverlay', name:'LoadingOverlay', icon:'\u29B6', cat:'feedback', comp: LoadingOverlayDemo },
  { id:'confirmdialog', name:'ConfirmDialog', icon:'\u2753', cat:'feedback', comp: ConfirmDialogDemo },
  { id:'statusindicator', name:'StatusIndicator', icon:'\u25CF', cat:'feedback', comp: StatusIndicatorDemo },
  { id:'progresssteps', name:'ProgressSteps', icon:'\u2022', cat:'feedback', comp: ProgressStepsDemo },
  { id:'notificationbell', name:'NotificationBell', icon:'\u237E', cat:'feedback', comp: NotificationBellDemo },
  { id:'errorboundary', name:'ErrorBoundary', icon:'\u26A0', cat:'feedback', comp: ErrorBoundaryDemo },
  { id:'paper', name:'Paper', icon:'\u25AD', cat:'surfaces', comp: PaperDemo },
  { id:'appbar', name:'AppBar', icon:'\u2550', cat:'surfaces', comp: AppBarDemo },
  { id:'toolbar', name:'Toolbar', icon:'\u2630', cat:'surfaces', comp: ToolbarDemo },
  { id:'drawer', name:'Drawer', icon:'\u25E7', cat:'surfaces', comp: DrawerDemo },
  { id:'fab', name:'FAB', icon:'+', cat:'surfaces', comp: FABDemo },
  { id:'bottomsheet', name:'BottomSheet', icon:'\u25B3', cat:'surfaces', comp: BottomSheetDemo },
  { id:'popover', name:'Popover', icon:'\u25C7', cat:'surfaces', comp: PopoverDemo },
  { id:'glasscard', name:'GlassCard', icon:'\u25C8', cat:'surfaces', comp: GlassCardDemo },
  { id:'collapsiblepanel', name:'CollapsiblePanel', icon:'\u25B5', cat:'surfaces', comp: CollapsiblePanelDemo },
  { id:'splitpane', name:'SplitPane', icon:'\u2503', cat:'surfaces', comp: SplitPaneDemo },
  { id:'tabs', name:'Tabs', icon:'\u2599', cat:'navigation', comp: TabsDemo },
  { id:'breadcrumbs', name:'Breadcrumbs', icon:'/', cat:'navigation', comp: BreadcrumbDemo },
  { id:'pagination', name:'Pagination', icon:'\u00AB', cat:'navigation', comp: PaginationDemo },
  { id:'stepper', name:'Stepper', icon:'\u25B6', cat:'navigation', comp: StepperDemo },
  { id:'bottomnav', name:'BottomNavigation', icon:'\u2501', cat:'navigation', comp: BottomNavigationDemo },
  { id:'menu', name:'Menu', icon:'\u2630', cat:'navigation', comp: MenuDemo },
  { id:'speeddial', name:'SpeedDial', icon:'\u2600', cat:'navigation', comp: SpeedDialDemo },
  { id:'navbar', name:'NavBar', icon:'\u2261', cat:'navigation', comp: NavBarDemo },
  { id:'sidebar', name:'Sidebar', icon:'\u25E8', cat:'navigation', comp: SidebarDemo },
  { id:'link', name:'Link', icon:'\u2197', cat:'navigation', comp: LinkDemo },
  { id:'scrolltotop', name:'ScrollToTop', icon:'\u2191', cat:'navigation', comp: ScrollToTopDemo },
  { id:'commandpalette', name:'CommandPalette', icon:'\u2318', cat:'navigation', comp: CommandPaletteDemo },
  { id:'megamenu', name:'MegaMenu', icon:'\u25A4', cat:'navigation', comp: MegaMenuDemo },
  { id:'verticalnav', name:'VerticalNav', icon:'\u2502', cat:'navigation', comp: VerticalNavDemo },
  { id:'wizard', name:'Wizard', icon:'W', cat:'navigation', comp: WizardDemo },
  { id:'segmentedcontrol', name:'SegmentedControl', icon:'\u2504', cat:'navigation', comp: SegmentedControlDemo },
  { id:'backbutton', name:'BackButton', icon:'\u2190', cat:'navigation', comp: BackButtonDemo },
  { id:'tabbar', name:'TabBar', icon:'\u2505', cat:'navigation', comp: TabBarDemo },
  { id:'dropdownmenu', name:'DropdownMenu', icon:'\u25BE', cat:'navigation', comp: DropdownMenuDemo },
  { id:'filterbar', name:'FilterBar', icon:'F', cat:'navigation', comp: FilterBarDemo },
  { id:'grid', name:'Grid', icon:'\u2588', cat:'layout', comp: GridDemo },
  { id:'stack', name:'Stack', icon:'\u2261', cat:'layout', comp: StackDemo },
  { id:'container', name:'Container', icon:'[ ]', cat:'layout', comp: ContainerDemo },
  { id:'aspectratio', name:'AspectRatio', icon:'\u25AF', cat:'layout', comp: AspectRatioDemo },
  { id:'masonry', name:'Masonry', icon:'\u2593', cat:'layout', comp: MasonryDemo },
  { id:'responsive', name:'Responsive', icon:'\u2194', cat:'layout', comp: ResponsiveDemo },
  { id:'spacer', name:'Spacer', icon:'\u2508', cat:'layout', comp: SpacerDemo },
  { id:'center', name:'Center', icon:'\u25CE', cat:'layout', comp: CenterDemo },
  { id:'wrap', name:'Wrap', icon:'\u21A9', cat:'layout', comp: WrapDemo },
  { id:'flex', name:'Flex', icon:'\u2B0C', cat:'layout', comp: FlexDemo },
  { id:'sticky', name:'Sticky', icon:'\u25BD', cat:'layout', comp: StickyDemo },
  { id:'overlay', name:'Overlay', icon:'\u25A8', cat:'layout', comp: OverlayDemo },
  { id:'zstack', name:'ZStack', icon:'Z', cat:'layout', comp: ZStackDemo },
  { id:'scrollarea', name:'ScrollArea', icon:'\u2195', cat:'layout', comp: ScrollAreaDemo },
  { id:'resizable', name:'Resizable', icon:'\u21D4', cat:'layout', comp: ResizableDemo },
];

const CATS = [
  { key:'all', label:'All Components' },
  { key:'inputs', label:'Inputs' },
  { key:'display', label:'Data Display' },
  { key:'feedback', label:'Feedback' },
  { key:'surfaces', label:'Surfaces' },
  { key:'navigation', label:'Navigation' },
  { key:'layout', label:'Layout' },
];

function CodePanel({ comp }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const code = comp.toString();

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
        <button
          onClick={() => setShow(!show)}
          style={{ ...ui.btn, background: show ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', color: show ? '#64b5f6' : 'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)', fontSize:12 }}
        >
          {show ? '\u25BC Hide Code' : '\u25B6 Show Code'}
        </button>
      </div>
      {show && (
        <div style={{ marginTop:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0d1117', padding:'8px 14px', borderRadius:'8px 8px 0 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>JSX</span>
            <button onClick={handleCopy} style={{ ...ui.btn, ...ui.btnSm, background:'rgba(255,255,255,0.08)', color: copied ? '#4caf50' : 'rgba(255,255,255,0.5)', border:'none', fontSize:11 }}>
              {copied ? '\u2713 Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{ background:'#0d1117', padding:'16px', borderRadius:'0 0 8px 8px', overflowX:'auto', margin:0, maxHeight:400, overflowY:'auto' }}>
            <code style={{ fontSize:12, lineHeight:1.6, color:'#c9d1d9', fontFamily:"'Fira Code','Consolas','Monaco',monospace", whiteSpace:'pre' }}>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function StorybookApp() {
  const [active, setActive] = useState('button');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = catFilter === 'all' ? COMPONENTS : COMPONENTS.filter(c => c.cat === catFilter);
  const current = COMPONENTS.find(c => c.id === active);

  return (
    <div style={s.layout}>
      <div style={s.sidebar}>
        <div style={s.sideHeader}>
          <a href="/" style={s.homeLink}>{'\u2190'}</a>
          <div>
            <div style={s.sideTitle}>React UI Kit</div>
            <div style={s.sideSub}>100 Components</div>
          </div>
        </div>

        {CATS.map(cat =>
          <div key={cat.key}>
            {cat.key !== 'all' && <div style={s.catLabel}>{cat.label}</div>}
            {(cat.key === 'all' ? [] : COMPONENTS.filter(c => c.cat === cat.key)).map(comp =>
              <div
                key={comp.id}
                style={{...s.sideItem, background: active===comp.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: active===comp.id ? '#fff' : 'rgba(255,255,255,0.55)'}}
                onClick={() => { setActive(comp.id); setCatFilter('all'); }}
              >
                <span style={{fontSize:11,opacity:0.6}}>{comp.icon}</span> {comp.name}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>{current ? current.icon + ' ' + current.name : 'Components'}</h1>
            <div style={s.pageSub}>{current ? 'Category: ' + current.cat : ''}</div>
          </div>
          <div style={s.filterRow}>
            {CATS.map(c =>
              <button key={c.key} onClick={() => setCatFilter(c.key)} style={{...s.filterBtn, background: catFilter===c.key ? '#2196f3' : 'rgba(255,255,255,0.06)', color: catFilter===c.key ? '#fff' : 'rgba(255,255,255,0.4)'}}>{c.label}</button>
            )}
          </div>
        </div>

        {catFilter === 'all' ? (
          <div style={s.demoPanel}>
            {current && React.createElement(current.comp)}
            {current && <CodePanel comp={current.comp} />}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {filtered.map(comp => (
              <div key={comp.id} style={s.demoPanel}>
                <h3 style={{color:'#fff',margin:'0 0 12px',fontSize:18}}>{comp.icon} {comp.name}</h3>
                {React.createElement(comp.comp)}
                <CodePanel comp={comp.comp} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ UI STYLES ============
const ui = {
  btn: { padding:'8px 16px', fontSize:13, fontWeight:600, borderRadius:6, cursor:'pointer', border:'none', transition:'all 0.2s', display:'inline-flex', alignItems:'center', gap:6 },
  btnPrimary: { background:'#2196f3', color:'#fff', border:'none' },
  btnSecondary: { background:'#333', color:'#fff', border:'none' },
  btnOutline: { background:'transparent', color:'#2196f3', border:'1px solid #2196f3' },
  btnText: { background:'transparent', color:'#2196f3', border:'none' },
  btnDanger: { background:'#ef5350', color:'#fff', border:'none' },
  btnSm: { padding:'5px 10px', fontSize:12 },
  btnLg: { padding:'12px 24px', fontSize:15 },
  input: { width:'100%', padding:'10px 12px', fontSize:14, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, color:'#fff', outline:'none', boxSizing:'border-box' },
  inputFilled: { background:'rgba(255,255,255,0.1)', border:'1px solid transparent' },
  card: { background:'rgba(255,255,255,0.05)', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden' },
  badge: { padding:'3px 10px', borderRadius:12, fontSize:12, fontWeight:600, display:'inline-block' },
  chip: { padding:'4px 12px', borderRadius:16, fontSize:12, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 },
  alert: { display:'flex', alignItems:'center', padding:'12px 16px', borderRadius:8, fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:10, gap:8 },
  alertClose: { background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:14 },
  checkLabel: { display:'flex', alignItems:'center', gap:8, fontSize:14, color:'rgba(255,255,255,0.65)', cursor:'pointer' },
  checkbox: { width:18, height:18, borderRadius:4, border:'2px solid', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff', fontWeight:700, transition:'all 0.2s', flexShrink:0 },
  radio: { width:18, height:18, borderRadius:'50%', border:'2px solid', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', flexShrink:0 },
  toggle: { width:44, height:24, borderRadius:12, padding:2, cursor:'pointer', transition:'background 0.2s', position:'relative' },
  toggleThumb: { width:20, height:20, borderRadius:'50%', background:'#fff', transition:'transform 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' },
  progressTrack: { height:6, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:3, transition:'width 0.3s' },
  tooltip: { position:'absolute', background:'#333', color:'#fff', padding:'6px 10px', borderRadius:6, fontSize:12, whiteSpace:'nowrap', zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' },
  tab: { background:'none', border:'none', padding:'10px 16px', fontSize:14, cursor:'pointer', fontWeight:600, transition:'all 0.2s' },
  accordionItem: { background:'rgba(255,255,255,0.04)', borderRadius:8, marginBottom:6, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' },
  accordionHeader: { padding:'12px 16px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:14, fontWeight:600, color:'#fff' },
  accordionBody: { padding:'0 16px 12px', fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.5 },
  modalOverlay: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  modalBox: { background:'#1e1e3a', borderRadius:12, padding:24, maxWidth:420, width:'90%', border:'1px solid rgba(255,255,255,0.1)' },
  dropdown: { position:'absolute', top:'calc(100% + 4px)', left:0, background:'#1e1e3a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:4, minWidth:160, zIndex:100, boxShadow:'0 4px 16px rgba(0,0,0,0.3)' },
  dropdownItem: { padding:'8px 12px', fontSize:13, color:'rgba(255,255,255,0.6)', cursor:'pointer', borderRadius:4 },
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th: { padding:'10px 12px', textAlign:'left', color:'rgba(255,255,255,0.4)', borderBottom:'1px solid rgba(255,255,255,0.08)', fontSize:11, textTransform:'uppercase', fontWeight:600 },
  tr: { borderBottom:'1px solid rgba(255,255,255,0.04)' },
  td: { padding:'10px 12px', color:'rgba(255,255,255,0.6)' },
  skeleton: { background:'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)', borderRadius:6 },
  pageBtn: { width:32, height:32, borderRadius:6, border:'none', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)' },
};

const demo = {
  wrap: { display:'flex', flexDirection:'column', gap:12 },
  row: { display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' },
  label: { color:'rgba(255,255,255,0.35)', fontSize:11, textTransform:'uppercase', fontWeight:700, letterSpacing:0.5, marginTop:8 },
};

const s = {
  layout: { display:'flex', minHeight:'100vh', fontFamily:"'Segoe UI',Arial,sans-serif" },
  sidebar: { width:220, background:'#0a0a1e', borderRight:'1px solid rgba(255,255,255,0.06)', overflowY:'auto', flexShrink:0, maxHeight:'100vh' },
  sideHeader: { padding:'16px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:10 },
  homeLink: { color:'rgba(255,255,255,0.5)', textDecoration:'none', fontSize:18, padding:'4px 8px' },
  sideTitle: { color:'#fff', fontSize:15, fontWeight:700 },
  sideSub: { color:'rgba(255,255,255,0.35)', fontSize:11 },
  catLabel: { padding:'12px 14px 4px', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:0.5 },
  sideItem: { padding:'5px 14px', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6, borderRadius:4, margin:'1px 6px', transition:'background 0.15s' },
  main: { flex:1, overflowY:'auto', padding:'24px 28px', color:'#fff', maxHeight:'100vh', background:'#0a0a1a' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:16 },
  pageTitle: { fontSize:24, fontWeight:700, margin:0 },
  pageSub: { fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:2, textTransform:'capitalize' },
  filterRow: { display:'flex', gap:4, flexWrap:'wrap' },
  filterBtn: { padding:'5px 12px', fontSize:11, border:'none', borderRadius:14, cursor:'pointer', fontWeight:600 },
  demoPanel: { background:'rgba(255,255,255,0.03)', borderRadius:12, padding:24, border:'1px solid rgba(255,255,255,0.06)' },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StorybookApp />);
