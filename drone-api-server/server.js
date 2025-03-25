const express = require('express');
const axios = require('axios');
const app = express();
const multer = require('multer');
const upload = multer();
const cors = require('cors');

// URL ของ Drone Config Server และ Drone Log Server
const CONFIG_URL = 'https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec';
const LOG_URL = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';

// Middleware สำหรับรับข้อมูล JSON
app.use(express.json());
app.use(cors());

// Routes
app.get('/configs/:id', async (req, res) => {
    const droneId = Number(req.params.id);
    try {
        const response = await axios.get(CONFIG_URL);
        const configs = response.data.data;
        const config = configs.find(c => c.drone_id === droneId);

        if (!config) {
            return res.status(404).json({ error: "Drone config not found" });
        }
      
        delete config.condition;
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: "Error fetching drone config" });
    }
});

app.get('/status/:id', async (req, res) => {
    const droneId = Number(req.params.id);
    try {
        const logResponse = await axios.get(CONFIG_URL);
        const logs = logResponse.data.data;
        const droneLog = logs.find(log => log.drone_id === droneId);

        if (!droneLog) {
            return res.status(404).json({ error: "Drone log not found" });
        }

        const condition = droneLog.condition || "unknown";
        res.json({ condition: condition });
    } catch (error) {
        res.status(500).json({ error: "Error fetching drone status" });
    }
});

app.get('/logs', async (req, res) => {
    try {
        let allLogs = [];
        let currentPage = 1;
        let hasMoreData = true;
        const droneId = 65011012;

        while (hasMoreData) {
            const response = await axios.get(`${LOG_URL}?page=${currentPage}`);
            const logs = response.data.items;

            if (logs && logs.length > 0) {
                const filteredLogs = logs.filter(log => log.drone_id === droneId);
                allLogs = allLogs.concat(filteredLogs);
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }

        res.json(allLogs);
    } catch (error) {
        console.error("Error fetching drone logs:", error.message);
        res.status(500).json({ error: "Error fetching drone logs" });
    }
});

app.post("/logs", upload.none(), async (req, res) => {
    if (!req.body.celsius) {
        return res.status(400).send("Please provide the celsius value");
    }

    const celsius = req.body.celsius;
    const country = "Thailand";
    const droneId = 65011012;
    const droneName = "Wuttipat";

    try {
        const { data } = await axios.post(LOG_URL, {
            celsius: celsius,
            country: country,
            drone_id: droneId,
            drone_name: droneName
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 20250301efx'
            }
        });
        
        console.log("Data generated: ", data);
        res.status(200).json({
            message: "Insert complete",
            input_celsius: celsius,
            generated_data: data,
            country: country,
            drone_id: droneId,
            drone_name: droneName
        });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send("Error handling the data");
    }
});

// Export Express app สำหรับ Vercel
module.exports = app;