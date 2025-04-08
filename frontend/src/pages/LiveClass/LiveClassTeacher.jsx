import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiVideo as VideoIcon,
  FiMic as MicIcon,
  FiMicOff as MicOffIcon,
  FiVideoOff as VideoOffIcon,
  FiShare2 as ScreenShareIcon,
  FiUsers as UsersIcon,
  FiMessageSquare as MessageIcon,
  FiCopy as CopyIcon,
  FiPhoneOff as EndCallIcon,
  FiAlertTriangle as AlertIcon
} from 'react-icons/fi';
import Peer from 'peerjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveClassTeacher = () => {
  // State management
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isClassActive, setIsClassActive] = useState(true);
  const [mediaError, setMediaError] = useState(null);

  // Refs
  const teacherVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const peerRef = useRef(null);
  const peersRef = useRef({});
  const mediaStreamRef = useRef(null);

  // Initialize media stream
  const initMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      mediaStreamRef.current = stream;
      
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = stream;
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
  }, []);

  // Initialize PeerJS connection
  useEffect(() => {
    const peer = new Peer(`teacher-${Math.random().toString(36).substr(2, 8)}`);
    peerRef.current = peer;

    const setupPeer = async () => {
      const stream = await initMediaStream();
      if (!stream) return;

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (studentStream) => {
          setStudents(prev => [...prev, { 
            id: call.peer, 
            stream: studentStream,
            name: `Student ${prev.length + 1}`
          }]);
        });
      });

      peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          setMessages(prev => [...prev, { 
            text: data.message, 
            sender: data.sender,
            timestamp: new Date().toLocaleTimeString()
          }]);
        });
      });
    };

    setupPeer();

    return () => {
      peer.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initMediaStream]);

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

  // Screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        const stream = await initMediaStream();
        if (stream) {
          Object.values(peersRef.current).forEach(peer => {
            peer.replaceTrack(
              peer.streams[0].getVideoTracks()[0],
              stream.getVideoTracks()[0],
              peer.streams[0]
            );
          });
        }
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenShareRef.current.srcObject = screenStream;
        Object.values(peersRef.current).forEach(peer => {
          peer.replaceTrack(
            peer.streams[0].getVideoTracks()[0],
            screenStream.getVideoTracks()[0],
            peer.streams[0]
          );
        });
        screenStream.getVideoTracks()[0].onended = () => toggleScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      toast.error("Screen sharing failed");
      console.error("Screen share error:", error);
    }
  };

  // End class
  const endClass = () => {
    setIsClassActive(false);
    peerRef.current.destroy();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    toast.success("Class ended successfully");
  };

  // Copy invite link
  const copyClassLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/student?classId=${peerRef.current.id}`
    );
    toast.info("Invite link copied!");
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      sender: 'Teacher',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    Object.values(peersRef.current).forEach(peer => {
      peer.connection.send(messageData);
    });

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  if (!isClassActive) {
    return (
      <div className="flex items-center justify-center h-screen bg-richblack-900">
        <div className="text-center p-8 bg-richblack-800 rounded-lg border border-richblack-700">
          <h2 className="text-2xl font-bold text-electricBlue mb-4">Class Ended</h2>
          <p className="text-richblack-300">You have successfully ended the class session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-richblack-900 text-richblack-5">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-richblack-800 border-b border-richblack-700">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${mediaError ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <h1 className="text-xl font-semibold">Live Classroom - Teacher</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-richblack-700 px-3 py-1 rounded-full">
            {students.length} {students.length === 1 ? 'Student' : 'Students'}
          </span>
          <button 
            onClick={copyClassLink}
            className="flex items-center space-x-2 px-4 py-2 bg-electricBlue text-richblack-900 rounded-md hover:bg-opacity-80 transition-all"
          >
            <CopyIcon size={18} />
            <span>Invite</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col bg-richblack-950 relative">
          {/* Teacher Video */}
          <div className="relative flex-1 bg-richblack-800 flex items-center justify-center">
            {isCameraOn ? (
              <video 
                ref={teacherVideoRef}
                autoPlay 
                muted 
                className="h-full w-full object-contain bg-richblack-900"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-richblack-800">
                <div className="w-32 h-32 rounded-full bg-richblack-700 flex items-center justify-center mb-4">
                  <VideoOffIcon className="h-12 w-12 text-richblack-400" />
                </div>
                <p className="text-richblack-300">Camera is disabled</p>
              </div>
            )}

            {/* Screen Share Indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-richblack-800 bg-opacity-70 px-3 py-1 rounded-full text-sm flex items-center">
                <ScreenShareIcon className="mr-2" size={16} />
                Screen Sharing
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
            
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full ${isScreenSharing ? 'bg-electricBlue text-richblack-900' : 'bg-richblack-700 text-richblack-400'} transition-colors`}
              aria-label={isScreenSharing ? "Stop screen share" : "Start screen share"}
            >
              {isScreenSharing ? <ScreenShareIcon size={20} /> : <ScreenShareIcon size={20} />}
            </button>
            
            <button
              onClick={endClass}
              className="p-3 rounded-full bg-red-500 text-richblack-5 hover:bg-red-600 transition-colors"
              aria-label="End class"
            >
              <EndCallIcon size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex flex-col border-l border-richblack-700 bg-richblack-800">
          {/* Students List */}
          <div className="p-4 border-b border-richblack-700">
            <h2 className="flex items-center space-x-2 font-medium text-lg">
              <UsersIcon size={20} />
              <span>Participants</span>
              <span className="ml-auto bg-richblack-700 text-richblack-100 px-2 py-1 rounded-full text-sm">
                {students.length} online
              </span>
            </h2>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {students.length > 0 ? (
                students.map(student => (
                  <div key={student.id} className="flex items-center space-x-3 p-2 hover:bg-richblack-750 rounded-lg transition-colors">
                    <video 
                      autoPlay 
                      className="w-10 h-10 rounded-full bg-richblack-700 object-cover"
                      ref={el => el && (el.srcObject = student.stream)}
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-richblack-400">Active now</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-richblack-400 py-4">No students joined yet</p>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-richblack-700">
              <h2 className="flex items-center space-x-2 font-medium text-lg">
                <MessageIcon size={20} />
                <span>Class Chat</span>
              </h2>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.sender === 'Teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs rounded-lg p-3 ${msg.sender === 'Teacher' ? 'bg-electricBlue text-richblack-900' : 'bg-richblack-700'}`}>
                      <p className="font-medium text-sm">{msg.sender}</p>
                      <p className="mt-1">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-richblack-400">No messages yet</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-richblack-700">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-richblack-700 border border-richblack-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-electricBlue text-richblack-900 rounded-md hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {mediaError && (
        <div className="absolute bottom-4 left-4 bg-red-500 text-richblack-5 px-4 py-2 rounded-md flex items-center space-x-2">
          <AlertIcon size={18} />
          <span>{mediaError}</span>
        </div>
      )}
    </div>
  );
};

export default LiveClassTeacher;