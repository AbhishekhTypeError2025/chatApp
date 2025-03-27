const dbServices = {};

dbServices.findUser = async (model,filter) => {
    return model.findOne(filter).lean();
}

dbServices.updateUser=async (model,filter,query,option) => {
    return model.updateOne(filter, query, option);
}



module.exports = dbServices;