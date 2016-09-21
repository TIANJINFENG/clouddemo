/**
 * Created by dell on 16-9-21.
 */
var mongodb = require('./db');


function Api() {
    this.name = 'k'

}
module.exports = Api;
Api.get = function(date,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('tyk_apis', function (err, collection) {
            if (err) {
                console.log('---------qwe--------');
                mongodb.close();
                console.log('---------asd--------');
                return callback(err);//错误，返回 err 信息
            }
            collection.find({
                _id:'ObjectId('+date+')'
            },function (err, user) {
                console.log('---------zxc--------');
                mongodb.close();
                console.log('---------tyu--------');
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                console.log('---------hjk--------');
                // console.log(user)
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};