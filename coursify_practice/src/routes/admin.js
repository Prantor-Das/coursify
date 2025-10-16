const {Router} = require('express');

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message: "signup endpoint"
    })
});

adminRouter.post("/signin", (req, res) => {
    res.json({
        message: "signin endpoint"
    })
});

adminRouter.post("/course", (req, res) => {
    res.json({
        message: "create-course endpoint"
    })
});

adminRouter.put("/course/:courseId", (req, res) => {
    res.json({
        message: "edit-course endpoint"
    })
});

adminRouter.get("/course/bulk", (req, res) => {
    res.json({
        message: "all-courses endpoint"
    })
});

module.exports = {
    adminRouter : adminRouter
}