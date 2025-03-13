// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5001"); // หรือ URL ของ server ของคุณ

export default socket;