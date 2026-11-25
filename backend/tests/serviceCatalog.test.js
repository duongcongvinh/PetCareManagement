const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_SERVICES, ensureDefaultServices } = require('../src/config/defaultServices');

test('DEFAULT_SERVICES chứa đủ 18 dịch vụ thuộc đúng 3 danh mục chuẩn (không còn Khách Sạn, gộp Khoa Sinh Sản vào Khám Bệnh & Trị Liệu)', () => {
  assert.equal(DEFAULT_SERVICES.length, 18);

  const byCategory = DEFAULT_SERVICES.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  assert.deepEqual(byCategory, {
    'Spa & Grooming': 6,
    'Y Tế & Tiêm Phòng': 3,
    'Khám Bệnh & Trị Liệu': 9,
  });

  // Đảm bảo không còn danh mục Khách Sạn & Lưu Trú, Khoa Sinh Sản tách riêng hay tên cũ Khám Bệnh
  assert.equal(DEFAULT_SERVICES.filter((s) => s.category === 'Khách Sạn & Lưu Trú').length, 0);
  assert.equal(DEFAULT_SERVICES.filter((s) => s.category === 'Khoa Sinh Sản').length, 0);
  assert.equal(DEFAULT_SERVICES.filter((s) => s.category === 'Khám Bệnh').length, 0);
});

test('Toàn bộ 6 dịch vụ Sinh sản đều nằm trong danh mục Khám Bệnh & Trị Liệu', () => {
  const clinicServices = DEFAULT_SERVICES.filter((s) => s.category === 'Khám Bệnh & Trị Liệu');
  const expectedKeywords = ['siêu âm thai', 'hộ sinh đỡ đẻ', 'mổ đẻ', 'triệt sản', 'thiến', 'pyometra'];

  for (const kw of expectedKeywords) {
    assert.ok(
      clinicServices.some((s) => s.name.toLowerCase().includes(kw)),
      `Phải có dịch vụ chứa "${kw}" trong Khám Bệnh & Trị Liệu`
    );
  }
});

test('ensureDefaultServices gộp Khoa Sinh Sản và xóa an toàn dịch vụ Khách Sạn không bị tham chiếu', async () => {
  const rows = [
    { id: '1', name: 'Phòng VIP Suite Kính Cường Lực & Camera Trực Tuyến 24/7', category: 'Khách Sạn & Lưu Trú' },
    { id: '2', name: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác', category: 'Khoa Sinh Sản' },
    { id: '3', name: 'Phòng Khách Sạn Standard Điều Hòa 24/7 (Tiêu Chuẩn)', category: 'Khách Sạn & Lưu Trú' },
  ];
  const deletedIds = [];

  const mockPrisma = {
    serviceCatalog: {
      updateMany: async ({ where, data }) => {
        const targets = where.category.in;
        for (const r of rows) {
          if (targets.includes(r.category)) r.category = data.category;
        }
      },
      findMany: async () => [...rows],
      delete: async ({ where }) => {
        deletedIds.push(where.id);
        const idx = rows.findIndex((r) => r.id === where.id);
        if (idx >= 0) rows.splice(idx, 1);
      },
      update: async ({ where, data }) => {
        const row = rows.find((r) => r.id === where.id);
        if (row) Object.assign(row, data);
        return row;
      },
      create: async ({ data }) => {
        const created = { id: `new-${rows.length + 1}`, ...data };
        rows.push(created);
        return created;
      },
    },
    appointment: {
      count: async ({ where }) => (where.serviceId === '3' ? 1 : 0),
    },
  };

  const res = await ensureDefaultServices(mockPrisma);

  assert.equal(res.removedCount, 1);
  assert.deepEqual(deletedIds, ['1']); // id=1 (0 lịch hẹn) bị xóa; id=3 (1 lịch hẹn cũ) được giữ an toàn
  assert.equal(rows.find((r) => r.id === '2').category, 'Khám Bệnh & Trị Liệu');
  assert.equal(res.createdCount, 17);
  assert.equal(res.totalExpected, 18);
});
