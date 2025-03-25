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
        const MAX_PAGES = 5; // จำกัดการดึงข้อมูลสูงสุด 5 หน้า เพื่อป้องกันการทำงานนานเกินไป

        while (hasMoreData && currentPage <= MAX_PAGES) {
            try {
                const response = await axios.get(`${LOG_URL}?page=${currentPage}`, {
                    headers: {
                        'Authorization': 'Bearer 20250301efx',
                        'Content-Type': 'application/json'
                    }
                });

                // ตรวจสอบโครงสร้างข้อมูล
                if (!response.data || !response.data.items) {
                    throw new Error('Invalid data structure from PocketHost API');
                }

                const logs = response.data.items;
                const filteredLogs = logs.filter(log => log.drone_id === droneId);
                
                if (filteredLogs.length > 0) {
                    allLogs = [...allLogs, ...filteredLogs];
                }

                // ตรวจสอบว่ายังมีหน้าถัดไปหรือไม่
                if (logs.length === 0 || currentPage >= MAX_PAGES) {
                    hasMoreData = false;
                } else {
                    currentPage++;
                }

            } catch (pageError) {
                console.error(`Error fetching page ${currentPage}:`, pageError.message);
                hasMoreData = false; // หยุดการดึงหากเกิดข้อผิดพลาด
            }
        }

        // เรียงลำดับข้อมูลตามวันที่สร้าง (ใหม่ที่สุดมาก่อน)
        const sortedLogs = allLogs.sort((a, b) => 
            new Date(b.created) - new Date(a.created)
        ).slice(0, 25); // จำกัดเพียง 25 รายการ

        res.json(sortedLogs);

    } catch (error) {
        console.error("Server Error:", {
            message: error.message,
            stack: error.stack,
            request: error.config?.url
        });
        
        res.status(500).json({ 
            error: "Failed to fetch logs",
            details: error.response?.data || error.message 
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