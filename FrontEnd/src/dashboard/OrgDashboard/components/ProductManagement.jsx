import React, { useState, useEffect } from "react";
import { useGenericProduct } from "../../../Redux/features/genericProduct";
import { useCategorySchema } from "../../../Redux/features/categorySchema";
import CustomModal from "../../../components/CustomModal";

/* ─── Fixed categories ───────────────────────────────────────────── */
const CATEGORIES = ["Shirts", "Tshirts", "Belts", "Watches", "Shoes", "Sandals"];
const CAT_ICONS  = { Shirts:"👔", Tshirts:"👕", Belts:"🔗", Watches:"⌚", Shoes:"👟", Sandals:"🩴" };

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const PlusIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevDown  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ImgIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

/* ─── Schema field renderer ──────────────────────────────────────── */
function SchemaField({ field, value, onChange, disabled }) {
  const base = disabled ? { ...S.input, ...S.inputDisabled } : S.input;
  const common = { style: base, value: value ?? "", disabled, onChange: e => !disabled && onChange(e.target.value) };
  if (field.type === "select") return (
    <select {...common}>
      <option value="">Select {field.label}</option>
      {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (field.type === "textarea") return (
    <textarea {...common} placeholder={field.placeholder || field.label} style={{ ...base, minHeight: 64, resize: "vertical" }} />
  );
  return <input {...common} type={field.type === "number" ? "number" : "text"} placeholder={field.placeholder || field.label} />;
}

/* ─── Form section ───────────────────────────────────────────────── */
function FormSection({ title, badge, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
        <span style={S.sectionBar} />
        <h3 style={S.sectionTitle}>{title}</h3>
        {badge && <span style={S.sectionBadge}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const schemaValsToObj = (fields, vals) => {
  const obj = {};
  (fields || []).forEach(f => { if (vals[f.name] !== undefined && vals[f.name] !== "") obj[f.name] = vals[f.name]; });
  return obj;
};
const objToSchemaVals = (fields, attrs) => {
  const vals = {};
  (fields || []).forEach(f => { vals[f.name] = attrs?.[f.name] ?? ""; });
  return vals;
};
const BASE_FIELD_NAMES = new Set(["name", "brand", "description", "category"]);

/* ─── Component ──────────────────────────────────────────────────── */
export default function ProductManagement() {
  const {
    loading: prodLoading, products,
    loadProducts, addProduct, updateProduct, deleteProduct, addVariant, updateVariant, deleteVariant,
  } = useGenericProduct();
  const {
    loading: schLoading, schema, allSchemas, loadSchema, loadAllSchemas,
  } = useCategorySchema();
  const loading = prodLoading || schLoading;

  const extraCategories = allSchemas.map(s => s.categoryName).filter(n => !CATEGORIES.includes(n));
  const allCategories   = [...CATEGORIES, ...extraCategories];

  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem("pmCategory") || "Shirts");
  const [expandedRows, setExpandedRows]         = useState({});
  const [showModal, setShowModal]               = useState(false);
  const [modalMode, setModalMode]               = useState("add");
  const [editingProduct, setEditingProduct]     = useState(null);
  const [editingVariant, setEditingVariant]     = useState(null);
  const [baseForm, setBaseForm]                 = useState({ name: "", brand: "", description: "" });
  const [prodVals, setProdVals]                 = useState({});
  const [variantVals, setVariantVals]           = useState({});
  const [variantBase, setVariantBase]           = useState({ cost: "", count: "", image_url: "" });
  const [statusModal, setStatusModal]           = useState({ open: false, type: "info", title: "", message: "" });
  const [confirmModal, setConfirmModal]         = useState({ open: false, message: "", onConfirm: null });

  useEffect(() => { loadAllSchemas(); }, [loadAllSchemas]);
  useEffect(() => {
    sessionStorage.setItem("pmCategory", selectedCategory);
    setExpandedRows({});
    loadProducts(selectedCategory);
    loadSchema(selectedCategory);
  }, [selectedCategory, loadProducts, loadSchema]);

  /* ── Stats ── */
  const totalStock = products.reduce((s, p) => s + (p.variants?.reduce((a, v) => a + (v.count || 0), 0) ?? 0), 0);
  const totalSold  = products.reduce((s, p) => s + (p.variants?.reduce((a, v) => a + (v.purchaseCount || 0), 0) ?? 0), 0);
  const allRated   = products.flatMap(p => p.variants || []).filter(v => v.rating != null && v.ratingCount > 0);
  const avgRating  = allRated.length ? (allRated.reduce((s, v) => s + v.rating, 0) / allRated.length).toFixed(1) : null;

  const notify  = (type, title, message) => setStatusModal({ open: true, type, title, message });
  const refetch = () => loadProducts(selectedCategory);

  /* ── Schema-filtered fields (skip name/brand/description/category) ── */
  const schemaOnlyFields  = (schema?.fields || []).filter(f => !BASE_FIELD_NAMES.has(f.name.toLowerCase()));
  const tableCols         = schemaOnlyFields.slice(0, 3);

  /* ── Modal openers ── */
  const openAddModal = () => {
    setModalMode("add");
    setBaseForm({ name: "", brand: "", description: "" });
    setProdVals(objToSchemaVals(schemaOnlyFields, {}));
    setVariantBase({ cost: "", count: "", image_url: "" });
    setVariantVals(objToSchemaVals(schema?.variantFields, {}));
    setEditingProduct(null);
    setShowModal(true);
  };
  const openEditModal = (product) => {
    setModalMode("editProduct");
    setEditingProduct(product);
    setBaseForm({ name: product.name, brand: product.brand, description: product.description || "" });
    setProdVals(objToSchemaVals(schemaOnlyFields, product.attributes || {}));
    setVariantBase({ cost: "", count: "", image_url: "" });
    setVariantVals(objToSchemaVals(schema?.variantFields, {}));
    setShowModal(true);
  };
  const openAddVariantModal = (product) => {
    setModalMode("addVariant");
    setEditingProduct(product);
    setEditingVariant(null);
    setBaseForm({ name: product.name, brand: product.brand, description: product.description || "" });
    setProdVals(objToSchemaVals(schemaOnlyFields, product.attributes || {}));
    setVariantBase({ cost: "", count: "", image_url: "" });
    setVariantVals(objToSchemaVals(schema?.variantFields, {}));
    setShowModal(true);
  };
  const openEditVariantModal = (product, variant) => {
    setModalMode("editVariant");
    setEditingProduct(product);
    setEditingVariant(variant);
    setBaseForm({ name: product.name, brand: product.brand, description: product.description || "" });
    setProdVals(objToSchemaVals(schemaOnlyFields, product.attributes || {}));
    setVariantBase({
      cost:      variant.cost ?? "",
      count:     variant.count ?? "",
      image_url: variant.image_url === "No image found" ? "" : (variant.image_url || ""),
    });
    setVariantVals(objToSchemaVals(schema?.variantFields, variant.attributes || {}));
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); setEditingVariant(null); };

  /* ── Submits ── */
  const handleAddProduct = async () => {
    const result = await addProduct({
      category: selectedCategory, ...baseForm,
      attributes: schemaValsToObj(schemaOnlyFields, prodVals),
      variants: [{ cost: Number(variantBase.cost), count: Number(variantBase.count), image_url: variantBase.image_url || "", attributes: schemaValsToObj(schema?.variantFields, variantVals) }],
    });
    closeModal();
    if (result.meta.requestStatus === "fulfilled") { refetch(); notify("success", "Product Added!", "Product added successfully."); }
    else notify("error", "Failed", result.payload?.message || result.payload?.error || "Could not add product.");
  };
  const handleEditProduct = async () => {
    const result = await updateProduct({
      id: editingProduct._id || editingProduct.id, name: baseForm.name, brand: baseForm.brand,
      description: baseForm.description, attributes: schemaValsToObj(schemaOnlyFields, prodVals),
    });
    closeModal();
    if (result.meta.requestStatus === "fulfilled") { refetch(); notify("success", "Updated!", "Product updated."); }
    else notify("error", "Failed", result.payload?.message || "Update failed.");
  };
  const handleAddVariant = async () => {
    const result = await addVariant({
      id: editingProduct._id || editingProduct.id,
      variantData: { cost: Number(variantBase.cost), count: Number(variantBase.count), image_url: variantBase.image_url || "", attributes: schemaValsToObj(schema?.variantFields, variantVals) },
    });
    closeModal();
    if (result.meta.requestStatus === "fulfilled") { refetch(); notify("success", "Variant Added!", "Variant added successfully."); }
    else notify("error", "Failed", result.payload?.message || "Failed to add variant.");
  };
  const handleUpdateVariant = async () => {
    const result = await updateVariant({
      id: editingProduct._id || editingProduct.id,
      variantId: editingVariant._id || editingVariant.id,
      variantData: { cost: Number(variantBase.cost), count: Number(variantBase.count), image_url: variantBase.image_url || "", attributes: schemaValsToObj(schema?.variantFields, variantVals) },
    });
    closeModal();
    if (result.meta.requestStatus === "fulfilled") { refetch(); notify("success", "Variant Updated!", "Variant updated successfully."); }
    else notify("error", "Failed", result.payload?.message || "Update failed.");
  };
  const handleDeleteProduct = (id) => setConfirmModal({
    open: true, message: "Delete this product and all its variants? This cannot be undone.",
    onConfirm: async () => { setConfirmModal({ open: false, message: "", onConfirm: null }); await deleteProduct(id); refetch(); },
  });
  const handleDeleteVariant = (productId, variantId) => setConfirmModal({
    open: true, message: "Delete this variant? This cannot be undone.",
    onConfirm: async () => { setConfirmModal({ open: false, message: "", onConfirm: null }); await deleteVariant({ id: productId, variantId }); refetch(); },
  });

  const modalTitle  = { add: `Add New ${selectedCategory}`, editProduct: "Edit Product", addVariant: "Add Variant", editVariant: "Edit Variant" }[modalMode];
  const submitLabel = { add: "Add Product", editProduct: "Save Changes", addVariant: "Add Variant", editVariant: "Save Variant" }[modalMode];
  const submitFn    = { add: handleAddProduct, editProduct: handleEditProduct, addVariant: handleAddVariant, editVariant: handleUpdateVariant }[modalMode];

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div style={S.page}>

      {/* ══ HEADER ══ */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerIcon}>🛍️</div>
          <div>
            <h1 style={S.headerTitle}>Product Management</h1>
            <p style={S.headerSub}>Manage inventory, variants and pricing across all categories</p>
          </div>
        </div>
        <button style={S.addBtn} onClick={openAddModal}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: "#4f46e5", transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(99,102,241,0.5)" })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: "#6366f1", transform: "translateY(0)", boxShadow: "0 2px 10px rgba(99,102,241,0.35)" })}>
          <PlusIcon /> Add {selectedCategory}
        </button>
      </div>

      {/* ══ STAT CARDS ══ */}
      <div style={S.statRow}>
        {[
          { icon: "📋", label: "Products",    val: products.length,             color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
          { icon: "📦", label: "Total Stock", val: totalStock.toLocaleString(), color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
          { icon: "🛒", label: "Units Sold",  val: totalSold.toLocaleString(),  color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
          { icon: "★",  label: "Avg Rating",  val: avgRating ? `${avgRating} ★` : "N/A", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
        ].map(sc => (
          <div key={sc.label} style={{ ...S.statCard, background: sc.bg, borderColor: sc.border }}>
            <span style={{ fontSize: 26 }}>{sc.icon}</span>
            <div>
              <p style={{ ...S.statVal, color: sc.color }}>{sc.val}</p>
              <p style={S.statLabel}>{sc.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CATEGORY TABS ══ */}
      <div style={S.tabsCard}>
        <p style={S.tabsLabel}>Category</p>
        <div style={S.tabsRow}>
          {allCategories.map(cat => (
            <button key={cat}
              style={selectedCategory === cat ? { ...S.catTab, ...S.catTabActive } : S.catTab}
              onClick={() => setSelectedCategory(cat)}>
              <span>{CAT_ICONS[cat] || "📦"}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ PRODUCTS TABLE ══ */}
      <div style={S.tableCard}>
        <div style={S.tableCardHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={S.catChip}>{CAT_ICONS[selectedCategory] || "📦"} {selectedCategory}</span>
            <span style={S.tableHeadSub}>
              {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
            </span>
          </div>
          <span style={S.tableHint}>Click <b>▶</b> to expand variants</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: 48 }} />
                <th style={S.th}>Product</th>
                <th style={S.th}>Brand</th>
                {tableCols.map(f => <th key={f.name} style={S.th}>{f.label}</th>)}
                <th style={{ ...S.th, textAlign: "center" }}>Variants</th>
                <th style={{ ...S.th, textAlign: "center" }}>Stock</th>
                <th style={{ ...S.th, textAlign: "right", paddingRight: 22 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7 + tableCols.length} style={S.emptyCell}>
                  <div style={S.loadingWrap}>
                    <div style={S.spinner} />
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>Loading {selectedCategory}…</span>
                  </div>
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7 + tableCols.length} style={S.emptyCell}>
                  <div style={S.emptyWrap}>
                    <span style={{ fontSize: 52 }}>{CAT_ICONS[selectedCategory] || "📦"}</span>
                    <p style={S.emptyTitle}>No {selectedCategory} yet</p>
                    <p style={S.emptySubtitle}>Click "Add {selectedCategory}" to register the first product.</p>
                    <button style={S.emptyBtn} onClick={openAddModal}><PlusIcon /> Add First Product</button>
                  </div>
                </td></tr>
              ) : products.map(product => {
                const pid   = product._id || product.id;
                const stock = product.variants?.reduce((s, v) => s + (v.count || 0), 0) || 0;
                const isExp = expandedRows[pid];
                return (
                  <React.Fragment key={pid}>
                    {/* ── Product row ── */}
                    <tr style={isExp ? { ...S.tableRow, background: "#f8faff" } : S.tableRow}
                      onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "#f8fafc"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isExp ? "#f8faff" : "transparent"; }}>
                      <td style={{ ...S.td, paddingLeft: 14 }}>
                        <button style={{ ...S.expandBtn, ...(isExp ? S.expandBtnActive : {}) }}
                          onClick={() => setExpandedRows(p => ({ ...p, [pid]: !p[pid] }))}
                          title={isExp ? "Collapse variants" : "Expand variants"}>
                          {isExp ? <ChevDown /> : <ChevRight />}
                        </button>
                      </td>
                      <td style={S.td}>
                        <p style={S.productName}>{product.name}</p>
                        {product.description && <p style={S.productDesc}>{product.description.slice(0, 55)}{product.description.length > 55 ? "…" : ""}</p>}
                      </td>
                      <td style={S.td}><span style={S.brandTag}>{product.brand}</span></td>
                      {tableCols.map(f => (
                        <td key={f.name} style={S.td}>
                          <span style={S.attrChip}>{product.attributes?.[f.name] || "—"}</span>
                        </td>
                      ))}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={S.variantCountBadge}>{product.variants?.length || 0}</span>
                      </td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={stock === 0 ? S.stockEmpty : stock < 10 ? S.stockLow : S.stockOk}>{stock}</span>
                      </td>
                      <td style={{ ...S.td, textAlign: "right", paddingRight: 22 }}>
                        <div style={S.rowActions}>
                          <button style={S.btnAdd}   title="Add Variant"    onClick={() => openAddVariantModal(product)}><PlusIcon /></button>
                          <button style={S.btnEdit}  title="Edit Product"   onClick={() => openEditModal(product)}><EditIcon /></button>
                          <button style={S.btnDel}   title="Delete Product" onClick={() => handleDeleteProduct(pid)}><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Variant panel ── */}
                    {isExp && (
                      <tr>
                        <td colSpan={7 + tableCols.length} style={S.variantPanelCell}>
                          <div style={S.variantPanel}>
                            {/* Panel header */}
                            <div style={S.variantPanelHead}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={S.variantPanelHeadIcon}>🏷️</span>
                                <span style={S.variantPanelHeadTitle}>
                                  Variants
                                </span>
                                <span style={S.variantPanelCount}>{product.variants?.length || 0}</span>
                              </div>
                              <button style={S.addVariantBtn} onClick={() => openAddVariantModal(product)}>
                                <PlusIcon /> Add Variant
                              </button>
                            </div>

                            {!product.variants?.length ? (
                              <p style={{ padding: "20px 20px", color: "#94a3b8", fontSize: 13, margin: 0 }}>No variants yet.</p>
                            ) : (
                              <div style={{ overflowX: "auto" }}>
                                <table style={S.variantTable}>
                                  <thead>
                                    <tr style={S.variantTableHead}>
                                      <th style={S.vth}>#</th>
                                      {/* Dynamic attribute columns */}
                                      {(schema?.variantFields || []).map(f => (
                                        <th key={f.name} style={S.vth}>{f.label}</th>
                                      ))}
                                      {/* Fallback: show raw attributes if no schema variantFields */}
                                      {!schema?.variantFields?.length && <th style={S.vth}>Attributes</th>}
                                      <th style={{ ...S.vth, textAlign: "right" }}>Cost</th>
                                      <th style={{ ...S.vth, textAlign: "center" }}>Stock</th>
                                      <th style={{ ...S.vth, textAlign: "center" }}>Sold</th>
                                      <th style={{ ...S.vth, textAlign: "center" }}>Rating</th>
                                      <th style={{ ...S.vth, textAlign: "center" }}>Image</th>
                                      <th style={{ ...S.vth, textAlign: "right" }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {product.variants.map((v, idx) => {
                                      const vStock = v.count ?? 0;
                                      const hasImg = v.image_url && v.image_url !== "No image found";
                                      return (
                                        <tr key={v._id || v.id} style={S.vrow}
                                          onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                          {/* # */}
                                          <td style={S.vtd}>
                                            <span style={S.variantNum}>#{idx + 1}</span>
                                          </td>
                                          {/* Dynamic attribute cells */}
                                          {(schema?.variantFields || []).map(f => (
                                            <td key={f.name} style={S.vtd}>
                                              <span style={S.attrPill}>
                                                {v.attributes?.[f.name] ?? <span style={{ color: "#cbd5e1" }}>—</span>}
                                              </span>
                                            </td>
                                          ))}
                                          {/* Fallback raw attributes */}
                                          {!schema?.variantFields?.length && (
                                            <td style={S.vtd}>
                                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                                {v.attributes && Object.entries(v.attributes).map(([k, val]) => (
                                                  <span key={k} style={S.attrPill}>{k}: {String(val)}</span>
                                                ))}
                                              </div>
                                            </td>
                                          )}
                                          {/* Cost */}
                                          <td style={{ ...S.vtd, textAlign: "right" }}>
                                            <span style={S.costVal}>₹{(v.cost ?? 0).toLocaleString()}</span>
                                          </td>
                                          {/* Stock */}
                                          <td style={{ ...S.vtd, textAlign: "center" }}>
                                            <span style={vStock === 0 ? S.stockEmpty : vStock < 10 ? S.stockLow : S.stockOk}>
                                              {vStock}
                                            </span>
                                          </td>
                                          {/* Sold */}
                                          <td style={{ ...S.vtd, textAlign: "center" }}>
                                            <span style={S.soldVal}>{v.purchaseCount || 0}</span>
                                          </td>
                                          {/* Rating */}
                                          <td style={{ ...S.vtd, textAlign: "center" }}>
                                            {v.rating != null
                                              ? <span style={S.ratingVal}>★ {v.rating}</span>
                                              : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}
                                          </td>
                                          {/* Image */}
                                          <td style={{ ...S.vtd, textAlign: "center" }}>
                                            {hasImg
                                              ? <a href={v.image_url} target="_blank" rel="noreferrer" style={S.imgLink}><ImgIcon /> View</a>
                                              : <span style={{ color: "#e2e8f0", fontSize: 11 }}>None</span>}
                                          </td>
                                          {/* Actions */}
                                          <td style={{ ...S.vtd, textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                              <button style={S.vBtnEdit} onClick={() => openEditVariantModal(product, v)} title="Edit variant">
                                                <EditIcon /> Edit
                                              </button>
                                              <button style={S.vBtnDel} onClick={() => handleDeleteVariant(pid, v._id || v.id)} title="Delete variant">
                                                <TrashIcon />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ ADD / EDIT MODAL ════ */}
      {showModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            {/* Modal header */}
            <div style={S.modalHead}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={S.modalHeadIcon}>{CAT_ICONS[selectedCategory] || "📦"}</div>
                <div>
                  <h2 style={S.modalTitle}>{modalTitle}</h2>
                  <p style={S.modalSub}>
                    {selectedCategory} · {{ add: "New entry", editProduct: "Editing product", addVariant: "Adding variant", editVariant: "Editing variant" }[modalMode]}
                  </p>
                </div>
              </div>
              <button style={S.closeBtn} onClick={closeModal}><CloseIcon /></button>
            </div>

            <div style={S.modalBody}>
              {/* Product Details */}
              {(() => {
                const ro = modalMode === "addVariant" || modalMode === "editVariant";
                return (
                  <FormSection title="Product Details" badge={ro ? "Read-only" : undefined}>
                    <div style={S.formGrid}>
                      <div style={S.formField}>
                        <label style={S.label}>Product Name <span style={S.req}>*</span></label>
                        <input style={ro ? { ...S.input, ...S.inputDisabled } : S.input}
                          value={baseForm.name} disabled={ro}
                          onChange={e => setBaseForm({ ...baseForm, name: e.target.value })}
                          placeholder={`e.g. Allen Solly ${selectedCategory}`} />
                      </div>
                      <div style={S.formField}>
                        <label style={S.label}>Brand <span style={S.req}>*</span></label>
                        <input style={ro ? { ...S.input, ...S.inputDisabled } : S.input}
                          value={baseForm.brand} disabled={ro}
                          onChange={e => setBaseForm({ ...baseForm, brand: e.target.value })}
                          placeholder="e.g. Allen Solly" />
                      </div>
                      <div style={{ ...S.formField, gridColumn: "span 2" }}>
                        <label style={S.label}>Description</label>
                        <input style={ro ? { ...S.input, ...S.inputDisabled } : S.input}
                          value={baseForm.description} disabled={ro}
                          onChange={e => setBaseForm({ ...baseForm, description: e.target.value })}
                          placeholder="Short product description" />
                      </div>
                    </div>
                  </FormSection>
                );
              })()}

              {/* Schema-driven product attributes */}
              {modalMode !== "addVariant" && schemaOnlyFields.length > 0 && (
                <FormSection title={`${selectedCategory} Details`} badge={modalMode === "editVariant" ? "Read-only" : undefined}>
                  <div style={S.formGrid}>
                    {schemaOnlyFields.map(f => (
                      <div key={f.name} style={S.formField}>
                        <label style={S.label}>{f.label}{f.required && <span style={S.req}> *</span>}</label>
                        <SchemaField field={f} value={prodVals[f.name]}
                          onChange={v => setProdVals({ ...prodVals, [f.name]: v })}
                          disabled={modalMode === "editVariant"} />
                      </div>
                    ))}
                  </div>
                </FormSection>
              )}

              {/* Variant fields */}
              {(modalMode === "add" || modalMode === "addVariant" || modalMode === "editVariant") && (
                <>
                  <FormSection title={modalMode === "add" ? "Initial Variant" : "Variant Details"} badge={modalMode === "editVariant" ? "Editing" : undefined}>
                    <div style={S.formGrid}>
                      <div style={S.formField}>
                        <label style={S.label}>Cost (₹) <span style={S.req}>*</span></label>
                        <input style={S.input} type="number" min="0" value={variantBase.cost}
                          onChange={e => setVariantBase({ ...variantBase, cost: e.target.value })} placeholder="e.g. 1299" />
                      </div>
                      <div style={S.formField}>
                        <label style={S.label}>Stock Count <span style={S.req}>*</span></label>
                        <input style={S.input} type="number" min="0" value={variantBase.count}
                          onChange={e => setVariantBase({ ...variantBase, count: e.target.value })} placeholder="e.g. 50" />
                      </div>
                      <div style={{ ...S.formField, gridColumn: "span 2" }}>
                        <label style={S.label}>Image URL</label>
                        <input style={S.input} value={variantBase.image_url}
                          onChange={e => setVariantBase({ ...variantBase, image_url: e.target.value })} placeholder="https://…" />
                      </div>
                    </div>
                  </FormSection>

                  {schema?.variantFields?.length > 0 && (
                    <FormSection title="Variant Attributes">
                      <div style={S.formGrid}>
                        {schema.variantFields.map(f => (
                          <div key={f.name} style={S.formField}>
                            <label style={S.label}>{f.label}{f.required && <span style={S.req}> *</span>}</label>
                            <SchemaField field={f} value={variantVals[f.name]}
                              onChange={v => setVariantVals({ ...variantVals, [f.name]: v })}
                              disabled={false} />
                          </div>
                        ))}
                      </div>
                    </FormSection>
                  )}
                </>
              )}
            </div>

            <div style={S.modalFoot}>
              <button style={S.btnOutline} onClick={closeModal}>Cancel</button>
              <button style={S.btnPrimary} onClick={submitFn} disabled={loading}>
                {loading ? "Saving…" : submitLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {confirmModal.open && (
        <div style={S.overlay}>
          <div style={{ ...S.modal, maxWidth: 400 }}>
            <div style={S.modalHead}>
              <h2 style={S.modalTitle}>Confirm Delete</h2>
              <button style={S.closeBtn} onClick={() => setConfirmModal({ open: false, message: "", onConfirm: null })}><CloseIcon /></button>
            </div>
            <div style={{ padding: "28px 28px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
              <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{confirmModal.message}</p>
            </div>
            <div style={S.modalFoot}>
              <button style={S.btnOutline} onClick={() => setConfirmModal({ open: false, message: "", onConfirm: null })}>Cancel</button>
              <button style={{ ...S.btnPrimary, background: "#ef4444", boxShadow: "0 2px 8px rgba(239,68,68,0.35)" }} onClick={confirmModal.onConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <CustomModal isOpen={statusModal.open} title={statusModal.title} message={statusModal.message}
        type={statusModal.type} onClose={() => setStatusModal({ open: false, type: "info", title: "", message: "" })} />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  page: { padding: "28px 32px", background: "#f1f5f9", minHeight: "100%", fontFamily: "'Inter',system-ui,-apple-system,sans-serif" },

  /* ── Header ── */
  header:      { display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 55%,#4338ca 100%)", borderRadius: 16, padding: "22px 28px", marginBottom: 18, boxShadow: "0 4px 20px rgba(67,56,202,0.3)" },
  headerLeft:  { display: "flex", alignItems: "center", gap: 14 },
  headerIcon:  { fontSize: 36, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.12)", borderRadius: 14, flexShrink: 0 },
  headerTitle: { fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px 0", letterSpacing: "-0.3px" },
  headerSub:   { fontSize: 13, color: "#c7d2fe", margin: 0 },
  addBtn: { display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", boxShadow: "0 2px 10px rgba(99,102,241,0.35)", whiteSpace: "nowrap" },

  /* ── Stat cards ── */
  statRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 },
  statCard: { display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 14, border: "1.5px solid", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  statVal:  { fontSize: 26, fontWeight: 800, margin: "0 0 2px 0", lineHeight: 1 },
  statLabel:{ fontSize: 11, color: "#64748b", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" },

  /* ── Category tabs ── */
  tabsCard: { background: "#fff", borderRadius: 14, padding: "14px 20px", marginBottom: 18, boxShadow: "0 1px 3px rgba(15,23,42,0.05)", border: "1px solid #e2e8f0" },
  tabsLabel:{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px 0" },
  tabsRow:  { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 },
  catTab: {
    display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
    border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#f8fafc",
    color: "#64748b", cursor: "pointer", whiteSpace: "nowrap",
    transition: "all 0.15s", fontSize: 13, fontWeight: 600, flexShrink: 0,
  },
  catTabActive: { background: "#eef2ff", borderColor: "#6366f1", color: "#4338ca", boxShadow: "0 1px 6px rgba(99,102,241,0.2)" },

  /* ── Table card ── */
  tableCard:     { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" },
  tableCardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderBottom: "1px solid #f1f5f9", background: "#fafbff" },
  catChip:       { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#eef2ff", color: "#4338ca", borderRadius: 20, fontSize: 13, fontWeight: 700 },
  tableHeadSub:  { fontSize: 12, color: "#94a3b8" },
  tableHint:     { fontSize: 11, color: "#cbd5e1", fontStyle: "italic" },

  table: { width: "100%", borderCollapse: "collapse", minWidth: 640 },
  th: {
    padding: "12px 18px", background: "#f8fafc",
    fontSize: 11, fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.07em",
    textAlign: "left", borderBottom: "2px solid #f1f5f9", whiteSpace: "nowrap",
  },
  tableRow: { borderBottom: "1px solid #f1f5f9", transition: "background 0.12s", cursor: "default" },
  td:       { padding: "14px 18px", fontSize: 13, color: "#334155", verticalAlign: "middle" },

  productName: { fontWeight: 700, color: "#0f172a", fontSize: 14, margin: 0 },
  productDesc: { fontSize: 11, color: "#94a3b8", margin: "2px 0 0 0" },
  brandTag:    { display: "inline-block", padding: "3px 10px", background: "#f1f5f9", color: "#475569", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  attrChip:    { display: "inline-block", padding: "3px 9px", background: "#f8fafc", color: "#374151", borderRadius: 6, fontSize: 12, border: "1px solid #e2e8f0" },
  variantCountBadge: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 24, padding: "0 8px", background: "#ede9fe", color: "#5b21b6", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  stockOk:    { display: "inline-block", padding: "3px 12px", background: "#dcfce7", color: "#15803d", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  stockLow:   { display: "inline-block", padding: "3px 12px", background: "#fff7ed", color: "#c2410c", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  stockEmpty: { display: "inline-block", padding: "3px 12px", background: "#fee2e2", color: "#b91c1c", borderRadius: 20, fontSize: 12, fontWeight: 700 },

  expandBtn:       { display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", cursor: "pointer", transition: "all 0.15s" },
  expandBtnActive: { background: "#eef2ff", borderColor: "#a5b4fc", color: "#4338ca" },

  rowActions: { display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end" },
  btnAdd:  { display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1.5px solid #a7f3d0", background: "#d1fae5", color: "#047857", cursor: "pointer" },
  btnEdit: { display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1.5px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" },
  btnDel:  { display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff1f2", color: "#dc2626", cursor: "pointer" },

  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "64px 20px" },
  spinner:     { width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  emptyCell:   { padding: "64px 20px", textAlign: "center" },
  emptyWrap:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  emptyTitle:  { margin: 0, fontSize: 17, fontWeight: 700, color: "#475569" },
  emptySubtitle:{ margin: 0, fontSize: 13, color: "#94a3b8" },
  emptyBtn:    { marginTop: 6, display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" },

  /* ── Variant panel (expanded row) ── */
  variantPanelCell: { background: "#f0f4ff", padding: 0, borderBottom: "2px solid #c7d2fe" },
  variantPanel:     { margin: "0 0 0 56px", borderLeft: "3px solid #6366f1", background: "#fff", boxShadow: "0 2px 12px rgba(99,102,241,0.08)" },

  variantPanelHead: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 18px", background: "linear-gradient(90deg,#eef2ff,#f8faff)",
    borderBottom: "1px solid #e0e7ff",
  },
  variantPanelHeadIcon:  { fontSize: 16 },
  variantPanelHeadTitle: { fontSize: 12, fontWeight: 700, color: "#4338ca", textTransform: "uppercase", letterSpacing: "0.06em" },
  variantPanelCount:     { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 20, padding: "0 6px", background: "#6366f1", color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  addVariantBtn: { display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" },

  /* Variant sub-table */
  variantTable:     { width: "100%", borderCollapse: "collapse" },
  variantTableHead: { background: "#f5f7ff" },
  vth: {
    padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6366f1",
    textTransform: "uppercase", letterSpacing: "0.06em",
    textAlign: "left", borderBottom: "1px solid #e0e7ff", whiteSpace: "nowrap",
  },
  vrow: { borderBottom: "1px solid #f0f4ff", transition: "background 0.1s" },
  vtd:  { padding: "11px 16px", fontSize: 13, color: "#334155", verticalAlign: "middle" },

  variantNum: { display: "inline-block", fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#f1f5f9", borderRadius: 4, padding: "2px 6px" },
  attrPill:   { display: "inline-block", padding: "4px 10px", background: "#eef2ff", color: "#4338ca", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #c7d2fe" },
  costVal:    { fontWeight: 800, color: "#0f172a", fontSize: 14 },
  soldVal:    { display: "inline-block", padding: "2px 8px", background: "#f0fdf4", color: "#15803d", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #bbf7d0" },
  ratingVal:  { display: "inline-block", padding: "2px 8px", background: "#fffbeb", color: "#b45309", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #fde68a" },
  imgLink:    { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none", padding: "3px 8px", background: "#eef2ff", borderRadius: 6, border: "1px solid #c7d2fe" },
  vBtnEdit:   { display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#2563eb", cursor: "pointer" },
  vBtnDel:    { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 7, color: "#dc2626", cursor: "pointer" },

  /* ── Modal ── */
  overlay:  { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal:    { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(15,23,42,0.25)" },
  modalHead:{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" },
  modalHeadIcon: { fontSize: 28, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "#eef2ff", borderRadius: 12, flexShrink: 0 },
  modalTitle:{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  modalSub:  { fontSize: 12, color: "#94a3b8", margin: "3px 0 0" },
  closeBtn:  { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "none", background: "#f1f5f9", color: "#64748b", cursor: "pointer" },
  modalBody: { padding: "22px 24px", overflowY: "auto", flex: 1 },
  modalFoot: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid #f1f5f9" },

  /* ── Form ── */
  sectionBar:   { display: "inline-block", width: 3, height: 16, background: "#6366f1", borderRadius: 2, flexShrink: 0 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 },
  sectionBadge: { fontSize: 10, fontWeight: 600, padding: "2px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 4 },
  formGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 18px" },
  formField:  { marginBottom: 14 },
  label:      { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 },
  req:        { color: "#ef4444" },
  input:      { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#fff", boxSizing: "border-box", outline: "none", transition: "border-color 0.15s" },
  inputDisabled: { background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed", borderColor: "#f1f5f9" },
  btnOutline: { padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnPrimary: { padding: "9px 22px", border: "none", borderRadius: 9, background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" },
};
