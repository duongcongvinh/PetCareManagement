export const CONTACT_INFO = {
  ownerName: 'Dương Công Vĩnh',
  phoneRaw: '0348639603',
  phoneDisplay: '0348 639 603',
  phoneDots: '0348.639.603',
  email: 'hello@petzera.vn',
  address: 'Số 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP. Hồ Chí Minh',
  openHours: 'Mở cửa 24/7 (00:00 – 24:00 • Cả Lễ & Tết)',
  coords: { lat: 10.822159, lng: 106.687451 },
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=S%E1%BB%91+12+Nguy%E1%BB%85n+V%C4%83n+B%E1%BA%A3o,+Ph%C6%B0%E1%BB%9Dng+H%E1%BA%A1nh+Th%C3%B4ng,+TP.+H%E1%BB%93+Ch%C3%AD+Minh',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=10.822159,106.687451&z=16&hl=vi&output=embed',
  zaloLink: 'https://zalo.me/0348639603',
  zaloQrImage: '/zalo-qr.jpg',
  zaloQrFallback:
    'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=https%3A%2F%2Fzalo.me%2F0348639603',
  facebookLink: 'https://www.facebook.com/cong.vinh.2624',
};

export const openZaloQrModal = (e) => {
  if (typeof window !== 'undefined') {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    window.dispatchEvent(new CustomEvent('petcare_open_zalo_qr'));
  }
};
