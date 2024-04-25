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
    updateProfile,
    assignTask,
    addComment, 
    addAttachment,
    createTeam, 
    getTeamById, 
    updateTeam, 
    inviteToTeam, 
    logout

} = require("./userController"); 

router.post("/", createUser);
router.post("/login", login);
router.post("/task", checkToken, createTask); 
router.get("/tasks", checkToken, getAllTasks); 
router.get("/tasks/:taskId", checkToken, getTaskById); 
router.put("/tasks/:taskId", checkToken, updateTask); 
router.delete("/tasks/:taskId", checkToken, deleteTask); 
router.get('/profile', viewProfile);
router.put('/profile', updateProfile);
router.post("/tasks/:taskId/assigntask", checkToken, assignTask);
router.post("/tasks/:taskId/comments", checkToken, addComment);
router.post("/tasks/:taskId/attachments", checkToken, addAttachment);
router.post("/team", checkToken, createTeam);
router.get("/team/:teamId", checkToken, getTeamById);
router.put("/team/:teamId", checkToken, updateTeam);
router.post("/team/:teamId/invite", checkToken, inviteToTeam);
router.post("/logout", logout);

module.exports = router;
