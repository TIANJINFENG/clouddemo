/**
 * Created by dell on 16-9-21.
 */
var mongodb = require('./db');


function Tyk() {
    this.name = 'k'

}
module.exports = Tyk;
Tyk.get = function(date,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('tyk_analytics', function (err, collection) {
            if (err) {
                console.log('---------qwe--------');
                mongodb.close();
                console.log('---------asd--------');
                return callback(err);//错误，返回 err 信息
            }
            collection.count(date,function (err, user) {
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