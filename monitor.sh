#!/bin/bash

# Backend Monitoring Script
# Backend İzleme Script'i
# 
# This script monitors backend logs for notification sending activity
# Bu script, bildirim gönderme aktivitesi için backend loglarını izler

echo "🔍 Backend Bildirim İzleme Başlatıldı"
echo "Backend Notification Monitoring Started"
echo ""
echo "Backend URL: http://localhost:3000"
echo "Log dosyası: /tmp/backend-monitor.log"
echo ""
echo "Bildirim gönderildiğinde aşağıdaki bilgileri göreceksiniz:"
echo "When a notification is sent, you will see:"
echo "  - POST /send-notification"
echo "  - POST /tokens (token kaydı)"
echo "  - Firebase response"
echo ""
echo "Çıkmak için Ctrl+C"
echo "Press Ctrl+C to exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Monitor backend log file
# Backend log dosyasını izle
tail -f /tmp/backend-monitor.log 2>/dev/null | grep --line-buffered -E "POST|send-notification|tokens|Firebase|notification|token|error|success|✅|❌" || {
    echo "⚠️ Log dosyası bulunamadı veya backend çalışmıyor"
    echo "⚠️ Log file not found or backend is not running"
    echo ""
    echo "Backend'i başlatmak için:"
    echo "To start backend:"
    echo "  cd backend && npm start"
}

