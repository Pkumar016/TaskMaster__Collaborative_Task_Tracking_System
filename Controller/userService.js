const pool = require("../Database/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `INSERT INTO users(firstName, lastName, gender, email, password, number) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                JSON.stringify(data.preferences), // Convert preferences array to JSON string
                defaultRole // Assign default role to the 'role' column
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                } else {
                    callBack(null, results);
                }
            }
        );
    },
    getUserByUserEmail: (email, callBack) => {
        pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                } else {
                    callBack(null, results[0]);
                }
            }
        );
    },
    createTask: async (title, description, dueDate, assignedTo) => {
        try {
            const [result] = await pool.query('INSERT INTO tasks (title, description, dueDate, assignedTo) VALUES (?, ?, ?, ?)', [title, description, dueDate, assignedTo]);
            return { id: result.insertId, title, description, dueDate, assignedTo };
        } catch (error) {
            throw error; // Throw the error for better error handling
        }
    },
    getAllTasks: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM tasks');
            return rows;
        } catch (error) {
            throw error; // Throw the error for better error handling
        }
    },
    getTaskById: async (taskId) => {
        try {
            const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
            return rows[0]; // Assuming taskId is unique, return the first row
        } catch (error) {
            throw error;
        }
    },
    updateTask: async (taskId, updatedTaskData) => {
        const { title, description, dueDate, assignedTo } = updatedTaskData;
        try {
            await pool.query('UPDATE tasks SET title = ?, description = ?, dueDate = ?, assignedTo = ? WHERE id = ?', [title, description, dueDate, assignedTo, taskId]);
            return { id: taskId, title, description, dueDate, assignedTo };
        } catch (error) {
            throw error;
        }
    },
    deleteTask: async (taskId) => {
        try {
            await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            return rows[0]; // Assuming userId is unique, return the first row
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId, updatedUserData) => {
        const { firstName, lastName, gender, email, number, preferences } = updatedUserData;
        try {
            await pool.query('UPDATE users SET firstName = ?, lastName = ?, gender = ?, email = ?, number = ?, preferences = ? WHERE id = ?', [firstName, lastName, gender, email, number, JSON.stringify(preferences), userId]);
        } catch (error) {
            throw error;
        }
    },

    assignTask: async (taskId, assignedTo) => {
        try {
            await pool.query('UPDATE tasks SET assignedTo = ? WHERE id = ?', [assignedTo, taskId]);
        } catch (error) {
            throw error;
        }
    }
}; // <-- added closing parenthesis
