// SEO Manager cho React SPA: URL thân thiện, Dynamic Meta Tags, Canonical, Robots & JSON-LD Schema

export const CUSTOMER_TAB_PATHS = {
  home: '/',
  about: '/ve-chung-toi',
  reproduction: '/khoa-sinh-san',
  booking: '/dich-vu-spa',
  shop: '/cua-hang',
  cart: '/gio-hang',
  pets: '/thu-cung',
  history: '/lich-hen',
  checkout: '/thanh-toan',
};

const PATH_TO_CUSTOMER_TAB = Object.entries(CUSTOMER_TAB_PATHS).reduce((acc, [tab, path]) => {
  acc[path] = tab;
  return acc;
}, { '/gioi-thieu': 'about' });

export function parseCustomerUrl(pathname = '/') {
  const normalized = (pathname || '/').replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();

  if (lower.startsWith('/san-pham/')) {
    const rawId = normalized.slice('/san-pham/'.length).split('/')[0];
    if (rawId) {
      return { tab: 'product-detail', productId: decodeURIComponent(rawId), serviceId: null };
    }
  }

  if (lower.startsWith('/dich-vu/')) {
    const rawId = normalized.slice('/dich-vu/'.length).split('/')[0];
    if (rawId) {
      return { tab: 'service-detail', productId: null, serviceId: decodeURIComponent(rawId) };
    }
  }

  return {
    tab: PATH_TO_CUSTOMER_TAB[lower] || 'home',
    productId: null,
    serviceId: null,
  };
}

export function getTabFromPathname(pathname = '/') {
  return parseCustomerUrl(pathname).tab;
}

export function getPathForCustomerTab(tab, productId = null, serviceId = null) {
  if (tab === 'product-detail' && productId) {
    return `/san-pham/${encodeURIComponent(productId)}`;
  }
  if (tab === 'service-detail' && serviceId) {
    return `/dich-vu/${encodeURIComponent(serviceId)}`;
  }
  return CUSTOMER_TAB_PATHS[tab] || '/';
}

const CUSTOMER_SEO_META = {
  home: {
    title: 'Petzera — Spa Thú Cưng, Khám Thú Y & Khoa Sinh Sản 24/7 | Pet Shop Chính Hãng',
    description:
      'Petzera cung cấp dịch vụ Spa Grooming cắt tỉa lông chó mèo, Tiêm phòng vắc xin, Khám bệnh trị liệu & Khoa Sinh Sản hộ sinh 24/7 và Pet Shop chính hãng giao nhanh 2H.',
    keywords:
      'Petzera, spa thú cưng, cắt tỉa lông chó mèo, khám bệnh thú y, khoa sinh sản thú cưng, tiêm phòng vắc xin, pet shop chính hãng, thức ăn Royal Canin',
    robots: 'index, follow',
    breadcrumbName: 'Trang Chủ',
  },
  about: {
    title: 'Về Chúng Tôi — Petzera 24/7 & Địa Chỉ Số 12 Nguyễn Văn Bảo, P. Hạnh Thông, TP.HCM',
    description:
      'Tìm hiểu về hệ sinh thái chăm sóc thú cưng 24/7 Petzera và bản đồ chỉ đường tới cơ sở Số 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP. Hồ Chí Minh.',
    keywords:
      'về chúng tôi Petzera, địa chỉ Petzera, 12 Nguyễn Văn Bảo Phường Hạnh Thông, spa thú cưng 24/7 TP.HCM, thú y 24/7 Hạnh Thông',
    robots: 'index, follow',
    breadcrumbName: 'Về Chúng Tôi',
  },
  reproduction: {
    title: 'Khoa Sinh Sản Thú Cưng 24/7 — Siêu Âm Thai, Đỡ Đẻ & Triệt Sản Minilap | Petzera',
    description:
      'Chuyên khoa sinh sản & hộ sinh thú y 24/7 tại Petzera: siêu âm Doppler chuẩn xác, máy tính ngày dự sinh chó mèo, đỡ đẻ mổ đẻ Isoflurane và triệt sản Minilap không sẹo.',
    keywords:
      'khoa sinh sản thú cưng, siêu âm thai chó mèo, đỡ đẻ chó mèo 24/7, mổ đẻ thú cưng, triệt sản Minilap, tính ngày dự sinh chó mèo',
    robots: 'index, follow',
    breadcrumbName: 'Khoa Sinh Sản',
  },
  booking: {
    title: 'Dịch Vụ Spa Grooming, Tiêm Phòng & Khám Bệnh Trị Liệu Thú Cưng | Petzera',
    description:
      'Đặt lịch Spa Grooming 7 bước, cắt tỉa tạo kiểu Teddy, tiêm vắc xin 5 trong 1, khám bệnh tổng quát, siêu âm thai & triệt sản Minilap — khóa khung giờ online không trùng slot.',
    keywords:
      'đặt lịch spa thú cưng, bảng giá tắm cắt tỉa chó mèo, tiêm phòng vắc xin chó mèo, khám bệnh trị liệu thú cưng, siêu âm thai triệt sản',
    robots: 'index, follow',
    breadcrumbName: 'Dịch Vụ Spa & Thú Y',
  },
  shop: {
    title: 'Pet Shop Petzera — Thức Ăn Hạt Royal Canin, Cát Đậu Nành Tofu & Phụ Kiện Chính Hãng',
    description:
      'Mua sắm hơn 40+ sản phẩm thú cưng chính hãng: thức ăn hạt Royal Canin, sữa bột Predogen, cát đậu nành Tofu khử mùi, sữa tắm SOS và phụ kiện giao hỏa tốc 2 giờ.',
    keywords:
      'pet shop, thức ăn hạt Royal Canin, cát đậu nành Tofu, sữa tắm chó mèo SOS, phụ kiện chó mèo chính hãng, giao nhanh 2h',
    robots: 'index, follow',
    breadcrumbName: 'Cửa Hàng Pet Shop',
  },
  pets: {
    title: 'Quản Lý Hồ Sơ Thú Cưng & Sổ Y Bạ Điện Tử | Petzera',
    description:
      'Lưu trữ hồ sơ thú cưng, theo dõi cân nặng, giống loài, tiền sử y tế và đặt lịch chăm sóc nhanh tại Petzera.',
    keywords: 'hồ sơ thú cưng, sổ sức khỏe chó mèo, quản lý thú cưng Petzera',
    robots: 'noindex, follow',
    breadcrumbName: 'Hồ Sơ Thú Cưng',
  },
  history: {
    title: 'Theo Dõi Tiến Độ Lịch Hẹn & Lịch Sử Đơn Hàng | Petzera',
    description:
      'Cập nhật tiến độ chăm sóc thú cưng theo thời gian thực, xem nhật ký Spa và quản lý đơn hàng đã đặt tại Petzera.',
    keywords: 'lịch sử đặt lịch thú cưng, theo dõi đơn hàng Petzera',
    robots: 'noindex, follow',
    breadcrumbName: 'Tiến Độ & Lịch Hẹn',
  },
  cart: {
    title: 'Giỏ Hàng Của Bạn | Petzera Super Shop',
    description:
      'Kiểm tra danh sách sản phẩm trong giỏ hàng, cập nhật số lượng, áp dụng mã giảm giá và tiến hành thanh toán tại Petzera.',
    keywords: 'giỏ hàng petzera, mua sắm thú cưng',
    robots: 'noindex, nofollow',
    breadcrumbName: 'Giỏ Hàng',
  },
  checkout: {
    title: 'Thanh Toán Đơn Hàng An Toàn | Petzera Super Shop',
    description:
      'Hoàn tất thanh toán đơn hàng vật phẩm thú cưng Petzera qua COD, chuyển khoản VietQR hoặc ví điện tử.',
    keywords: 'thanh toán pet shop, đặt hàng thú cưng',
    robots: 'noindex, nofollow',
    breadcrumbName: 'Thanh Toán',
  },
};

const STAFF_SEO_META = {
  CARE_STAFF: {
    title: 'Cổng Nhân Viên — Quản Lý Lịch Hẹn, Dịch Vụ & Hồ Sơ Thú Cưng | Petzera',
    description: 'Không gian làm việc nội bộ dành cho Nhân viên chăm sóc Petzera.',
  },
  WAREHOUSE_STAFF: {
    title: 'Cổng Quản Lý Kho — Tồn Kho & Dự Báo Nhu Cầu AI | Petzera',
    description: 'Không gian quản lý nhập xuất tồn kho và dự báo nhu cầu AI Petzera.',
  },
  ADMIN: {
    title: 'Cổng Quản Trị Admin — Điều Hành & Phân Quyền Hệ Thống | Petzera',
    description: 'Trang quản trị nội bộ hệ thống Petzera.',
  },
};

function upsertMeta(selector, attrName, attrValue, content) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertDynamicJsonLd(schemaObj) {
  if (typeof document === 'undefined') return;
  const scriptId = 'dynamic-seo-jsonld';
  let script = document.getElementById(scriptId);
  if (!schemaObj) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj);
}

export function applyPageSEO({ portalMode, activeRole, activeTab, selectedProduct = null, selectedService = null, services = [], products = [] }) {
  if (typeof document === 'undefined') return;
  const origin =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://petzera.vn';

  if (portalMode === 'STAFF') {
    const staffMeta = STAFF_SEO_META[activeRole] || STAFF_SEO_META.ADMIN;
    document.title = staffMeta.title;
    upsertMeta('meta[name="description"]', 'name', 'description', staffMeta.description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    upsertCanonical(`${origin}/admin`);
    upsertDynamicJsonLd(null);
    return;
  }

  // Dedicated SEO for Service Detail Page (/dich-vu/:id)
  if (activeTab === 'service-detail' && selectedService) {
    const priceText = `${Number(selectedService.price || 0).toLocaleString('vi-VN')}đ`;
    const svcTitle = `${selectedService.name} — Giá ${priceText} | Petzera`;
    const svcDesc = `${selectedService.name} (${selectedService.category}, ${selectedService.durationMinutes || 45} phút) giá niêm yết ${priceText} tại Petzera. ${selectedService.description || 'Đặt lịch online không trùng khung giờ.'}`;
    const canonicalUrl = `${origin}/dich-vu/${encodeURIComponent(selectedService.id)}`;

    document.title = svcTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', svcDesc);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', `${selectedService.name}, ${selectedService.category}, đặt lịch thú cưng Petzera`);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');
    upsertCanonical(canonicalUrl);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', svcTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', svcDesc);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', svcTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', svcDesc);

    upsertDynamicJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang Chủ', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Dịch Vụ Spa & Thú Y', item: `${origin}/dich-vu-spa` },
            { '@type': 'ListItem', position: 3, name: selectedService.name, item: canonicalUrl },
          ],
        },
        {
          '@type': 'Service',
          name: selectedService.name,
          serviceType: selectedService.category,
          description: selectedService.description || svcDesc,
          provider: {
            '@type': 'VeterinaryCare',
            name: 'Petzera Pet Care',
            telephone: '+84348639603',
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'VND',
            price: Number(selectedService.price) || 0,
            availability: 'https://schema.org/InStock',
          },
        },
      ],
    });
    return;
  }

  // Dedicated SEO for Product Detail Page (/san-pham/:id)
  if (activeTab === 'product-detail' && selectedProduct) {
    const priceText = `${Number(selectedProduct.unitPrice || 0).toLocaleString('vi-VN')}đ`;
    const prodTitle = `${selectedProduct.name} — Giá ${priceText} | Petzera Pet Shop`;
    const prodDesc = `Mua ${selectedProduct.name} (${selectedProduct.category}, mã ${selectedProduct.sku}) chính hãng tại Petzera chỉ ${priceText}. Giao hỏa tốc 2H, đổi trả 7 ngày.`;
    const canonicalUrl = `${origin}/san-pham/${encodeURIComponent(selectedProduct.id)}`;

    document.title = prodTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', prodDesc);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', `${selectedProduct.name}, ${selectedProduct.category}, ${selectedProduct.sku}, Petzera Pet Shop`);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');
    upsertCanonical(canonicalUrl);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', prodTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', prodDesc);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    if (selectedProduct.image) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', selectedProduct.image);
      upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', selectedProduct.image);
    }
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', prodTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', prodDesc);

    upsertDynamicJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang Chủ', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Cửa Hàng Pet Shop', item: `${origin}/cua-hang` },
            { '@type': 'ListItem', position: 3, name: selectedProduct.name, item: canonicalUrl },
          ],
        },
        {
          '@type': 'Product',
          name: selectedProduct.name,
          sku: selectedProduct.sku,
          category: selectedProduct.category,
          image: selectedProduct.image ? [selectedProduct.image] : undefined,
          description: prodDesc,
          brand: {
            '@type': 'Brand',
            name: selectedProduct.supplierName || 'Petzera Official',
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'VND',
            price: Number(selectedProduct.unitPrice) || 0,
            availability:
              selectedProduct.currentStock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '140',
          },
        },
      ],
    });
    return;
  }

  const meta = CUSTOMER_SEO_META[activeTab] || CUSTOMER_SEO_META.home;
  const slugPath = getPathForCustomerTab(activeTab);
  const canonicalUrl = `${origin}${slugPath}`;

  document.title = meta.title;
  upsertMeta('meta[name="description"]', 'name', 'description', meta.description);
  upsertMeta('meta[name="keywords"]', 'name', 'keywords', meta.keywords);
  upsertMeta('meta[name="robots"]', 'name', 'robots', meta.robots);
  upsertCanonical(canonicalUrl);

  upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  const graph = [];

  if (activeTab !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang Chủ', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: meta.breadcrumbName, item: canonicalUrl },
      ],
    });
  }

  if (activeTab === 'booking' && services.length > 0) {
    graph.push({
      '@type': 'ItemList',
      name: 'Bảng Giá Dịch Vụ Spa & Thú Y Petzera',
      itemListElement: services.slice(0, 12).map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Service',
          name: s.name,
          serviceType: s.category,
          description: s.description,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: Number(s.price) || 0,
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    });
  } else if (activeTab === 'shop' && products.length > 0) {
    graph.push({
      '@type': 'ItemList',
      name: 'Sản Phẩm Pet Shop Chính Hãng Petzera',
      itemListElement: products.slice(0, 12).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          sku: p.sku,
          category: p.category,
          url: `${origin}/san-pham/${encodeURIComponent(p.id)}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: Number(p.unitPrice) || 0,
            availability:
              p.currentStock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
          },
        },
      })),
    });
  } else if (activeTab === 'reproduction') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Chó mèo mang thai bao nhiêu ngày thì sinh?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Thời gian mang thai trung bình ở chó là 58 đến 68 ngày (trung bình 63 ngày) và ở mèo là 63 đến 67 ngày (trung bình 65 ngày).',
          },
        },
        {
          '@type': 'Question',
          name: 'Triệt sản Minilap cho chó mèo có cần cắt chỉ không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Công nghệ triệt sản vi phẫu Minilap tại Petzera tạo đường mổ siêu nhỏ 1 - 1.5cm, khâu chỉ tự tiêu thẩm mỹ nội bì nên không cần tái khám cắt chỉ và bé hồi phục sau 24 giờ.',
          },
        },
      ],
    });
  }

  upsertDynamicJsonLd(graph.length > 0 ? { '@context': 'https://schema.org', '@graph': graph } : null);
}
