import {MongoDataSourceExtended} from "./common";

export class crawlingScriptDataSource extends MongoDataSourceExtended {

  async removeAndRelist(query) {
    const numDocs = await this.model.countDocuments();
    await this.model.remove(query).collation({locale: "en", strength: 2});
    // The result of remove is a find of the remaining documents
    const numDocsAfterDeletion = await this.model.countDocuments();
    if (numDocs === numDocsAfterDeletion) {
      return null;
    }
    const ret = await this.model.find({});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  cleanScriptStringNoObj(ret2) {
    ret2["_id"] = null;
    delete ret2["_id"];
    delete ret2["__v"];
    delete ret2["username"];
    delete ret2["trendId"];
    delete ret2["scriptName"];
    return JSON.stringify(ret2, null, 2);
  }

  cleanScriptString(ret) {
    return this.cleanScriptStringNoObj(ret.toObject());
  }

  async findOneStringify(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return ret ? {
      filename: ret.toObject().scriptName,
      text: this.cleanScriptString(ret)
    } : null;
  }

  async findManyStringify(query) {
    const ret = await this.model.find(query).collation({locale: "en", strength: 2});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  async updateOneStringify(query, data) {
    // WARNING: findOneAndUpdate returns the doc _before_ the update, so basically it returns the findOne part :/ Lame
    const doc = await this.model.findOneAndUpdate(query, data);
    if (!doc) {
      return null;
    }
    const updated = await this.model.findById(doc._id);
    const ret = updated.toObject();
    return {
      filename: ret.scriptName,
      text: this.cleanScriptStringNoObj(ret)
    };
  }
}
