const petService = require('../services/petService');

const getPets = async (req, res) => {
  try {
    const pets = await petService.getPetsByUser(req.user);
    return res.json(pets);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách thú cưng.' });
  }
};

const createPet = async (req, res) => {
  try {
    const pet = await petService.createNewPet(req.body, req.user);
    return res.status(201).json(pet);
  } catch (error) {
    console.error('Create pet error:', error);
    return res.status(500).json({ message: 'Lỗi khi tạo hồ sơ thú cưng.' });
  }
};

const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await petService.updatePetById(id, req.body);
    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật thú cưng.' });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    await petService.deletePetById(id);
    return res.json({ message: 'Đã xóa hồ sơ thú cưng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi xóa thú cưng.' });
  }
};

module.exports = {
  getPets,
  createPet,
  updatePet,
  deletePet,
};
