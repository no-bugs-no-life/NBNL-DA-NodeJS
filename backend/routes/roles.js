var express = require("express");
var router = express.Router();
let roleController = require('../controllers/roles');

router.get("/",
    /* #swagger.tags = ['Roles'] */
    async function (req, res, next) {
        try {
            let roles = await roleController.getAllRoles(req.query);
            res.send(roles);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get("/:id",
    /* #swagger.tags = ['Roles'] */
    async function (req, res, next) {
        try {
            let role = await roleController.getRoleById(req.params.id);
            if (!role) {
                return res.status(404).send({ message: "id not found" });
            }
            res.send(role);
        } catch (error) {
            res.status(404).send({ message: "id not found" });
        }
    });

router.post("/",
    /* #swagger.tags = ['Roles'] */
    async function (req, res, next) {
        try {
            let newRole = await roleController.createRole(req.body.name, req.body.description);
            res.status(201).send(newRole);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.put("/:id",
    /* #swagger.tags = ['Roles'] */
    async function (req, res, next) {
        try {
            let role = await roleController.updateRole(req.params.id, req.body);
            if (!role) {
                return res.status(404).send({ message: "id not found" });
            }
            res.send(role);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.delete("/:id",
    /* #swagger.tags = ['Roles'] */
    async function (req, res, next) {
        try {
            let role = await roleController.deleteRole(req.params.id);
            if (!role) {
                return res.status(404).send({ message: "id not found" });
            }
            res.send(role);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

module.exports = router;
