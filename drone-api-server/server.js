const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const multer = require('multer');
const upload = multer();
const cors = require('cors');




// URL ของ Drone Config Server และ Drone Log Server
const CONFIG_URL = 'https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec';
const LOG_URL = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';

// Middleware สำหรับรับข้อมูล JSON
app.use(express.json());
app.use(cors());

app.get('/configs/:id', async (req, res) => {
    const droneId = Number(req.params.id);
    try {
        // ดึงข้อมูลทั้งหมดจาก Drone Config Server
        const response = await axios.get(CONFIG_URL);
        const configs = response.data.data;

        // กรองข้อมูลให้เหลือเฉพาะ config ที่ตรงกับ drone_id ที่ส่งมา
        const config = configs.find(c => c.drone_id === droneId);

        if (!config) {
            return res.status(404).json({ error: "Drone config not found" });
        }
      
        // ลบ property 'condition' ออกจาก config
        delete config.condition;

        // ส่ง config ที่ถูกต้องกลับไป
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: "Error fetching drone config" });
    }
});
// 2. GET /status/:id (สถานะของ drone)
    app.get('/status/:id', async (req, res) => {
        const droneId = Number(req.params.id);

        try {
            // ดึงข้อมูล log ทั้งหมดจาก Drone Log Server
            const logResponse = await axios.get(CONFIG_URL);
            const logs = logResponse.data.data;

            // ค้นหา log ที่ตรงกับ drone_id
            const droneLog = logs.find(log => log.drone_id === droneId);

            if (!droneLog) {
                return res.status(404).json({ error: "Drone log not found" });
            }

            // ตรวจสอบสถานะ condition ใน log
            const condition = droneLog.condition || "unknown";  // ใช้ค่า "unknown" ถ้าไม่มี condition

            // ส่งข้อมูลสถานะกลับไป
            res.json({
                condition: condition,
            });

        } catch (error) {
            res.status(500).json({ error: "Error fetching drone status" });
        }
    });

    // 3. GET /logs (ดึง log ของเรา)
    app.get('/logs', async (req, res) => {
        try {
            let allLogs = [];
            let currentPage = 1;
            let hasMoreData = true;
            const droneId = 65011012; // กำหนด droneId ที่ต้องการกรอง
    
            while (hasMoreData) {
                // เรียก API โดยใช้ currentPage
                const response = await axios.get(`${LOG_URL}?page=${currentPage}`);
                const logs = response.data.items; // ปรับให้ตรงกับโครงสร้าง response ของ API
    
                // ตรวจสอบว่าข้อมูลมีอยู่จริงก่อนที่จะทำการกรอง
                if (logs && logs.length > 0) {
                    // กรอง log ที่มี drone_id ตรงกับ droneId ที่เราต้องการ
                    const filteredLogs = logs.filter(log => log.drone_id === droneId);
    
                    // เพิ่ม log ที่กรองแล้วลงใน allLogs
                    allLogs = allLogs.concat(filteredLogs);
    
                    // ตรวจสอบว่ามีข้อมูลเพิ่มเติมหรือไม่
                    currentPage++; // ไปยังหน้าถัดไป
                } else {
                    hasMoreData = false; // ไม่มีข้อมูลเพิ่มเติม
                }
            }
    
            // ส่งข้อมูลทั้งหมดที่กรองแล้วกลับไปที่ client
            res.json(allLogs);
        } catch (error) {
            console.error("Error fetching drone logs:", error.message);
            res.status(500).json({ error: "Error fetching drone logs" });
        }
    });
    
    
    
    


    // 4. POST /logs (เพิ่ม log ใหม่)
    app.post("/POST/logs", upload.none(), async (req, res) => {
        // Check if celsius is present in the request body
        if (!req.body.celsius) {
            return res.status(400).send("Please provide the celsius value");
        }
    
        const celsius = req.body.celsius;
        const country = "Thailand";
        const droneId = 65011012;
        const droneName = "Wuttipat";
    
        try {
            // ส่งข้อมูลไปที่ LOG_URL พร้อมกับ Authorization header
            const { data } = await axios.post(LOG_URL, {
                celsius: celsius,
                country: country,
                drone_id: droneId,
                drone_name: droneName
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 20250301efx' // เพิ่ม Authorization Header
                }
            });
            
            // Log และส่ง response กลับไปที่ client พร้อมกับข้อมูลที่ถูกสร้างขึ้น
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
            // Log error และส่ง response กลับไปที่ client ในกรณีที่เกิดข้อผิดพลาด
            console.error("Error: ", error.message);
            res.status(500).send("Error handling the data");
        }
    });
    

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/configs/3001`);
});