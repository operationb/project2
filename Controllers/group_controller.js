var db = require("../models");
var Sequelize = require("sequelize");

module.exports = function (app) {
    //displays groups
    app.get("/group/all", function (req, res) {
        db.VanGroup.aggregate(
            'vanGroup_ID', 'DISTINCT', {
                plain: false,
            }
        ).then(function (data) {
            if (data.length != 0) {
                var dataArray = [];
                var idArray = [];
                data.forEach(function (e) {
                    idArray.push(e.vanGroup_ID);
                });

                data.forEach(function (e, index) {
                    db.VanGroup.find({
                        where: {
                            vanGroup_ID: e.DISTINCT
                        }
                    }).then(function (data) {
                        //console.log(data);
                        var vanGroup = {};
                        vanGroup.vanGroup_ID = data.dataValues.vanGroup_ID;
                        vanGroup.pickup_point = data.dataValues.pickup_point;
                        //console.log(vanGroup);
                        dataArray.push(vanGroup);
                        if (index === idArray.length - 1) {
                            var handlebarsObj = {
                                vanGroup: dataArray
                            }
                            //res.json(handlebarsObj);
                            res.render("groups", handlebarsObj);
                        }
                    });
                });
            }
            else {
                res.render("groups");
            }
            // console.log(dataArray);
            // res.json(dataArray);
            // //res.render("groups", data);
        });
    });

    app.get("/group/:id", function (req, res) {
        db.VanGroup.findAll({
                where: {
                    vanGroup_ID: req.params.id,
                },
                include: [{
                    model: db.User
                }]
            })
            .then(function (data) {
                var userData = [];
                var admin;

                data.forEach(function (e) {
                    userData.push(e.User);
                    if (e.User.admin) {
                        admin = e.User;
                    }
                });
                console.log(data);

                var handlebarsObj = {
                    groupData: data[0],
                    userData: userData,
                    admin: admin
                };
                //res.json(handlebarsObj);
                res.render("groupInfo", handlebarsObj);
            })
    })

    // Joins a group
    app.post("/group/join", function (req, res) {
        db.VanGroup.findOrCreate({
            where: {
                vanGroup_ID: req.body.input_vanGroup_ID,
                passenger_ID: req.body.input_user_ID,
                pickup_point: req.body.input_pickup_point
            }
        }).then(function (data) {
            if (data[0]) {
                console.log('Already a member of Van Group');
            } else {
                console.log('Joined Van Group.');
            }

            if (data === null) {
                res.status(404).end();
            }
            res.status(200).end();

        });
    });
}