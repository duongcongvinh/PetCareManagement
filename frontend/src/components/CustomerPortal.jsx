import React, { useState, useEffect } from 'react';
import { 
  PawPrint, Calendar, ShoppingBag, Plus, Clock, ShieldCheck, HeartHandshake, 
  Truck, Award, Sparkles, Tag, Search, Filter, Star, ShoppingCart, CheckCircle, ArrowRight, PhoneCall, Mail, MapPin, Heart, Zap
} from 'lucide-react';

export default function CustomerPortal({ 
  currentUser,
  activeTab, 
  onTabChange,
  pets, 
  services, 
  appointments, 
  products, 
  promotions = [],
  orders = [],
  onAddPet, 
  onBookAppointment, 
  onCheckoutOrder,
  onOpenLogin,
  onQuickLogin
}) {
  const [showAddPet, setShowAddPet] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // Shop Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Cart State
  const [cart, setCart] = useState([]);

  // New Pet State
  const [newPet, setNewPet] = useState({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    petId: '',
    serviceId: services[0]?.id || '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 - 10:00',
    notes: ''
  });

  const myPets = currentUser ? pets.filter(p => p.ownerId === currentUser.id) : [];
  const myAppointments = currentUser ? appointments.filter(a => a.customerId === currentUser.id) : [];
  const myOrders = currentUser ? orders.filter(o => o.customerId === currentUser.id || o.customerName === currentUser.fullName) : [];

  // Always ensure petId is populated with a valid pet
  useEffect(() => {
    if (myPets.length > 0 && (!bookingForm.petId || !myPets.some(p => p.id === bookingForm.petId))) {
      setBookingForm(prev => ({ ...prev, petId: myPets[0].id }));
    }
  }, [myPets, bookingForm.petId]);

  const handleCreatePetSubmit = (e) => {
    e.preventDefault();
    if (!newPet.name) return alert('Vui lòng nhập tên thú cưng!');
    onAddPet(newPet);
    setNewPet({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });
    setShowAddPet(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const finalForm = {
      ...bookingForm,
      petId: bookingForm.petId || (myPets[0] ? myPets[0].id : (pets[0] ? pets[0].id : 'p1')),
      serviceId: bookingForm.serviceId || (services[0] ? services[0].id : 's1')
    };
    const result = await onBookAppointment(finalForm);
    if (result && result.error) {
      alert(result.error);
    } else {
      alert('🎉 Đặt lịch hẹn thành công! Đã gửi xác nhận tới hệ thống chăm sóc thú cưng.');
      setShowBookingModal(false);
    }
  };

  const handleAddToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.currentStock) {
        return alert(`Số lượng mua đạt tối đa tồn kho hiện có (${product.currentStock} sản phẩm).`);
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng Petopia!`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Giỏ hàng của bạn đang trống!');
    if (!currentUser) {
      alert('Vui lòng đăng nhập để tiến hành đặt hàng & thanh toán!');
      onOpenLogin();
      return;
    }

    onCheckoutOrder(cart, cartTotal);

    setCart([]);
    setShowCartModal(false);
    alert('🎉 Thanh toán thành công! Đã ghi nhận đơn hàng.');
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SPA10OFF' || promoCode.toUpperCase() === 'PETLOVER20') {
      setDiscountPercent(15);
      alert('🎉 Áp dụng mã giảm giá thành công! Bạn được giảm 15% tổng hóa đơn.');
    } else {
      alert('⚠️ Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  // Filter & Sort Products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.unitPrice - b.unitPrice;
    if (sortBy === 'PRICE_HIGH') return b.unitPrice - a.unitPrice;
    return 0;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartTotal = cartSubtotal * (1 - discountPercent / 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. TRANG CHỦ PETOPIA LANDING PAGE (home tab) */}
      {(activeTab === 'home' || !activeTab) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* HERO BANNER CARDS */}
          <div className="grid-2">
            <div className="hero-card hero-card-orange">
              <div>
                <span className="badge badge-coral" style={{ marginBottom: '0.75rem', background: '#ff6b35', color: '#fff', fontSize: '0.8rem' }}>
                  🔥 SIÊU ƯU ĐÃI THÁNG 8
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem', lineHeight: '1.3' }}>
                  Chăm Sóc & Spa Grooming Thú Cưng Toàn Diện
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.4rem' }}>
                  Giảm ngay 15% cho tất cả gói tắm cắt tỉa, tạo kiểu & khám sức khỏe định kỳ cho bé cưng.
                </p>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <button className="btn btn-coral" onClick={() => onTabChange('booking')}>
                    <Calendar size={16} /> Đặt Lịch Ngay
                  </button>
                  <button className="btn btn-secondary" onClick={() => onTabChange('shop')}>
                    Vào Cửa Hàng
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 10px 15px rgba(255,107,53,0.4))' }}>🐶</div>
            </div>

            <div className="hero-card hero-card-cyan">
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                  ⚡ GIAO NHANH 2H TOÀN QUỐC
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem', lineHeight: '1.3' }}>
                  Thức Ăn Dinh Dưỡng & Phụ Kiện Nhập Khẩu
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.4rem' }}>
                  Sản phẩm chính hãng Royal Canin, Cát đậu nành Tofu 6L khử mùi. Cam kết 100% chính hãng.
                </p>
                <button className="btn btn-cyan" onClick={() => onTabChange('shop')}>
                  <ShoppingBag size={16} /> Khám Phá Cửa Hàng
                </button>
              </div>
              <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 10px 15px rgba(0,180,216,0.4))' }}>🐱</div>
            </div>
          </div>

          {/* DỊCH VỤ SPA NỔI BẬT SHOWCASE */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles color="#ff8e53" size={22} /> Dịch Vụ Spa & Khám Thú Y Đẳng Cấp 5★
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Minh bạch giá niêm yết, đội ngũ bác sĩ & kĩ thuật viên giàu kinh nghiệm</p>
              </div>
              <button className="btn btn-secondary" onClick={() => onTabChange('booking')}>
                Xem Tất Cả Dịch Vụ <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid-3">
              {services.slice(0, 3).map(s => (
                <div key={s.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-info">{s.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {s.durationMinutes} phút
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.4rem 0' }}>{s.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: '1.5' }}>{s.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                    <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{s.price.toLocaleString('vi-VN')} đ</strong>
                    <button className="btn btn-coral" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => {
                      setBookingForm(prev => ({ ...prev, serviceId: s.id }));
                      setShowBookingModal(true);
                    }}>
                      Đặt Lịch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SẢN PHẨM BÁN CHẠY SHOWCASE */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag color="#38bdf8" size={22} /> Sản Phẩm Pet Shop Được Yêu Thích Nhất
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thức ăn hạt, cát đậu nành và mỹ phẩm dưỡng lông được chọn lọc</p>
              </div>
              <button className="btn btn-secondary" onClick={() => onTabChange('shop')}>
                Vào Cửa Hàng <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid-3">
              {products.slice(0, 3).map(p => (
                <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-coral" style={{ background: '#ff6b35', color: '#fff' }}>GIẢM 15%</span>
                      <span className="badge badge-success">Còn {p.currentStock} sp</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', height: 130, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', margin: '0.5rem 0', border: '1px solid var(--border-light)' }}>
                      {p.category === 'Thức ăn' ? '🥣' : p.category === 'Phụ kiện' ? '🎾' : '🧴'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fbbf24', margin: '4px 0' }}>
                      <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" />
                      <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>(4.9/5 • 42 đánh giá)</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.3rem 0' }}>{p.name}</h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mã SKU: {p.sku}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                        {p.unitPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {Math.round(p.unitPrice * 1.15).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <button className="btn btn-emerald" style={{ width: '100%', padding: '0.55rem' }} onClick={() => handleAddToCart(p)}>
                      <ShoppingCart size={16} /> Thêm Giỏ Hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PETOPIA TRUST INDICATORS */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="grid-4" style={{ textAlign: 'center' }}>
              <div>
                <Award size={30} color="#ff8e53" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>4.9 / 5 Hài Lòng</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Đánh giá tích cực từ hơn 5.000+ chủ nuôi</p>
              </div>
              <div>
                <Clock size={30} color="#38bdf8" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>24/7 Đặt Lịch Online</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Khóa trùng slot giờ real-time linh hoạt</p>
              </div>
              <div>
                <ShieldCheck size={30} color="#34d399" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>100% Giá Công Khai</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Minh bạch chi phí dịch vụ & vật phẩm</p>
              </div>
              <div>
                <Truck size={30} color="#a855f7" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Giao Hàng Nhanh 2H</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Miễn phí vận chuyển cho đơn từ 500.000đ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THÚ CƯNG CỦA TÔI TAB (pets tab) */}
      {activeTab === 'pets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản Lý Hồ Sơ Thú Cưng</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Theo dõi giống, tuổi, cân nặng và tiền sử y tế của bé</p>
            </div>
            {currentUser && (
              <button className="btn btn-coral" onClick={() => setShowAddPet(true)}>
                <Plus size={16} /> Thêm Thú Cưng Mới
              </button>
            )}
          </div>

          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Heart size={48} color="#ff8e53" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vui lòng đăng nhập</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Bạn cần đăng nhập để quản lý hồ sơ thú cưng của mình.</p>
              <button className="btn btn-coral" onClick={onOpenLogin}>
                Đăng Nhập Khách Hàng Ngay
              </button>
            </div>
          ) : myPets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Bạn chưa có thú cưng nào. Hãy thêm thú cưng để dễ dàng đặt lịch!</p>
            </div>
          ) : (
            <div className="grid-3">
              {myPets.map((pet) => (
                <div key={pet.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 6px 20px rgba(255,107,53,0.35)' }}>
                      {pet.species === 'Mèo' ? '🐱' : '🐶'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pet.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>{pet.species} • {pet.breed || 'Chưa rõ giống'}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Tuổi:</strong> {pet.ageMonths ? `${pet.ageMonths} tháng` : 'Chưa cập nhật'}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Cân nặng:</strong> {pet.weightKg ? `${pet.weightKg} kg` : 'Chưa cập nhật'}</div>
                    <div style={{ marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <strong>Tiền sử y tế:</strong> {pet.medicalHistory || 'Chưa có ghi chú đặc biệt.'}
                    </div>
                  </div>

                  <button className="btn btn-emerald" style={{ width: '100%' }} onClick={() => {
                    setBookingForm(prev => ({ ...prev, petId: pet.id }));
                    setShowBookingModal(true);
                  }}>
                    <Calendar size={16} /> Đặt Lịch Cho {pet.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. DỊCH VỤ & ĐẶT LỊCH TAB (booking tab) */}
      {activeTab === 'booking' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dịch Vụ Spa & Khám Thú Y Petopia</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Xem bảng giá công khai, chọn khung giờ và đặt lịch hẹn giữ chỗ</p>
          </div>

          <div className="grid-2">
            {services.map((s) => (
              <div key={s.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-info">{s.category}</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
                      {s.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: '1.5' }}>{s.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> Thời gian: {s.durationMinutes} phút
                  </span>
                  <button className="btn btn-coral" onClick={() => {
                    if (!currentUser) {
                      onOpenLogin();
                      return;
                    }
                    setBookingForm(prev => ({ ...prev, serviceId: s.id }));
                    setShowBookingModal(true);
                  }}>
                    Đăng Ký Đặt Lịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CỬA HÀNG PETOPIA SHOP TAB (shop tab) */}
      {activeTab === 'shop' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={24} color="#ff8e53" /> Cửa Hàng Vật Phẩm Petopia Super Shop
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Thức ăn hạt, pate, cát đậu nành, dụng cụ spa chính hãng Royal Canin, Tofu, SOS
              </p>
            </div>

            <button className="btn btn-coral" onClick={() => setShowCartModal(true)}>
              <ShoppingCart size={18} /> Giỏ Hàng ({cart.reduce((s, i) => s + i.quantity, 0)})
            </button>
          </div>

          {/* Filter Bar Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', background: 'rgba(15,23,42,0.8)', padding: '1rem 1.35rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'Tất Cả Sản Phẩm' },
                { id: 'Thức ăn', label: '🥣 Thức Ăn Hạt & Pate' },
                { id: 'Phụ kiện', label: '🎾 Cát & Phụ Kiện' },
                { id: 'Mỹ phẩm Spa', label: '🧴 Mỹ Phẩm & Spa' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: selectedCategory === cat.id ? '1px solid #ff8e53' : '1px solid var(--border-light)',
                    background: selectedCategory === cat.id ? 'rgba(255, 107, 53, 0.2)' : 'transparent',
                    color: selectedCategory === cat.id ? '#ff8e53' : 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid var(--border-light)' }}>
                <Search size={15} color="var(--text-muted)" style={{ marginRight: '6px' }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Lọc tên..." 
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '130px' }}
                />
              </div>

              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="form-control" 
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                <option value="DEFAULT">Sắp xếp: Mặc định</option>
                <option value="PRICE_LOW">Giá: Thấp đến Cao</option>
                <option value="PRICE_HIGH">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid-3">
            {filteredProducts.map((p) => {
              const isLowStock = p.currentStock <= p.minStockLevel;
              return (
                <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span className="badge badge-coral" style={{ background: '#ff6b35', color: '#fff', fontSize: '0.72rem' }}>GIẢM 15%</span>
                    <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                      {isLowStock ? `Sắp hết: ${p.currentStock} sp` : `Còn hàng: ${p.currentStock} sp`}
                    </span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', height: 140, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.8rem', margin: '0.5rem 0', border: '1px solid var(--border-light)' }}>
                    {p.category === 'Thức ăn' ? '🥣' : p.category === 'Phụ kiện' ? '🎾' : '🧴'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fbbf24', margin: '4px 0' }}>
                      <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" /> <Star size={12} fill="#fbbf24" />
                      <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>(4.9/5 • 42 đánh giá)</span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.4rem 0' }}>{p.name}</h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mã SKU: {p.sku}</div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.85rem 0' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                        {p.unitPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {Math.round(p.unitPrice * 1.15).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, padding: '0.55rem' }} disabled={p.currentStock <= 0} onClick={() => handleAddToCart(p)}>
                      <ShoppingCart size={16} /> Thêm Giỏ
                    </button>
                    <button className="btn btn-coral" style={{ flex: 1, padding: '0.55rem' }} disabled={p.currentStock <= 0} onClick={() => {
                      handleAddToCart(p);
                      setShowCartModal(true);
                    }}>
                      Mua Ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. LỊCH SỬ & TIẾN ĐỘ THỜI GIAN THỰC TAB (history tab) */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Lịch Sử Lịch Hẹn & Tiến Độ Chăm Sóc Real-time</h2>
          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Clock size={48} color="#38bdf8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vui lòng đăng nhập</h3>
              <p style={{ color: 'var(--text-muted)' }}>Đăng nhập để xem tiến độ dịch vụ và lịch sử mua hàng của bạn.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Thú Cưng</th>
                      <th>Dịch Vụ</th>
                      <th>Ngày & Giờ Hẹn</th>
                      <th>Trạng Thái Tiến Độ</th>
                      <th>Nhật Ký Chăm Sóc Tuần Tự</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAppointments.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có ca hẹn nào.</td></tr>
                    ) : (
                      myAppointments.map((app) => (
                        <tr key={app.id}>
                          <td><strong>{app.petName}</strong> ({app.species})</td>
                          <td>{app.serviceName}</td>
                          <td>{app.appointmentDate} ({app.timeSlot})</td>
                          <td>
                            <span className={`badge ${app.status === 'COMPLETED' ? 'badge-success' : app.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-pending'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ color: app.careSummary ? '#34d399' : 'var(--text-muted)', fontStyle: app.careSummary ? 'italic' : 'normal' }}>
                            {app.careSummary || 'Đang cập nhật từ nhân viên...'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2rem 0 1.25rem 0' }}>Lịch Sử Mua Hàng & Sản Phẩm</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Chi Tiết Sản Phẩm</th>
                  <th>Tổng Tiền</th>
                  <th>Ngày Đặt</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có đơn hàng nào.</td></tr>
                ) : (
                  myOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td style={{ maxWidth: '300px' }}>{order.items}</td>
                      <td style={{ color: '#34d399', fontWeight: 700 }}>{order.total.toLocaleString('vi-VN')} đ</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`badge ${order.status === 'CONFIRMED' ? 'badge-success' : 'badge-pending'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </>
          )}
        </div>
      )}

      {/* PETOPIA FOOTER */}
      <footer className="petopia-footer">
        <div className="grid-4">
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ff8e53', marginBottom: '0.85rem' }}>PETOPIA PLATFORM</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Chăm sóc thú cưng toàn diện — cửa hàng, dịch vụ spa, lưu trú và thú y trong một nền tảng thông minh.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Khám Phá</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('booking')}>Dịch Vụ Spa</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('shop')}>Cửa Hàng Vật Phẩm</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('pets')}>Quản Lý Thú Cưng</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Liên Hệ</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span>Hotline: 076 240 9021</span>
              <span>Email: hello@petopia.vn</span>
              <span>Hỗ trợ: 8:00 - 21:00 hằng ngày</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Cam Kết</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Minh bạch 100% chi phí, hoàn tiền nếu sản phẩm không đúng mô tả. An toàn tuyệt đối cho bé cưng.
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          Petopia © 2026 — Hệ Thống Quản Lý Dịch Vụ Thú Cưng & Dự Báo Kho Thông Minh.
          <span style={{ margin: '0 8px' }}>•</span>
          <a href="/admin" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>🔒 Dành Cho Nhân Viên & Quản Trị</a>
        </div>
      </footer>

      {/* SHOPPING CART MODAL */}
      {showCartModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={22} color="#ff8e53" /> Giỏ Hàng Petopia Super Shop
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cart.length} món</span>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Giỏ hàng của bạn đang trống! Chọn sản phẩm ở cửa hàng để mua sắm.
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div>
                        <strong style={{ fontSize: '1rem' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Đơn giá: {item.unitPrice.toLocaleString('vi-VN')} đ</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>x{item.quantity}</span>
                        <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)} 
                    placeholder="Nhập mã giảm giá (VD: SPA10OFF, PETLOVER20)" 
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button className="btn btn-secondary" onClick={applyPromoCode}>Áp Dụng</button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.1rem', borderRadius: '12px', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Tạm tính:</span>
                    <span>{cartSubtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                      <span>Giảm giá ({discountPercent}%):</span>
                      <span>-{(cartSubtotal * discountPercent / 100).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#38bdf8', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)' }}>
                    <span>Tổng Thanh Toán:</span>
                    <span>{cartTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowCartModal(false)}>Đóng</button>
              {cart.length > 0 && (
                <button className="btn btn-coral" onClick={handleCheckout}>
                  Xác Nhận Thanh Toán <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM THÚ CƯNG */}
      {showAddPet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Tạo Hồ Sơ Thú Cưng Mới</h3>
            <form onSubmit={handleCreatePetSubmit}>
              <div className="form-group">
                <label>Tên Thú Cưng *</label>
                <input className="form-control" value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} placeholder="VD: LuLu" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Loài</label>
                  <select className="form-control" value={newPet.species} onChange={e => setNewPet({ ...newPet, species: e.target.value })}>
                    <option value="Chó">Chó 🐶</option>
                    <option value="Mèo">Mèo 🐱</option>
                    <option value="Khác">Khác 🐰</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giống (Breed)</label>
                  <input className="form-control" value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} placeholder="VD: Poodle" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Tuổi (tháng)</label>
                  <input type="number" className="form-control" value={newPet.ageMonths} onChange={e => setNewPet({ ...newPet, ageMonths: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cân nặng (kg)</label>
                  <input type="number" step="0.1" className="form-control" value={newPet.weightKg} onChange={e => setNewPet({ ...newPet, weightKg: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Tiền sử y tế / Lưu ý dịch ứng</label>
                <textarea className="form-control" rows={3} value={newPet.medicalHistory} onChange={e => setNewPet({ ...newPet, medicalHistory: e.target.value })} placeholder="Nhạy cảm với sữa, dị ứng xà phòng..." />
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddPet(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Hồ Sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LỊCH HẸN */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540, borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>Xác Nhận Đặt Lịch Dịch Vụ</h3>
            
            {!currentUser ? (
              <div style={{ background: 'rgba(255, 107, 53, 0.06)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid rgba(255, 107, 53, 0.25)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🔐</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Vui Lòng Đăng Nhập Để Đặt Lịch</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Bạn cần đăng nhập hoặc đăng ký tài khoản khách hàng để lưu lịch hẹn và quản lý dịch vụ cho thú cưng của mình.
                </p>
                <button 
                  type="button" 
                  className="btn btn-coral" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem', fontWeight: 800, borderRadius: '12px' }}
                  onClick={() => {
                    setShowBookingModal(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                >
                  🔐 Đăng Nhập / Đăng Ký Tài Khoản
                </button>
              </div>
            ) : myPets.length === 0 ? (
              <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid rgba(2, 132, 199, 0.25)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🐶</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Chưa Có Hồ Sơ Thú Cưng</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Xin chào <strong>{currentUser.fullName}</strong>! Tài khoản của bạn chưa có hồ sơ thú cưng. Vui lòng tạo hồ sơ bé cưng để tiếp tục đặt lịch.
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem', fontWeight: 800, borderRadius: '12px' }}
                  onClick={() => { 
                    setShowBookingModal(false); 
                    onTabChange('pets'); 
                    setShowAddPet(true); 
                  }}
                >
                  + Thêm Hồ Sơ Thú Cưng Của Bạn
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Chọn Thú Cưng *</label>
                  <select 
                    className="form-control" 
                    value={bookingForm.petId || (myPets[0] ? myPets[0].id : '')} 
                    onChange={e => setBookingForm({ ...bookingForm, petId: e.target.value })}
                  >
                    {myPets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species} - {p.breed})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Chọn Dịch Vụ *</label>
                  <select 
                    className="form-control" 
                    value={bookingForm.serviceId || (services[0] ? services[0].id : '')} 
                    onChange={e => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                  >
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString('vi-VN')} đ ({s.durationMinutes} phút)</option>)}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label style={{ fontWeight: 700, color: '#334155' }}>Ngày Hẹn *</label>
                    <input type="date" className="form-control" value={bookingForm.appointmentDate} onChange={e => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 700, color: '#334155' }}>Khung Giờ (Lock Slot) *</label>
                    <select className="form-control" value={bookingForm.timeSlot} onChange={e => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}>
                      <option value="09:00 - 10:00">09:00 - 10:00 (Còn trống)</option>
                      <option value="10:00 - 11:00">10:00 - 11:00 (Còn trống)</option>
                      <option value="14:00 - 15:00">14:00 - 15:00 (Còn trống)</option>
                      <option value="15:00 - 16:00">15:00 - 16:00 (Còn trống)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Ghi chú dặn dò nhân viên</label>
                  <input className="form-control" value={bookingForm.notes} onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })} placeholder="VD: Bé hơi nhát nước, nhờ tắm nhẹ tay..." />
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-emerald" style={{ padding: '0.65rem 1.4rem', fontWeight: 800 }}>Xác Nhận Đặt Lịch</button>
                </div>
              </form>
            )}

            {!currentUser || myPets.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Đóng</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
