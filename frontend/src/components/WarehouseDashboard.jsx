import React, { useState } from 'react';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, Brain, CheckCircle, Clock } from 'lucide-react';

export default function WarehouseDashboard({ 
  activeTab, 
  products = [], 
  reorderProposals = [], 
  onUpdateStock, 
  onTriggerAI,
  onAddProduct
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockTxForm, setStockTxForm] = useState({ type: 'IN', quantity: 10, note: '' });

  // Modal Add New Product
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

  const handleCreateProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name) return;
    if (onAddProduct) {
      onAddProduct(newProductForm);
    }
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

  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;
  const approvedProposals = reorderProposals.filter(p => p.status === 'APPROVED');

  const handleStockSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    onUpdateStock(selectedProduct.id, stockTxForm.type, parseInt(stockTxForm.quantity), stockTxForm.note);
    setSelectedProduct(null);
  };

  const handleExecuteInboundOrder = (proposal) => {
    onUpdateStock(proposal.productId, 'IN', proposal.suggestedQuantity, `Nhập kho theo đơn AI đã duyệt (Đề xuất #${proposal.id})`);
    alert(`✅ Đã xử lý thực tế đơn nhập hàng: +${proposal.suggestedQuantity} ${proposal.productName} vào kho!`);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* HEADER STATS */}
      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng Loại Sản Phẩm Trong Kho</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00f2fe', marginTop: '0.2rem' }}>{products.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cảnh Báo Tồn Kho Thấp (minStock)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lowStockCount > 0 ? '#ff5e62' : '#38ef7d', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {lowStockCount} {lowStockCount > 0 && <AlertTriangle size={20} />}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Đơn Nhập Hàng Đã Duyệt Chờ Xử Lý</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38ef7d', marginTop: '0.2rem' }}>
            {approvedProposals.length}
          </div>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      {(activeTab === 'inventory' || !activeTab) && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Bảng Theo Dõi Tồn Kho Real-time</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Quản lý nhập xuất kho & kiểm tra ngưỡng an toàn tồn kho</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-coral" onClick={() => setShowAddProductModal(true)}>
                <Plus size={16} /> Thêm Sản Phẩm Mới
              </button>
              <button className="btn btn-emerald" onClick={onTriggerAI}>
                <Brain size={16} /> Khởi Chạy AI Kiểm Tra Tồn Kho
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Sản Phẩm / SKU</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th>Tồn Kho / Mức An Toàn</th>
                  <th>Trạng Thái Kho</th>
                  <th>Thao Tác Kho</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isLow = p.currentStock <= p.minStockLevel;
                  return (
                    <tr key={p.id} style={{ background: isLow ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                      <td>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                      </td>
                      <td><span className="badge badge-info">{p.category}</span></td>
                      <td>{p.unitPrice.toLocaleString('vi-VN')} đ</td>
                      <td>
                        <strong style={{ color: isLow ? '#f87171' : '#38ef7d', fontSize: '1rem' }}>
                          {p.currentStock}
                        </strong> / min: {p.minStockLevel} (max: {p.maxStockLevel})
                      </td>
                      <td>
                        {isLow ? (
                          <span className="badge badge-danger"><AlertTriangle size={12} /> Cảnh Báo Thủng Kho</span>
                        ) : (
                          <span className="badge badge-success">An Toàn</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedProduct(p)}>
                          Nhập / Xuất Kho
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

      {/* XỬ LÝ NHẬP HÀNG TỪ ĐƠN ĐÃ PHÊ DUYỆT */}
      {activeTab === 'process-orders' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="#38ef7d" /> Xử Lý Nhập Hàng (Process Inbound Goods)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Tiếp nhận đề xuất nhập hàng đã được Admin phê duyệt, bấm nút nhập kho thực tế để tăng số lượng tồn.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reorderProposals.filter(p => p.status === 'APPROVED').length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Chưa có đơn nhập hàng nào đã qua Admin phê duyệt.
              </div>
            ) : (
              reorderProposals.filter(p => p.status === 'APPROVED').map(prop => (
                <div key={prop.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{prop.productName} (SKU: {prop.sku})</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Nhà cung cấp đề xuất: <strong>{prop.suggestedSupplier || 'Royal Canin Việt Nam'}</strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#38ef7d', marginTop: '4px' }}>
                      Trạng thái: <strong>APPROVED (Đã duyệt)</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ fontSize: '1.2rem', color: '#38ef7d' }}>+{prop.suggestedQuantity} sp</strong>
                    <button className="btn btn-emerald" onClick={() => handleExecuteInboundOrder(prop)}>
                      <Package size={16} /> Nhập Kho Thực Tế
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* AI REORDER PROPOSALS VIEW */}
      {activeTab === 'ai-reorder' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Đề Xuất Nhập Hàng Từ AI Engine</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tự động phân tích tồn kho ➔ Xác định lượng cần nhập ➔ Đề xuất nhà cung cấp tối ưu</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reorderProposals.map(prop => (
              <div key={prop.id} className="glass-card" style={{ borderColor: 'var(--border-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{prop.productName} (SKU: {prop.sku})</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tồn hiện tại: {prop.currentStock} | Ngưỡng an toàn: {prop.minStockLevel}</div>
                  </div>
                  <span className="badge badge-pending">Gợi ý nhập: +{prop.suggestedQuantity} sp</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#60a5fa', margin: '0.5rem 0' }}>
                  💡 <strong>Lý do AI:</strong> {prop.reason}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Nhà cung cấp: <strong>{prop.suggestedSupplier}</strong> • Độ tin cậy: <strong>{(prop.confidenceScore * 100).toFixed(0)}%</strong> • Trạng thái: <strong>{prop.status}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* MODAL CẬP NHẬT KHO */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Điều Chỉnh Kho: {selectedProduct.name}</h3>
            <form onSubmit={handleStockSubmit}>
              <div className="form-group">
                <label>Loại Giao Dịch Kho</label>
                <select className="form-control" value={stockTxForm.type} onChange={e => setStockTxForm({ ...stockTxForm, type: e.target.value })}>
                  <option value="IN">Nhập Kho (+)</option>
                  <option value="OUT">Xuất Kho (-)</option>
                  <option value="ADJUSTMENT">Kiểm Kê / Đặt Lại (=)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số Lượng</label>
                <input type="number" min="1" className="form-control" value={stockTxForm.quantity} onChange={e => setStockTxForm({ ...stockTxForm, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ghi Chú Giao Dịch</label>
                <input className="form-control" value={stockTxForm.note} onChange={e => setStockTxForm({ ...stockTxForm, note: e.target.value })} placeholder="VD: Nhập thêm hàng từ nhà cung cấp Royal Canin" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Giao Dịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM SẢN PHẨM MỚI */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={22} color="#00f2fe" /> Thêm Sản Phẩm Mới Vào Kho Hàng
            </h3>
            <form onSubmit={handleCreateProductSubmit}>
              <div className="form-group">
                <label>Tên Sản Phẩm *</label>
                <input 
                  className="form-control" 
                  value={newProductForm.name} 
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })} 
                  placeholder="VD: Pate Cung Đình Mèo Vị Cá Hồi 85g" 
                  required 
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Mã SKU Sản Phẩm</label>
                  <input 
                    className="form-control" 
                    value={newProductForm.sku} 
                    onChange={e => setNewProductForm({ ...newProductForm, sku: e.target.value.toUpperCase() })} 
                    placeholder="VD: PATE-SALMON-85G" 
                  />
                </div>
                <div className="form-group">
                  <label>Danh Mục</label>
                  <select 
                    className="form-control" 
                    value={newProductForm.category} 
                    onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  >
                    <option value="Thức ăn">🥣 Thức Ăn & Pate</option>
                    <option value="Phụ kiện">🎾 Cát & Phụ Kiện</option>
                    <option value="Mỹ phẩm Spa">🧴 Mỹ Phẩm & Spa</option>
                    <option value="Y tế">🩺 Vắc Xin & Y Tế</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Đơn Giá Bán (đ) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newProductForm.unitPrice} 
                    onChange={e => setNewProductForm({ ...newProductForm, unitPrice: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Tồn Kho Ban Đầu (sp) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newProductForm.currentStock} 
                    onChange={e => setNewProductForm({ ...newProductForm, currentStock: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Ngưỡng Tối Thiểu minStock (sp)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newProductForm.minStockLevel} 
                    onChange={e => setNewProductForm({ ...newProductForm, minStockLevel: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Ngưỡng Tối Đa maxStock (sp)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newProductForm.maxStockLevel} 
                    onChange={e => setNewProductForm({ ...newProductForm, maxStockLevel: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nhà Cung Cấp Đề Xuất</label>
                <input 
                  className="form-control" 
                  value={newProductForm.supplierName} 
                  onChange={e => setNewProductForm({ ...newProductForm, supplierName: e.target.value })} 
                  placeholder="VD: Royal Canin Việt Nam" 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Sản Phẩm Mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
