
import mongoose from 'mongoose';

export const sessionSchema = new mongoose.Schema({
    deviceId: { 
        type: String, 
        required: true,
    },
    refreshToken: { 
        type: String, 
        required: true, 
    },
    userAgent: { 
        type: String, 
        required: false, 
        default: 'Unknown Device' 
    },
    ipAddress: { 
        type: String, 
        required: false 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    lastUsed: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
}, { 
    _id: false
});