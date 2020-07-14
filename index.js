const mysql = require('mysql');
const querystring = require('querystring');

exports.handler = function(event, context, callback) {
    
    
    var tokenValido= "980a2596-511c-416f-970b-a5483853e32b";
    var userId= 1;
    if (event.body !== null && event.body !== undefined) {

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystring.parse(bodyBase64);

        var token = body.token;
        var description = body.description;

        var conn = mysql.createConnection({
        host: "database-software.crknvr8yjx6d.us-east-1.rds.amazonaws.com",
        user: "branko",
        password: "g1r42o2o",
        port: 3306,
        database: "teletok_lambda"
    });

        var errorcito = "";
        if (token==tokenValido){errorcito="SAVE_ERROR";}else {errorcito="TOKEN_INVALID";}
    
        conn.connect(function(error) {
            if (error) {
                conn.end(function() {
                    callback(error, {
                        statusCode: 400,
                        body: JSON.stringify({
                            "error": errorcito
                        })
                    });
                });
            }
            else {

                var sql = "INSERT INTO teletok_lambda.post (description, user_id) VALUES (?,?)";

                conn.query(sql, [description,userId], function(error, result) {
                    if (error) {
                        conn.end(function() {
                            callback(error, {
                                statusCode: 400,
                                body: JSON.stringify({
            
                                    "error": errorcito
                                })
                            });
                        });
                    }
                    else {
                            conn.end(function() {
                                callback(null, {
                                    statusCode: 200,
                                    body: JSON.stringify({
                                        "postId": result.createdId,
                                        "status": "POST_CREATED"
                                    })
                                });
                            });
                       
                    }
                });
            }
        });
    }

};
