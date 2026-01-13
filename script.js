const monthInput=document.getElementById('monthPicker');
let deleteTarget=null;
monthInput.addEventListener('change',loadMonth);

function addRow(){
  const tbody=document.getElementById('tbody');
  const i=tbody.children.length/2+1;
  const main=document.createElement('tr');
  main.innerHTML=`
    <td class="no">${i}</td>
    <td><textarea></textarea></td>
    <td><div class="img-box"></div></td>
    <td><input></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number" class="buy" oninput="calc(this)"></td>
    <td><input type="number" class="price" oninput="calc(this)"></td>
    <td class="sum">0.00</td>
    <td><input></td>
    <td><button class="btn-del" onclick="askDelete(this)">🗑</button></td>`;
  const sub=document.createElement('tr');
  sub.className='sub-row';
  sub.innerHTML=`<td colspan="11"><div class="sub-grid">
    <div><label>จุดประสงค์</label><textarea></textarea></div>
    <div><label>ใช้งานที่</label><textarea></textarea></div>
  </div></td>`;
  tbody.append(main,sub);
  saveMonth();
}

function askDelete(btn){
  deleteTarget=btn;
  document.getElementById('deleteModal').style.display='flex';
}
function closeDelete(){
  document.getElementById('deleteModal').style.display='none';
}
function confirmDelete(){
  const tr=deleteTarget.closest('tr');
  tr.nextElementSibling.remove();
  tr.remove();
  closeDelete();
  renumber(); recalcGrand(); saveMonth();
}

function calc(el){
  const r=el.closest('tr');
  const q=r.querySelector('.buy').value||0;
  const p=r.querySelector('.price').value||0;
  r.querySelector('.sum').innerText=(q*p).toFixed(2);
  recalcGrand();
}
function recalcGrand(){
  let t=0;
  document.querySelectorAll('.sum').forEach(s=>t+=parseFloat(s.innerText||0));
  document.getElementById('grand').innerText=t.toFixed(2);
}
function renumber(){
  document.querySelectorAll('.no').forEach((n,i)=>n.innerText=i+1);
}
function saveMonth(){
  if(!monthInput.value) return;
  const data=[];
  document.querySelectorAll('#tbody tr').forEach(tr=>{
    if(!tr.classList.contains('sub-row')){
      data.push({main:tr.innerHTML,sub:tr.nextElementSibling.innerHTML});
    }
  });
  localStorage.setItem('PO_'+monthInput.value,JSON.stringify(data));
}
function loadMonth(){
  const raw=localStorage.getItem('PO_'+monthInput.value);
  tbody.innerHTML='';
  if(!raw){addRow();return;}
  JSON.parse(raw).forEach(d=>{
    const m=document.createElement('tr');m.innerHTML=d.main;
    const s=document.createElement('tr');s.className='sub-row';s.innerHTML=d.sub;
    tbody.append(m,s);
  });
  recalcGrand();
}
function copyWithPrompt(){
  document.getElementById('copyModal').style.display='flex';
  document.getElementById('copyTo').value=monthInput.value;
}
function closeCopy(){
  document.getElementById('copyModal').style.display='none';
}
function confirmCopy(){
  const from=document.getElementById('copyFrom').value;
  const to=document.getElementById('copyTo').value;
  const f=new Date(from+'-01');
  const t=new Date(to+'-01');
  f.setMonth(f.getMonth()+1);
  if(f.getTime()!==t.getTime()) return alert('ต้องเป็นเดือนก่อนหน้าเท่านั้น');
  const raw=localStorage.getItem('PO_'+from);
  if(!raw) return alert('ไม่พบข้อมูล');
  localStorage.setItem('PO_'+to,raw);
  closeCopy(); loadMonth();
}
function printPDF(){window.print();}
addRow();
