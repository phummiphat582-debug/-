const tbody=document.getElementById('tbody');
const monthInput=document.getElementById('month');
const grand=document.getElementById('grand');

monthInput.value=new Date().toISOString().slice(0,7);
loadMonth();

document.addEventListener('input',e=>{
  if(e.target.closest('#tbody')){
    saveMonth();
    recalcGrand();
  }
});

function addRow(){
  const i=document.querySelectorAll('.no').length+1;
  const m=document.createElement('tr');
  m.innerHTML=`<td class="no">${i}</td>
  <td><textarea></textarea></td>
  <td><input type="number" value="1"></td>
  <td><input type="number" value="0"></td>
  <td class="sum">0</td>
  <td><button onclick="delRow(this)">🗑</button></td>`;
  const s=document.createElement('tr');
  s.className='sub-row';
  s.innerHTML='<td></td><td colspan="5"><textarea placeholder="หมายเหตุ"></textarea></td>';
  tbody.append(m,s);
  saveMonth();
}

function delRow(b){
  const tr=b.closest('tr');
  const sub=tr.nextSibling;
  tr.remove(); sub.remove();
  renumber(); saveMonth(); recalcGrand();
}

function renumber(){
  document.querySelectorAll('.no').forEach((n,i)=>n.textContent=i+1);
}

function recalcGrand(){
  let g=0;
  tbody.querySelectorAll('tr').forEach(tr=>{
    const q=tr.querySelector('input[type=number]');
    if(!q)return;
    const p=tr.querySelectorAll('input')[1];
    const s=tr.querySelector('.sum');
    const v=(+q.value||0)*(+p.value||0);
    s.textContent=v;
    g+=v;
  });
  grand.textContent=g;
}

function saveMonth(){
  const data=[];
  tbody.querySelectorAll('tr').forEach((tr,i)=>{
    if(i%2==0){
      data.push({main:tr.outerHTML,sub:tr.nextSibling.outerHTML});
    }
  });
  localStorage.setItem('PO_'+monthInput.value,JSON.stringify(data));
}

function loadMonth(){
  const raw=localStorage.getItem('PO_'+monthInput.value);
  tbody.innerHTML='';
  if(!raw){addRow();return;}
  JSON.parse(raw).forEach(d=>{
    tbody.insertAdjacentHTML('beforeend',d.main+d.sub);
  });
  renumber(); recalcGrand();
}

function copyPrev(){
  const d=new Date(monthInput.value+'-01');
  d.setMonth(d.getMonth()-1);
  const k='PO_'+d.toISOString().slice(0,7);
  const p=localStorage.getItem(k);
  if(p){
    localStorage.setItem('PO_'+monthInput.value,p);
    loadMonth();
  }
}

monthInput.onchange=loadMonth;
