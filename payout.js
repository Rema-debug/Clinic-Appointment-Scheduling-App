// payout.js — Demo payment page logic

function formatCurrency(n){
  return Number(n).toLocaleString(undefined,{style:'currency',currency:'USD'});
}

const form = document.getElementById('payoutForm');
const resultEl = document.getElementById('payoutResult');

function fakeTransactionId(){
  return 'DEMO-' + Math.random().toString(36).substring(2,10).toUpperCase();
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  const payerName = data.get('payerName');
  const amount = parseFloat(data.get('amount')) || 0;
  const note = data.get('note') || '';

  // Basic client-side validation (for demo only)
  if(!payerName || amount <= 0){
    alert('Please enter a valid name and amount.');
    return;
  }

  // Simulate processing delay
  const txId = fakeTransactionId();
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<h4>Processing payment…</h4><p>Please wait.</p>`;

  setTimeout(()=>{
    // Randomly succeed or fail to simulate different outcomes
    const success = Math.random() > 0.08; // 92% success for demo
    if(success){
      resultEl.innerHTML = `
        <h4>Payment Successful</h4>
        <p>Transaction ID: <strong>${txId}</strong></p>
        <p>Amount: <strong>${formatCurrency(amount)}</strong></p>
        <p>Paid by: <strong>${escapeHtml(payerName)}</strong></p>
        <p style="margin-top:0.5rem; color:var(--text-secondary);">Your appointment is confirmed. A receipt has been sent to your email.</p>
      `;
      // Reset form after successful payment
      form.reset();
      // Update summary display
      const summary = document.querySelector('#paymentSummary .doctor-preview-details');
      if(summary){
        summary.innerHTML = `\n        <p><strong>Recipient:</strong> MedTasks Clinic</p>\n        <p><strong>Transaction fee:</strong> None</p>\n        <p><strong>Processing:</strong> Instant</p>\n      `;
      }
    } else {
      resultEl.innerHTML = `
        <h4 style="color:var(--accent-color);">Payment Failed</h4>
        <p>Transaction could not be completed. Try again or use a different card.</p>
      `;
    }

    // Scroll to result
    resultEl.scrollIntoView({behavior:'smooth'});
  }, 900 + Math.random()*800);
});

function escapeHtml(unsafe){
  return unsafe.replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m];
  });
}

// Optionally show the summary amount live
const amountInput = document.getElementById('amount');
if(amountInput){
  amountInput.addEventListener('input', ()=>{
    const val = parseFloat(amountInput.value)||0;
    const summary = document.querySelector('#paymentSummary .doctor-preview-details');
    if(summary){
      summary.innerHTML = `\n        <p><strong>Recipient:</strong> MedTasks Clinic</p>\n        <p><strong>Amount:</strong> ${formatCurrency(val)}</p>\n        <p><strong>Transaction fee:</strong> None — demo only</p>\n        <p><strong>Refund policy:</strong> Demo page, no real refund necessary</p>\n      `;
    }
  });
}
