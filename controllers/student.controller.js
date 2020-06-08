const Student = require("../models/student.model");
const pdf = require("html-pdf");
const fs = require("fs");
const options = { format: "A4" };

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


 //contact us
 exports.contact = (req, res) =>
  res.render("contact"
    );
 exports.contactUser=(req, res, next)=>{
 async function main() {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>  
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
`;

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "meharmuneeba91@gmail.com", // generated ethereal user
      pass: "729007ab"// generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'meharmuneeba91@gmail.com', // sender address
    to:  "abdullah.asif0009@gmail.com", // list of receivers
    subject: "Nodemailer Contact", // Subject line
    text:'Hello world?', // plain text body
     html: output // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
 }

 main().catch(console.error);
 res.end("you message has been send successfully")

}

// test function
exports.test = function A(req, res) {
  res.render("test", {
    layout: "noLayout"
  });
};

// Add new student function
exports.add = function A(req, res) {
  res.render("student/studentAdd", { layout: "studentLayout" });
};

exports.update = async function(req, res) {
  let student = await Student.findOne({ _id: req.params.id });
  res.render("student/studentUpdate", {
    student,
    layout: "studentLayout"
  });
};

exports.create = (req, res) => {
  let student = new Student({
    roll: req.body.roll,
    name: req.body.name
  });

  student.save(function(err) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont insert student.." });
    }
    req.flash("student_add_success_msg", "New Dish added successfully");
    res.redirect("/student.route/all");
  });
};

exports.details = (req, res) => {
  Student.findById(req.params.id, function(err, student) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Cannont find student with ${req.params.id}.`
      });
    }
    res.render("student/studentDetail", {
      student,
      layout: "studentLayout"
    });
  });
};

exports.all = (req, res) => {
  Student.find(function(err, students) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find students." });
    }
    res.status(200).render("student/studentAll", {
      students,
      layout: "studentLayout"
    });
    //res.send(students);
  });
};

// Post Update to insert data in database
exports.updateStudent = async (req, res) => {
  let result = await Student.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont update Dish with ${req.params.id}.`
    });
  req.flash("student_update_success_msg", "Dish updated successfully");
  res.redirect("/student.route/all");
};

exports.delete = async (req, res) => {
  let result = await Student.deleteOne({ _id: req.params.id });
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont delete Dish with ${req.params.id}.`
    });
  req.flash("student_del_success_msg", "Dish has been deleted successfully");
  res.redirect("/student.route/all");
};

exports.allReport = (req, res) => {
  Student.find(function(err, students) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find students." });
    }
    res.status(200).render(
      "reports/student/allStudent",
      {
        students,
        layout: "studentLayout"
      },
      function(err, html) {
        pdf
          .create(html, options)
          .toFile("uploads/dishesreport.pdf", function(err, result) {
            if (err) return console.log(err);
            else {
              var datafile = fs.readFileSync("uploads/dishesreport.pdf");
              res.header("content-type", "application/pdf");
              res.send(datafile);
            }
          });
      }
    );
  });
};

