/* ============================================================
   INKKAS SIZE FINDER — external asset
   Loaded once globally (theme.liquid). Reads product id/type from
   <div class="ink-sf-data" data-pid data-type> emitted by
   snippets/inkkas-size-finder.liquid (inside product-information, so it
   renders on the PDP AND in the Quick Shop drawer). Self-initializes on
   page load AND whenever new size-chart markup appears (AJAX drawer).
   Fit logic is unchanged from the original inline version.
   ============================================================ */
(function(){

  // --- one instance = one product's finder ---------------------------------
  function initInstance(PID, TYPE){

    function mapStyle(t){
      t = (t||'').toLowerCase();
      if(/kids/.test(t))                       return null;
      if(/buckle.?sandal|size-guide-buckle/.test(t)) return null;
      if(/low.?top/.test(t))                   return 'Low Tops';
      if(/tennis/.test(t))                     return 'Tennis';
      if(/trainer/.test(t))                    return 'Trainers';
      if(/runner/.test(t))                     return 'Runners';
      if(/jogger/.test(t))                     return 'Joggers';
      if(/high.?top/.test(t))                  return 'High Tops';
      if(/slip.?on/.test(t))                   return 'Slip Ons';
      if(/trekk/.test(t))                      return 'Trekk Boots';
      if(/camping/.test(t))                    return 'Camping Boots';
      if(/western/.test(t))                    return 'Western Boots';
      if(/bootie/.test(t))                     return 'Booties';
      if(/slide/.test(t))                      return 'Slides';
      return null;
    }

    var DATA = {
     "Tennis":{w:{"5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"10 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42","11-11.5":"11 / EUR 42"},m:null},
     "Low Tops":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42"},m:{"9-9.5":"9 / EUR 42","9.5-10":"10 / EUR 43","10-10.5":"10 / EUR 43","10.5-11":"11 / EUR 44","11-11.5":"11 / EUR 44","11.5-12":"12 / EUR 45","12-12.5":"13 / EUR 46","12.5-13":"13 / EUR 46"}},
     "Runners":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"7 / EUR 38","6.5-7":"7 / EUR 38","7-7.5":"8 / EUR 39","7.5-8":"8 / EUR 39","8-8.5":"9 / EUR 40","8.5-9":"9 / EUR 40","9-9.5":"10 / EUR 41","9.5-10":"10 / EUR 41","10-10.5":"11 / EUR 42","10.5-11":"11 / EUR 42"},m:{"9-9.5":"9 / EUR 42","9.5-10":"10 / EUR 43","10-10.5":"10 / EUR 43","10.5-11":"11 / EUR 44","11-11.5":"11 / EUR 44","11.5-12":"12 / EUR 45","12-12.5":"12 / EUR 45"}},
     "Trainers":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42","11-11.5":"11 / EUR 42"},m:null},
     "Joggers":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42"},m:{"9-9.5":"9 / EUR 42","9.5-10":"10 / EUR 43","10-10.5":"10 / EUR 43","10.5-11":"11 / EUR 44","11-11.5":"11 / EUR 44","11.5-12":"12 / EUR 45","12-12.5":"13 / EUR 46","12.5-13":"13 / EUR 46"}},
     "High Tops":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42"},m:{"9-9.5":"9 / EUR 42","9.5-10":"10 / EUR 43","10-10.5":"10 / EUR 43","10.5-11":"11 / EUR 44","11-11.5":"11 / EUR 44","11.5-12":"12 / EUR 45","12-12.5":"13 / EUR 46","12.5-13":"13 / EUR 46"}},
     "Slip Ons":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"7.5 / EUR 38.5","8-8.5":"8 / EUR 39","8.5-9":"8.5 / EUR 39.5","9-9.5":"9 / EUR 40","9.5-10":"9.5 / EUR 40.5","10-10.5":"10 / EUR 41","10.5-11":"10 / EUR 41","11-11.5":"11 / EUR 42"},m:null},
     "Trekk Boots":{w:{"5-5.5":"6 / EUR 37","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42"},m:{"9-9.5":"9 / EUR 42","9.5-10":"10 / EUR 43","10-10.5":"10 / EUR 43","10.5-11":"11 / EUR 44","11-11.5":"11 / EUR 44","11.5-12":"12 / EUR 45","12-12.5":"13 / EUR 45"}},
     "Camping Boots":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"10 / EUR 41","9.5-10":"10 / EUR 41","10-10.5":"11 / EUR 42","10.5-11":"11 / EUR 42"},m:{"9-9.5":"10 / EUR 43","9.5-10":"10 / EUR 43","10-10.5":"11 / EUR 44","10.5-11":"11 / EUR 44","11-11.5":"12 / EUR 45","11.5-12":"12 / EUR 45","12-12.5":"13 / EUR 46","12.5-13":"13 / EUR 46"}},
     "Western Boots":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42","11-11.5":"11 / EUR 42"},m:null},
     "Booties":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42","11-11.5":"11 / EUR 42"},m:null},
     "Slides":{w:{"5-5.5":"5 / EUR 36","5.5-6":"6 / EUR 37","6-6.5":"6 / EUR 37","6.5-7":"7 / EUR 38","7-7.5":"7 / EUR 38","7.5-8":"8 / EUR 39","8-8.5":"8 / EUR 39","8.5-9":"9 / EUR 40","9-9.5":"9 / EUR 40","9.5-10":"10 / EUR 41","10-10.5":"10 / EUR 41","10.5-11":"11 / EUR 42","11-11.5":"11 / EUR 42"},m:null}
    };

    var META = {
     "Booties":{note:"Booties run a touch snug.",unsure:"up"},
     "Trainers":{note:"Trainers run a touch snug.",unsure:"up"},
     "Tennis":{note:"Tennis run a touch snug.",unsure:"up"},
     "Trekk Boots":{note:"Trekk Boots run a touch snug.",unsure:"up"},
     "Camping Boots":{note:"Camping Boots run a touch snug.",unsure:"up"},
     "High Tops":{note:"High Tops run a touch snug.",unsure:"up"},
     "Runners":{note:"Runners run a touch snug.",unsure:"up"},
     "Western Boots":{note:"Western Boots run a touch snug.",unsure:"up"},
     "Slides":{note:"Slides run a touch snug.",unsure:"up"},
     "Low Tops":{note:"Ace Low Tops run a little roomy.",unsure:"down"},
     "Slip Ons":{note:"",unsure:"down"},
     "Joggers":{note:"Joggers run true to size, with a little extra room.",unsure:"down"}
    };

    var FIT = {
     "Booties":"snug","Trainers":"snug","Tennis":"snug","Trekk Boots":"snug",
     "Camping Boots":"snug","High Tops":"snug","Runners":"snug","Western Boots":"snug","Slides":"snug",
     "Low Tops":"roomy","Joggers":"true"
    };
    var DISP = { "Low Tops":"Ace Low Tops" };

    var STYLE = mapStyle(TYPE);
    if(!STYLE || !DATA[STYLE]) return true; // unmapped type: nothing to build, treat as done

    if(!document.getElementById('ink-sf-css')){
      var css=document.createElement('style'); css.id='ink-sf-css';
      css.textContent=
      ".ink-fit-cta{display:inline-flex;align-items:center;gap:7px;box-sizing:border-box;text-align:left;text-decoration:none;background:#f5f3ef;border-radius:10px;padding:10px 15px;margin:8px 0 16px;cursor:pointer;transition:background .12s;}"+
      ".ink-fit-cta:hover{background:#BEB4A1;}"+
      ".ink-fit-cta__sub{font-family:'Fraunces',Georgia,serif;font-size:14px;color:#3A382E;}"+
      ".ink-fit-cta__main{font-family:'Fraunces',Georgia,serif;font-size:15px;color:#1A1A1A;font-weight:500;}"+
      ".ink-sf{font-family:'Manrope',system-ui,sans-serif;max-width:480px;margin:0 auto 20px;}"+
      ".ink-sf-outer{padding:16px;border-radius:20px;background:transparent;}"+
      ".ink-sf .c{border:1px solid #E9E4D8;border-radius:16px;padding:20px 20px 22px;background:#FAF6EF;}"+
      ".ink-sf .prog{font-family:'Fraunces',Georgia,serif;font-size:13px;color:#C15F3C;margin:2px 0 16px;}"+
      ".ink-sf .note span,.ink-sf .xchg{font-family:'Fraunces',Georgia,serif;}"+
      ".ink-sf .startover{font-family:'Fraunces',Georgia,serif;background:none;border:none;color:#9A9789;font-size:13px;cursor:pointer;padding:0;margin-top:6px;}"+
      ".ink-sf h4{font-family:'Fraunces',Georgia,serif;font-size:21px;color:#1A1A1A;margin:0 0 2px;font-weight:500;}"+
      ".ink-sf .sub{font-size:12px;color:#9A9789;margin:0 0 16px;}"+
      ".ink-sf .lab{font-size:16px;color:#1A1A1A;font-weight:600;margin:0 0 11px;}"+
      ".ink-sf .hint{font-size:12px;color:#9A9789;margin:-4px 0 12px;}"+
      ".ink-sf .b{display:block;width:100%;padding:12px 14px;border:1.5px solid #C9C3B4;border-radius:10px;background:#fff;cursor:pointer;font-size:14px;color:#1A1A1A;text-align:left;margin-bottom:9px;font-family:inherit;transition:background .12s,border-color .12s,color .12s;}"+
      ".ink-sf .b:hover{border-color:#C15F3C;background:#FBF3EF;}"+
      ".ink-sf .b:active,.ink-sf .b.sel-on{background:#C15F3C;border-color:#C15F3C;color:#fff;}"+
      ".ink-sf .b--ctr{text-align:center;}"+
      ".ink-sf select.sel{width:100%;padding:13px 36px 13px 13px;border:1px solid #D9D5CA;border-radius:10px;font-size:14px;font-family:inherit;color:#1A1A1A;-webkit-appearance:none;appearance:none;background:#fff url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M2 2 6 6 10 2' fill='none' stroke='%237C7A67' stroke-width='1.6'/></svg>\") no-repeat right 13px center;}"+
      ".ink-sf .link{background:none;border:none;color:#C15F3C;font-weight:500;font-size:13px;cursor:pointer;padding:0;font-family:inherit;}"+
      ".ink-sf .back{background:none;border:none;color:#9A9789;font-size:13px;cursor:pointer;padding:0;margin-top:6px;font-family:inherit;}"+
      ".ink-sf .notsure{display:block;width:100%;margin:14px auto 0;background:none;border:none;color:#7C7A67;font-size:12px;text-align:center;cursor:pointer;padding:0;font-family:inherit;}"+
      ".ink-sf .res{background:#F7E9D8;border-radius:14px;padding:18px;text-align:center;margin-bottom:11px;}"+
      ".ink-sf .res .l{font-size:12px;color:#C15F3C;margin-bottom:4px;}"+
      ".ink-sf .res .v{font-family:'Fraunces',Georgia,serif;font-size:26px;color:#993C1D;line-height:1.15;}"+
      ".ink-sf .note{display:flex;gap:7px;align-items:flex-start;background:#fff;border:1px solid #EBE7DD;border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:12.5px;color:#5F5E5A;line-height:1.5;}"+
      ".ink-sf .note b{color:#1A1A1A;font-weight:500;}"+
      ".ink-sf .xchg{display:flex;gap:6px;align-items:center;font-size:11.5px;color:#3B6D11;}"+
      ".ink-sf hr.div{border:none;border-top:1px solid #E5E2DA;margin:16px 0 0;}"+
      ".ink-sf-toggle{display:block;margin:16px auto 0;background:none;border:none;color:#C15F3C;font-family:'Fraunces',Georgia,serif;font-size:16px;font-weight:500;text-decoration:underline;text-underline-offset:3px;cursor:pointer;}"+
      ".ink-sf-chart{background:#fff;border:1px solid #E9E4D8;border-radius:12px;padding:12px;margin-top:6px;}";
      document.head.appendChild(css);
    }

    // Size Guide link opens the popup natively (Fancybox); the True-to-size bar is left untouched.

    function fmt(n){return String(n);}
    function endpoints(tbl){var s={};Object.keys(tbl).forEach(function(k){var p=k.split('-');s[p[0]]=1;s[p[1]]=1;});return Object.keys(s).map(parseFloat).sort(function(a,b){return a-b;});}
    function sizesFor(g){var d=DATA[STYLE];if(g==='W')return endpoints(d.w);if(d.m)return endpoints(d.m);return endpoints(d.w).map(function(x){return x-2;});}
    function nearest(tbl,high){var best=null,bd=1e9;Object.keys(tbl).forEach(function(k){var h=parseFloat(k.split('-')[1]);var dd=Math.abs(h-high);if(dd<bd){bd=dd;best=tbl[k];}});return best;}
    function recFor(g,usual,lean){
      var d=DATA[STYLE];
      function lk(tbl,u){var lo=lean==='up'?u:u-0.5,hi=lean==='up'?u+0.5:u;return tbl[fmt(lo)+'-'+fmt(hi)]||nearest(tbl,hi);}
      if(g==='W')return{txt:lk(d.w,usual),label:"Women’s"};
      if(d.m)return{txt:lk(d.m,usual),label:"Men’s"};
      var wr=lk(d.w,usual+2);var us=parseFloat(wr.split('/')[0]);var eur=(wr.match(/EUR ([0-9.]+)/)||[])[1];
      return{txt:(us-2)+" / EUR "+eur,label:"Men’s"};
    }
    function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}

    function fitNote(dir){
      var name=DISP[STYLE]||STYLE, ch=FIT[STYLE];
      if(ch==='snug'){
        return dir==='down'
          ? name+' run a touch snug, so this size gives you a close, true fit.'
          : name+' run a touch snug, so this size gives you a comfortable, true fit.';
      }
      if(ch==='roomy'){
        return dir==='up'
          ? name+' run a little roomy, so this size gives you a relaxed, roomy fit.'
          : name+' run a little roomy, so this size gives you a truer fit.';
      }
      return dir==='up'
        ? name+' run true with a little extra room — this size sits relaxed.'
        : name+' run true to size — this size keeps a clean, true fit.';
    }

    function render(root){
      var st=root._st;
      root.innerHTML='';
      var c=el('div','c');
      c.appendChild(el('h4',null,'Find your size'));
      var isSlip = STYLE==='Slip Ons';
      var totalQ = 3;
      var step = !st.gender?1:(st.size==null?2:(st.lean==null?3:0));
      c.appendChild(step ? el('div','prog',step+' of '+totalQ) : el('div','sub','Your recommendation'));
      if(!st.gender){
        c.appendChild(el('p','lab','Shopping Women’s or Men’s?'));
        ['Women’s','Men’s'].forEach(function(g){var b=el('button','b b--ctr',g);b.onclick=function(){b.classList.add('sel-on');setTimeout(function(){st.gender=g[0]==='W'?'W':'M';st.size=null;st.lean=null;render(root);},140);};c.appendChild(b);});
      } else if(st.size==null){
        c.appendChild(el('p','lab','What’s your usual size?'));
        var sel=el('select','sel');var o0=el('option',null,'Select your size');o0.value='';sel.appendChild(o0);
        sizesFor(st.gender).forEach(function(s){var o=el('option',null,String(s));o.value=String(s);sel.appendChild(o);});
        sel.onchange=function(){if(sel.value){st.size=parseFloat(sel.value);var carr=st.gender==='W'?[7.5,8.5,9.5]:[5.5,6.5,7.5];st.lean=(isSlip&&carr.indexOf(st.size)>-1)?'up':null;render(root);}};
        c.appendChild(sel);
        var bk=el('button','back','← Back');bk.onclick=function(){st.gender=null;render(root);};c.appendChild(bk);
      } else if(st.lean==null){
        c.appendChild(el('p','lab','Which is more true for you?'));
        c.appendChild(el('div','hint','About how you usually fit — not this shoe.'));
        [['up','I sometimes size up, rarely down'],['down','I sometimes size down, rarely up']].forEach(function(o){var b=el('button','b',o[1]);b.onclick=function(){b.classList.add('sel-on');setTimeout(function(){st.lean=o[0];render(root);},140);};c.appendChild(b);});
        var nsLbl = META[STYLE].unsure==='up' ? 'Not sure? See our '+STYLE+' pick →' : (STYLE==='Joggers' ? 'Not sure? They run true to size →' : 'Not sure? See our pick →');
        var lk=el('button','notsure',nsLbl);
        lk.onclick=function(){st.lean=META[STYLE].unsure;render(root);};
        c.appendChild(lk);
        var bk2=el('button','back','← Back');bk2.onclick=function(){st.size=null;render(root);};c.appendChild(bk2);
      } else {
        var r=recFor(st.gender,st.size,st.lean);
        var res=el('div','res');
        res.appendChild(el('div','l','We recommend'));
        res.appendChild(el('div','v',r.label+' '+r.txt));
        c.appendChild(res);
        var recNum=parseFloat(r.txt);
        var dir = recNum>st.size?'up':(recNum<st.size?'down':'exact');
        var noteTxt;
        if(isSlip){
          var usualHalf = st.size % 1 !== 0;
          if(dir==='exact'){
            noteTxt = usualHalf
              ? 'Nice — we carry your half size.'
              : 'You’re all set — this is your size in our Slip-Ons.';
          } else {
            noteTxt = usualHalf
              ? 'For your half size, sizing '+dir+' is the best fit in our Slip-Ons.'
              : 'Sizing '+dir+' is your best fit in our Slip-Ons.';
          }
        } else {
          noteTxt = fitNote(dir);
        }
        var note=el('div','note');
        var dot=el('span',null,'◆'); dot.style.color='#C15F3C'; note.appendChild(dot);
        note.appendChild(el('span',null,noteTxt));
        c.appendChild(note);
        var x=el('div','xchg'); x.appendChild(el('span',null,'⇄')); x.appendChild(el('span',null,'Free U.S. exchanges within 30 days.'));
        c.appendChild(x);
        var ag=el('button','startover','↺ Start over');ag.onclick=function(){root._st={gender:null,size:null,lean:null};render(root);};c.appendChild(ag);
      }
      c.appendChild(el('hr','div'));
      var ch=root._chart;
      if(ch){
        var tog=el('button','ink-sf-toggle', ch.style.display==='none'?'See full size guide ▾':'Hide full size guide ▴');
        tog.onclick=function(){var open=ch.style.display!=='none';ch.style.display=open?'none':'block';tog.textContent=open?'See full size guide ▾':'Hide full size guide ▴';};
        c.appendChild(tog);
      }
      root.appendChild(c);
    }

    function inject(){
      var box=document.getElementById('size-chart'+PID);
      if(!box) return false;
      var wrap=box.querySelector('.size-chart-wrap')||box;
      if(wrap.querySelector('.ink-sf')) return true;
      var chart=el('div','ink-sf-chart');
      while(wrap.firstChild){ chart.appendChild(wrap.firstChild); }
      chart.style.display='none';
      var outer=el('div','ink-sf-outer');
      var container=el('div','ink-sf'); container._st={gender:null,size:null,lean:null}; container._chart=chart;
      outer.appendChild(container);
      outer.appendChild(chart);
      wrap.appendChild(outer);
      render(container);
      return true;
    }

    // ---- nudge line under the true-to-size bar (style-driven) ----
    (function injectNudge(){
      var snug={'Booties':1,'Trainers':1,'Tennis':1,'High Tops':1,'Runners':1,'Trekk Boots':1,'Camping Boots':1,'Western Boots':1,'Slides':1};
      var bars=document.querySelectorAll('.product-variant-label-dm__true-to-size');
      for(var i=0;i<bars.length;i++){
        var bar=bars[i];
        var scope=bar.closest('form, .product-information, .product-drawer')||document;
        if(!scope.querySelector('.ink-sizeguide')) continue;   // only where a finder exists
        if(scope.querySelector('.ink-fit-nudge')) continue;    // don't double-inject
        var p=document.createElement('p'); p.className='ink-fit-nudge';
        if(snug[STYLE]){ p.textContent='We recommend sizing up for half sizes or wider feet.'; }
        else if(STYLE==='Low Tops'){ p.textContent='Between sizes? We recommend sizing down.'; }
        else if(STYLE==='Joggers'){ p.textContent='Roomy enough for wider feet — take your usual size. Between sizes? Size down.'; }
        else if(STYLE==='Slip Ons'){
          p.appendChild(document.createTextNode('Take your usual size. Don’t see it? Use our '));
          var a=document.createElement('a'); a.className='ink-fit-nudge__link'; a.href='javascript:;'; a.textContent='Size Finder';
          a.addEventListener('click', function(e){ e.preventDefault(); var sc=this.closest('form, .product-information, .product-drawer')||document; var l=sc.querySelector('.ink-sizeguide'); if(l) l.click(); });
          p.appendChild(a); p.appendChild(document.createTextNode('.'));
        } else { continue; }
        bar.insertAdjacentElement('afterend', p);
      }
    })();

    return inject();
  }

  // --- controller: init every product-data tag, on load + on DOM changes ----
  function scan(){
    var list = document.querySelectorAll('.ink-sf-data');
    for(var i=0;i<list.length;i++){
      var d = list[i];
      if(d.getAttribute('data-sf-init')) continue;
      var pid = d.getAttribute('data-pid');
      var type = d.getAttribute('data-type') || '';
      if(!pid) continue;
      if(initInstance(pid, type)) d.setAttribute('data-sf-init','1');
    }
  }

  var t;
  function schedule(){ clearTimeout(t); t = setTimeout(scan, 60); }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
  new MutationObserver(schedule).observe(document.documentElement, { childList:true, subtree:true });
})();