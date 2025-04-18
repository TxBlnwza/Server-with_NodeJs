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
        const DRONE_ID = 65011012; // ใช้ drone_id ของคุณโดยตรง
        const MAX_ITEMS = 25; // จำกัดจำนวนรายการ
        
        // ใช้ filter โดยตรงใน URL ของ PocketHost
        const response = await axios.get(
            `${LOG_URL}?filter=(drone_id=${DRONE_ID})&sort=-created&perPage=${MAX_ITEMS}`,
            {
                headers: {
                    'Authorization': 'Bearer 20250301efx',
                    'Content-Type': 'application/json'
                }
            }
        );

        // ตรวจสอบโครงสร้างข้อมูล
        if (!response.data?.items) {
            return res.status(404).json({ 
                error: "No logs found",
                message: "ไม่พบข้อมูล Log สำหรับ Drone ID นี้"
            });
        }

        // ส่งกลับเฉพาะข้อมูลที่ได้เลย (ไม่ต้อง filter อีกครั้ง)
        res.json(response.data.items);

    } catch (error) {
        console.error("Server Error:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        
        res.status(500).json({ 
            error: "Failed to fetch logs",
            details: error.response?.data || error.message,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล Logs"
        });
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