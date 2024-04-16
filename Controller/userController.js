const {
    create,
    getUserByUserEmail
} = require("./userService");

const taskService = require("./taskService"); // Import taskService module
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.role = 'attendee'; // Default role

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
};
