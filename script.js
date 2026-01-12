const STORAGE_PREFIX='PO_DATA_PRINT_BIG_';
let deleteTargetBtn=null;

function addRow(data={}){
  const tbody=document.getElementById('tbody');
  const index=tbody.children.length/2+1;

  const main=document.createElement('tr');
  main.innerHTML=`
    <td>${index}</td>
    <td><textarea>${data.desc||''}</textarea></td>
    <td class="img-col">
      <div class="img-box" onclick="this.querySelector('input').click()">
        <input type="file" hidden>
        <img src="${data.img||''}" style="${data.img?'display:block':''}">
      </div>
    </td>
    <td><input value="${data.unit||''}"></td>
    <td><input type="number" value="${data.stock||''}"></td>
    <td><input type="number" value="${data.remain||''}"></td>
    <td><input type="number" class="buy" value="${data.buy||''}" oninput="calcRow(this)"></td>
    <td><input type="number" class="price" value="${data.price||''}" oninput="calcRow(this)"></td>
    <td class="sum">0.00</td>
    <td><input value="${data.vendor||''}"></td>
    <td class="delete-col no-print">
      <button class="delete-btn" onclick="openModal(this)">🗑</button>
    </td>
  `;

  const sub=document.createElement('tr');
  sub.className='sub-row';
  sub.innerHTML=`
    <td colspan="11">
      <div class="sub-grid">
        <div><label>จุดประสงค์</label><textarea>${data.purpose||''}</textarea></div>
        <div><label>ใช้งานที่</label><textarea>${data.place||''}</textarea></div>
      </div>
    </td>
  `;

  tbody.appendChild(main);
  tbody.appendChild(sub);
}

function openModal(btn){
  deleteTargetBtn=btn;
  document.getElementById('deleteModal').classList.add('show');
}
function closeModal(){
  deleteTargetBtn=null;
  document.getElementById('deleteModal').classList.remove('show');
}
function confirmDelete(){
  if(!deleteTargetBtn) return;
  const main=deleteTargetBtn.closest('tr');
  const sub=main.nextElementSibling;
  if(sub&&sub.classList.contains('sub-row')) sub.remove();
  main.remove();
  closeModal();
  reindex();
  calcAll();
  saveData();
}

function reindex(){
  const rows=document.querySelectorAll('#tbody tr');
  let i=1;
  for(let r=0;r<rows.length;r+=2){rows[r].children[0].innerText=i++;}
}
function calcRow(el){
  const r=el.closest('tr');
  const q=r.querySelector('.buy').value||0;
  const p=r.querySelector('.price').value||0;
  r.querySelector('.sum').innerText=(q*p).toFixed(2);
  calcAll();
}
function calcAll(){
  let t=0;
  document.querySelectorAll('.sum').forEach(s=>t+=parseFloat(s.innerText||0));
  document.getElementById('grand').innerText=t.toFixed(2);
}
function saveData(){
  const month=document.getElementById('month').value;
  if(!month) return;
  const rows=[];
  const trs=document.querySelectorAll('#tbody tr');
  for(let i=0;i<trs.length;i+=2){
    const m=trs[i],s=trs[i+1];
    rows.push({
      desc:m.querySelector('textarea').value,
      img:m.querySelector('img').src,
      unit:m.querySelectorAll('input')[1].value,
      stock:m.querySelectorAll('input')[2].value,
      remain:m.querySelectorAll('input')[3].value,
      buy:m.querySelector('.buy').value,
      price:m.querySelector('.price').value,
      vendor:m.querySelectorAll('input')[4].value,
      purpose:s.querySelectorAll('textarea')[0].value,
      place:s.querySelectorAll('textarea')[1].value
    });
  }
  localStorage.setItem(STORAGE_PREFIX+month,JSON.stringify({month,dept:document.getElementById('dept').value,rows}));
}
function loadData(){
  const month=document.getElementById('month').value;
  document.getElementById('tbody').innerHTML='';
  if(!month){addRow();return;}
  const data=JSON.parse(localStorage.getItem(STORAGE_PREFIX+month));
  if(!data){addRow();return;}
  document.getElementById('dept').value=data.dept;
  data.rows.forEach(r=>addRow(r));
  calcAll();
}
document.getElementById('month').addEventListener('change',loadData);

addRow();
