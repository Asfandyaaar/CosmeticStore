class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //api search feature
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  //api filter function
  filter() {
    const query2 = { ...this.queryString };
    const fieldsToremove = ["keyword", "page", "limit"];
    fieldsToremove.forEach((key) => delete query2[key]);

    //filter for price and rating
    //gt or lt k sath $ sign lagana hoga q k ye mongodb operators hain
    // "query2" ek object hai to sb se pehle ise string m convert karain ge.
    let queryStr = JSON.stringify(query2); // gt or lt k sath $ sign lagane k liye ise string m convert karain ge.

    //string bnane k baad ise replace kr dain ge.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //pagination function
  pagination(ProductsPerPage) {
    let currentPage = Number(this.queryString.page) || 1; // matlab agr user page keyword ka use nhe krta to currentPage 1 hu ga

    const skip = ProductsPerPage * (currentPage - 1);
    /* 
  skip formula maths
  matlab mere paas 20 products hain or m ne hr page pe 5 products dekhani hain to
  productsPerPage = 5, shoro m currentpage = 1,
  pehli baar agr hm skip m values put karain to 5 * (1-1) = 0 matlab k pehle page pr hm koi product skip nhe karain ge or 1 se 5 tk products nazar aayain ge.
  now
  currentPage = 2, skip = 5 * (2-1) = 5 mean skip ki value 5 aa gayi hai to 5 products skip hun gii or 2nd page pr 6 se 10 tk products nazar aayain gee.
*/

    this.query = this.query.limit(ProductsPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
