const monthInput=document.getElementById('monthPicker');
monthInput.addEventListener('change',loadMonth);

function addRow(){
  const tbody=document.getElementById('tbody');
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
    <td><button class="btn-del" onclick="deleteRow(this)">🗑</button></td>
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

function deleteRow(btn){
  if(!confirm('ยืนยันการลบรายการนี้ใช่ไหม?')) return;
  const tr=btn.closest('tr');
  tr.nextElementSibling.remove();
  tr.remove();
  renumber();
  recalcGrand();
  saveMonth();
}

function previewImage(input){
  const img=input.parentElement.querySelector('img');
  const file=input.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=e=>{img.src=e.target.result;img.style.display='block';};
  r.readAsDataURL(file);
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

function copyPrevMonth(){
  if(!monthInput.value) return alert('กรุณาเลือกเดือน');
  const d=new Date(monthInput.value+'-01');
  d.setMonth(d.getMonth()-1);
  const prev=d.toISOString().slice(0,7);
  const raw=localStorage.getItem('PO_'+prev);
  if(!raw) return alert('ไม่พบข้อมูลเดือนก่อน');
  localStorage.setItem('PO_'+monthInput.value,raw);
  loadMonth();
}

addRow();

function openCopyModal(){
  if(!monthInput.value)
    return alert('กรุณาเลือกเดือนปลายทางก่อน');
  document.getElementById('copyModal').style.display='flex';
}

function closeCopyModal(){
  document.getElementById('copyModal').style.display='none';
}

function confirmCopy(){
  const fromMonth=document.getElementById('copyMonth').value;
  const toMonth=monthInput.value;
  if(!fromMonth) return alert('กรุณาเลือกเดือนต้นทาง');
  if(fromMonth===toMonth)
    return alert('ไม่สามารถคัดลอกเดือนเดียวกันได้');
  const raw=localStorage.getItem('PO_'+fromMonth);
  if(!raw) return alert('ไม่พบข้อมูลเดือนที่เลือก');
  localStorage.setItem('PO_'+toMonth,raw);
  loadMonth();
  closeCopyModal();
}
