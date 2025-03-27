const dbServices = {};

dbServices.findUser = async (model,filter) => {
    return await model.findOne(filter).lean();
}

dbServices.updateUser=async (model,filter,query,option) => {
    return await model.updateOne(filter, query, option);
}



module.exports = dbServices;