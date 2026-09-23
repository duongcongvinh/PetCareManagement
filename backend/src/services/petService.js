const prisma = require('../config/prisma');

const getPetsByUser = async (user) => {
  const where = user.role === 'CUSTOMER' ? { ownerId: user.id } : {};
  return await prisma.pet.findMany({
    where,
    include: {
      owner: { select: { fullName: true, phone: true, email: true } },
      appointments: { select: { id: true, appointmentDate: true, status: true, timeSlot: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const createNewPet = async ({ name, species, breed, ageMonths, weightKg, medicalHistory, ownerId }, currentUser) => {
  const targetOwnerId = currentUser.role === 'CUSTOMER' ? currentUser.id : (ownerId || currentUser.id);

  return await prisma.pet.create({
    data: {
      name,
      species,
      breed,
      ageMonths: ageMonths ? parseInt(ageMonths) : null,
      weightKg: weightKg ? parseFloat(weightKg) : null,
      medicalHistory,
      ownerId: targetOwnerId,
    },
  });
};

const updatePetById = async (id, data) => {
  const updateData = { ...data };
  if (updateData.ageMonths) updateData.ageMonths = parseInt(updateData.ageMonths);
  if (updateData.weightKg) updateData.weightKg = parseFloat(updateData.weightKg);

  return await prisma.pet.update({
    where: { id },
    data: updateData,
  });
};

const deletePetById = async (id) => {
  return await prisma.pet.delete({
    where: { id },
  });
};

module.exports = {
  getPetsByUser,
  createNewPet,
  updatePetById,
  deletePetById,
};
