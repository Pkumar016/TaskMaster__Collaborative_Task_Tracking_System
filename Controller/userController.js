const {
    create,
    getUserByUserEmail,
    login,
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getUserById,
    updateUser,
    assignTask,
    addComment,
    addAttachment,
    createTeam,
    getTeamById,
    updateTeam,
    inviteToTeam

} = require("./userService");

const taskService = require("./taskService.js"); 
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");


module.exports = {
    createUser: (req, res) => {
        console.log('Received request body:', req.body);
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.role = defaultRole; // Set the default role here

        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, "qwe1234", {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    message: "Login successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
        });
    },

    createTask: async (req, res) => {
        try {
            const { title, description, dueDate, assignedTo } = req.body;
            const newTask = await taskService.createTask(title, description, dueDate, assignedTo);
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllTasks: async (req, res) => {
        try {
            const tasks = await taskService.getAllTasks();
            res.status(200).json({ tasks });
        } catch (error) {
            console.error('Error getting all tasks:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTaskById: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const task = await taskService.getTaskById(taskId);
            if (!task) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            res.status(200).json({ task });
        } catch (error) {
            console.error('Error getting task by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const updatedTask = await taskService.updateTask(taskId, req.body);
            res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            await taskService.deleteTask(taskId);
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    viewProfile: async (req, res) => {
        try {
            const userId = req.user.id; 
            const userProfile = await userService.getUserById(userId);
            if (!userProfile) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ userProfile });
        } catch (error) {
            console.error('Error viewing profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id; 
            const updatedUserData = req.body;
            await userService.updateUser(userId, updatedUserData);
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    assignTask: async (req, res) => {
        try {
            const { taskId, assignedTo } = req.body;
            if (!taskId || !assignedTo) {
                return res.status(400).json({ message: 'Task ID and assignedTo are required' });
            }
            await taskService.assignTask(taskId, assignedTo);
            res.status(200).json({ message: 'Task assigned successfully' });
        } catch (error) {
            console.error('Error assigning task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addComment: async (req, res) => {
        try {
            const { taskId, userId, comment } = req.body;
            if (!taskId || !userId || !comment) {
                return res.status(400).json({ message: 'Task ID, user ID, and comment are required' });
            }
            const newComment = await commentService.addComment(taskId, userId, comment);
            res.status(201).json({ message: 'Comment added successfully', comment: newComment });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addAttachment: async (req, res) => {
        try {
            const { taskId, attachmentUrl } = req.body;
            if (!taskId || !attachmentUrl) {
                return res.status(400).json({ message: 'Task ID and attachment URL are required' });
            }
            const newAttachment = await attachmentService.addAttachment(taskId, attachmentUrl);
            res.status(201).json({ message: 'Attachment added successfully', attachment: newAttachment });
        } catch (error) {
            console.error('Error adding attachment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createTeam: async (req, res) => {
        try {
            const { name, description } = req.body;
            if (!name || !description) {
                return res.status(400).json({ message: 'Name and description are required to create a team' });
            }
            const newTeam = await teamService.createTeam(name, description);
            res.status(201).json({ message: 'Team created successfully', team: newTeam });
        } catch (error) {
            console.error('Error creating team:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTeamById: async (req, res) => {
        try {
            const teamId = req.params.teamId;
            const team = await teamService.getTeamById(teamId);
            if (!team) {
                res.status(404).json({ message: 'Team not found' });
                return;
            }
            res.status(200).json({ team });
        } catch (error) {
            console.error('Error getting team by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateTeam: async (req, res) => {
        try {
            const teamId = req.params.teamId;
            const updatedTeamData = req.body;
            await teamService.updateTeam(teamId, updatedTeamData);
            res.status(200).json({ message: 'Team updated successfully' });
        } catch (error) {
            console.error('Error updating team:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    inviteToTeam: async (req, res) => {
        try {
            const { teamId, userId } = req.body;
            if (!teamId || !userId) {
                return res.status(400).json({ message: 'Team ID and user ID are required to invite to team' });
            }
            await teamService.inviteToTeam(teamId, userId);
            res.status(200).json({ message: 'Invitation sent successfully' });
        } catch (error) {
            console.error('Error inviting to team:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};