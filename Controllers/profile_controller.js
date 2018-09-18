var db = require("../models");

module.exports = function(app) {

    // Returns user profile with provided ID from body
    app.get("/profile", function(req, res) {
        db.User.findAll({
            where: {
                id: req.body.userId
            }
        })
        .then(function(data) {
            var handlebarsObj = {
                user_data: data
            };

            res.render("index", handlebarsObj);
        });
    });

    // Posts a new user to user table
    app.post("/create/user", function (req, res) {
        var adminCheck = req.body.input_admin;
        var adminCode = 'admin';
        var isUserAdmin = false;
        if (adminCheck == adminCode) { isUserAdmin = true; }
        
        db.User.create({
            email: req.body.input_email,
            password: req.body.input_password,
            first_name: req.body.input_firstName,
            last_name: req.body.input_lastName,
            company_name: req.body.input_companyName,
            home_address: req.body.input_homeAddress,
            phone_number: req.body.input_phoneNumber,
            about: req.body.input_about,
            pref_pickup: req.body.input_prefPickup,
            admin: isUserAdmin
        })
        .then(function(data) {
            //console.log(adminCheck);
            if (data === null) {
                res.status(404).end();
            }
            res.status(200).end();
        });
    });
}