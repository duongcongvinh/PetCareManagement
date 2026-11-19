import React, { useState, useEffect } from 'react';
import ReproductionClinic from './ReproductionClinic';
import { 
  PawPrint, Calendar, ShoppingBag, Plus, Minus, Trash2, Clock, ShieldCheck, HeartHandshake, 
  Truck, Award, Sparkles, Tag, Search, Filter, Star, ShoppingCart, CheckCircle, ArrowRight, ArrowLeft, 
  PhoneCall, Mail, MapPin, Heart, Zap, User, Edit3, Lock, CreditCard, QrCode, Copy, Check, AlertCircle, RefreshCw, X,
  Gift, RotateCcw, Flame, Activity
} from 'lucide-react';
import { toast, confirmModal } from './ToastNotification';
import { CONTACT_INFO, openZaloQrModal } from '../contactConfig';
import { HERO_IMAGES, FALLBACK_IMAGES, getUserAvatar, getPetAvatar, getServiceImage, getProductImage } from '../mediaAssets';

const getCategoryVisual = (category) => {
  switch (category) {
    case 'Thức ăn':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fff7ed 0%, #ffedd5 55%, #fed7aa 100%)',
        accent: '#ea580c',
        badgeBg: '#fff7ed',
        badgeColor: '#c2410c',
        emoji: '🥣'
      };
    case 'Bánh thưởng':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fefce8 0%, #fef08a 55%, #fde047 100%)',
        accent: '#ca8a04',
        badgeBg: '#fef9c3',
        badgeColor: '#854d0e',
        emoji: '🍖'
      };
    case 'Cát vệ sinh':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #f0fdf4 0%, #dcfce7 55%, #bbf7d0 100%)',
        accent: '#16a34a',
        badgeBg: '#dcfce7',
        badgeColor: '#15803d',
        emoji: '📦'
      };
    case 'Phụ kiện':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%)',
        accent: '#2563eb',
        badgeBg: '#dbeafe',
        badgeColor: '#1d4ed8',
        emoji: '🎾'
      };
    case 'Mỹ phẩm Spa':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #faf5ff 0%, #f3e8ff 55%, #e9d5ff 100%)',
        accent: '#9333ea',
        badgeBg: '#f3e8ff',
        badgeColor: '#7e22ce',
        emoji: '🧴'
      };
    case 'Dinh dưỡng':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fdf2f8 0%, #fce7f3 55%, #fbcfe8 100%)',
        accent: '#db2777',
        badgeBg: '#fce7f3',
        badgeColor: '#be185d',
        emoji: '💊'
      };
    case 'Y tế':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #ecfeff 0%, #cffafe 55%, #a5f3fc 100%)',
        accent: '#0891b2',
        badgeBg: '#cffafe',
        badgeColor: '#0e7490',
        emoji: '🏥'
      };
    default:
      return {
        bg: 'radial-gradient(circle at 50% 35%, #f8fafc 0%, #f1f5f9 55%, #e2e8f0 100%)',
        accent: '#ea580c',
        badgeBg: '#f1f5f9',
        badgeColor: '#475569',
        emoji: '🛍️'
      };
  }
};

const getProductBrand = (p) => {
  if (!p || !p.name) return 'Petopia Mall';
  if (p.name.includes('Royal Canin')) return 'Royal Canin';
  if (p.name.includes('Orijen')) return 'Orijen Premium';
  if (p.name.includes('Reflex')) return 'Reflex Plus';
  if (p.name.includes('Whiskas')) return 'Whiskas';
  if (p.name.includes('Monge')) return 'Monge Italy';
  if (p.name.includes('Orgo')) return 'Orgo Dental';
  if (p.name.includes('Bowwow')) return 'Bowwow Korea';
  if (p.name.includes('Ciao')) return 'Inaba Ciao';
  if (p.name.includes('Cature')) return 'Cature Natural';
  if (p.name.includes('Sanicat')) return 'Sanicat';
  if (p.name.includes('Best')) return "Cat's Best";
  if (p.name.includes('SOS')) return 'SOS Japan';
  if (p.name.includes('Davis')) return 'Davis USA';
  if (p.name.includes('Bioline')) return 'Bioline Vet';
  if (p.name.includes('Megaderm') || p.name.includes('Nootie')) return 'Megaderm';
  if (p.name.includes('Wild Alaskan')) return 'Wild Alaskan';
  if (p.name.includes('Bio-Cal')) return 'Bio-Pharm';
  if (p.name.includes('Bene-Bac')) return 'Bene-Bac USA';
  if (p.name.includes('NexGard')) return 'NexGard Spectra';
  if (p.name.includes('Vime')) return 'Vime-Vet';
  if (p.name.includes('TropiClean')) return 'TropiClean';
  return 'Petopia Mall';
};

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
  cart: propsCart,
  setCart: propsSetCart,
  onAddPet, 
  onBookAppointment, 
  onCancelAppointment,
  onUpdateProfile,
  onCheckoutOrder,
  onOpenLogin,
  onQuickLogin
}) {
  const [showAddPet, setShowAddPet] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedDetailService, setSelectedDetailService] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    password: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        password: ''
      });
    }
  }, [currentUser]);

  // Shop & Service Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Cart State (fallback internal if not passed from App)
  const [internalCart, setInternalCart] = useState([]);
  const cart = propsCart !== undefined ? propsCart : internalCart;
  const setCart = propsSetCart || setInternalCart;

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    recipientName: currentUser?.fullName || '',
    recipientPhone: currentUser?.phone || '',
    deliveryAddress: 'Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    deliveryNotes: '',
    shippingMethod: 'STANDARD', // 'STANDARD' (0 đ) or 'EXPRESS' (30.000 đ)
    paymentMethod: 'COD', // 'COD', 'VIETQR', 'MOMO'
  });

  // Unique Order Code for VietQR & tracking
  const [tempOrderCode] = useState(() => 'ORD-' + Math.floor(100000 + Math.random() * 900000));

  useEffect(() => {
    if (currentUser) {
      setCheckoutForm(prev => ({
        ...prev,
        recipientName: prev.recipientName || currentUser.fullName || '',
        recipientPhone: prev.recipientPhone || currentUser.phone || ''
      }));
    }
  }, [currentUser]);

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
    if (!newPet.name) {
      toast.warning('Vui lòng nhập tên thú cưng của bạn!', 'Thiếu Thông Tin');
      return;
    }
    onAddPet(newPet);
    setNewPet({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });
    setShowAddPet(false);
    toast.success('Hồ sơ thú cưng đã được tạo thành công!', 'Thú Cưng Petopia');
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
      toast.error(result.error, 'Không Thể Đặt Lịch');
    } else {
      toast.success('Đặt lịch hẹn thành công! Đã gửi xác nhận tới hệ thống chăm sóc thú cưng.', '🎉 Đặt Lịch Thành Công');
      setShowBookingModal(false);
    }
  };

  // Reset cart when user logs out
  useEffect(() => {
    if (!currentUser) {
      setCart([]);
    }
  }, [currentUser]);

  // Cart Management Functions
  const handleAddToCart = (product, quantity = 1) => {
    if (!currentUser) {
      toast.warning(
        'Vui lòng đăng nhập tài khoản khách hàng để thêm sản phẩm vào giỏ hàng và mua sắm!',
        'Yêu Cầu Đăng Nhập',
        {
          actionText: '🔐 Đăng Nhập Ngay',
          onAction: () => {
            if (onOpenLogin) onOpenLogin();
          }
        }
      );
      if (onOpenLogin) onOpenLogin();
      return false;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity + quantity > product.currentStock) {
        toast.warning(`Số lượng mua vượt quá tồn kho hiện có (${product.currentStock} sản phẩm).`, 'Tồn Kho Giới Hạn');
        return false;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng Petopia!`, '🛒 Đã Thêm Giỏ Hàng', {
      actionText: 'Xem Giỏ Hàng',
      onAction: () => setShowCartModal(true)
    });
    return true;
  };

  const updateCartQuantity = (productId, delta) => {
    const existing = cart.find(item => item.id === productId);
    if (!existing) return;
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      removeCartItem(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && newQty > product.currentStock) {
      toast.warning(`Số lượng vượt quá tồn kho hiện có (${product.currentStock} sp)!`, 'Tồn Kho Giới Hạn');
      return;
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const removeCartItem = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(cart.filter(i => i.id !== productId));
    if (item) {
      toast.info(`Đã bỏ "${item.name}" khỏi giỏ hàng.`, 'Cập Nhật Giỏ Hàng');
    }
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    confirmModal({
      title: 'Dọn Sạch Giỏ Hàng?',
      message: 'Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?',
      confirmText: 'Xóa Toàn Bộ',
      confirmColor: 'danger',
      onConfirm: () => {
        setCart([]);
        toast.info('Đã xóa tất cả sản phẩm trong giỏ hàng.', 'Giỏ Hàng');
      }
    });
  };

  // Proceed from Cart Modal to Dedicated Checkout Page
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống! Hãy chọn sản phẩm trước khi thanh toán.', 'Giỏ Hàng Rỗng');
      return;
    }
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập tài khoản khách hàng để tiến hành thanh toán!', 'Yêu Cầu Đăng Nhập', {
        actionText: '🔐 Đăng Nhập Ngay',
        onAction: () => onOpenLogin && onOpenLogin()
      });
      if (onOpenLogin) onOpenLogin();
      return;
    }
    setShowCartModal(false);
    onTabChange('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('Đã chuyển đến trang thanh toán. Vui lòng kiểm tra thông tin và đặt hàng!', 'Trang Thanh Toán');
  };

  const applyPromoCode = (codeOverride) => {
    const code = (codeOverride || promoCode).toUpperCase().trim();
    if (code === 'SPA10OFF') {
      setDiscountPercent(10);
      setPromoCode('SPA10OFF');
      toast.success('Áp dụng mã SPA10OFF thành công! Giảm 10% tổng hóa đơn.', '🎁 Mã Khuyến Mãi');
    } else if (code === 'PETLOVER20') {
      setDiscountPercent(20);
      setPromoCode('PETLOVER20');
      toast.success('Áp dụng mã PETLOVER20 thành công! Giảm 20% tổng hóa đơn.', '🎁 Mã Khuyến Mãi');
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng.', 'Mã Giảm Giá');
    }
  };

  const handleCopyText = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}: ${text}`, 'Sao Chép Thành Công');
    }
  };

  // Final Order Submission from Checkout Page
  const handleFinalPlaceOrder = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) {
      toast.warning('Giỏ hàng trống! Hãy chọn sản phẩm trước khi thanh toán.', 'Giỏ Hàng Rỗng');
      onTabChange('shop');
      return;
    }
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để hoàn tất đặt hàng!', 'Yêu Cầu Đăng Nhập', {
        actionText: '🔐 Đăng Nhập Ngay',
        onAction: () => onOpenLogin && onOpenLogin()
      });
      if (onOpenLogin) onOpenLogin();
      return;
    }
    if (!checkoutForm.recipientName.trim()) {
      toast.warning('Vui lòng nhập họ và tên người nhận hàng!', 'Thiếu Thông Tin');
      return;
    }
    if (!checkoutForm.recipientPhone.trim()) {
      toast.warning('Vui lòng nhập số điện thoại người nhận hàng!', 'Thiếu Thông Tin');
      return;
    }
    if (!checkoutForm.deliveryAddress.trim()) {
      toast.warning('Vui lòng nhập địa chỉ giao hàng cụ thể!', 'Thiếu Thông Tin');
      return;
    }

    const orderId = tempOrderCode;

    onCheckoutOrder(cart, grandTotal, {
      orderId,
      recipientName: checkoutForm.recipientName.trim(),
      recipientPhone: checkoutForm.recipientPhone.trim(),
      deliveryAddress: checkoutForm.deliveryAddress.trim(),
      deliveryNotes: checkoutForm.deliveryNotes.trim(),
      shippingMethod: checkoutForm.shippingMethod,
      paymentMethod: checkoutForm.paymentMethod
    });

    setCart([]);
    setShowCartModal(false);

    toast.success(
      `Đặt hàng thành công mã đơn ${orderId}! Tổng thanh toán: ${grandTotal.toLocaleString('vi-VN')} đ. Đơn hàng đã được chuyển sang bộ phận kho chuẩn bị đóng gói.`,
      '🎉 ĐẶT HÀNG THÀNH CÔNG',
      { duration: 6000 }
    );

    // Redirect to history tab so user immediately sees their order
    onTabChange('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Filter Services by Category
  const filteredServices = services.filter(s => {
    return selectedServiceCategory === 'ALL' || s.category === selectedServiceCategory;
  });

  // Financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round(cartSubtotal * discountPercent / 100);
  const shippingFee = checkoutForm.shippingMethod === 'EXPRESS' 
    ? (cartSubtotal >= 500000 ? 0 : 30000) 
    : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

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
              <img
                src={HERO_IMAGES.spaBanner}
                alt="Chăm sóc và Spa Grooming thú cưng"
                className="hero-photo-thumb"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
              />
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
              <img
                src={HERO_IMAGES.shopBanner}
                alt="Thức ăn dinh dưỡng và phụ kiện thú cưng"
                className="hero-photo-thumb"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.pet; }}
              />
            </div>
          </div>

          {/* BANNER CHUYÊN KHOA SINH SẢN VPET'S */}
          <div style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #fff7ed 50%, #fed7aa 100%)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            border: '1.5px solid #fed7aa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 6px 22px rgba(234, 88, 12, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={HERO_IMAGES.reproBanner}
                alt="Khoa Sinh Sản Thú Cưng"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                style={{ 
                  width: 68, 
                  height: 68, 
                  borderRadius: '16px', 
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '2px solid #ffffff',
                  boxShadow: '0 6px 18px rgba(234, 88, 12, 0.25)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>HOT • CHUYÊN KHOA VẬT NUÔI</span>
                  <span style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 700 }}>THEO TIÊU CHUẨN BỆNH VIỆN THÚ Y VPET'S</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  Khoa Sinh Sản & Hộ Sinh Thú Cưng 24/7
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                  Siêu âm thai Doppler, đỡ đẻ & mổ đẻ cấp cứu khẩn cấp, triệt sản Minilap vi phẫu không để sẹo chỉ từ 280.000đ.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-coral" style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }} onClick={() => onTabChange('reproduction')}>
                Khám Phá Khoa Sinh Sản ➔
              </button>
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
                <div key={s.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
                  <div>
                    <div style={{ position: 'relative', height: 170, overflow: 'hidden', background: '#f1f5f9' }}>
                      <img
                        src={getServiceImage(s)}
                        alt={s.name}
                        className="media-card-img"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                      />
                      <span className="badge badge-info" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)' }}>
                        {s.category}
                      </span>
                      <span style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.74rem', fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,0.92)', padding: '3px 9px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="#ea580c" /> {s.durationMinutes} phút
                      </span>
                    </div>
                    <div style={{ padding: '1.15rem 1.3rem 0 1.3rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.2rem 0 0.5rem 0', lineHeight: 1.4 }}>{s.name}</h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>{s.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.95rem 1.3rem 1.25rem 1.3rem', borderTop: '1px solid var(--border-light)' }}>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ea580c' }}>{s.price.toLocaleString('vi-VN')} đ</strong>
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
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span className="badge badge-coral" style={{ background: '#ff6b35', color: '#fff', fontSize: '0.72rem' }}>GIẢM 15%</span>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2px 8px' }}>{p.category}</span>
                      </div>
                      <span className="badge badge-success">Còn {p.currentStock} sp</span>
                    </div>
                    <div style={{ background: '#f8fafc', height: 170, borderRadius: '14px', overflow: 'hidden', margin: '0.5rem 0 0.75rem 0', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        className="media-card-img"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.product; }}
                      />
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
                    <img
                      src={getPetAvatar(pet)}
                      alt={pet.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.pet; }}
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffedd5', boxShadow: '0 6px 18px rgba(255,107,53,0.25)', flexShrink: 0 }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pet.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600 }}>{pet.species} • {pet.breed || 'Chưa rõ giống'}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
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

      {/* 2.5 KHOA SINH SẢN & HỘ SINH THÚ CƯNG (THEO CHUẨN VPETS.VN) */}
      {activeTab === 'reproduction' && (
        <ReproductionClinic 
          onBookService={(serviceId) => {
            setBookingForm(prev => ({ ...prev, serviceId }));
            setShowBookingModal(true);
          }}
          services={services}
        />
      )}

      {/* 3. DỊCH VỤ & ĐẶT LỊCH TAB (booking tab) */}
      {activeTab === 'booking' && (
        <div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dịch Vụ Spa, Lưu Trú & Khám Thú Y Petopia</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Xem bảng giá công khai, chọn khung giờ và đặt lịch hẹn giữ chỗ không trùng slot</p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ff6b35', fontWeight: 700, background: '#fff7ed', padding: '4px 12px', borderRadius: '14px', border: '1px solid #ffedd5' }}>
              {filteredServices.length} dịch vụ chuyên nghiệp
            </span>
          </div>

          {/* Service Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.75rem', background: '#ffffff', padding: '0.85rem 1.1rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            {[
              { id: 'ALL', label: '🌟 Tất Cả Dịch Vụ' },
              { id: 'Khoa Sinh Sản', label: '🏥 Khoa Sinh Sản (VPet\'s)' },
              { id: 'Spa & Grooming', label: '✂️ Spa & Grooming' },
              { id: 'Khách Sạn & Lưu Trú', label: '🏨 Khách Sạn & Lưu Trú' },
              { id: 'Y Tế & Tiêm Phòng', label: '💉 Tiêm Phòng & Vắc Xin' },
              { id: 'Khám Bệnh & Trị Liệu', label: '🩺 Khám Bệnh & Trị Liệu' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedServiceCategory(cat.id)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: selectedServiceCategory === cat.id ? '1px solid #ff6b35' : '1px solid var(--border-light)',
                  background: selectedServiceCategory === cat.id ? '#fff7ed' : 'transparent',
                  color: selectedServiceCategory === cat.id ? '#ff6b35' : '#475569',
                  cursor: 'pointer',
                  boxShadow: selectedServiceCategory === cat.id ? '0 2px 8px rgba(255, 107, 53, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid-2">
            {filteredServices.map((s) => (
              <div key={s.id} className="glass-panel glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ position: 'relative', height: 195, overflow: 'hidden', background: '#f1f5f9' }}>
                    <img
                      src={getServiceImage(s)}
                      alt={s.name}
                      className="media-card-img"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                    />
                    <span className="badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)', color: '#0f172a', fontWeight: 800, fontSize: '0.75rem', padding: '4px 11px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      {s.category === 'Khoa Sinh Sản' ? '🏥 Khoa Sinh Sản' :
                       s.category === 'Spa & Grooming' ? '✂️ Spa & Grooming' :
                       s.category === 'Khách Sạn & Lưu Trú' ? '🏨 Khách Sạn' :
                       s.category === 'Y Tế & Tiêm Phòng' ? '💉 Tiêm Phòng' : '🩺 Thú Y & Trị Liệu'}
                    </span>
                    <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(15,23,42,0.82)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
                      {s.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div style={{ padding: '1.35rem 1.5rem 0 1.5rem' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '0.55rem', color: '#0f172a', lineHeight: 1.4 }}>{s.name}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.1rem', lineHeight: '1.55' }}>{s.description}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem 1.35rem 1.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#64748b" /> Thời gian: {s.durationMinutes >= 60 ? `${Math.floor(s.durationMinutes / 60)}h${s.durationMinutes % 60 ? ` ${s.durationMinutes % 60}p` : ''}` : `${s.durationMinutes} phút`}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedDetailService(s)}>
                      Xem Chi Tiết
                    </button>
                    <button className="btn btn-coral" onClick={() => {
                      if (!currentUser) {
                        toast.warning('Vui lòng đăng nhập để tiến hành đặt lịch dịch vụ!', 'Yêu Cầu Đăng Nhập', {
                          actionText: '🔐 Đăng Nhập Ngay',
                          onAction: () => onOpenLogin && onOpenLogin()
                        });
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CỬA HÀNG PETOPIA SHOP TAB (shop tab) */}
      {activeTab === 'shop' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* PETOPIA SHOP HERO PROMO BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 45%, #c2410c 100%)',
            borderRadius: '24px',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(234, 88, 12, 0.25)'
          }}>
            {/* Ambient decorative glowing shapes */}
            <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.22)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, backdropFilter: 'blur(8px)', marginBottom: '0.85rem' }}>
                  <Flame size={14} color="#ffd166" />
                  <span>SIÊU HỘI MUA SẮM THÚ CƯNG 2026</span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }}></span>
                  <span style={{ color: '#fef08a' }}>GIẢM TỚI 35%</span>
                </div>

                <h1 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 0.6rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  Cửa Hàng Vật Phẩm Petopia Super Shop
                </h1>
                <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  Hơn 30+ dòng thức ăn Royal Canin, súp thưởng Ciao, cát đậu nành hữu cơ & mỹ phẩm chăm sóc lông chính hãng 100%. Giao hỏa tốc 2 giờ nội thành!
                </p>

                {/* Trust Badges */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <Truck size={15} /> Giao Hỏa Tốc 2H
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <ShieldCheck size={15} /> 100% Chính Hãng
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <Gift size={15} /> Quà Tặng Đơn >300K
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <RotateCcw size={15} /> Đổi Trả Trong 7 Ngày
                  </div>
                </div>
              </div>

              {/* Right: Quick Vouchers + Cart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 270 }}>
                {/* Voucher 1 */}
                <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: '16px', padding: '0.75rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>Mã Giảm 10% Toàn Đơn</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>SPA10OFF</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopyText('SPA10OFF', 'Mã Giảm Giá')}
                    style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                  >
                    Sao Chép
                  </button>
                </div>

                {/* Voucher 2 */}
                <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: '16px', padding: '0.75rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>Mã Giảm 20% Khách VIP</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>PETLOVER20</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopyText('PETLOVER20', 'Mã Giảm Giá')}
                    style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                  >
                    Sao Chép
                  </button>
                </div>

                {/* Cart Action Button */}
                <button 
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      toast.warning('Vui lòng đăng nhập tài khoản khách hàng để xem và thanh toán giỏ hàng!', 'Yêu Cầu Đăng Nhập', {
                        actionText: '🔐 Đăng Nhập',
                        onAction: () => onOpenLogin && onOpenLogin()
                      });
                      if (onOpenLogin) onOpenLogin();
                      return;
                    }
                    setShowCartModal(true);
                  }}
                  style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s ease' }}
                >
                  <ShoppingCart size={18} /> Xem Giỏ Hàng ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
                </button>
              </div>
            </div>
          </div>

          {/* SHOP CONTROL BAR: SEARCH, SORT & CATEGORIES */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Row: Search Input + Live Counter + Sort Select */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '14px', padding: '0.6rem 1rem', border: '1.5px solid #e2e8f0', flex: '1', minWidth: '280px', maxWidth: '480px', transition: 'border-color 0.2s' }}>
                <Search size={18} color="#ea580c" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên hạt, pate, phụ kiện, SKU..." 
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.9rem', outline: 'none', width: '100%', fontWeight: 500 }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status and Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  Hiển thị <strong style={{ color: '#ea580c' }}>{filteredProducts.length}</strong> / {products.length} sản phẩm
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sắp xếp:</span>
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                    style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="DEFAULT">⭐ Mặc định (Gợi ý)</option>
                    <option value="PRICE_LOW">💵 Giá: Thấp đến Cao</option>
                    <option value="PRICE_HIGH">💎 Giá: Cao đến Thấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Navigation Chips */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              {[
                { id: 'ALL', label: '🌟 Tất Cả' },
                { id: 'Thức ăn', label: '🥣 Thức Ăn' },
                { id: 'Bánh thưởng', label: '🍖 Bánh Thưởng' },
                { id: 'Cát vệ sinh', label: '📦 Cát Vệ Sinh' },
                { id: 'Phụ kiện', label: '🎾 Phụ Kiện' },
                { id: 'Mỹ phẩm Spa', label: '🧴 Mỹ Phẩm' },
                { id: 'Dinh dưỡng', label: '💊 Dinh Dưỡng' },
                { id: 'Y tế', label: '🏥 Y Tế' }
              ].map(cat => {
                const isActive = selectedCategory === cat.id;
                const count = cat.id === 'ALL' ? products.length : products.filter(p => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.55rem 1.05rem',
                      borderRadius: '24px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: isActive ? '1.5px solid #ff6b35' : '1px solid #e2e8f0',
                      background: isActive ? 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 14px rgba(255, 107, 53, 0.35)' : '0 2px 6px rgba(0,0,0,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 800
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {filteredProducts.map((p) => {
              const isLowStock = p.currentStock <= p.minStockLevel;
              const visual = getCategoryVisual(p.category);
              const brand = getProductBrand(p);
              const savingAmount = Math.round(p.unitPrice * 0.15);

              return (
                <div 
                  key={p.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: '22px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Top Header of Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ 
                      background: visual.badgeBg, 
                      color: visual.badgeColor, 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      padding: '3px 10px', 
                      borderRadius: '14px', 
                      border: '1px solid ' + visual.accent + '33',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {visual.emoji} {p.category}
                    </span>

                    {isLowStock ? (
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 800, padding: '3px 9px', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Flame size={12} /> Sắp hết: {p.currentStock} sp
                      </span>
                    ) : (
                      <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ✓ Sẵn hàng ({p.currentStock})
                      </span>
                    )}
                  </div>

                  {/* Product Real Photo Showcase */}
                  <div style={{ 
                    background: '#f8fafc', 
                    height: 185, 
                    borderRadius: '16px', 
                    margin: '0.5rem 0 0.85rem 0', 
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="media-card-img"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.product; }}
                    />

                    {/* Brand Badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,23,42,0.78)', backdropFilter: 'blur(6px)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 9px', borderRadius: '20px', letterSpacing: '0.3px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {brand}
                    </div>

                    {/* Discount Ribbon */}
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={11} fill="#fff" /> -15%
                    </div>

                    {/* Delivery Tag */}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.94)', color: '#0f172a', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
                      ⚡ Giao 2h
                    </div>
                  </div>

                  {/* Product Details */}
                  <div>
                    {/* Rating and Social Proof */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 6px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>4.9</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '2px' }}>(140+ đánh giá)</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '1px 6px', borderRadius: '6px' }}>
                        250+ đã bán
                      </span>
                    </div>

                    {/* Product Name (2 Lines Clamp) */}
                    <h4 style={{ 
                      fontSize: '1.08rem', 
                      fontWeight: 800, 
                      color: '#0f172a', 
                      margin: '0.3rem 0',
                      lineHeight: '1.4',
                      minHeight: '44px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {p.name}
                    </h4>

                    {/* SKU info */}
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem' }}>
                      Mã SKU: <span style={{ fontWeight: 600 }}>{p.sku}</span>
                    </div>

                    {/* Price Section */}
                    <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '12px', marginBottom: '0.85rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c' }}>
                          {p.unitPrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          {Math.round(p.unitPrice * 1.15).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                        🎉 Tiết kiệm ngay {savingAmount.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      style={{ 
                        flex: 1, 
                        padding: '0.6rem 0.5rem', 
                        fontSize: '0.82rem', 
                        fontWeight: 700,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }} 
                      disabled={p.currentStock <= 0} 
                      onClick={() => handleAddToCart(p)}
                    >
                      <ShoppingCart size={15} /> Thêm Giỏ
                    </button>
                    <button 
                      type="button"
                      className="btn btn-coral" 
                      style={{ 
                        flex: 1, 
                        padding: '0.6rem 0.5rem', 
                        fontSize: '0.82rem', 
                        fontWeight: 800,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)',
                        boxShadow: '0 4px 10px rgba(255, 107, 53, 0.25)'
                      }} 
                      disabled={p.currentStock <= 0} 
                      onClick={() => {
                        const added = handleAddToCart(p);
                        if (added) {
                          onTabChange('checkout');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      <Zap size={15} fill="#fff" /> Mua Ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. DEDICATED TRANG THANH TOÁN PETOPIA (checkout tab) */}
      {activeTab === 'checkout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Top Breadcrumb & Step Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1.25rem 1.75rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
            <div>
              <button 
                type="button"
                onClick={() => onTabChange('shop')}
                style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', padding: 0 }}
              >
                <ArrowLeft size={16} /> Quay Lại Cửa Hàng
              </button>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={24} color="#ff6b35" /> Thanh Toán Đơn Hàng An Toàn
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Vui lòng điền thông tin người nhận, chọn phương thức vận chuyển và hoàn tất thanh toán
              </p>
            </div>

            {/* Stepper Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>✓</span>
                <span>1. Giỏ Hàng</span>
              </div>
              <div style={{ width: 24, height: 2, background: '#ff6b35' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b35', fontWeight: 800 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                <span>2. Thanh Toán</span>
              </div>
              <div style={{ width: 24, height: 2, background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontWeight: 600 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>3</span>
                <span>3. Hoàn Tất</span>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid #ffedd5' }}>
                <ShoppingBag size={40} color="#ff6b35" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Giỏ Hàng Của Bạn Đang Trống</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                Hiện tại không có sản phẩm nào để tiến hành thanh toán. Hãy ghé qua Cửa Hàng Petopia để lựa chọn thức ăn, đồ dùng và đồ chơi cho bé cưng!
              </p>
              <button className="btn btn-coral" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }} onClick={() => onTabChange('shop')}>
                Khám Phá Cửa Hàng Ngay <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleFinalPlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)', gap: '1.75rem', alignItems: 'start' }}>
              
              {/* LEFT COLUMN: Recipient Information, Shipping, Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Recipient Information */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <MapPin size={20} color="#ff6b35" /> 1. Thông Tin Nhận Hàng
                  </h3>
                  
                  <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Họ và tên người nhận *
                      </label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="VD: Nguyễn Văn An"
                        value={checkoutForm.recipientName}
                        onChange={e => setCheckoutForm({ ...checkoutForm, recipientName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Số điện thoại liên hệ *
                      </label>
                      <input 
                        type="tel" 
                        required 
                        className="form-control" 
                        placeholder="VD: 0901234567"
                        value={checkoutForm.recipientPhone}
                        onChange={e => setCheckoutForm({ ...checkoutForm, recipientPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Địa chỉ nhận hàng chi tiết *
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh thành..."
                      value={checkoutForm.deliveryAddress}
                      onChange={e => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <textarea 
                      className="form-control" 
                      rows={2}
                      placeholder="VD: Giao giờ hành chính, gọi trước 15 phút, gửi bảo vệ..."
                      value={checkoutForm.deliveryNotes}
                      onChange={e => setCheckoutForm({ ...checkoutForm, deliveryNotes: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {[
                        '📞 Gọi trước 15 phút',
                        '🏢 Giao giờ hành chính',
                        '📦 Gửi lễ tân / bảo vệ',
                        '🐾 Hàng thú cưng nhẹ tay'
                      ].map((chip, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            const newNotes = checkoutForm.deliveryNotes ? `${checkoutForm.deliveryNotes}, ${chip}` : chip;
                            setCheckoutForm({ ...checkoutForm, deliveryNotes: newNotes });
                          }}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '3px 8px',
                            fontSize: '0.75rem',
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Method */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <Truck size={20} color="#ff6b35" /> 2. Phương Thức Vận Chuyển
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Option: Standard */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'STANDARD' })}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.shippingMethod === 'STANDARD' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.shippingMethod === 'STANDARD' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="radio" 
                          name="shippingMethod" 
                          checked={checkoutForm.shippingMethod === 'STANDARD'} 
                          onChange={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'STANDARD' })}
                          style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            🚚 Giao Hàng Tiêu Chuẩn (1 - 2 Ngày)
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Miễn phí vận chuyển toàn quốc cho đơn hàng Petopia
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>MIỄN PHÍ (0 đ)</span>
                    </label>

                    {/* Option: Express */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'EXPRESS' })}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.shippingMethod === 'EXPRESS' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.shippingMethod === 'EXPRESS' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="radio" 
                          name="shippingMethod" 
                          checked={checkoutForm.shippingMethod === 'EXPRESS'} 
                          onChange={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'EXPRESS' })}
                          style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ⚡ Hỏa Tốc Petopia 2H (Nội Thành)
                            <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>SIÊU TỐC</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Giao ngay trong 120 phút qua GrabExpress / Ahamove (Miễn phí từ 500k)
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: cartSubtotal >= 500000 ? '#059669' : '#ea580c', fontSize: '0.95rem' }}>
                        {cartSubtotal >= 500000 ? 'MIỄN PHÍ' : '30.000 đ'}
                      </span>
                    </label>

                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <CreditCard size={20} color="#ff6b35" /> 3. Phương Thức Thanh Toán
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Method 1: COD */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.paymentMethod === 'COD' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.paymentMethod === 'COD' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={checkoutForm.paymentMethod === 'COD'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                        style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: '1.4rem' }}>💵</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Kiểm tra sản phẩm tận tay, thanh toán trực tiếp cho nhân viên giao hàng
                        </div>
                      </div>
                    </label>

                    {/* Method 2: VietQR */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'VIETQR' })}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.paymentMethod === 'VIETQR' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.paymentMethod === 'VIETQR' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={checkoutForm.paymentMethod === 'VIETQR'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'VIETQR' })}
                        style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: '1.4rem' }}>📱</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Chuyển Khoản Ngân Hàng 24/7 (VietQR Siêu Tốc)
                          <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>KHUYÊN DÙNG ⭐</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Quét mã QR tự động điền số tài khoản, số tiền và nội dung qua bất kỳ App ngân hàng nào
                        </div>
                      </div>
                    </label>

                    {/* VietQR Detail Box if selected */}
                    {checkoutForm.paymentMethod === 'VIETQR' && (
                      <div style={{ 
                        background: '#f8fafc', 
                        border: '1.5px dashed #0284c7', 
                        borderRadius: '16px', 
                        padding: '1.5rem', 
                        marginTop: '0.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.25rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                            MÃ THANH TOÁN VIETQR NGÂN HÀNG QUÂN ĐỘI (MB BANK)
                          </span>
                          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                            Mở ứng dụng ngân hàng và quét mã để thanh toán tự động chính xác 100%
                          </p>
                        </div>

                        {/* VietQR Live Image */}
                        <div style={{ 
                          background: '#ffffff', 
                          padding: '12px', 
                          borderRadius: '16px', 
                          boxShadow: '0 8px 25px rgba(2, 132, 199, 0.15)',
                          border: '1px solid #bae6fd',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <img 
                            src={`https://img.vietqr.io/image/MB-0762409021-compact2.png?amount=${grandTotal}&addInfo=PETOPIA%20${tempOrderCode}&accountName=DUONG%20CONG%20VINH`}
                            alt="VietQR MB Bank 0762409021"
                            style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '8px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div style={{ marginTop: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>
                            MB Bank • DUONG CONG VINH
                          </div>
                        </div>

                        {/* Bank Details Table */}
                        <div style={{ width: '100%', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Ngân Hàng:</span>
                            <strong style={{ color: '#0f172a' }}>MB Bank (Ngân hàng TMCP Quân Đội)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Số Tài Khoản:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ color: '#0284c7', fontSize: '1rem' }}>0762409021</strong>
                              <button 
                                type="button" 
                                onClick={() => handleCopyText('0762409021', 'Số tài khoản')}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Chủ Tài Khoản:</span>
                            <strong style={{ color: '#0f172a' }}>DUONG CONG VINH</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Số Tiền:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ color: '#ea580c', fontSize: '1.05rem' }}>{grandTotal.toLocaleString('vi-VN')} đ</strong>
                              <button 
                                type="button" 
                                onClick={() => handleCopyText(grandTotal.toString(), 'Số tiền')}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px dashed #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>Nội Dung Chuyển Khoản:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ color: '#ff6b35', background: '#fff7ed', padding: '2px 6px', borderRadius: '4px' }}>
                                PETOPIA {tempOrderCode}
                              </strong>
                              <button 
                                type="button" 
                                onClick={() => handleCopyText(`PETOPIA ${tempOrderCode}`, 'Nội dung CK')}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <CheckCircle size={15} /> Hệ thống tự động xác nhận sau khi nhận được chuyển khoản thành công
                        </div>
                      </div>
                    )}

                    {/* Method 3: MoMo */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'MOMO' })}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.paymentMethod === 'MOMO' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.paymentMethod === 'MOMO' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={checkoutForm.paymentMethod === 'MOMO'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'MOMO' })}
                        style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: '1.4rem' }}>👛</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          Ví Điện Tử MoMo / ZaloPay
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Thanh toán bảo mật nhanh chóng qua ví điện tử liên kết
                        </div>
                      </div>
                    </label>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky Order Summary & Submit Button */}
              <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px', boxShadow: 'var(--shadow-soft)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                      🧾 Đơn Hàng Của Bạn
                    </h3>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6b35', background: '#fff7ed', padding: '3px 10px', borderRadius: '14px' }}>
                      {cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                    </span>
                  </div>

                  {/* Cart Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1.25rem' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '0.75rem 0.95rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.product; }}
                          style={{ width: 46, height: 46, borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, paddingRight: '6px' }}>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {item.unitPrice.toLocaleString('vi-VN')} đ / sp
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            style={{ width: 26, height: 26, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', minWidth: '18px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            style={{ width: 26, height: 26, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div style={{ textAlign: 'right', minWidth: '85px', marginLeft: '8px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                            {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input & Quick Suggestion Chips */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={promoCode} 
                        onChange={e => setPromoCode(e.target.value)} 
                        placeholder="Mã voucher (SPA10OFF, PETLOVER20)" 
                        style={{ textTransform: 'uppercase', fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => applyPromoCode()}
                        style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                      >
                        Áp Dụng
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button 
                        type="button"
                        onClick={() => applyPromoCode('SPA10OFF')}
                        style={{ background: '#f0fdf4', border: '1px dashed #22c55e', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🏷️ SPA10OFF (-10%)
                      </button>
                      <button 
                        type="button"
                        onClick={() => applyPromoCode('PETLOVER20')}
                        style={{ background: '#fef3c7', border: '1px dashed #f59e0b', color: '#b45309', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🏷️ PETLOVER20 (-20%)
                      </button>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>Tạm tính hàng hóa:</span>
                      <strong style={{ color: '#0f172a' }}>{cartSubtotal.toLocaleString('vi-VN')} đ</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>Phí giao hàng:</span>
                      <strong style={{ color: shippingFee === 0 ? '#059669' : '#0f172a' }}>
                        {shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                      </strong>
                    </div>

                    {discountPercent > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                        <span>Giảm giá khuyến mãi ({discountPercent}%):</span>
                        <strong>-{discountAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>TỔNG THANH TOÁN:</span>
                      <strong style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ff6b35' }}>
                        {grandTotal.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  </div>

                  {/* Submit CTA Button */}
                  <button 
                    type="submit" 
                    className="btn btn-coral" 
                    style={{ 
                      width: '100%', 
                      padding: '1rem', 
                      fontSize: '1.05rem', 
                      fontWeight: 800, 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)'
                    }}
                  >
                    Xác Nhận Đặt Hàng & Hoàn Tất <CheckCircle size={20} />
                  </button>

                  {/* Security Reassurance Points */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#059669" /> 100% Sản phẩm chính hãng Royal Canin, SOS, Tofu
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={14} color="#0284c7" /> Đổi trả miễn phí trong 7 ngày nếu không hài lòng
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PhoneCall size={14} color="#ea580c" /> Hotline hỗ trợ đơn hàng: <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 800 }}>{CONTACT_INFO.phoneDisplay}</a>
                    </div>
                  </div>

                </div>
              </div>

            </form>
          )}

        </div>
      )}

      {/* 6. LỊCH SỬ & TIẾN ĐỘ THỜI GIAN THỰC TAB (history tab) */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Lịch Sử Lịch Hẹn & Tiến Độ Chăm Sóc Real-time</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Theo dõi trạng thái tiếp nhận, tiến độ thực hiện và hủy hẹn giữ chỗ khi cần</p>
            </div>
            {currentUser && (
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowProfileModal(true)}>
                <Edit3 size={15} color="#38bdf8" /> Quản Lý Thông Tin Cá Nhân
              </button>
            )}
          </div>

          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Clock size={48} color="#38bdf8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vui lòng đăng nhập</h3>
              <p style={{ color: 'var(--text-muted)' }}>Đăng nhập để xem tiến độ dịch vụ và lịch sử mua hàng của bạn.</p>
            </div>
          ) : (
            <>
              {/* User Profile Mini Banner */}
              <div style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.25)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={getUserAvatar(currentUser)}
                    alt={currentUser.fullName || 'Khách hàng'}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.user; }}
                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b35', boxShadow: '0 4px 12px rgba(255,107,53,0.2)', flexShrink: 0 }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{currentUser.fullName}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Email: <strong>{currentUser.email}</strong> • SĐT: <strong>{currentUser.phone || 'Chưa cập nhật'}</strong>
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }} onClick={() => setShowProfileModal(true)}>
                  Cập Nhật SĐT / Mật Khẩu
                </button>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Thú Cưng</th>
                      <th>Dịch Vụ</th>
                      <th>Ngày & Giờ Hẹn</th>
                      <th>Trạng Thái Tiến Độ</th>
                      <th>Nhật Ký Chăm Sóc Tuần Tự</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAppointments.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có ca hẹn nào.</td></tr>
                    ) : (
                      myAppointments.map((app) => (
                        <tr key={app.id}>
                          <td><strong>{app.petName}</strong> ({app.species})</td>
                          <td>{app.serviceName}</td>
                          <td>{app.appointmentDate} ({app.timeSlot})</td>
                          <td>
                            <span className={`badge ${app.status === 'COMPLETED' ? 'badge-success' : app.status === 'IN_PROGRESS' ? 'badge-info' : app.status === 'CANCELLED' ? 'badge-danger' : 'badge-pending'}`}>
                              {app.status === 'CANCELLED' ? 'ĐÃ HỦY' : app.status}
                            </span>
                          </td>
                          <td style={{ color: app.careSummary ? '#34d399' : 'var(--text-muted)', fontStyle: app.careSummary ? 'italic' : 'normal' }}>
                            {app.careSummary || 'Đang cập nhật từ nhân viên...'}
                          </td>
                          <td>
                            {app.status === 'PENDING' ? (
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.4)' }}
                                onClick={async () => {
                                  const confirmed = await confirmModal(
                                    `Bạn có chắc chắn muốn hủy ca hẹn [${app.serviceName}] cho bé ${app.petName}? Khung giờ sẽ được giải phóng lập tức.`,
                                    'Xác Nhận Hủy Lịch Hẹn',
                                    { type: 'danger', confirmText: 'Hủy Lịch Hẹn', cancelText: 'Giữ Lại Ca Hẹn' }
                                  );
                                  if (confirmed && onCancelAppointment) {
                                    onCancelAppointment(app.id);
                                  }
                                }}
                              >
                                Hủy Lịch
                              </button>
                            ) : app.status === 'CANCELLED' ? (
                              <span style={{ fontSize: '0.78rem', color: '#f87171' }}>Đã giải phóng</span>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Không thể hủy</span>
                            )}
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
              <span style={{ cursor: 'pointer', color: '#ea580c', fontWeight: 700 }} onClick={() => onTabChange('reproduction')}>🏥 Khoa Sinh Sản (VPet's)</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('booking')}>Dịch Vụ Spa</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('shop')}>Cửa Hàng Vật Phẩm</span>
              <span style={{ cursor: 'pointer' }} onClick={() => onTabChange('pets')}>Quản Lý Thú Cưng</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Liên Hệ Trực Tuyến</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} /> Hotline 24/7: {CONTACT_INFO.phoneDisplay}
              </a>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a
                  href={CONTACT_INFO.zaloLink}
                  onClick={openZaloQrModal}
                  style={{
                    background: '#0068FF',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  💬 Zalo QR
                </a>
                <a
                  href={CONTACT_INFO.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #0078ff 0%, #a033ff 100%)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📘 Facebook
                </a>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Email: hello@petopia.vn</span>
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
          <div className="modal-content animate-fade-in" style={{ maxWidth: 620, padding: '1.75rem', borderRadius: '20px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={20} color="#ff6b35" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Giỏ Hàng Petopia Super Shop
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {cart.reduce((s, i) => s + i.quantity, 0)} món đồ trong giỏ
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowCartModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #ffedd5' }}>
                  <ShoppingBag size={32} color="#ff6b35" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Giỏ hàng của bạn đang trống!
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 360, margin: '0 auto 1.25rem' }}>
                  Hãy dạo quanh cửa hàng Petopia và chọn những món quà dinh dưỡng tuyệt vời nhất cho thú cưng của bạn.
                </p>
                <button 
                  type="button"
                  className="btn btn-coral" 
                  onClick={() => {
                    setShowCartModal(false);
                    onTabChange('shop');
                  }}
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
                >
                  Khám Phá Cửa Hàng Ngay <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                {/* Scrollable Items Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.product; }}
                        style={{ width: 48, height: 48, borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Đơn giá: {item.unitPrice.toLocaleString('vi-VN')} đ • Tồn: {item.currentStock} sp
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '1rem' }}>
                        <button 
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          style={{ width: 28, height: 28, borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Giảm số lượng"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', minWidth: '22px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button 
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          disabled={item.quantity >= item.currentStock}
                          style={{ width: 28, height: 28, borderRadius: '8px', border: '1px solid #cbd5e1', background: item.quantity >= item.currentStock ? '#f1f5f9' : '#ffffff', cursor: item.quantity >= item.currentStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Tăng số lượng"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Subtotal & Delete */}
                      <div style={{ textAlign: 'right', minWidth: '95px' }}>
                        <strong style={{ color: '#059669', fontSize: '1rem', display: 'block' }}>
                          {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                        </strong>
                        <button 
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                          title="Xóa món này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)} 
                    placeholder="Mã giảm giá (SPA10OFF, PETLOVER20)" 
                    style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => applyPromoCode()}>Áp Dụng</button>
                </div>

                {/* Subtotal summary */}
                <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} sp):</span>
                    <strong style={{ color: '#0f172a' }}>{cartSubtotal.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                      <span>Khuyến mãi ({discountPercent}%):</span>
                      <strong>-{discountAmount.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.15rem', color: '#ff6b35', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0' }}>
                    <span>Tổng Tạm Tính:</span>
                    <span>{(cartSubtotal - discountAmount).toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              {cart.length > 0 ? (
                <button 
                  type="button"
                  onClick={handleClearCart}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Xóa Giỏ
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCartModal(false)}>
                  Tiếp Tục Mua Sắm
                </button>
                {cart.length > 0 && (
                  <button type="button" className="btn btn-coral" onClick={handleProceedToCheckout}>
                    Tiến Hành Thanh Toán <ArrowRight size={16} />
                  </button>
                )}
              </div>
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

      {/* MODAL CHI TIẾT DỊCH VỤ (USE CASE: TRA CỨU & XEM CHI TIẾT DỊCH VỤ) */}
      {selectedDetailService && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 560, overflow: 'hidden' }}>
            <div style={{ height: 185, borderRadius: '14px', overflow: 'hidden', marginBottom: '1.15rem', background: '#f1f5f9' }}>
              <img
                src={getServiceImage(selectedDetailService)}
                alt={selectedDetailService.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>{selectedDetailService.category}</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedDetailService.name}</h3>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {selectedDetailService.price.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {selectedDetailService.description}
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c' }}>
                <Clock size={16} /> Quy Trình Chăm Sóc Chuẩn Spa ({selectedDetailService.durationMinutes} Phút)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>1.</span>
                  <span><strong>Tiếp nhận & Kiểm tra:</strong> Cân đo thể trạng, kiểm tra da lông, ghi nhận lưu ý tiền sử bệnh/dị ứng.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>2.</span>
                  <span><strong>Thực hiện liệu trình:</strong> Thực hiện dịch vụ chuyên sâu theo đúng tiêu chuẩn vệ sinh và kỹ thuật Petopia.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>3.</span>
                  <span><strong>Bàn giao & Care Summary:</strong> Nhân viên cập nhật kết quả và ghi chú dặn dò chăm sóc tại nhà.</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDetailService(null)}>Đóng</button>
              <button 
                className="btn btn-coral" 
                onClick={() => {
                  const sId = selectedDetailService.id;
                  setSelectedDetailService(null);
                  if (!currentUser) {
                    onOpenLogin();
                    return;
                  }
                  setBookingForm(prev => ({ ...prev, serviceId: sId }));
                  setShowBookingModal(true);
                }}
              >
                <Calendar size={16} /> Đặt Lịch Dịch Vụ Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẬP NHẬT HỒ SƠ CÁ NHÂN (USE CASE: QUẢN LÝ THÔNG TIN CÁ NHÂN) */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 480 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#ff6b35" /> Cập Nhật Thông Tin Cá Nhân
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (onUpdateProfile) {
                await onUpdateProfile(profileForm);
              }
              setShowProfileModal(false);
            }}>
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input 
                  className="form-control" 
                  value={profileForm.fullName} 
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Đăng Ký (Định danh duy nhất)</label>
                <input 
                  className="form-control" 
                  value={currentUser?.email || ''} 
                  disabled 
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email tài khoản không thể thay đổi theo quy tắc BR01</span>
              </div>

              <div className="form-group">
                <label>Số Điện Thoại</label>
                <input 
                  className="form-control" 
                  value={profileForm.phone} 
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                  placeholder="VD: 0934567890" 
                />
              </div>

              <div className="form-group">
                <label>Mật Khẩu Mới (Để trống nếu không đổi)</label>
                <input 
                  type="password"
                  className="form-control" 
                  value={profileForm.password} 
                  onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} 
                  placeholder="Nhập mật khẩu mới..." 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
