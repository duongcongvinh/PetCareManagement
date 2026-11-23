import React, { useState } from 'react';
import {
  Package, AlertTriangle, Plus, Brain, CheckCircle, Building2, Phone, Mail, MapPin,
  Search, X, FileText, Clock
} from 'lucide-react';
import { INITIAL_SUPPLIERS } from '../mockData';
import { getProductImage, FALLBACK_IMAGES } from '../mediaAssets';
import DemandForecastPanel from './DemandForecastPanel';

export default function WarehouseDashboard({
  activeTab = 'inventory',
  onTabChange,
  authToken = null,
  products = [],
  orders = [],
  reorderProposals = [],
  suppliers = INITIAL_SUPPLIERS,
  onUpdateStock,
  onTriggerAI,
  onAddProduct,
  onAddSupplier,
  onApproveProposal,
  onRejectProposal,
  onCreateProposal,
  onExecuteProposalInbound
}) {
  // Sub-tab inside Inventory (1. Quản lý kho: Tồn kho / Lịch sử Nhập-Xuất / Nhà cung cấp)
  const [inventorySubTab, setInventorySubTab] = useState('stock'); // 'stock' | 'history' | 'suppliers'
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'LOW' | category
  const [txHistory, setTxHistory] = useState([
    { id: 'TX-1001', productName: 'Hạt Royal Canin Mini Adult Cho Chó Nhỏ (2kg)', type: 'IN', quantity: 30, note: 'Nhập lô hàng định kỳ từ Royal Canin VN', time: '09:15 - Hôm nay' },
    { id: 'TX-1002', productName: 'Sữa Tắm Dưỡng Lông SOS 530ml', type: 'OUT', quantity: 5, note: 'Xuất vật tư cho khu vực Spa', time: '10:30 - Hôm nay' }
  ]);

  // Stock transaction modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockTxForm, setStockTxForm] = useState({ type: 'IN', quantity: 10, note: '' });

  // Add Product modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'Thức ăn',
    unitPrice: 150000,
    currentStock: 20,
    minStockLevel: 10,
    maxStockLevel: 100,
    supplierName: 'Royal Canin Việt Nam'
  });

  // Add Supplier modal
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    productCategories: 'Thức ăn hạt, Pate'
  });

  // Manual Proposal modal
  const [showManualProposalModal, setShowManualProposalModal] = useState(false);
  const [manualProposalForm, setManualProposalForm] = useState({
    productId: products[0]?.id || '',
    suggestedQuantity: 30,
    suggestedSupplier: suppliers[0]?.name || 'Royal Canin Việt Nam',
    suggestedOrderDate: new Date().toISOString().split('T')[0],
    reason: 'Chủ động bổ sung tồn kho trước đợt cao điểm.'
  });

  const validTabs = ['inventory', 'demand-forecast', 'reorder-proposals'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'inventory';

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
  const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0);
  const draftProposals = reorderProposals.filter(p => p.status === 'DRAFT');
  const approvedProposals = reorderProposals.filter(p => p.status === 'APPROVED');

  const filteredProducts = products.filter(p => {
    const matchQ = !searchQuery.trim() ||
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = stockFilter === 'ALL' ? true : stockFilter === 'LOW' ? p.currentStock <= p.minStockLevel : p.category === stockFilter;
    return matchQ && matchFilter;
  });

  // Handlers
  const handleStockSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const qty = parseInt(stockTxForm.quantity, 10) || 1;
    onUpdateStock(selectedProduct.id, stockTxForm.type, qty, stockTxForm.note);
    setTxHistory(prev => [
      {
        id: 'TX-' + Date.now().toString().slice(-4),
        productName: selectedProduct.name,
        type: stockTxForm.type,
        quantity: qty,
        note: stockTxForm.note || (stockTxForm.type === 'IN' ? 'Nhập kho bổ sung' : stockTxForm.type === 'OUT' ? 'Xuất kho sử dụng' : 'Kiểm kê điều chỉnh'),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay'
      },
      ...prev
    ]);
    setSelectedProduct(null);
    setStockTxForm({ type: 'IN', quantity: 10, note: '' });
  };

  const handleCreateProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;
    if (onAddProduct) onAddProduct(newProductForm);
    setShowAddProductModal(false);
    setNewProductForm({
      name: '',
      sku: '',
      category: 'Thức ăn',
      unitPrice: 150000,
      currentStock: 20,
      minStockLevel: 10,
      maxStockLevel: 100,
      supplierName: 'Royal Canin Việt Nam'
    });
  };

  const handleCreateSupplierSubmit = (e) => {
    e.preventDefault();
    if (!newSupplierForm.name.trim()) return;
    if (onAddSupplier) onAddSupplier(newSupplierForm);
    setShowAddSupplierModal(false);
    setNewSupplierForm({ name: '', contactPerson: '', phone: '', email: '', address: '', productCategories: 'Thức ăn hạt, Pate' });
  };

  const handleCreateManualProposal = (e) => {
    e.preventDefault();
    const targetProduct = products.find(p => p.id === manualProposalForm.productId) || products[0];
    if (!targetProduct) return;
    if (onCreateProposal) {
      onCreateProposal({
        productId: targetProduct.id,
        productName: targetProduct.name,
        sku: targetProduct.sku,
        currentStock: targetProduct.currentStock,
        minStockLevel: targetProduct.minStockLevel,
        suggestedQuantity: parseInt(manualProposalForm.suggestedQuantity, 10) || 20,
        suggestedSupplier: manualProposalForm.suggestedSupplier,
        suggestedOrderDate: manualProposalForm.suggestedOrderDate,
        reason: manualProposalForm.reason || 'Đề xuất nhập hàng từ bộ phận Quản lý kho.'
      });
    }
    setShowManualProposalModal(false);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ==================== 1. QUẢN LÝ KHO (NHẬP / XUẤT / TỒN) ==================== */}
        {currentTab === 'inventory' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={22} color="#d97706" /> Quản Lý Kho (Nhập / Xuất / Tồn Kho)
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Theo dõi tồn kho theo thời gian thực, thực hiện nhập xuất kho, kiểm kê và quản lý nhà cung cấp
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-coral" onClick={() => setShowAddProductModal(true)}>
                  <Plus size={16} /> Thêm Sản Phẩm
                </button>
                <button type="button" className="btn btn-emerald" onClick={onTriggerAI}>
                  <Brain size={16} /> Quét AI Kiểm Tra Kho
                </button>
              </div>
            </div>

            {/* KPI STRIP */}
            <div className="grid-4">
              <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #0284c7' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng Mã Sản Phẩm</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>{products.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #059669' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng Số Lượng Tồn</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{totalStockUnits.toLocaleString('vi-VN')}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: `4px solid ${lowStockProducts.length > 0 ? '#dc2626' : '#059669'}` }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Cảnh Báo Tồn Thấp</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: lowStockProducts.length > 0 ? '#dc2626' : '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {lowStockProducts.length} {lowStockProducts.length > 0 && <AlertTriangle size={18} />}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #d97706' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Đề Xuất Chờ Xử Lý</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                  {draftProposals.length + approvedProposals.length}
                </div>
              </div>
            </div>

            {/* SUB-TABS: TỒN KHO | LỊCH SỬ NHẬP XUẤT | NHÀ CUNG CẤP */}
            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
              {[
                { id: 'stock', label: `📦 Bảng Tồn Kho (${products.length})` },
                { id: 'history', label: `📋 Lịch Sử Nhập / Xuất (${txHistory.length})` },
                { id: 'suppliers', label: `🏢 Nhà Cung Cấp (${suppliers.length})` }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInventorySubTab(t.id)}
                  style={{
                    padding: '0.5rem 1.05rem',
                    borderRadius: '12px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    border: inventorySubTab === t.id ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                    background: inventorySubTab === t.id ? '#fef3c7' : '#ffffff',
                    color: inventorySubTab === t.id ? '#b45309' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: STOCK TABLE */}
            {inventorySubTab === 'stock' && (
              <div className="glass-panel" style={{ padding: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {['ALL', 'LOW', 'Thức ăn', 'Cát vệ sinh', 'Phụ kiện', 'Mỹ phẩm Spa', 'Y tế'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setStockFilter(f)}
                        style={{
                          padding: '0.36rem 0.8rem',
                          borderRadius: '18px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          border: stockFilter === f ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                          background: stockFilter === f ? '#fffbeb' : '#ffffff',
                          color: stockFilter === f ? '#b45309' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {f === 'ALL' ? 'Tất cả' : f === 'LOW' ? `⚠️ Sắp hết (${lowStockProducts.length})` : f}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 230 }}>
                    <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Tìm tên sản phẩm, mã SKU..."
                      style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Sản Phẩm / SKU</th>
                        <th>Danh Mục</th>
                        <th>Giá Bán</th>
                        <th>Tồn Kho / Định Mức</th>
                        <th>Trạng Thái</th>
                        <th>Thao Tác Kho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const isLow = p.currentStock <= p.minStockLevel;
                        const fillPercent = Math.min(100, Math.round((p.currentStock / Math.max(1, p.maxStockLevel || 100)) * 100));
                        return (
                          <tr key={p.id} style={{ background: isLow ? '#fef2f2' : 'transparent' }}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <img
                                  src={getProductImage(p)}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                                  style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'contain', background: '#ffffff', padding: '2px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                />
                                <div>
                                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{p.name}</strong>
                                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>SKU: {p.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge badge-info">{p.category}</span></td>
                            <td style={{ whiteSpace: 'nowrap' }}><strong>{Number(p.unitPrice).toLocaleString('vi-VN')} đ</strong></td>
                            <td style={{ minWidth: 165 }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <strong style={{ color: isLow ? '#dc2626' : '#059669', fontSize: '1rem' }}>{p.currentStock}</strong>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ min {p.minStockLevel} • max {p.maxStockLevel}</span>
                              </div>
                              <div style={{ height: 5, background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                                <div style={{ width: `${fillPercent}%`, height: '100%', background: isLow ? '#ef4444' : '#10b981' }} />
                              </div>
                            </td>
                            <td>
                              {isLow ? (
                                <span className="badge badge-danger"><AlertTriangle size={12} /> Thiếu hàng</span>
                              ) : (
                                <span className="badge badge-success">An toàn</span>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                onClick={() => setSelectedProduct(p)}
                              >
                                Nhập / Xuất
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: STOCK TRANSACTION HISTORY */}
            {inventorySubTab === 'history' && (
              <div className="glass-panel" style={{ padding: '1.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#d97706" /> Nhật Ký Giao Dịch Nhập / Xuất / Kiểm Kê Kho
                </h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã Phiếu</th>
                        <th>Sản Phẩm</th>
                        <th>Loại Giao Dịch</th>
                        <th>Số Lượng</th>
                        <th>Ghi Chú</th>
                        <th>Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txHistory.map(tx => (
                        <tr key={tx.id}>
                          <td><strong>{tx.id}</strong></td>
                          <td>{tx.productName}</td>
                          <td>
                            <span className={`badge ${tx.type === 'IN' ? 'badge-success' : tx.type === 'OUT' ? 'badge-danger' : 'badge-info'}`}>
                              {tx.type === 'IN' ? 'Nhập kho (+)' : tx.type === 'OUT' ? 'Xuất kho (-)' : 'Kiểm kê (=)'}
                            </span>
                          </td>
                          <td><strong>{tx.type === 'IN' ? `+${tx.quantity}` : tx.type === 'OUT' ? `-${tx.quantity}` : tx.quantity}</strong></td>
                          <td style={{ color: '#475569', fontSize: '0.84rem' }}>{tx.note}</td>
                          <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: SUPPLIERS */}
            {inventorySubTab === 'suppliers' && (
              <div className="glass-panel" style={{ padding: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={19} color="#0284c7" /> Danh Sách Nhà Cung Cấp Đối Tác
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Thông tin đầu mối nhập thức ăn, phụ kiện, mỹ phẩm Spa và thuốc thú y
                    </p>
                  </div>
                  <button type="button" className="btn btn-coral" onClick={() => setShowAddSupplierModal(true)}>
                    <Plus size={16} /> Thêm Nhà Cung Cấp
                  </button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Tên Nhà Cung Cấp</th>
                        <th>Người Đại Diện</th>
                        <th>Liên Hệ</th>
                        <th>Địa Chỉ</th>
                        <th>Mặt Hàng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map(sup => (
                        <tr key={sup.id}>
                          <td><strong>{sup.name}</strong></td>
                          <td>{sup.contactPerson || 'Bộ phận kinh doanh'}</td>
                          <td>
                            <div style={{ fontSize: '0.82rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} /> {sup.phone || '028 3899 0011'}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} /> {sup.email || 'contact@supplier.vn'}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} /> {sup.address || 'TP. Hồ Chí Minh'}
                            </span>
                          </td>
                          <td><span className="badge badge-info">{sup.productCategories || 'Thức ăn & Vật tư'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================== 2. DỰ BÁO NHU CẦU (AI FORECASTING) ==================== */}
        {currentTab === 'demand-forecast' && (
          <DemandForecastPanel
            authToken={authToken}
            products={products}
            orders={orders}
            reorderProposals={reorderProposals}
            onCreateProposal={onCreateProposal}
            onTabChange={onTabChange}
          />
        )}

        {/* ==================== 3. LẬP ĐỀ XUẤT NHẬP HÀNG ==================== */}
        {currentTab === 'reorder-proposals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={22} color="#ea580c" /> Lập & Xử Lý Đề Xuất Nhập Hàng
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Tạo phiếu đề xuất nhập kho tự động bằng AI hoặc thủ công, phê duyệt và xác nhận nhập hàng thực tế
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-coral"
                  onClick={() => {
                    setManualProposalForm({
                      productId: products[0]?.id || '',
                      suggestedQuantity: 30,
                      suggestedSupplier: suppliers[0]?.name || 'Royal Canin Việt Nam',
                      suggestedOrderDate: new Date().toISOString().split('T')[0],
                      reason: 'Chủ động bổ sung tồn kho theo kế hoạch bán hàng.'
                    });
                    setShowManualProposalModal(true);
                  }}
                >
                  <Plus size={16} /> Lập Đề Xuất Thủ Công
                </button>
                <button type="button" className="btn btn-emerald" onClick={onTriggerAI}>
                  <Brain size={16} /> AI Quét & Lập Đề Xuất Tự Động
                </button>
              </div>
            </div>

            {/* KPI STRIP */}
            <div className="grid-4">
              <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #0284c7' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Tổng Phiếu Đề Xuất</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>{reorderProposals.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Chờ Duyệt (DRAFT)</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{draftProposals.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #059669' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Đã Duyệt Chờ Nhập Kho</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{approvedProposals.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #7c3aed' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Đã Nhập Kho Hoàn Tất</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
                  {reorderProposals.filter(p => p.status === 'COMPLETED').length}
                </div>
              </div>
            </div>

            {/* PROPOSALS LIST */}
            <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reorderProposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  Chưa có phiếu đề xuất nhập hàng nào. Bấm <strong>"Lập Đề Xuất Thủ Công"</strong> hoặc <strong>"AI Quét & Lập Đề Xuất Tự Động"</strong>.
                </div>
              ) : (
                reorderProposals.map(prop => (
                  <div
                    key={prop.id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft: `4px solid ${prop.status === 'COMPLETED' ? '#7c3aed' : prop.status === 'APPROVED' ? '#059669' : prop.status === 'REJECTED' ? '#dc2626' : '#f59e0b'}`
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '1.02rem', color: '#0f172a' }}>{prop.productName}</strong>
                        <span className={`badge ${prop.status === 'COMPLETED' ? 'badge-info' : prop.status === 'APPROVED' ? 'badge-success' : prop.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}`}>
                          {prop.status === 'DRAFT' ? 'Chờ Admin phê duyệt' : prop.status === 'APPROVED' ? 'Admin đã duyệt • Chờ nhập kho' : prop.status === 'COMPLETED' ? 'Đã nhập kho' : 'Admin đã từ chối'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        SKU: <strong>{prop.sku}</strong> • Tồn lúc lập: <strong style={{ color: '#dc2626' }}>{prop.currentStock}</strong> (min {prop.minStockLevel}) • NCC: <strong>{prop.suggestedSupplier || 'Royal Canin Việt Nam'}</strong>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.55rem 0.75rem', fontSize: '0.82rem', color: '#334155', marginTop: '6px' }}>
                        {prop.reason}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Số lượng đề xuất</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>+{prop.suggestedQuantity} sp</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Dự kiến: {prop.suggestedOrderDate || 'Hôm nay'}</div>
                      </div>

                      {prop.status === 'DRAFT' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '0.4rem 0.75rem', borderRadius: '10px' }}>
                            ⏳ Đang chờ Admin phê duyệt
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Chỉ nhập kho sau khi Admin duyệt phiếu
                          </span>
                        </div>
                      )}

                      {prop.status === 'APPROVED' && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 0.95rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            if (onExecuteProposalInbound) {
                              onExecuteProposalInbound(prop);
                            } else {
                              onUpdateStock(prop.productId, 'IN', prop.suggestedQuantity, `Nhập kho theo đề xuất #${prop.id}`);
                            }
                            setTxHistory(prev => [
                              {
                                id: 'TX-' + Date.now().toString().slice(-4),
                                productName: prop.productName,
                                type: 'IN',
                                quantity: prop.suggestedQuantity,
                                note: `Nhập kho theo phiếu đề xuất #${prop.id}`,
                                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay'
                              },
                              ...prev
                            ]);
                          }}
                        >
                          <CheckCircle size={15} /> Xác Nhận Nhập Kho
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL: NHẬP / XUẤT / KIỂM KÊ KHO ==================== */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Điều Chỉnh Tồn Kho</h3>
              <button type="button" onClick={() => setSelectedProduct(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>
              <strong>{selectedProduct.name}</strong>
              <div style={{ color: '#64748b', marginTop: '2px' }}>Tồn kho hiện tại: <strong style={{ color: '#0284c7' }}>{selectedProduct.currentStock} sp</strong></div>
            </div>
            <form onSubmit={handleStockSubmit}>
              <div className="form-group">
                <label>Loại Giao Dịch</label>
                <select className="form-control" value={stockTxForm.type} onChange={e => setStockTxForm({ ...stockTxForm, type: e.target.value })}>
                  <option value="IN">Nhập Kho (+)</option>
                  <option value="OUT">Xuất Kho (-)</option>
                  <option value="ADJUSTMENT">Kiểm Kê / Đặt Lại (=)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số Lượng *</label>
                <input type="number" min="1" className="form-control" value={stockTxForm.quantity} onChange={e => setStockTxForm({ ...stockTxForm, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ghi Chú Phiếu Kho</label>
                <input className="form-control" value={stockTxForm.note} onChange={e => setStockTxForm({ ...stockTxForm, note: e.target.value })} placeholder="Nhập ghi chú nhập/xuất kho" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Giao Dịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: LẬP ĐỀ XUẤT NHẬP HÀNG THỦ CÔNG ==================== */}
      {showManualProposalModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowManualProposalModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Lập Phiếu Đề Xuất Nhập Hàng Mới</h3>
              <button type="button" onClick={() => setShowManualProposalModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateManualProposal}>
              <div className="form-group">
                <label>Chọn Sản Phẩm Cần Nhập *</label>
                <select
                  className="form-control"
                  value={manualProposalForm.productId}
                  onChange={e => setManualProposalForm({ ...manualProposalForm, productId: e.target.value })}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn: {p.currentStock} / min {p.minStockLevel})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Số Lượng Đề Xuất Nhập *</label>
                  <input type="number" min="1" className="form-control" value={manualProposalForm.suggestedQuantity} onChange={e => setManualProposalForm({ ...manualProposalForm, suggestedQuantity: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ngày Dự Kiến Nhập</label>
                  <input type="date" className="form-control" value={manualProposalForm.suggestedOrderDate} onChange={e => setManualProposalForm({ ...manualProposalForm, suggestedOrderDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Nhà Cung Cấp</label>
                <select
                  className="form-control"
                  value={manualProposalForm.suggestedSupplier}
                  onChange={e => setManualProposalForm({ ...manualProposalForm, suggestedSupplier: e.target.value })}
                >
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Lý Do Đề Xuất</label>
                <textarea className="form-control" rows={3} value={manualProposalForm.reason} onChange={e => setManualProposalForm({ ...manualProposalForm, reason: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowManualProposalModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Tạo Đề Xuất Nhập Hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM SẢN PHẨM MỚI ==================== */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddProductModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.15rem', color: '#0f172a' }}>Thêm Sản Phẩm Mới Vào Kho</h3>
            <form onSubmit={handleCreateProductSubmit}>
              <div className="form-group">
                <label>Tên Sản Phẩm *</label>
                <input className="form-control" value={newProductForm.name} onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })} placeholder="Nhập tên sản phẩm" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Mã SKU</label>
                  <input className="form-control" value={newProductForm.sku} onChange={e => setNewProductForm({ ...newProductForm, sku: e.target.value.toUpperCase() })} placeholder="Nhập mã SKU" />
                </div>
                <div className="form-group">
                  <label>Danh Mục</label>
                  <select className="form-control" value={newProductForm.category} onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}>
                    <option value="Thức ăn">Thức ăn</option>
                    <option value="Bánh thưởng">Bánh thưởng</option>
                    <option value="Cát vệ sinh">Cát vệ sinh</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Mỹ phẩm Spa">Mỹ phẩm Spa</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Y tế">Y tế</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Đơn Giá Bán (đ) *</label>
                  <input type="number" className="form-control" value={newProductForm.unitPrice} onChange={e => setNewProductForm({ ...newProductForm, unitPrice: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Tồn Kho Ban Đầu *</label>
                  <input type="number" className="form-control" value={newProductForm.currentStock} onChange={e => setNewProductForm({ ...newProductForm, currentStock: e.target.value })} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Ngưỡng Tối Thiểu (minStock)</label>
                  <input type="number" className="form-control" value={newProductForm.minStockLevel} onChange={e => setNewProductForm({ ...newProductForm, minStockLevel: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ngưỡng Tối Đa (maxStock)</label>
                  <input type="number" className="form-control" value={newProductForm.maxStockLevel} onChange={e => setNewProductForm({ ...newProductForm, maxStockLevel: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM NHÀ CUNG CẤP ==================== */}
      {showAddSupplierModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddSupplierModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.15rem', color: '#0f172a' }}>Thêm Nhà Cung Cấp Mới</h3>
            <form onSubmit={handleCreateSupplierSubmit}>
              <div className="form-group">
                <label>Tên Nhà Cung Cấp *</label>
                <input className="form-control" value={newSupplierForm.name} onChange={e => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })} placeholder="Nhập tên công ty / nhà cung cấp" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Người Đại Diện</label>
                  <input className="form-control" value={newSupplierForm.contactPerson} onChange={e => setNewSupplierForm({ ...newSupplierForm, contactPerson: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input className="form-control" value={newSupplierForm.phone} onChange={e => setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={newSupplierForm.email} onChange={e => setNewSupplierForm({ ...newSupplierForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Mặt Hàng Cung Ứng</label>
                  <input className="form-control" value={newSupplierForm.productCategories} onChange={e => setNewSupplierForm({ ...newSupplierForm, productCategories: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Địa Chỉ</label>
                <input className="form-control" value={newSupplierForm.address} onChange={e => setNewSupplierForm({ ...newSupplierForm, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSupplierModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Nhà Cung Cấp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
