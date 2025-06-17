const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  phone: DataTypes.STRING,
  preferencias: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]'
  }
});

// Método para verificar se a senha está correta usando bcrypt
User.prototype.isPasswordValid = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Método para verificar se o usuário possui uma determinada preferência
User.prototype.hasPreference = function(preference) {
  if (!this.preferencias) return false;
  const preferencesArray = JSON.parse(this.preferencias);
  return preferencesArray.includes(preference);
};

// Método para obter as preferências do usuário
User.prototype.getPreferences = function() {
  if (!this.preferencias) return [];
  return JSON.parse(this.preferencias);
};

// Método para atualizar as preferências do usuário
User.prototype.updatePreferences = function(preferences) {
  this.preferencias = JSON.stringify(preferences);
  return this.save();
};

// Adiciona uma nova preferência, se ainda não estiver presente
User.prototype.addPreference = function(preference) {
  const preferencesArray = this.getPreferences();
  if (!preferencesArray.includes(preference)) {
    preferencesArray.push(preference);
    return this.updatePreferences(preferencesArray);
  }
  return Promise.resolve(this);
};

// Remove uma preferência existente
User.prototype.removePreference = function(preference) {
  const preferencesArray = this.getPreferences();
  const index = preferencesArray.indexOf(preference);
  if (index > -1) {
    preferencesArray.splice(index, 1);
    return this.updatePreferences(preferencesArray);
  }
  return Promise.resolve(this);
};

// Sincroniza o modelo com o banco de dados
User.sync({ alter: true })
  .then(() => console.log('User model synced'))
  .catch(err => console.error('Error syncing User model:', err));

module.exports = User;
