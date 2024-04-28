const pool = require("../Database/database"); // Assuming your database connection pool is exported from db.js

module.exports = {
    async createTask(title, description, dueDate, assignedTo) {
        try {
            const query = `
                INSERT INTO tasks (title, description, due_date, assigned_to)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [title, description, dueDate, assignedTo]);
            return result.insertId; // Assuming you want to return the ID of the newly created task
        } catch (error) {
            throw new Error(`Error creating task: ${error.message}`);
        }
    },

    async getAllTasks() {
        try {
            const query = 'SELECT * FROM tasks';
            const [tasks] = await pool.query(query);
            return tasks;
        } catch (error) {
            throw new Error(`Error fetching all tasks: ${error.message}`);
        }
    },

    async getTaskById(taskId) {
        try {
            const query = 'SELECT * FROM tasks WHERE id = ?';
            const [task] = await pool.query(query, [taskId]);
            return task[0]; // Assuming task ID is unique and returns a single task
        } catch (error) {
            throw new Error(`Error fetching task by ID: ${error.message}`);
        }
    },

    async updateTask(taskId, updatedData) {
        try {
            const query = `
                UPDATE tasks
                SET ?
                WHERE id = ?
            `;
            await pool.query(query, [updatedData, taskId]);
            return true; // Return true or handle success response accordingly
        } catch (error) {
            throw new Error(`Error updating task: ${error.message}`);
        }
    },

    async deleteTask(taskId) {
        try {
            const query = 'DELETE FROM tasks WHERE id = ?';
            await pool.query(query, [taskId]);
            return true; // Return true or handle success response accordingly
        } catch (error) {
            throw new Error(`Error deleting task: ${error.message}`);
        }
    }
};
