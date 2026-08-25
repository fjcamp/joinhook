import { FormEvent, useMemo, useState } from 'react';
import styles from './LocalAdmin.module.css';
import { adminMutation, loadAdminContent, loginLocalAdmin, type AdminContentSnapshot } from './supabaseGateway';

type Status = 'draft'|'published'|'archived';

export function LocalContentAdmin(){
  const [accessToken,setAccessToken]=useState('');
  const [login,setLogin]=useState({email:'',password:''});
  const [snapshot,setSnapshot]=useState<AdminContentSnapshot|null>(null);
  const [selectedBusinessId,setSelectedBusinessId]=useState('');
  const [catalog,setCatalog]=useState({category:'General',name:'',priceLabel:'',featured:false,sortOrder:0,status:'published' as Status});
  const [message,setMessage]=useState('Inicia sesión para administrar contenido');
  const [busy,setBusy]=useState(false);

  const selectedBusiness=useMemo(()=>snapshot?.businesses.find((item)=>item.id===selectedBusinessId)??snapshot?.businesses[0]??null,[snapshot,selectedBusinessId]);
  const items=useMemo(()=>snapshot?.catalog.filter((item)=>item.business_id===selectedBusiness?.id)??[],[snapshot,selectedBusiness]);

  async function reload(token=accessToken){
    if(!token)return;
    const data=await loadAdminContent(token);
    setSnapshot(data);
    if(!selectedBusinessId&&data.businesses[0])setSelectedBusinessId(data.businesses[0].id);
  }

  async function signIn(event:FormEvent){
    event.preventDefault();setBusy(true);
    try{const session=await loginLocalAdmin(login.email.trim(),login.password);setAccessToken(session.accessToken);setLogin((x)=>({...x,password:''}));await reload(session.accessToken);setMessage('Contenido administrativo cargado');}
    catch{setMessage('No fue posible iniciar sesión');}
    finally{setBusy(false);}
  }

  async function setBusinessStatus(status:Status){
    if(!selectedBusiness)return;setBusy(true);
    try{await adminMutation(accessToken,{entity:'business',action:'update',data:{id:selectedBusiness.id,slug:selectedBusiness.slug,name:selectedBusiness.name,category:selectedBusiness.category,city:selectedBusiness.city,region:selectedBusiness.region,summary:selectedBusiness.summary,latitude:selectedBusiness.latitude,longitude:selectedBusiness.longitude,openNow:selectedBusiness.open_now,verification:selectedBusiness.verification,status}});await reload();setMessage(`Comercio actualizado a ${status}`);}
    catch(error){setMessage(error instanceof Error?error.message:'Error al actualizar');}finally{setBusy(false);}
  }

  async function addCatalog(event:FormEvent){
    event.preventDefault();if(!selectedBusiness)return;setBusy(true);
    try{await adminMutation(accessToken,{entity:'catalog',action:'create',data:{businessId:selectedBusiness.id,...catalog}});setCatalog({category:'General',name:'',priceLabel:'',featured:false,sortOrder:items.length+1,status:'published'});await reload();setMessage('Elemento de catálogo creado');}
    catch(error){setMessage(error instanceof Error?error.message:'Error al crear catálogo');}finally{setBusy(false);}
  }

  async function archiveCatalog(itemId:string){
    const item=items.find((row)=>row.id===itemId);if(!item)return;setBusy(true);
    try{await adminMutation(accessToken,{entity:'catalog',action:'update',data:{id:item.id,businessId:item.business_id,category:item.category,name:item.name,priceLabel:item.price_label,featured:item.featured,sortOrder:item.sort_order,status:'archived'}});await reload();setMessage('Elemento archivado');}
    catch(error){setMessage(error instanceof Error?error.message:'Error al archivar');}finally{setBusy(false);}
  }

  async function setSignalStatus(id:string,status:Status){
    const row=snapshot?.signals.find((item)=>item.id===id);if(!row)return;setBusy(true);
    try{await adminMutation(accessToken,{entity:'signal',action:'update',data:{id:row.id,kind:row.kind,title:row.title,summary:row.summary,city:row.city,region:row.region,sponsored:row.sponsored,verification:row.verification,sourceUrl:row.source_url,status}});await reload();setMessage(`Señal actualizada a ${status}`);}
    catch(error){setMessage(error instanceof Error?error.message:'Error al actualizar señal');}finally{setBusy(false);}
  }

  if(!accessToken)return <main className={styles.page}><section className={styles.shell}><header className={styles.header}><div><div className={styles.muted}>JoinHook Local · Contenido</div><h1>Administración de contenido</h1></div><div className={styles.status}>{message}</div></header><form className={styles.card} onSubmit={signIn}><h2>Acceso</h2><div className={styles.form}><div className={styles.field}><label>Correo</label><input type="email" required value={login.email} onChange={(e)=>setLogin({...login,email:e.target.value})}/></div><div className={styles.field}><label>Contraseña</label><input type="password" required value={login.password} onChange={(e)=>setLogin({...login,password:e.target.value})}/></div><div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy}>Iniciar sesión</button></div></div></form></section></main>;

  return <main className={styles.page}><section className={styles.shell}>
    <header className={styles.header}><div><div className={styles.muted}>JoinHook Local · CRUD territorial</div><h1>Contenido y catálogo</h1></div><div className={styles.status}>{message}</div></header>
    <article className={styles.card}><div className={styles.actions}><strong>Rol: {snapshot?.actor.role||'—'}</strong><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void reload()} disabled={busy}>Actualizar</button><button className={`${styles.button} ${styles.secondary}`} onClick={()=>{setAccessToken('');setSnapshot(null);}}>Cerrar sesión</button></div></article>

    <section className={styles.grid}>
      <article className={styles.card}><h2>Comercios</h2><div className={styles.field}><label>Seleccionar</label><select value={selectedBusiness?.id||''} onChange={(e)=>setSelectedBusinessId(e.target.value)}>{snapshot?.businesses.map((item)=><option key={item.id} value={item.id}>{item.name} · {item.status}</option>)}</select></div>{selectedBusiness&&<><p className={styles.muted}>{selectedBusiness.category} · {selectedBusiness.city}</p><p>{selectedBusiness.summary}</p><div className={styles.actions}><button className={styles.button} onClick={()=>void setBusinessStatus('published')} disabled={busy}>Publicar</button><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void setBusinessStatus('draft')} disabled={busy}>Borrador</button><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void setBusinessStatus('archived')} disabled={busy}>Archivar</button></div></>}</article>

      <form className={styles.card} onSubmit={addCatalog}><h2>Agregar al catálogo</h2><div className={styles.form}><div className={styles.field}><label>Categoría</label><input required value={catalog.category} onChange={(e)=>setCatalog({...catalog,category:e.target.value})}/></div><div className={styles.field}><label>Nombre</label><input required value={catalog.name} onChange={(e)=>setCatalog({...catalog,name:e.target.value})}/></div><div className={styles.field}><label>Precio / CTA</label><input value={catalog.priceLabel} onChange={(e)=>setCatalog({...catalog,priceLabel:e.target.value})}/></div><div className={styles.field}><label>Orden</label><input type="number" value={catalog.sortOrder} onChange={(e)=>setCatalog({...catalog,sortOrder:Number(e.target.value)})}/></div><label className={styles.muted}><input type="checkbox" checked={catalog.featured} onChange={(e)=>setCatalog({...catalog,featured:e.target.checked})}/> Destacado</label><div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy||!selectedBusiness}>Crear elemento</button></div></div></form>
    </section>

    <article className={styles.card}><h2>Catálogo de {selectedBusiness?.name||'comercio'}</h2><div className={styles.list}>{items.map((item)=><div className={styles.row} key={item.id}><div><strong>{item.name}</strong><div className={styles.muted}>{item.category} · {item.price_label} · {item.status}</div></div><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void archiveCatalog(item.id)} disabled={busy||item.status==='archived'}>Archivar</button></div>)}{!items.length&&<p className={styles.muted}>Este comercio aún no tiene catálogo.</p>}</div></article>

    <article className={styles.card}><h2>Señales territoriales</h2><div className={styles.list}>{snapshot?.signals.map((item)=><div className={styles.row} key={item.id}><div><strong>{item.title}</strong><div className={styles.muted}>{item.kind} · {item.city||'territorial'} · {item.status}</div></div><div className={styles.actions}><button className={styles.button} onClick={()=>void setSignalStatus(item.id,'published')} disabled={busy}>Publicar</button><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void setSignalStatus(item.id,'archived')} disabled={busy}>Archivar</button></div></div>)}</div></article>
  </section></main>;
}
