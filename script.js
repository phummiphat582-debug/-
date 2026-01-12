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
    <td>
      <div class="img-box" onclick="this.querySelector('input').click()">
        <input type="file" accept="image/*" onchange="previewImage(this)" hidden>
        <img>
      </div>
    </td>
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
  sub.innerHTML=`
    <td colspan="11">
      <div class="sub-grid">
        <div><label>จุดประสงค์</label><textarea></textarea></div>
        <div><label>ใช้งานที่</label><textarea></textarea></div>
      </div>
    </td>`;

  tbody.append(main,sub);
  saveMonth();
}

/* DELETE (modal) */
function requestDelete(btn){
  deleteTarget = btn.closest('tr');
  document.getElementById('deleteModal').classList.add('show');
}
function closeDeleteModal(){
  document.getElementById('deleteModal').classList.remove('show');
}
function confirmDelete(){
  if(!deleteTarget) return;
  const sub=deleteTarget.nextElementSibling;
  if(sub && sub.classList.contains('sub-row')) sub.remove();
  deleteTarget.remove();
  closeDeleteModal();
  renumber();
  recalcGrand();
  saveMonth();
}

/* IMAGE */
function previewImage(input){
  const img=input.parentElement.querySelector('img');
  const file=input.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=e=>{img.src=e.target.result;img.style.display='block';};
  r.readAsDataURL(file);
}

/* CALC */
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

/* SAVE / LOAD */
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

/* COPY MODAL (เดิม) */
function openCopyModal(){
  document.getElementById('copyModal').classList.add('show');
  document.getElementById('toMonth').value = monthInput.value;
}
function closeCopyModal(){
  document.getElementById('copyModal').classList.remove('show');
}
function confirmCopy(){
  const from=document.getElementById('fromMonth').value;
  const to=document.getElementById('toMonth').value;
  if(!from||!to) return alert('กรุณาเลือกเดือนให้ครบ');
  const raw=localStorage.getItem('PO_'+from);
  if(!raw) return alert('ไม่พบข้อมูลเดือนต้นทาง');
  localStorage.setItem('PO_'+to,raw);
  closeCopyModal();
  loadMonth();
}

addRow();
