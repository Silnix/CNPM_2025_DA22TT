#!/bin/bash

echo "🚀 Importing QLTV.NGUOIDUNG.json into MongoDB..."

# Chờ MongoDB sẵn sàng
sleep 5

# Import dữ liệu
mongoimport --host localhost --db QLTV --collection books --file /docker-entrypoint-initdb.d/QLTV.NGUOIDUNG.json --jsonArray

echo "✅ Import completed."