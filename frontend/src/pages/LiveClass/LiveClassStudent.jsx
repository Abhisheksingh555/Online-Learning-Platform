import React, { useState, useEffect, useRef } from 'react';
import { 
  FiVideo as VideoIcon,
  FiMic as MicIcon,
  FiMicOff as MicOffIcon,
  FiVideoOff as VideoOffIcon,
  FiMessageSquare as MessageIcon,
  FiAlertTriangle as AlertIcon
} from 'react-icons/fi';
import Peer from 'peerjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveClassStudent = ({ classId }) => {
  // State management
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [teacherStream, setTeacherStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [classEnded, setClassEnded] = useState(false);

  // Refs
  const studentVideoRef = useRef(null);
  const teacherVideoRef = useRef(null);
  const peerRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Initialize media stream
  const initMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      mediaStreamRef.current = stream;
      
      if (studentVideoRef.current) {
        studentVideoRef.current.srcObject = stream;
        setIsMicOn(true);
        setIsCameraOn(true);
      }
      return stream;
    } catch (error) {
      setMediaError("Camera/microphone access denied");
      toast.error("Please enable camera/microphone permissions");
      console.error("Media error:", error);
      return null;
    }
  };

  // Initialize PeerJS connection
  useEffect(() => {
    if (!classId) {
      toast.error("Missing class ID");
      return;
    }

    const peer = new Peer();
    peerRef.current = peer;

    const setupConnection = async () => {
      const stream = await initMediaStream();
      if (!stream) return;

      peer.on('open', () => {
        const call = peer.call(classId, stream);
        call.on('stream', (teacherStream) => {
          setTeacherStream(teacherStream);
          setIsConnected(true);
          toast.success("Connected to class!");
        });

        call.on('close', () => {
          setClassEnded(true);
          toast.info("Teacher has ended the class");
        });

        call.on('error', (err) => {
          toast.error("Connection error");
          console.error("Call error:", err);
        });
      });

      // Set up data channel for chat
      const conn = peer.connect(classId);
      conn.on('data', (data) => {
        setMessages(prev => [...prev, data]);
      });

      conn.on('close', () => {
        setClassEnded(true);
      });
    };

    setupConnection();

    return () => {
      peer.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [classId]);

  // Toggle media controls
  const toggleMedia = (type) => {
    if (!mediaStreamRef.current) return;

    const tracks = type === 'audio' 
      ? mediaStreamRef.current.getAudioTracks() 
      : mediaStreamRef.current.getVideoTracks();

    if (tracks.length > 0) {
      const enabled = !tracks[0].enabled;
      tracks[0].enabled = enabled;
      
      if (type === 'audio') setIsMicOn(enabled);
      else setIsCameraOn(enabled);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !peerRef.current || !isConnected) return;
    
    const messageData = {
      sender: 'Student',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    try {
      peerRef.current.connections[classId][0].send(messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Message error:", error);
    }
  };

  if (classEnded) {
    return (
      <div className="flex items-center justify-center h-screen bg-richblack-900">
        <div className="text-center p-8 bg-richblack-800 rounded-lg border border-richblack-700 max-w-md">
          <h2 className="text-2xl font-bold text-electricBlue mb-4">Class Ended</h2>
          <p className="text-richblack-300 mb-6">The teacher has ended this class session.</p>
          <a 
            href="/" 
            className="px-6 py-2 bg-electricBlue text-richblack-900 rounded-md hover:bg-opacity-80 transition-opacity inline-block"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-richblack-900 text-richblack-5">
      {/* Connection Status */}
      <header className="flex items-center justify-between p-4 bg-richblack-800 border-b border-richblack-700">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <h1 className="text-xl font-semibold">
            {isConnected ? 'Connected to Class' : 'Connecting...'}
          </h1>
        </div>
        {mediaError && (
          <div className="flex items-center space-x-2 text-red-400">
            <AlertIcon size={18} />
            <span className="text-sm">{mediaError}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Teacher Video */}
        <div className="relative flex-1 bg-richblack-800">
          {teacherStream ? (
            <video
              ref={teacherVideoRef}
              autoPlay
              className="h-full w-full object-contain"
              onCanPlay={() => teacherVideoRef.current?.play()}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-richblack-700 flex items-center justify-center">
                  <VideoOffIcon className="h-8 w-8 text-richblack-400" />
                </div>
                <p className="text-richblack-300">
                  {isConnected ? 'Waiting for teacher...' : 'Connecting to class...'}
                </p>
              </div>
            </div>
          )}

          {/* Student Video (PIP) */}
          {isCameraOn ? (
            <div className="absolute bottom-4 right-4 w-40 h-24 bg-richblack-700 rounded-md overflow-hidden border-2 border-electricBlue shadow-lg">
              <video
                ref={studentVideoRef}
                autoPlay
                muted
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute bottom-4 right-4 w-40 h-24 bg-richblack-700 rounded-md overflow-hidden border-2 border-richblack-600 flex items-center justify-center">
              <VideoOffIcon className="h-8 w-8 text-richblack-400" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 p-4 bg-richblack-800 border-t border-richblack-700">
          <button
            onClick={() => toggleMedia('audio')}
            className={`p-3 rounded-full ${isMicOn ? 'bg-richblack-700 text-electricBlue' : 'bg-red-500 text-richblack-5'} transition-colors`}
            aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isMicOn ? <MicIcon size={20} /> : <MicOffIcon size={20} />}
          </button>
          
          <button
            onClick={() => toggleMedia('video')}
            className={`p-3 rounded-full ${isCameraOn ? 'bg-richblack-700 text-electricBlue' : 'bg-richblack-700 text-richblack-400'} transition-colors`}
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <VideoIcon size={20} /> : <VideoOffIcon size={20} />}
          </button>

          <div className="flex-1 max-w-md mx-4">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-richblack-700 border border-richblack-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="px-4 py-2 bg-electricBlue text-richblack-900 rounded-md hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <MessageIcon size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Chat (Mobile) */}
        <div className="md:hidden flex-1 overflow-y-auto p-4 bg-richblack-850 border-t border-richblack-700">
          <h3 className="flex items-center space-x-2 mb-4">
            <MessageIcon size={20} />
            <span>Class Chat</span>
          </h3>
          
          <div className="space-y-3">
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'Student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs rounded-lg p-3 ${msg.sender === 'Student' ? 'bg-electricBlue text-richblack-900' : 'bg-richblack-700'}`}>
                    <p className="font-medium text-sm">{msg.sender}</p>
                    <p className="mt-1">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-richblack-400 py-8">
                {isConnected ? 'No messages yet' : 'Not connected to chat'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassStudent;