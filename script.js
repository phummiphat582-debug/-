function addRow(){
  const tbody=document.getElementById('tbody');
  const i=tbody.children.length/2+1;

  const main=document.createElement('tr');
  main.innerHTML=`
    <td>${i}</td>
    <td><textarea oninput="autoGrow(this)"></textarea></td>
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
    <td><input type="url" placeholder="ชื่อร้าน / https://"></td>
  `;

  const sub=document.createElement('tr');
  sub.className='sub-row';
  sub.innerHTML=`
    <td colspan="10">
      <div class="sub-grid">
        <div>
          <label>จุดประสงค์</label>
          <textarea oninput="autoGrow(this)"></textarea>
        </div>
        <div>
          <label>ใช้งานที่</label>
          <textarea oninput="autoGrow(this)"></textarea>
        </div>
      </div>
    </td>
  `;

  tbody.appendChild(main);
  tbody.appendChild(sub);
}

function autoGrow(el){
  el.style.height='auto';
  el.style.height=el.scrollHeight+'px';
}

function previewImage(input){
  const img=input.parentElement.querySelector('img');
  const file=input.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    img.src=e.target.result;
    img.style.display='block';
  };
  r.readAsDataURL(file);
}

function calc(el){
  const r=el.closest('tr');
  const q=r.querySelector('.buy').value||0;
  const p=r.querySelector('.price').value||0;
  r.querySelector('.sum').innerText=(q*p).toFixed(2);
  let total=0;
  document.querySelectorAll('.sum').forEach(s=>total+=parseFloat(s.innerText));
  document.getElementById('grand').innerText=total.toFixed(2);
}

function exportPDF(){
  document.body.classList.add('pdf-mode');

  document.querySelectorAll('textarea').forEach(t=>{
    t.style.height='auto';
    t.style.height=t.scrollHeight+'px';
  });

  setTimeout(()=>{
    html2pdf().from(document.getElementById('pdf-area')).set({
      filename:'Purchase_Order_A4_Final.pdf',
      html2canvas:{ scale:1, useCORS:true },
      jsPDF:{ unit:'mm', format:'a4', orientation:'landscape' },
      pagebreak:{ mode:['css','legacy'] }
    }).save().then(()=>{
      document.body.classList.remove('pdf-mode');
    });
  },300);
}

addRow();
