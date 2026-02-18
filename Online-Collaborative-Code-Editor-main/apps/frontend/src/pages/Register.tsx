import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { useNavigate, useParams } from 'react-router-dom';
import { socketAtom } from '../atoms/socketAtom';
import { IP_ADDRESS } from '../Globle';

const Register = () => {
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const parms = useParams();
    const [user, setUser] = useRecoilState(userAtom);
    const [socket, setSocket] = useRecoilState<WebSocket | null>(socketAtom);

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const generateId = () => {
        const id = Math.floor(Math.random() * 100000);
        return id.toString();
    }

    const generateUniqueUsername = () => {
        if (name && phoneNumber) {
            return `${name}_${phoneNumber.slice(-4)}`;
        }
        return name;
    }

    const generateAvatarUrl = () => {
        const uniqueName = generateUniqueUsername();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(uniqueName)}&background=random&color=fff&bold=true`;
    }

    const initializeSocket = () => {
        setLoading(true);
        let GeneratedId = "";
        if (user.id == "") {
            GeneratedId = generateId();
            const uniqueUsername = generateUniqueUsername();
            setUser({
                id: GeneratedId,
                name: uniqueUsername,
                roomId: "",
                isAdmin: isAdmin
            });
        }

        if (!socket || socket.readyState === WebSocket.CLOSED) {
            const uniqueUsername = generateUniqueUsername();
            const u = {
                id: user.id == "" ? GeneratedId : user.id,
                name: uniqueUsername,
                isAdmin: isAdmin
            }
            if(name == "" || phoneNumber == "") {
                alert("Please enter both name and phone number to continue");
                setLoading(false);
                return;
            }
            const ws = new WebSocket(`ws://${IP_ADDRESS}:5000?roomId=${roomId}&id=${u.id}&name=${u.name}&isAdmin=${isAdmin}`);
          
            setSocket(ws);


            ws.onopen = () => {
                console.log("Connected to WebSocket");
            };

            ws.onopen = () => {
                console.log("Connected to WebSocket");
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type == "roomId") {
                    setRoomId(data.roomId);
                    console.log("Room ID : ", data.roomId);
                    const uniqueUsername = generateUniqueUsername();
                    setUser({
                        id: user.id == "" ? GeneratedId : user.id,
                        name: uniqueUsername,
                        roomId: data.roomId,
                        isAdmin: isAdmin
                    });
                   
                    setLoading(false);
                    alert(data.message);
                    navigate("/code/" + data.roomId);
                }
            };
            ws.onclose = () => {
                console.log("WebSocket connection closed from register page");
                setLoading(false);
            };

        }
        else {

            setLoading(false);
        }
    }

    const handleNewRoom = () => {
        if (!loading)
            initializeSocket();

    }

    const handleJoinRoom = () => {
        if (roomId != "" && roomId.length == 6 && !loading) {

            initializeSocket();

        }
        else {
            alert("Please enter a room ID to join a room");
        }

    }

    useEffect(() => {
        setRoomId(parms.roomId || "");
    }, []);

   return (
  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0c] text-white">
    
    {/* 🌌 High-Tech Mesh Background */}
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
    </div>

    {/* 💠 Glassmorphic Card */}
    <div className="relative z-10 w-full max-w-md p-8 mx-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      
      {/* Branding */}
      <div className="text-center mb-10">
        <div className="inline-block p-4 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/30">
          <img src="/G Collab logo (2).png" alt="logo" className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Code Palette
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Synchronized real-time collaboration</p>
      </div>

      {/* Avatar Preview */}
      {name && phoneNumber && (
        <div className="flex justify-center mb-6">
          <img
            src={generateAvatarUrl()}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-2 border-blue-500/50 shadow-lg"
          />
        </div>
      )}

      {/* Unique Username Display */}
      {name && phoneNumber && (
        <div className="text-center mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Your Unique ID</p>
          <p className="text-lg font-bold text-blue-400">{generateUniqueUsername()}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Name</label>
          <input
            type="text"
            placeholder="eg: John"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
          />
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
          <input
            type="tel"
            placeholder="eg: 1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
          />
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Room Access</label>
          <input
            type="number"
            placeholder="Room ID (Optional)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
          />
        </div>

        <div className="group flex items-center gap-3">
          <input
            type="checkbox"
            id="adminCheckbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="w-5 h-5 rounded bg-white/5 border border-white/10 cursor-pointer accent-blue-500"
          />
          <label htmlFor="adminCheckbox" className="text-sm font-semibold text-gray-400 cursor-pointer">
            Register as Admin
          </label>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleNewRoom}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create New Workspace"}
          </button>
          
          <button
            onClick={handleJoinRoom}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
          >
            Join Existing Room
          </button>
        </div>
      </div>
    </div>
  </div>
);



};

export default Register;