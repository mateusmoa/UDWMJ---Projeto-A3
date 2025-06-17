const Address = require('../models/Address');

exports.getUserAddresses = async (req, res) => {
  const userId = req.params.id;
  try {
    const addresses = await Address.findByUserId(userId);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar endereços' });
  }
};

exports.createAddress = async (req, res) => {
  const {
    user_id, zip, street, number, complement,
    neighborhood, city, state, category, nickname, is_main
  } = req.body;

  try {
    await Address.create(
      user_id, category, street, city, state, zip, number,
      complement, neighborhood, nickname, is_main
    );
    res.status(201).json({ message: 'Endereço criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar endereço' });
  }
};

exports.updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const {
    user_id, zip, street, number, complement,
    neighborhood, city, state, category, nickname, is_main
  } = req.body;

  try {
    await Address.update(
      addressId,
      user_id, category, street, city, state, zip, number,
      complement, neighborhood, nickname, is_main ? 1 : 0
    );
    res.status(200).json({ message: 'Endereço atualizado com sucesso' });
  } catch (err) {
    console.error(err);Q
    res.status(500).json({ error: 'Erro ao atualizar endereço' });
  }
};

exports.deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  try {
    await Address.delete(addressId);
    res.status(200).json({ message: 'Endereço excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir endereço' });
  }
};
