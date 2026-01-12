const monthInput=document.getElementById('monthPicker');
const tbody=document.getElementById('tbody');
monthInput.addEventListener('change',loadMonth);

let deleteTarget=null;

function addRow(){
  const i=tbody.children.length/2+1;
  const main=document.createElement('tr');
  main.innerHTML=`
    <td class="no">${i}</td>
    <td><textarea></textarea></td>
    <td></td>
    <td><input></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number" class="buy" oninput="calc(this)"></td>
    <td><input type="number" class="price" oninput="calc(this)"></td>
    <td class="sum">0.00</td>
    <td><input></td>
    <td><button class="btn-del" onclick="requestDelete(this)">🗑</button></td>
  `;

  const sub=document.createElement('tr');
  sub.className='sub-row';
  sub.innerHTML='<td colspan="11"></td>';

  tbody.append(main,sub);
  saveMonth();
}

function requestDelete(btn){
  deleteTarget = btn.closest('tr');
  document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal(){
  document.getElementById('deleteModal').classList.remove('show');
}

function confirmDelete(){
  if(!deleteTarget) return;
  const sub = deleteTarget.nextElementSibling;
  if(sub && sub.classList.contains('sub-row')) sub.remove();
  deleteTarget.remove();
  closeDeleteModal();
  renumber();
  recalcGrand();
  saveMonth();
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
  tbody.innerHTML='';
  const raw=localStorage.getItem('PO_'+monthInput.value);
  if(!raw){addRow();return;}
  JSON.parse(raw).forEach(d=>{
    const m=document.createElement('tr');m.innerHTML=d.main;
    const s=document.createElement('tr');s.className='sub-row';s.innerHTML=d.sub;
    tbody.append(m,s);
  });
  recalcGrand();
}

addRow();
