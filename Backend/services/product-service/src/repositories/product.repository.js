const createProductRepository = (Model) => ({
  findAll: (filter = {}) => Model.find(filter),
  findById: (id) => Model.findById(id),
  create: (data) => Model.create(data),
  findByIdAndUpdate: (id, data, options) => Model.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => Model.findByIdAndDelete(id),
  findOneAndUpdate: (filter, update, options) => Model.findOneAndUpdate(filter, update, options),
  findOneAndDelete: (filter) => Model.findOneAndDelete(filter),
});

module.exports = createProductRepository;
