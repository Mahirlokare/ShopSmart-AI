import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, Bot, Send, Sparkles, Plus, Minus, Trash2 } from 'lucide-react';
import { request } from './api';

const demo = [
 {id:'d1',name:'Wireless Headphones',description:'Comfortable over-ear audio with rich sound.',price:2499,category:'Electronics',image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',stock:12},
 {id:'d2',name:'Smart Watch',description:'Track your day, activity and notifications.',price:3299,category:'Electronics',image_url:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',stock:8},
 {id:'d3',name:'Everyday Backpack',description:'A clean, durable backpack for work and travel.',price:1499,category:'Lifestyle',image_url:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',stock:20},
 {id:'d4',name:'Desk Lamp',description:'Minimal adjustable lamp for your workspace.',price:999,category:'Home',image_url:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',stock:15}
];
export default function App(){
 const [products,setProducts]=useState(demo),[query,setQuery]=useState(''),[category,setCategory]=useState('All');
 const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('shopsmart_cart')||'[]'));
 const [chat,setChat]=useState([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[showCart,setShowCart]=useState(false);
 useEffect(()=>{request('/api/products').then(rows=>{if(rows.length)setProducts(rows)}).catch(()=>{});},[]);
 useEffect(()=>localStorage.setItem('shopsmart_cart',JSON.stringify(cart)),[cart]);
 const categories=['All',...new Set(products.map(p=>p.category))];
 const visible=useMemo(()=>products.filter(p=>(category==='All'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[products,category,query]);
 const add=p=>setCart(old=>{const found=old.find(x=>x.id===p.id);return found?old.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...old,{...p,qty:1}]});
 const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
 async function sendChat(e){e.preventDefault();if(!message.trim())return;const text=message;setMessage('');setChat(c=>[...c,{role:'user',text}]);setBusy(true);try{const r=await request('/api/chat',{method:'POST',body:JSON.stringify({message:text})});setChat(c=>[...c,{role:'assistant',text:r.reply}]);}catch(err){setChat(c=>[...c,{role:'assistant',text:err.message}]);}finally{setBusy(false)}}
 return <div className="app">
  <header><a className="brand" href="#"><span className="brand-icon"><ShoppingBag size={20}/></span>ShopSmart<span className="ai">AI</span></a><nav><a href="#products">Explore</a><a href="#assistant">AI Assistant</a></nav><button className="cart-button" onClick={()=>setShowCart(!showCart)}><ShoppingBag size={18}/> Cart <b>{cart.reduce((n,p)=>n+p.qty,0)}</b></button></header>
  <main>
   <section className="hero"><div><span className="eyebrow"><Sparkles size={15}/> SMARTER WAY TO SHOP</span><h1>Find what you love.<br/><em>Shop smarter.</em></h1><p>Discover everyday essentials and get a little help from your personal AI shopping assistant.</p><a className="primary" href="#products">Explore collection</a></div><div className="hero-art"><div className="orb">✦</div><div className="floating-card">✧ Curated for you <small>Thoughtful picks. Better choices.</small></div></div></section>
   <section id="products" className="section"><div className="section-head"><div><span className="eyebrow">THE COLLECTION</span><h2>Popular picks</h2></div><div className="search"><Search size={17}/><input placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
    <div className="filters">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="products">{visible.map(p=><article className="product" key={p.id}><div className="product-image"><img src={p.image_url||'https://placehold.co/600x400?text=ShopSmart'} alt={p.name}/><span>{p.category}</span></div><div className="product-info"><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><strong>₹{Number(p.price).toLocaleString('en-IN')}</strong><button onClick={()=>add(p)}>Add to cart <Plus size={15}/></button></div></div></article>)}</div>
    {!visible.length&&<p className="empty">No products match your search.</p>}
   </section>
   <section id="assistant" className="assistant"><div><span className="eyebrow"><Bot size={15}/> YOUR PERSONAL SHOPPER</span><h2>Not sure what to choose?</h2><p>Tell ShopSmart AI what you need, your budget, or who you're shopping for.</p><div className="suggestions"><button onClick={()=>setMessage('Suggest a useful gift under ₹2000')}>Gift under ₹2,000</button><button onClick={()=>setMessage('Help me choose headphones')}>Choose headphones</button></div></div><div className="chat"><div className="chat-title"><Bot/> <div><b>ShopSmart Assistant</b><small>AI-powered shopping help</small></div><span className="online"/></div><div className="messages">{!chat.length&&<div className="bubble bot">Hi! I'm your shopping assistant. What are you looking for today?</div>}{chat.map((m,i)=><div key={i} className={'bubble '+m.role}>{m.text}</div>)}{busy&&<div className="bubble bot">Thinking…</div>}</div><form onSubmit={sendChat}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask me anything..." /><button disabled={busy}><Send size={17}/></button></form></div></section>
  </main>
  {showCart&&<aside className="cart-panel"><div className="cart-title"><h3>Your cart</h3><button onClick={()=>setShowCart(false)}>×</button></div>{cart.map(p=><div className="cart-row" key={p.id}><div><b>{p.name}</b><small>₹{p.price.toLocaleString('en-IN')}</small></div><div className="qty"><button onClick={()=>setCart(c=>c.map(x=>x.id===p.id?{...x,qty:Math.max(1,x.qty-1)}:x))}><Minus size={13}/></button>{p.qty}<button onClick={()=>add(p)}><Plus size={13}/></button><button onClick={()=>setCart(c=>c.filter(x=>x.id!==p.id))}><Trash2 size={13}/></button></div></div>)}<div className="cart-total">Total <b>₹{total.toLocaleString('en-IN')}</b></div><p className="note">Checkout and payment are not enabled in this demo.</p></aside>}
  <footer>© 2026 ShopSmart AI <span>Thoughtful shopping, powered by AI.</span></footer>
 </div>
}