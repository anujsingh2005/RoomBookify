import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function ChatBox({ guestId, hostId, bookingId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [partner, setPartner] = useState(null);

  const currentUserId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchConversation();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchConversation, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    try {
      const otherUserId = currentUserId === guestId ? hostId : guestId;
      const response = await fetch(`http://localhost:5000/api/messages/conversation/${otherUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
      if (data.length > 0 && !partner) {
        setPartner(data[0].sender_id === currentUserId ? data[0].receiver : data[0].sender);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: currentUserId === guestId ? hostId : guestId,
          booking_id: bookingId,
          message: newMessage,
          message_type: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchConversation();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-h-96">
      {/* Header */}
      <div className="bg-royal-blue text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold">{partner?.name || 'Chat'}</h3>
          <p className="text-xs text-blue-100">{partner?.role === 'provider' ? 'Property Host' : 'Guest'}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded p-1">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">Start a conversation</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === currentUserId
                    ? 'bg-royal-blue text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field text-sm py-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
