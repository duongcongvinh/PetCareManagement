export const CONTACT_INFO = {
  ownerName: 'Dương Công Vĩnh',
  phoneRaw: '0348639603',
  phoneDisplay: '0348 639 603',
  phoneDots: '0348.639.603',
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
