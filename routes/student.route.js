const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

const student_controller = require("../controllers/student.controller");


router.get("/add", student_controller.add);
router.post("/add", student_controller.create);

router.get("/all", student_controller.all);
router.get("/:id", student_controller.details);
router.get("/update/:id", student_controller.update);
router.post("/update/:id", student_controller.updateStudent);
router.get("/delete/:id", student_controller.delete);

router.get("/report/all", student_controller.allReport);

router.get('/contact', forwardAuthenticated, student_controller.contact);

router.post('/contact', student_controller.contactUser);


module.exports = router;
