import React, { useState } from "react";
import { useGenericProduct } from "../../../Redux/features/genericProduct";
import { useCategorySchema } from "../../../Redux/features/categorySchema";
import CustomModal from "../../../components/CustomModal";

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const PlusIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const CloseIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevDown   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevRight  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const XIcon      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ─── Capability cards ─────────────────────────────────────────── */
const FEATURES = [
  { icon:"🗂️", title:"Any Category",   desc:"Eyewear, Travel Bags, Lipstick, Mirrors — anything not in built-in Products.", color:"#6366f1", bg:"#eef2ff", border:"#c7d2fe" },
  { icon:"🏷️", title:"Schema Builder", desc:"Define the exact fields each category needs — text, numbers, dropdowns, required.",   color:"#0369a1", bg:"#f0f9ff", border:"#bae6fd" },
  { icon:"📦", title:"Multi-Variant",  desc:"Every product holds multiple variants, each with its own stock, cost, and attributes.",color:"#15803d", bg:"#f0fdf4", border:"#bbf7d0" },
  { icon:"🛡️", title:"Duplicate Guard",desc:"Same brand + name + category → 409 error. No accidental duplicates.", color:"#b45309", bg:"#fffbeb", border:"#fde68a" },
];

const HOW_TO = [
  { step:"01", icon:"🔍", title:"Search Category",  desc:"Type any category name. The system checks if a schema exists for it." },
  { step:"02", icon:"🏗️", title:"Define Schema",    desc:"If no schema yet, click 'Define Schema' to specify required fields like material, size, color." },
  { step:"03", icon:"✏️", title:"Add Products",     desc:"Use the structured form — fields match exactly what you defined in the schema." },
];

const QUICK_PICKS = [
  { label:"👓 Eyewear",     value:"Eyewear"     },
  { label:"🧳 Travel Bags", value:"Travel Bags" },
  { label:"💄 Lipstick",    value:"Lipstick"    },
  { label:"🪞 Mirrors",     value:"Mirrors"     },
  { label:"🌸 Perfume",     value:"Perfume"     },
  { label:"🧸 Toys",        value:"Toys"        },
  { label:"📚 Books",       value:"Books"       },
  { label:"🎮 Gaming",      value:"Gaming"      },
];

/* ─── Attribute tag display ────────────────────────────────────── */
function AttrTags({ attrs }) {
  if (!attrs || typeof attrs !== "object") return null;
  const entries = Object.entries(attrs);
  if (!entries.length) return <span style={{ color:"#94a3b8", fontSize:12 }}>—</span>;
  return (
    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
      {entries.slice(0, 3).map(([k,v]) => <span key={k} style={S.attrTag}>{k}: {String(v)}</span>)}
      {entries.length > 3 && <span style={{ fontSize:10, color:"#94a3b8", alignSelf:"center" }}>+{entries.length-3}</span>}
    </div>
  );
}

/* ─── Generic key-value attribute editor ───────────────────────── */
function AttrEditor({ attrs, onChange }) {
  const add    = () => onChange([...attrs, { key:"", value:"" }]);
  const remove = (i) => onChange(attrs.filter((_,idx)=>idx!==i));
  const update = (i,f,v) => onChange(attrs.map((a,idx)=>idx===i?{...a,[f]:v}:a));
  return (
    <div>
      {attrs.map((a,i)=>(
        <div key={i} style={{ display:"flex", gap:6, marginBottom:6, alignItems:"center" }}>
          <input style={{...S.input,flex:1}}  placeholder="key   (e.g. material)"  value={a.key}   onChange={e=>update(i,"key",  e.target.value)}/>
          <input style={{...S.input,flex:2}}  placeholder="value (e.g. Leather)"   value={a.value} onChange={e=>update(i,"value",e.target.value)}/>
          <button style={S.removeBtn} onClick={()=>remove(i)} title="Remove"><XIcon/></button>
        </div>
      ))}
      <button style={S.addAttrBtn} onClick={add}><PlusIcon/> Add Attribute</button>
    </div>
  );
}

/* ─── Schema-driven field renderer ─────────────────────────────── */
function SchemaFields({ fields, values, onChange, disabled }) {
  if (!fields?.length) return null;
  return (
    <div style={S.formGrid}>
      {fields.map((f) => {
        const val = values[f.name] ?? "";
        const common = {
          style: disabled ? {...S.input,...S.inputDisabled} : S.input,
          value: val,
          disabled,
          onChange: (e) => !disabled && onChange({ ...values, [f.name]: e.target.value }),
        };
        return (
          <div key={f.name} style={f.type === "textarea" ? {...S.formField, gridColumn:"span 2"} : S.formField}>
            <label style={S.label}>
              {f.label}
              {f.required && <span style={S.req}> *</span>}
            </label>
            {f.type === "select" ? (
              <select {...common}>
                <option value="">Select {f.label}</option>
                {(f.options||[]).map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea {...common} placeholder={f.placeholder || f.label} style={{...common.style,minHeight:64,resize:"vertical"}}/>
            ) : (
              <input {...common} type={f.type==="number"?"number":"text"} placeholder={f.placeholder||f.label}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Schema field-definition row editor ───────────────────────── */
function SchemaFieldEditor({ fields, onChange, title }) {
  const add    = () => onChange([...fields,{ name:"", label:"", type:"text", required:false, options:[], placeholder:"" }]);
  const remove = (i) => onChange(fields.filter((_,idx)=>idx!==i));
  const update = (i,k,v) => onChange(fields.map((f,idx)=>idx===i?{...f,[k]:v}:f));
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={S.sectionBar}/><h3 style={S.sectionTitle}>{title}</h3>
      </div>
      {fields.length === 0 && (
        <p style={{ fontSize:12, color:"#94a3b8", margin:"0 0 10px 0" }}>No fields defined yet. Click "+ Add Field" to start.</p>
      )}
      {fields.map((f,i)=>(
        <div key={i} style={S.schemaFieldRow}>
          <div style={S.schemaFieldGrid}>
            <div>
              <label style={S.smallLabel}>Field Key *</label>
              <input style={S.input} placeholder="e.g. lens_type" value={f.name} onChange={e=>update(i,"name",e.target.value)}/>
            </div>
            <div>
              <label style={S.smallLabel}>Display Label *</label>
              <input style={S.input} placeholder="e.g. Lens Type" value={f.label} onChange={e=>update(i,"label",e.target.value)}/>
            </div>
            <div>
              <label style={S.smallLabel}>Type</label>
              <select style={S.input} value={f.type} onChange={e=>update(i,"type",e.target.value)}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select (dropdown)</option>
                <option value="textarea">Textarea</option>
              </select>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:18 }}>
              <input type="checkbox" id={`req-${i}`} checked={f.required} onChange={e=>update(i,"required",e.target.checked)}/>
              <label htmlFor={`req-${i}`} style={{ fontSize:12, color:"#374151", cursor:"pointer" }}>Required</label>
            </div>
          </div>
          {f.type === "select" && (
            <div style={{ marginTop:6 }}>
              <label style={S.smallLabel}>Options (comma-separated)</label>
              <input
                style={S.input}
                placeholder="e.g. Polarized, UV400, Tinted"
                value={(f.options||[]).join(", ")}
                onChange={e=>update(i,"options",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}
              />
            </div>
          )}
          <div style={{ marginTop:6 }}>
            <label style={S.smallLabel}>Placeholder text (optional)</label>
            <div style={{ display:"flex", gap:8 }}>
              <input style={{...S.input,flex:1}} placeholder="e.g. Enter lens type" value={f.placeholder||""} onChange={e=>update(i,"placeholder",e.target.value)}/>
              <button style={S.removeBtn} onClick={()=>remove(i)} title="Remove field"><TrashIcon/></button>
            </div>
          </div>
        </div>
      ))}
      <button style={S.addAttrBtn} onClick={add}><PlusIcon/> Add Field</button>
    </div>
  );
}

/* ─── Base field names already covered by the hardcoded form ────── */
const BASE_FIELDS = new Set(["name", "brand", "description", "category"]);
const filterSchemaFields = (fields) =>
  (fields || []).filter(f => !BASE_FIELDS.has(f.name.toLowerCase()));

/* ─── Helpers ───────────────────────────────────────────────────── */
const attrsToObj = (arr) => {
  const obj={};
  arr.forEach(({key,value})=>{ if(key.trim()) obj[key.trim()]=value; });
  return obj;
};
const objToAttrs = (obj) => {
  if(!obj||typeof obj!=="object") return [];
  return Object.entries(obj).map(([key,value])=>({key,value:String(value)}));
};
const schemaValsToObj = (fields, vals) => {
  const obj={};
  (fields||[]).forEach(f=>{ if(vals[f.name]!==undefined&&vals[f.name]!=="") obj[f.name]=vals[f.name]; });
  return obj;
};

function FormSection({ title, badge, hint, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={S.sectionBar}/><h3 style={S.sectionTitle}>{title}</h3>
        {badge && <span style={S.sectionBadge}>{badge}</span>}
      </div>
      {hint && <p style={{ fontSize:11, color:"#64748b", margin:"0 0 10px 0", lineHeight:1.5 }}>{hint}</p>}
      {children}
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function GenericProductPanel() {
  const {
    loading: prodLoading, products,
    loadProducts, addProduct, updateProduct, deleteProduct, addVariant, deleteVariant,
  } = useGenericProduct();
  const {
    loading: schLoading, schema,
    loadSchema, defineSchema, removeSchema, clear: clearSchema,
  } = useCategorySchema();
  const loading = prodLoading || schLoading;

  /* ── Browse state ── */
  const [categoryInput, setCategoryInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [expandedRows, setExpandedRows]   = useState({});

  /* ── Product modal ── */
  const [showModal, setShowModal]         = useState(false);
  const [modalMode, setModalMode]         = useState("add");
  const [editingProduct, setEditingProduct] = useState(null);

  /* ── Product form: base fields ── */
  const [pForm, setPForm] = useState({ category:"", name:"", brand:"", description:"" });
  /* Schema-driven product attribute values */
  const [pSchemaVals, setPSchemaVals]     = useState({});
  /* Fallback generic key-value (when no schema) */
  const [pAttrs, setPAttrs]               = useState([]);

  /* ── Variant form ── */
  const [vForm, setVForm]     = useState({ cost:"", count:"", image_url:"" });
  const [vSchemaVals, setVSchemaVals] = useState({});
  const [vAttrs, setVAttrs]           = useState([]);

  /* ── Schema builder modal ── */
  const [showSchemaModal, setShowSchemaModal]     = useState(false);
  const [sFields, setSFields]                     = useState([]);
  const [sVarFields, setSVarFields]               = useState([]);

  /* ── Feedback ── */
  const [statusModal, setStatusModal]   = useState({ open:false, type:"info", title:"", message:"" });
  const [confirmModal, setConfirmModal] = useState({ open:false, message:"", onConfirm:null });

  const notify = (type, title, message) => setStatusModal({ open:true, type, title, message });
  const refetch = () => { if (activeCategory) loadProducts(activeCategory); };

  /* ── Search ── */
  const handleSearch = (cat) => {
    const c = (cat || categoryInput).trim();
    if (!c) return;
    setCategoryInput(c);
    setActiveCategory(c);
    loadProducts(c);
    loadSchema(c);
  };

  const handleClear = () => {
    setCategoryInput(""); setActiveCategory("");
    clearSchema();
  };

  /* ── Schema builder open ── */
  const openSchemaBuilder = () => {
    setSFields(schema?.fields        ? JSON.parse(JSON.stringify(schema.fields))        : []);
    setSVarFields(schema?.variantFields ? JSON.parse(JSON.stringify(schema.variantFields)) : []);
    setShowSchemaModal(true);
  };

  const handleSaveSchema = async () => {
    const result = await defineSchema({ categoryName: activeCategory, fields: sFields, variantFields: sVarFields });
    setShowSchemaModal(false);
    if (result.meta.requestStatus === "fulfilled") notify("success", "Schema Saved!", `Schema for "${activeCategory}" is now active.`);
    else notify("error", "Save Failed", result.payload?.message || "Could not save schema.");
  };

  const handleDeleteSchema = () => {
    setConfirmModal({
      open:true, message:`Delete the schema for "${activeCategory}"? Products already saved are not affected.`,
      onConfirm: async () => {
        setConfirmModal({ open:false, message:"", onConfirm:null });
        await removeSchema(activeCategory);
        notify("success","Schema Deleted",`Schema for "${activeCategory}" removed.`);
      },
    });
  };

  /* ── Product modal openers ── */
  const openAddModal = () => {
    if (!schema) {
      notify("error", "Schema Required", `Define a schema for "${activeCategory}" first — it specifies what fields this category needs before any products can be added.`);
      return;
    }
    setModalMode("add");
    setPForm({ category:activeCategory, name:"", brand:"", description:"" });
    setPSchemaVals({}); setPAttrs([]);
    setVForm({ cost:"", count:"", image_url:"" }); setVSchemaVals({}); setVAttrs([]);
    setEditingProduct(null); setShowModal(true);
  };
  const openEditModal = (product) => {
    setModalMode("editProduct"); setEditingProduct(product);
    setPForm({ category:product.category, name:product.name, brand:product.brand, description:product.description||"" });
    if (schema?.fields?.length) {
      const vals={};
      (schema.fields||[]).forEach(f=>{ vals[f.name]=product.attributes?.[f.name]??""; });
      setPSchemaVals(vals);
    } else {
      setPAttrs(objToAttrs(product.attributes));
    }
    setVForm({ cost:"", count:"", image_url:"" }); setVSchemaVals({}); setVAttrs([]);
    setShowModal(true);
  };
  const openAddVariantModal = (product) => {
    setModalMode("addVariant"); setEditingProduct(product);
    setPForm({ category:product.category, name:product.name, brand:product.brand, description:"" });
    setPAttrs([]); setPSchemaVals({});
    setVForm({ cost:"", count:"", image_url:"" }); setVSchemaVals({}); setVAttrs([]);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  /* ── Build attributes object from whichever form mode is active ── */
  const buildProductAttrs = () =>
    schema?.fields?.length ? schemaValsToObj(filterSchemaFields(schema.fields), pSchemaVals) : attrsToObj(pAttrs);
  const buildVariantAttrs = () =>
    schema?.variantFields?.length ? schemaValsToObj(schema.variantFields, vSchemaVals) : attrsToObj(vAttrs);

  /* ── Submits ── */
  const handleAddProduct = async () => {
    const result = await addProduct({
      ...pForm,
      attributes: buildProductAttrs(),
      variants:[{ cost:Number(vForm.cost), count:Number(vForm.count), image_url:vForm.image_url||"", attributes:buildVariantAttrs() }],
    });
    closeModal();
    if (result.meta.requestStatus==="fulfilled") { refetch(); notify("success","Product Registered!",result.payload?.message||"Done."); }
    else notify("error","Registration Failed", result.payload?.message||result.payload?.error||"Something went wrong.");
  };
  const handleEditProduct = async () => {
    const result = await updateProduct({
      id:editingProduct._id||editingProduct.id, name:pForm.name, brand:pForm.brand,
      description:pForm.description, attributes:buildProductAttrs(),
    });
    closeModal();
    if (result.meta.requestStatus==="fulfilled") { refetch(); notify("success","Updated!","Product updated."); }
    else notify("error","Update Failed",result.payload?.message||"Update failed.");
  };
  const handleAddVariant = async () => {
    const result = await addVariant({
      id:editingProduct._id||editingProduct.id,
      variantData:{ cost:Number(vForm.cost), count:Number(vForm.count), image_url:vForm.image_url||"", attributes:buildVariantAttrs() },
    });
    closeModal();
    if (result.meta.requestStatus==="fulfilled") { refetch(); notify("success","Variant Added!","New variant added."); }
    else notify("error","Failed",result.payload?.message||"Failed to add variant.");
  };
  const handleDeleteProduct = (id) => {
    setConfirmModal({ open:true, message:"Delete this product and all its variants? This cannot be undone.",
      onConfirm: async () => { setConfirmModal({open:false,message:"",onConfirm:null}); await deleteProduct(id); refetch(); },
    });
  };
  const handleDeleteVariant = (productId, variantId) => {
    setConfirmModal({ open:true, message:"Delete this variant?",
      onConfirm: async () => { setConfirmModal({open:false,message:"",onConfirm:null}); await deleteVariant({id:productId,variantId}); refetch(); },
    });
  };

  const modalTitle  = { add:"Register New Product", editProduct:"Edit Product", addVariant:"Add Variant" }[modalMode];
  const submitLabel = { add:"Register Product",      editProduct:"Save Changes",  addVariant:"Add Variant" }[modalMode];
  const submitFn    = { add:handleAddProduct, editProduct:handleEditProduct, addVariant:handleAddVariant }[modalMode];

  /* stats */
  const totalProducts = products.length;
  const totalStock    = products.reduce((s,p)=>s+(p.variants?.reduce((a,v)=>a+(v.count||0),0)??0),0);
  const totalSold     = products.reduce((s,p)=>s+(p.variants?.reduce((a,v)=>a+(v.purchaseCount||0),0)??0),0);
  const totalVariants = products.reduce((s,p)=>s+(p.variants?.length||0),0);

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div style={S.page}>

      {/* ── Hero ── */}
      <div style={S.hero}>
        <div style={S.heroLeft}>
          <div style={S.heroIcon}>🗂️</div>
          <div>
            <h1 style={S.heroTitle}>Product Catalog</h1>
            <p style={S.heroSub}>
              Register any product category with <strong>custom schemas</strong> — define the exact fields each category needs, then add products using those structured forms.
            </p>
            <div style={S.heroPills}>
              {["Any Category","Schema Builder","Multi-Variant","Duplicate Guard"].map(t=>(
                <span key={t} style={S.heroPill}>✦ {t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Capability cards ── */}
      <div style={S.featureGrid}>
        {FEATURES.map(f=>(
          <div key={f.title} style={{...S.featureCard, borderColor:f.border, background:f.bg}}>
            <div style={{...S.featureCardIcon, color:f.color}}>{f.icon}</div>
            <div>
              <p style={{...S.featureCardTitle, color:f.color}}>{f.title}</p>
              <p style={S.featureCardDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search card ── */}
      <div style={S.searchCard}>
        <p style={S.searchCardLabel}>Browse or create a category</p>
        <div style={S.searchRow}>
          <div style={S.searchBox}>
            <SearchIcon/>
            <input
              style={S.searchInput}
              placeholder="Type a category name  (e.g. Eyewear, Travel Bags, Lipstick…)"
              value={categoryInput}
              onChange={e=>setCategoryInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSearch()}
            />
            {categoryInput && <button style={S.clearBtn} onClick={handleClear}><XIcon/></button>}
          </div>
          <button style={S.searchBtn} onClick={()=>handleSearch()} onMouseEnter={e=>e.currentTarget.style.background="#4f46e5"} onMouseLeave={e=>e.currentTarget.style.background="#6366f1"}>
            <SearchIcon/> Search
          </button>
          {activeCategory && (
            schema ? (
              <button style={S.addBtn} onClick={openAddModal} onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"#059669",transform:"translateY(-1px)"})} onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:"#10b981",transform:"translateY(0)"})}>
                <PlusIcon/> Add Product
              </button>
            ) : (
              <button style={S.addBtnLocked} onClick={openSchemaBuilder} title="Define a schema before adding products">
                🔒 Define Schema First
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Landing (no category) ── */}
      {!activeCategory && (
        <>
          <div style={S.howCard}>
            <p style={S.howTitle}>How it works</p>
            <div style={S.howSteps}>
              {HOW_TO.map((h,i)=>(
                <React.Fragment key={h.step}>
                  <div style={S.howStep}>
                    <div style={S.howStepNum}>{h.step}</div>
                    <div style={S.howStepIcon}>{h.icon}</div>
                    <p style={S.howStepTitle}>{h.title}</p>
                    <p style={S.howStepDesc}>{h.desc}</p>
                  </div>
                  {i<HOW_TO.length-1 && <div style={S.howArrow}>→</div>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={S.quickCard}>
            <p style={S.quickTitle}>Quick-start examples — click to browse</p>
            <div style={S.quickChips}>
              {QUICK_PICKS.map(q=>(
                <button key={q.value} style={S.quickChip} onClick={()=>handleSearch(q.value)}
                  onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"#eef2ff",borderColor:"#6366f1",color:"#4f46e5"})}
                  onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:"#fff",borderColor:"#e2e8f0",color:"#374151"})}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Active category view ── */}
      {activeCategory && (
        <>
          {/* ── Schema status banner ── */}
          {schema ? (
            <div style={{...S.schemaBanner, ...S.schemaBannerDefined}}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={S.schemaCheckIcon}>✓</span>
                <div>
                  <p style={S.schemaBannerTitle}>Schema defined for "{activeCategory}"</p>
                  <p style={S.schemaBannerDesc}>
                    {schema.fields?.length||0} product field{schema.fields?.length!==1?"s":""} ·{" "}
                    {schema.variantFields?.length||0} variant field{schema.variantFields?.length!==1?"s":""}
                    {" "}— Add Product form uses these structured fields.
                  </p>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <button style={S.schemaEditBtn} onClick={openSchemaBuilder}><EditIcon/> Edit Schema</button>
                <button style={S.schemaDeleteBtn} onClick={handleDeleteSchema}><TrashIcon/> Remove</button>
              </div>
            </div>
          ) : (
            <div style={{...S.schemaBanner, ...S.schemaBannerMissing}}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={S.schemaWarningIcon}>⚠</span>
                <div>
                  <p style={S.schemaBannerTitle}>No schema defined for "{activeCategory}"</p>
                  <p style={S.schemaBannerDesc}>
                    A schema must be defined before any products can be added to this category. Click "Define Schema" to specify the fields this category needs.
                  </p>
                </div>
              </div>
              <button style={S.schemaDefineBtn} onClick={openSchemaBuilder}><PlusIcon/> Define Schema</button>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div style={S.statsRow}>
            {[
              { emoji:"📋", val:totalProducts, label:"Products", color:"#0f172a" },
              { emoji:"📦", val:totalStock.toLocaleString(), label:"Total Stock Units", color:"#6366f1" },
              { emoji:"🛒", val:totalSold.toLocaleString(),  label:"Total Units Sold",  color:"#10b981" },
              { emoji:"🏷️", val:totalVariants,              label:"Total Variants",     color:"#f59e0b" },
            ].map(sc=>(
              <div key={sc.label} style={S.statCard}>
                <span style={S.statCardEmoji}>{sc.emoji}</span>
                <div>
                  <p style={{...S.statCardNum, color:sc.color}}>{sc.val}</p>
                  <p style={S.statCardLabel}>{sc.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Products table ── */}
          <div style={S.tableCard}>
            <div style={S.tableHead}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={S.catChip}>{activeCategory}</span>
                <span style={S.tableSubLabel}>{loading?"Loading…":`${products.length} product${products.length!==1?"s":""}`}</span>
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{...S.th,width:40}}/>
                    <th style={S.th}>Product Name</th>
                    <th style={S.th}>Brand</th>
                    <th style={S.th}>Attributes</th>
                    <th style={S.th}>Variants</th>
                    <th style={{...S.th,textAlign:"center"}}>Stock</th>
                    <th style={{...S.th,textAlign:"right"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length===0&&!loading ? (
                    <tr><td colSpan={7} style={S.emptyCell}>
                      <div style={S.emptyState}>
                        <div style={S.emptyIcon}>📭</div>
                        <p style={S.emptyTitle}>No products in "{activeCategory}" yet</p>
                        <p style={S.emptySubtitle}>
                          {schema
                            ? "Click 'Add Product' above — the form will use your defined schema fields."
                            : "No schema yet. Define one first so the system knows what fields this category needs."}
                        </p>
                        {schema ? (
                          <button style={S.emptyAddBtn} onClick={openAddModal}><PlusIcon/> Register First Product</button>
                        ) : (
                          <button style={{...S.emptyAddBtn, background:"#6366f1"}} onClick={openSchemaBuilder}><PlusIcon/> Define Schema First</button>
                        )}
                      </div>
                    </td></tr>
                  ) : products.map((product) => {
                    const pid   = product._id||product.id;
                    const stock = product.variants?.reduce((s,v)=>s+(v.count||0),0)||0;
                    const isExp = expandedRows[pid];
                    return (
                      <React.Fragment key={pid}>
                        <tr style={S.tableRow} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={S.td}>
                            <button style={S.expandBtn} onClick={()=>setExpandedRows(p=>({...p,[pid]:!p[pid]}))}>
                              {isExp?<ChevDown/>:<ChevRight/>}
                            </button>
                          </td>
                          <td style={S.td}>
                            <span style={S.productName}>{product.name}</span>
                            {product.description && <span style={S.productDesc}>{product.description.slice(0,50)}{product.description.length>50?"…":""}</span>}
                          </td>
                          <td style={S.td}><span style={S.brandBadge}>{product.brand}</span></td>
                          <td style={S.td}><AttrTags attrs={product.attributes}/></td>
                          <td style={S.td}><span style={S.variantBadge}>{product.variants?.length||0} variants</span></td>
                          <td style={{...S.td,textAlign:"center"}}>
                            <span style={stock===0?S.stockEmpty:stock<10?S.stockLow:S.stockOk}>{stock}</span>
                          </td>
                          <td style={{...S.td,textAlign:"right"}}>
                            <div style={S.actions}>
                              <button style={S.btnGhost} title="Add Variant"   onClick={()=>openAddVariantModal(product)}><PlusIcon/></button>
                              <button style={S.btnBlue}  title="Edit Product"  onClick={()=>openEditModal(product)}><EditIcon/></button>
                              <button style={S.btnRed}   title="Delete Product" onClick={()=>handleDeleteProduct(pid)}><TrashIcon/></button>
                            </div>
                          </td>
                        </tr>
                        {isExp && product.variants?.length>0 && (
                          <tr><td colSpan={7} style={S.variantCell}>
                            <div style={S.variantBlock}>
                              <p style={S.variantBlockTitle}>Variants · {product.variants.length}</p>
                              <table style={{...S.table,minWidth:"unset"}}>
                                <thead><tr>
                                  <th style={S.variantTh}>Cost</th><th style={S.variantTh}>Stock</th>
                                  <th style={S.variantTh}>Image</th><th style={S.variantTh}>Attributes</th>
                                  <th style={{...S.variantTh,textAlign:"center"}}>Sold</th>
                                  <th style={{...S.variantTh,textAlign:"center"}}>Rating</th>
                                  <th style={{...S.variantTh,textAlign:"right"}}>Action</th>
                                </tr></thead>
                                <tbody>
                                  {product.variants.map(v=>(
                                    <tr key={v._id||v.id} style={S.variantRow} onMouseEnter={e=>e.currentTarget.style.background="#f0f9ff"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                      <td style={S.variantTd}><span style={{fontWeight:700,color:"#0f172a"}}>₹{v.cost??0}</span></td>
                                      <td style={S.variantTd}>{v.count??0}</td>
                                      <td style={S.variantTd}>
                                        {v.image_url&&v.image_url!=="No image found"
                                          ?<a href={v.image_url} target="_blank" rel="noreferrer" style={{color:"#6366f1",fontSize:12}}>View ↗</a>
                                          :<span style={{color:"#cbd5e1",fontSize:12}}>—</span>}
                                      </td>
                                      <td style={S.variantTd}><AttrTags attrs={v.attributes}/></td>
                                      <td style={{...S.variantTd,textAlign:"center"}}><span style={S.soldBadge}>{(v.purchaseCount||0).toLocaleString()}</span></td>
                                      <td style={{...S.variantTd,textAlign:"center"}}>
                                        {v.rating!=null?<span style={S.ratingBadge}>★ {v.rating}</span>:<span style={{fontSize:12,color:"#94a3b8"}}>N/A</span>}
                                      </td>
                                      <td style={{...S.variantTd,textAlign:"right"}}>
                                        <button style={S.btnRed} title="Delete Variant" onClick={()=>handleDeleteVariant(pid,v._id||v.id)}><TrashIcon/></button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td></tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ════ SCHEMA BUILDER MODAL ════ */}
      {showSchemaModal && (
        <div style={S.overlay}>
          <div style={{...S.modal, maxWidth:720}}>
            <div style={S.modalHead}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={S.modalHeadIcon}>🏗️</div>
                <div>
                  <h2 style={S.modalTitle}>{schema?"Edit Schema":"Define Schema"} — {activeCategory}</h2>
                  <p style={S.modalSub}>Define the fields that appear in the "Add / Edit Product" form for this category</p>
                </div>
              </div>
              <button style={S.closeBtn} onClick={()=>setShowSchemaModal(false)}><CloseIcon/></button>
            </div>
            <div style={S.modalBody}>
              <div style={S.schemaInfoBox}>
                <strong>💡 How schema fields work:</strong> Product fields become attributes stored on the product (e.g. lens_type, material). Variant fields become attributes on each variant (e.g. color, size). Both are stored as flexible key-value data — no code changes needed.
              </div>
              <SchemaFieldEditor fields={sFields} onChange={setSFields} title="Product Fields"/>
              <SchemaFieldEditor fields={sVarFields} onChange={setSVarFields} title="Variant Fields"/>
            </div>
            <div style={S.modalFoot}>
              <button style={S.btnOutline} onClick={()=>setShowSchemaModal(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={handleSaveSchema} disabled={loading}>
                {loading?"Saving…":"Save Schema"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ PRODUCT / VARIANT MODAL ════ */}
      {showModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={S.modalHead}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={S.modalHeadIcon}>{{add:"✨",editProduct:"✏️",addVariant:"📦"}[modalMode]}</div>
                <div>
                  <h2 style={S.modalTitle}>{modalTitle}</h2>
                  <p style={S.modalSub}>
                    {modalMode==="add"
                      ? schema?`Using "${activeCategory}" schema — structured fields`:"No schema — using free-form key-value fields"
                      : `${editingProduct?.category} · ${editingProduct?.name}`}
                  </p>
                </div>
              </div>
              <button style={S.closeBtn} onClick={closeModal}><CloseIcon/></button>
            </div>
            <div style={S.modalBody}>

              {/* Product base fields */}
              <FormSection title="Product Details" badge={modalMode==="addVariant"?"Read-only":undefined}>
                <div style={S.formGrid}>
                  <div style={S.formField}>
                    <label style={S.label}>Category <span style={S.req}>*</span></label>
                    <input style={modalMode!=="add"?{...S.input,...S.inputDisabled}:S.input} value={pForm.category} disabled={modalMode!=="add"} onChange={e=>setPForm({...pForm,category:e.target.value})} placeholder="e.g. Eyewear"/>
                  </div>
                  <div style={S.formField}>
                    <label style={S.label}>Product Name <span style={S.req}>*</span></label>
                    <input style={modalMode==="addVariant"?{...S.input,...S.inputDisabled}:S.input} value={pForm.name} disabled={modalMode==="addVariant"} onChange={e=>setPForm({...pForm,name:e.target.value})} placeholder="e.g. Classic Aviator"/>
                  </div>
                  <div style={S.formField}>
                    <label style={S.label}>Brand <span style={S.req}>*</span></label>
                    <input style={modalMode==="addVariant"?{...S.input,...S.inputDisabled}:S.input} value={pForm.brand} disabled={modalMode==="addVariant"} onChange={e=>setPForm({...pForm,brand:e.target.value})} placeholder="e.g. RayBan"/>
                  </div>
                  <div style={S.formField}>
                    <label style={S.label}>Description</label>
                    <input style={modalMode==="addVariant"?{...S.input,...S.inputDisabled}:S.input} value={pForm.description} disabled={modalMode==="addVariant"} onChange={e=>setPForm({...pForm,description:e.target.value})} placeholder="Short description"/>
                  </div>
                </div>
              </FormSection>

              {/* Product attributes — schema-driven or generic */}
              {modalMode!=="addVariant" && (() => {
                const extraFields = filterSchemaFields(schema?.fields);
                if (extraFields.length) return (
                  <FormSection title={`${activeCategory} Attributes`} badge="Schema-defined">
                    <SchemaFields fields={extraFields} values={pSchemaVals} onChange={setPSchemaVals} disabled={false}/>
                  </FormSection>
                );
                if (!schema?.fields?.length) return (
                  <FormSection title="Product Attributes" badge="Free-form" hint="No schema defined. Add any key-value pairs, or close this modal and click 'Define Schema' first.">
                    <AttrEditor attrs={pAttrs} onChange={setPAttrs}/>
                  </FormSection>
                );
                return null;
              })()}

              {/* Variant fields */}
              {(modalMode==="add"||modalMode==="addVariant") && (
                <>
                  <FormSection title={modalMode==="add"?"Initial Variant":"Variant Details"}>
                    <div style={S.formGrid}>
                      <div style={S.formField}>
                        <label style={S.label}>Cost (₹) <span style={S.req}>*</span></label>
                        <input style={S.input} type="number" min="0" value={vForm.cost} onChange={e=>setVForm({...vForm,cost:e.target.value})} placeholder="e.g. 1999"/>
                      </div>
                      <div style={S.formField}>
                        <label style={S.label}>Stock Count <span style={S.req}>*</span></label>
                        <input style={S.input} type="number" min="0" value={vForm.count} onChange={e=>setVForm({...vForm,count:e.target.value})} placeholder="e.g. 50"/>
                      </div>
                      <div style={{...S.formField,gridColumn:"span 2"}}>
                        <label style={S.label}>Image URL</label>
                        <input style={S.input} value={vForm.image_url} onChange={e=>setVForm({...vForm,image_url:e.target.value})} placeholder="https://..."/>
                      </div>
                    </div>
                  </FormSection>
                  {schema?.variantFields?.length ? (
                    <FormSection title="Variant Attributes" badge="Schema-defined">
                      <SchemaFields fields={schema.variantFields} values={vSchemaVals} onChange={setVSchemaVals} disabled={false}/>
                    </FormSection>
                  ) : (
                    <FormSection title="Variant Attributes" badge="Free-form" hint="Define a schema to get structured variant fields.">
                      <AttrEditor attrs={vAttrs} onChange={setVAttrs}/>
                    </FormSection>
                  )}
                </>
              )}
            </div>
            <div style={S.modalFoot}>
              <button style={S.btnOutline} onClick={closeModal}>Cancel</button>
              <button style={S.btnPrimary} onClick={submitFn} disabled={loading}>{loading?"Saving…":submitLabel}</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {confirmModal.open && (
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:420}}>
            <div style={S.modalHead}>
              <h2 style={S.modalTitle}>Confirm Delete</h2>
              <button style={S.closeBtn} onClick={()=>setConfirmModal({open:false,message:"",onConfirm:null})}><CloseIcon/></button>
            </div>
            <div style={{padding:"28px 28px 8px",textAlign:"center"}}>
              <div style={S.deleteIcon}>🗑️</div>
              <p style={{color:"#475569",fontSize:14,lineHeight:1.6,margin:0}}>{confirmModal.message}</p>
            </div>
            <div style={S.modalFoot}>
              <button style={S.btnOutline} onClick={()=>setConfirmModal({open:false,message:"",onConfirm:null})}>Cancel</button>
              <button style={{...S.btnPrimary,background:"#ef4444"}} onClick={confirmModal.onConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <CustomModal isOpen={statusModal.open} title={statusModal.title} message={statusModal.message} type={statusModal.type} onClose={()=>setStatusModal({open:false,type:"info",title:"",message:""})}/>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  page:{ padding:"24px 28px", background:"#f8fafc", minHeight:"100%", fontFamily:"'Inter',system-ui,-apple-system,sans-serif" },

  hero:{ background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)", borderRadius:16, padding:"28px 32px", marginBottom:20, display:"flex", alignItems:"center", gap:20, boxShadow:"0 4px 24px rgba(67,56,202,0.35)" },
  heroLeft:{ display:"flex", alignItems:"flex-start", gap:16 },
  heroIcon:{ fontSize:40, flexShrink:0, marginTop:2 },
  heroTitle:{ fontSize:22, fontWeight:800, color:"#fff", margin:"0 0 6px 0", letterSpacing:"-0.3px" },
  heroSub:{ fontSize:13, color:"#c7d2fe", margin:"0 0 14px 0", lineHeight:1.6, maxWidth:520 },
  heroPills:{ display:"flex", gap:8, flexWrap:"wrap" },
  heroPill:{ fontSize:11, fontWeight:600, padding:"4px 10px", background:"rgba(255,255,255,0.12)", color:"#e0e7ff", borderRadius:20, border:"1px solid rgba(255,255,255,0.2)" },

  featureGrid:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 },
  featureCard:{ display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px", borderRadius:12, border:"1.5px solid" },
  featureCardIcon:{ fontSize:22, flexShrink:0, marginTop:1 },
  featureCardTitle:{ fontSize:12, fontWeight:700, margin:"0 0 3px 0", textTransform:"uppercase", letterSpacing:"0.04em" },
  featureCardDesc:{ fontSize:11, color:"#64748b", margin:0, lineHeight:1.5 },

  searchCard:{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"18px 20px", marginBottom:20, boxShadow:"0 1px 3px rgba(15,23,42,0.05)" },
  searchCardLabel:{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 8px" },
  searchRow:{ display:"flex", gap:8, alignItems:"center" },
  searchBox:{ display:"flex", alignItems:"center", gap:8, flex:1, padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, background:"#f8fafc" },
  searchInput:{ flex:1, border:"none", outline:"none", fontSize:13, color:"#0f172a", background:"transparent" },
  clearBtn:{ display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20, border:"none", background:"transparent", color:"#94a3b8", cursor:"pointer", borderRadius:4 },
  searchBtn:{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#6366f1", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s", whiteSpace:"nowrap" },
  addBtn:{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#10b981", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s,transform 0.15s", boxShadow:"0 2px 8px rgba(16,185,129,0.35)", whiteSpace:"nowrap" },
  addBtnLocked:{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"#f1f5f9", color:"#64748b", border:"1.5px dashed #cbd5e1", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" },

  howCard:{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"22px 24px", marginBottom:16 },
  howTitle:{ fontSize:13, fontWeight:700, color:"#0f172a", margin:"0 0 18px 0", textTransform:"uppercase", letterSpacing:"0.05em" },
  howSteps:{ display:"flex", alignItems:"flex-start", gap:8 },
  howStep:{ flex:1, textAlign:"center" },
  howStepNum:{ display:"inline-block", fontSize:10, fontWeight:800, color:"#6366f1", background:"#eef2ff", borderRadius:20, padding:"2px 8px", marginBottom:8 },
  howStepIcon:{ fontSize:26, display:"block", marginBottom:6 },
  howStepTitle:{ fontSize:13, fontWeight:700, color:"#0f172a", margin:"0 0 4px 0" },
  howStepDesc:{ fontSize:11, color:"#64748b", margin:0, lineHeight:1.55 },
  howArrow:{ fontSize:18, color:"#cbd5e1", paddingTop:32, flexShrink:0 },

  quickCard:{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"18px 24px" },
  quickTitle:{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 12px 0" },
  quickChips:{ display:"flex", flexWrap:"wrap", gap:8 },
  quickChip:{ padding:"7px 14px", background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:20, fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer", transition:"all 0.15s" },

  /* Schema banner */
  schemaBanner:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderRadius:12, marginBottom:16, gap:12, flexWrap:"wrap" },
  schemaBannerDefined:{ background:"#f0fdf4", border:"1.5px solid #86efac" },
  schemaBannerMissing:{ background:"#fffbeb", border:"1.5px solid #fcd34d" },
  schemaCheckIcon:{ fontSize:22, color:"#15803d", flexShrink:0 },
  schemaWarningIcon:{ fontSize:22, color:"#b45309", flexShrink:0 },
  schemaBannerTitle:{ fontSize:13, fontWeight:700, color:"#0f172a", margin:"0 0 2px 0" },
  schemaBannerDesc:{ fontSize:12, color:"#64748b", margin:0, lineHeight:1.5 },
  schemaEditBtn:{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"#fff", border:"1.5px solid #86efac", borderRadius:8, fontSize:12, fontWeight:600, color:"#15803d", cursor:"pointer" },
  schemaDeleteBtn:{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"#fff", border:"1.5px solid #fecaca", borderRadius:8, fontSize:12, fontWeight:600, color:"#dc2626", cursor:"pointer" },
  schemaDefineBtn:{ display:"flex", alignItems:"center", gap:5, padding:"8px 16px", background:"#6366f1", border:"none", borderRadius:9, fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", whiteSpace:"nowrap" },

  statsRow:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 },
  statCard:{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", padding:"14px 18px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 3px rgba(15,23,42,0.05)" },
  statCardEmoji:{ fontSize:26 },
  statCardNum:{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"0 0 1px 0" },
  statCardLabel:{ fontSize:11, color:"#94a3b8", margin:0 },

  tableCard:{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", boxShadow:"0 1px 3px rgba(15,23,42,0.06)", overflow:"hidden" },
  tableHead:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:"1px solid #f1f5f9", background:"#fafbff" },
  catChip:{ display:"inline-block", padding:"4px 12px", background:"#eef2ff", color:"#4f46e5", borderRadius:20, fontSize:12, fontWeight:700, marginRight:8 },
  tableSubLabel:{ fontSize:12, color:"#94a3b8" },
  table:{ width:"100%", borderCollapse:"collapse", minWidth:640 },
  th:{ padding:"11px 16px", background:"#f8fafc", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #f1f5f9", whiteSpace:"nowrap" },
  tableRow:{ borderBottom:"1px solid #f8fafc", transition:"background 0.12s" },
  td:{ padding:"12px 16px", fontSize:13, color:"#334155", verticalAlign:"middle" },
  productName:{ display:"block", fontWeight:600, color:"#0f172a", fontSize:13 },
  productDesc:{ display:"block", fontSize:11, color:"#94a3b8", marginTop:1 },
  brandBadge:{ display:"inline-block", padding:"3px 8px", background:"#f1f5f9", color:"#475569", borderRadius:6, fontSize:12, fontWeight:600 },
  emptyCell:{ padding:"60px 20px", textAlign:"center" },
  emptyState:{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 },
  emptyIcon:{ fontSize:40, marginBottom:4 },
  emptyTitle:{ margin:0, fontSize:15, fontWeight:600, color:"#475569" },
  emptySubtitle:{ margin:0, fontSize:13, color:"#94a3b8" },
  emptyAddBtn:{ marginTop:8, display:"flex", alignItems:"center", gap:6, padding:"8px 18px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" },
  variantBadge:{ display:"inline-block", padding:"3px 9px", background:"#ede9fe", color:"#5b21b6", borderRadius:20, fontSize:11, fontWeight:600 },
  stockOk:{ display:"inline-block", padding:"3px 10px", background:"#dcfce7", color:"#15803d", borderRadius:20, fontSize:12, fontWeight:700 },
  stockLow:{ display:"inline-block", padding:"3px 10px", background:"#fff7ed", color:"#c2410c", borderRadius:20, fontSize:12, fontWeight:700 },
  stockEmpty:{ display:"inline-block", padding:"3px 10px", background:"#fee2e2", color:"#b91c1c", borderRadius:20, fontSize:12, fontWeight:700 },
  soldBadge:{ display:"inline-block", padding:"3px 8px", background:"#f0fdf4", color:"#15803d", borderRadius:20, fontSize:11, fontWeight:600, border:"1px solid #bbf7d0" },
  ratingBadge:{ display:"inline-block", padding:"3px 8px", background:"#fffbeb", color:"#b45309", borderRadius:20, fontSize:11, fontWeight:600, border:"1px solid #fde68a" },
  attrTag:{ fontSize:10, padding:"2px 6px", background:"#f0f9ff", color:"#0369a1", borderRadius:4, border:"1px solid #bae6fd", whiteSpace:"nowrap" },
  actions:{ display:"flex", gap:6, alignItems:"center", justifyContent:"flex-end" },
  expandBtn:{ display:"flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:6, border:"none", background:"#f1f5f9", color:"#64748b", cursor:"pointer" },
  btnGhost:{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, borderRadius:7, border:"1.5px solid #e2e8f0", background:"#fff", color:"#f59e0b", cursor:"pointer" },
  btnBlue:{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, borderRadius:7, border:"1.5px solid #bfdbfe", background:"#eff6ff", color:"#2563eb", cursor:"pointer" },
  btnRed:{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, borderRadius:7, border:"1.5px solid #fecaca", background:"#fff1f2", color:"#dc2626", cursor:"pointer" },
  variantCell:{ padding:"0 0 0 48px", background:"#fafbff" },
  variantBlock:{ borderLeft:"3px solid #c7d2fe", margin:"8px 20px 8px 0", borderRadius:"0 8px 8px 0", overflow:"hidden" },
  variantBlockTitle:{ margin:0, padding:"8px 16px", fontSize:11, fontWeight:600, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.06em", background:"#eef2ff" },
  variantTh:{ padding:"9px 14px", background:"#f5f7ff", fontSize:11, fontWeight:600, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.05em", textAlign:"left", borderBottom:"1px solid #e0e7ff" },
  variantRow:{ borderBottom:"1px solid #f0f4ff", transition:"background 0.12s" },
  variantTd:{ padding:"10px 14px", fontSize:13 },

  overlay:{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
  modal:{ background:"#fff", borderRadius:16, width:"100%", maxWidth:660, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 64px rgba(15,23,42,0.2)" },
  modalHead:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"20px 24px 16px", borderBottom:"1px solid #f1f5f9" },
  modalHeadIcon:{ fontSize:28, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc", borderRadius:10, flexShrink:0 },
  modalTitle:{ fontSize:16, fontWeight:700, color:"#0f172a", margin:0 },
  modalSub:{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" },
  closeBtn:{ display:"flex", alignItems:"center", justifyContent:"center", width:32, height:32, borderRadius:8, border:"none", background:"#f1f5f9", color:"#64748b", cursor:"pointer" },
  modalBody:{ padding:"20px 24px", overflowY:"auto", flex:1 },
  modalFoot:{ display:"flex", justifyContent:"flex-end", gap:10, padding:"16px 24px", borderTop:"1px solid #f1f5f9" },
  deleteIcon:{ fontSize:40, marginBottom:12 },

  /* Schema builder */
  schemaInfoBox:{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#0369a1", lineHeight:1.6, marginBottom:20 },
  schemaFieldRow:{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:10 },
  schemaFieldGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:10, alignItems:"end" },
  smallLabel:{ display:"block", fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4 },

  sectionBar:{ display:"inline-block", width:3, height:16, background:"#6366f1", borderRadius:2, flexShrink:0 },
  sectionTitle:{ fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.07em", margin:0 },
  sectionBadge:{ fontSize:10, fontWeight:600, padding:"2px 7px", background:"#fef3c7", color:"#92400e", borderRadius:4 },
  formGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 16px" },
  formField:{ marginBottom:12 },
  label:{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 },
  req:{ color:"#ef4444" },
  input:{ width:"100%", padding:"8px 11px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, color:"#0f172a", background:"#fff", boxSizing:"border-box", outline:"none" },
  inputDisabled:{ background:"#f8fafc", color:"#94a3b8", cursor:"not-allowed", borderColor:"#f1f5f9" },
  addAttrBtn:{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", background:"#f8fafc", border:"1.5px dashed #cbd5e1", borderRadius:7, fontSize:12, color:"#64748b", cursor:"pointer", fontWeight:500 },
  removeBtn:{ display:"flex", alignItems:"center", justifyContent:"center", width:28, height:28, border:"1px solid #fecaca", borderRadius:6, background:"#fff1f2", color:"#dc2626", cursor:"pointer", flexShrink:0 },
  btnOutline:{ padding:"8px 18px", border:"1.5px solid #e2e8f0", borderRadius:9, background:"#fff", color:"#475569", fontSize:13, fontWeight:600, cursor:"pointer" },
  btnPrimary:{ padding:"8px 20px", border:"none", borderRadius:9, background:"#6366f1", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 2px 6px rgba(99,102,241,0.3)" },
};
