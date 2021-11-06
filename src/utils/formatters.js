
export function formatCurrency(amount, currency="CAD") {
  const formatter = new Intl.NumberFormat('en-US',{ style:'currency', currency})
  return formatter.format(amount/100);
}

export function formatDate(date){
  const dateFormatter = new Intl.DateTimeFormat('en-CA',{
    year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', second:'numeric',
  })
  return dateFormatter.format(date);
}