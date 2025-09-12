import React, { useEffect, useState } from "react";

function Reporting() {
  const [products,setProducts] = useState([]);
  const [sales,setSales] = useState([]);

  useEffect(()=>{
    fetch("http://localhost:5000/products").then(r=>r.json()).then(setProducts);
    fetch("http://localhost:5000/sales").then(r=>r.json()).then(setSales);
  },[]);

  const totalSales = sales.reduce((sum,s)=>sum + s.items.reduce((a,b)=>{
    const prod = products.find(p=>p.id===b.productId);
    return prod ? a + prod.price*b.quantity : a;
  },0),0);

  return (
    <div>
      <h2>Reporting</h2>
      <p>Total Products: {products.length}</p>
      <p>Total Sales Value: ${totalSales.toFixed(2)}</p>
    </div>
  )
}

export default Reporting;
