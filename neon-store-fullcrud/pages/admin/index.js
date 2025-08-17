import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import seedData from '../../products.json'
import { getProducts, setProducts, seedIfEmpty } from '../../lib/db'

export default function Admin(){
  const router = useRouter()
  const [form,setForm]=useState({ id:null, name:'', price:'', image:'', tag:'' })
  const [items,setItems]=useState([])

  useEffect(()=>{
    if(localStorage.getItem('loggedIn')!=='true'){ router.replace('/admin/login'); return }
    seedIfEmpty(seedData)
    setItems(getProducts())
  },[])

  const sync=(arr)=>{ setItems(arr); setProducts(arr) }

  const submit=(e)=>{
    e.preventDefault()
    const payload = { ...form, id: form.id || Date.now(), price: Number(form.price||0) }
    if(form.id){
      sync(items.map(p => p.id===form.id ? payload : p))
    }else{
      sync([payload, ...items])
    }
    setForm({ id:null, name:'', price:'', image:'', tag:'' })
  }

  const edit=(p)=> setForm({ ...p, price: String(p.price) })
  const del=(id)=>{ if(confirm('Delete this product?')) sync(items.filter(p=>p.id!==id)) }
  const clearAll=()=>{ if(confirm('Delete ALL products?')) sync([]) }
  const resetSeed=()=>{ if(confirm('Reset to 20 sample items?')) sync(seedData.map(p=>({ ...p }))) }
  const exportJSON=()=>{
    const blob = new Blob([JSON.stringify(items,null,2)], {type:'application/json'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href=url; a.download='products-export.json'; a.click(); URL.revokeObjectURL(url)
  }
  const importJSON=(e)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader(); reader.onload=()=>{ try{ const arr=JSON.parse(reader.result); if(Array.isArray(arr)){ sync(arr); alert('Imported!') } }catch{ alert('Invalid JSON') } }; reader.readAsText(file)
  }
  const logout=()=>{ localStorage.removeItem('loggedIn'); router.push('/admin/login') }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={exportJSON}>Export</button>
          <label className="btn-ghost cursor-pointer">Import<input type="file" accept="application/json" className="hidden" onChange={importJSON}/></label>
          <button className="btn-ghost warn" onClick={resetSeed}>Reset Seed</button>
          <button className="btn-ghost danger" onClick={clearAll}>Clear All</button>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <form onSubmit={submit} className="card p-4 grid md:grid-cols-5 gap-3 mb-6">
        <input placeholder="Name" className="px-3 py-2 rounded-xl border md:col-span-2" style={{borderColor:'var(--line)', background:'#0b120f'}} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input placeholder="Price" className="px-3 py-2 rounded-xl border" style={{borderColor:'var(--line)', background:'#0b120f'}} value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/>
        <input placeholder="Image URL" className="px-3 py-2 rounded-xl border md:col-span-2" style={{borderColor:'var(--line)', background:'#0b120f'}} value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
        <input placeholder="Tag (Steam/Gift Card/...)" className="px-3 py-2 rounded-xl border" style={{borderColor:'var(--line)', background:'#0b120f'}} value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})}/>
        <div className="md:col-span-5 flex gap-2">
          <button className="neon-btn">{form.id ? 'Update Product' : 'Add Product'}</button>
          {form.id ? <button type="button" className="btn-ghost" onClick={()=>setForm({ id:null, name:'', price:'', image:'', tag:'' })}>Cancel</button> : null}
          <a href="/" className="btn-ghost">View Store</a>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => (
          <div key={p.id} className="card overflow-hidden">
            <img src={p.image || '/images/placeholder.jpg'} alt={p.name} className="w-full h-40 object-cover bg-[#070b09]"/>
            <div className="p-3">
              <div className="text-xs inline-flex px-2 py-1 rounded-full border mb-2" style={{borderColor:'var(--line)'}}>{p.tag || 'Digital'}</div>
              <div className="font-medium">{p.name}</div>
              <div className="opacity-90">${Number(p.price).toFixed(2)}</div>
              <div className="flex gap-2 mt-3">
                <button className="btn-ghost" onClick={()=>edit(p)}>Edit</button>
                <button className="danger px-3 py-1 rounded-xl" onClick={()=>del(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
