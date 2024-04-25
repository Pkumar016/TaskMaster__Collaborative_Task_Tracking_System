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
                JSON.stringify(data.preferences), 
                defaultRole 
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
            throw error; 
        }
    },
    getAllTasks: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM tasks');
            return rows;
        } catch (error) {
            throw error; 
        }
    },
    getTaskById: async (taskId) => {
        try {
            const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
            return rows[0]; 
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
            return rows[0]; 
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
    },

    addComment: async (taskId, userId, comment) => {
        try {
            const [result] = await pool.query('INSERT INTO comments (taskId, userId, comment) VALUES (?, ?, ?)', [taskId, userId, comment]);
            return { id: result.insertId, taskId, userId, comment };
        } catch (error) {
            throw error;
        }
    },

    addAttachment: async (taskId, attachmentUrl) => {
        try {
            const [result] = await pool.query('INSERT INTO attachments (taskId, attachmentUrl) VALUES (?, ?)', [taskId, attachmentUrl]);
            return { id: result.insertId, taskId, attachmentUrl };
        } catch (error) {
            throw error;
        }
    },

    createTeam: async (name, description) => {
        try {
            const [result] = await pool.query('INSERT INTO teams (name, description) VALUES (?, ?)', [name, description]);
            return { id: result.insertId, name, description };
        } catch (error) {
            throw error;
        }
    },

    getTeamById: async (teamId) => {
        try {
            const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [teamId]);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    },

    updateTeam: async (teamId, updatedTeamData) => {
        const { name, description } = updatedTeamData;
        try {
            await pool.query('UPDATE teams SET name = ?, description = ? WHERE id = ?', [name, description, teamId]);
        } catch (error) {
            throw error;
        }
    },

    inviteToTeam: async (teamId, userId) => {
        try {
            await pool.query('UPDATE users SET teamId = ? WHERE id = ?', [teamId, userId]);
        } catch (error) {
            throw error;
        }
    }

}; 
