import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  ScreenShare, 
  ScreenShareOff, 
  Users,
  MessageSquare,
  Monitor,
  Share2,
  MoreVertical,
  Clipboard,
  Download,
  Bell,
  Settings,
  ArrowLeft
} from 'lucide-react';

const TeacherLiveClass = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const videoRef = useRef(null);
  const screenShareRef = useRef(null);

  // Mock data for participants
  useEffect(() => {
    const mockParticipants = [
      { id: 1, name: 'Alex Johnson', role: 'student', isMicOn: true, isVideoOn: false },
      { id: 2, name: 'Sarah Williams', role: 'student', isMicOn: false, isVideoOn: true },
      { id: 3, name: 'Michael Brown', role: 'student', isMicOn: true, isVideoOn: true },
      { id: 4, name: 'Emma Davis', role: 'student', isMicOn: false, isVideoOn: false },
      { id: 5, name: 'James Wilson', role: 'teaching assistant', isMicOn: true, isVideoOn: true },
    ];
    setParticipants(mockParticipants);

    // Mock chat messages
    const mockMessages = [
      { id: 1, sender: 'Alex Johnson', message: 'Good morning everyone!', time: '10:00 AM' },
      { id: 2, sender: 'Sarah Williams', message: 'Hi Alex!', time: '10:01 AM' },
      { id: 3, sender: 'You', message: 'Welcome to today\'s class', time: '10:02 AM', isYou: true },
    ];
    setChatMessages(mockMessages);
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Here you would add actual mic toggle logic
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // Here you would add actual camera toggle logic
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Here you would add actual screen share logic
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'You',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: true
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const copyClassLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Add toast notification in a real app
  };

  return (
    <div className="flex flex-col h-screen bg-richblack-900 text-richblack-5">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-richblack-800 border-b border-richblack-700">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-richblack-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Advanced Mathematics - Class 12B</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={copyClassLink}
            className="flex items-center space-x-2 px-4 py-2 bg-electricBlue text-richblack-900 rounded-md hover:bg-opacity-80"
          >
            <Share2 className="h-5 w-5" />
            <span>Invite</span>
          </button>
          <button className="p-2 rounded-full hover:bg-richblack-700">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col bg-richblack-950">
          {/* Teacher's Video */}
          <div className="relative flex-1 bg-richblack-800 flex items-center justify-center">
            {isCameraOn ? (
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                className="h-full w-full object-contain bg-richblack-900"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-richblack-800">
                <div className="w-32 h-32 rounded-full bg-richblack-700 flex items-center justify-center mb-4">
                  <VideoOff className="h-12 w-12 text-richblack-400" />
                </div>
                <p className="text-richblack-300">Your camera is off</p>
              </div>
            )}
            
            {/* Teacher Info */}
            <div className="absolute bottom-4 left-4 bg-richblack-800 bg-opacity-70 px-3 py-1 rounded-full">
              <p className="text-sm">You (Teacher)</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 p-4 bg-richblack-800 border-t border-richblack-700">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${isMicOn ? 'bg-richblack-700 text-electricBlue' : 'bg-red-500 text-richblack-5'}`}
            >
              {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </button>
            
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full ${isCameraOn ? 'bg-richblack-700 text-electricBlue' : 'bg-richblack-700 text-richblack-400'}`}
            >
              {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </button>
            
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full ${isScreenSharing ? 'bg-electricBlue text-richblack-900' : 'bg-richblack-700 text-richblack-400'}`}
            >
              {isScreenSharing ? <ScreenShareOff className="h-6 w-6" /> : <ScreenShare className="h-6 w-6" />}
            </button>
            
            <button className="p-3 rounded-full bg-red-500 text-richblack-5">
              End Class
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col border-l border-richblack-700 bg-richblack-800">
          {/* Tabs */}
          <div className="flex border-b border-richblack-700">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 ${activeTab === 'participants' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
            >
              <Users className="h-5 w-5" />
              <span>Participants ({participants.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 ${activeTab === 'chat' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'participants' ? (
              <div className="divide-y divide-richblack-700">
                <div className="p-3 bg-richblack-700 flex items-center justify-between">
                  <p className="text-sm font-medium">Participants</p>
                  <button className="text-xs text-electricBlue">Manage</button>
                </div>
                {participants.map((participant) => (
                  <div key={participant.id} className="p-3 flex items-center justify-between hover:bg-richblack-750">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-richblack-600 flex items-center justify-center">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-richblack-400">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`p-1 rounded ${participant.isMicOn ? 'text-green-400' : 'text-richblack-500'}`}>
                        {participant.isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </span>
                      <span className={`p-1 rounded ${participant.isVideoOn ? 'text-green-400' : 'text-richblack-500'}`}>
                        {participant.isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </span>
                      <button className="text-richblack-400 hover:text-richblack-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isYou ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-lg p-3 ${msg.isYou ? 'bg-electricBlue text-richblack-900' : 'bg-richblack-700'}`}>
                        {!msg.isYou && <p className="text-xs font-medium mb-1">{msg.sender}</p>}
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-richblack-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-richblack-700 border border-richblack-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electricBlue"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-full bg-electricBlue text-richblack-900 hover:bg-opacity-80"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="p-3 border-t border-richblack-700">
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center p-2 rounded hover:bg-richblack-700 text-richblack-400 hover:text-richblack-200">
                <Clipboard className="h-5 w-5 mb-1" />
                <span className="text-xs">Whiteboard</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded hover:bg-richblack-700 text-richblack-400 hover:text-richblack-200">
                <Monitor className="h-5 w-5 mb-1" />
                <span className="text-xs">Poll</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded hover:bg-richblack-700 text-richblack-400 hover:text-richblack-200">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs">Resources</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded hover:bg-richblack-700 text-richblack-400 hover:text-richblack-200">
                <Bell className="h-5 w-5 mb-1" />
                <span className="text-xs">Attention</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded hover:bg-richblack-700 text-richblack-400 hover:text-richblack-200">
                <Settings className="h-5 w-5 mb-1" />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLiveClass;