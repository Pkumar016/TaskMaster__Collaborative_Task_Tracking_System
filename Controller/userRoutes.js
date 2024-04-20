const router = require("express").Router();
const { checkToken } = require("../Auth/token");
const {
    createUser,
    login,
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    viewProfile,
    updateProfile

} = require("./userController"); // Updated imports

router.post("/", createUser);
router.post("/login", login);
router.post("/task", checkToken, createTask); // Added route for creating a task
router.get("/tasks", checkToken, getAllTasks); // Added route for getting all tasks
router.get("/tasks/:taskId", checkToken, getTaskById); // Added route for getting a task by ID
router.put("/tasks/:taskId", checkToken, updateTask); // Added route for updating a task
router.delete("/tasks/:taskId", checkToken, deleteTask); // Added route for deleting a task
router.get('/profile', viewProfile);
router.put('/profile', updateProfile);

module.exports = router;
