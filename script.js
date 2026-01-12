const monthInput=document.getElementById('monthPicker');
monthInput.addEventListener('change',loadMonth);

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

  if(!from || !to){
    alert('กรุณาเลือกเดือนให้ครบ');
    return;
  }

  const f=new Date(from+'-01');
  const t=new Date(to+'-01');

  f.setMonth(f.getMonth()+1);
  if(f.getTime() !== t.getTime()){
    alert('ต้องคัดลอกจากเดือนก่อนหน้าเท่านั้น');
    return;
  }

  const raw=localStorage.getItem('PO_'+from);
  if(!raw){
    alert('ไม่พบข้อมูลเดือนต้นทาง');
    return;
  }

  localStorage.setItem('PO_'+to, raw);
  closeCopy();
  loadMonth();
}

function printPDF(){
  window.print();
}
