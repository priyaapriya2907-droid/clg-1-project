import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdContentCopy, MdClose } from "react-icons/md";



import { userAtom } from "../atoms/userAtom";
import { socketAtom } from "../atoms/socketAtom";
import { connectedUsersAtom } from "../atoms/connectedUsersAtom";
import { IP_ADDRESS } from "../Globle";

const CodeEditor: React.FC = () => {
  /* ---------------- STATE ---------------- */
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentButtonState, setCurrentButtonState] = useState("Run Code");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [socket, setSocket] = useRecoilState<WebSocket | null>(socketAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [connectedUsers, setConnectedUsers] =
    useRecoilState<any[]>(connectedUsersAtom);

  const navigate = useNavigate();
  const params = useParams();

  const isDark = theme === "dark";

  /* ---------------- SOCKET INIT ---------------- */
  useEffect(() => {
    if (!socket) {
      navigate("/" + params.roomId);
      return;
    }

    socket.send(JSON.stringify({ type: "requestToGetUsers", userId: user.id }));
    socket.send(JSON.stringify({ type: "requestForAllData" }));

    socket.onclose = () => {
      setUser({ id: "", name: "", roomId: "" });
      setSocket(null);
    };

    return () => socket.close();
  }, []);

  /* ---------------- SOCKET LISTENERS ---------------- */
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "users") setConnectedUsers(data.users);
      if (data.type === "code") setCode(data.code);
      if (data.type === "input") setInput(data.input);
      if (data.type === "language") setLanguage(data.language);

      if (data.type === "submitBtnStatus") {
        setCurrentButtonState(data.value);
        setIsLoading(data.isLoading);
      }

      if (data.type === "output") {
        setOutput((prev) => [...prev, data.message]);
        handleButtonStatus("Run Code", false);
      }

      if (data.type === "requestForAllData") {
        socket.send(
          JSON.stringify({
            type: "allData",
            code,
            input,
            language,
            currentButtonState,
            isLoading,
            userId: data.userId,
          })
        );
      }

      if (data.type === "allData") {
        setCode(data.code);
        setInput(data.input);
        setLanguage(data.language);
        setCurrentButtonState(data.currentButtonState);
        setIsLoading(data.isLoading);
      }
    };
  }, [code, input, language, currentButtonState, isLoading]);

  /* ---------------- HANDLERS ---------------- */
  const handleButtonStatus = (value: string, loading: boolean) => {
    setCurrentButtonState(value);
    setIsLoading(loading);

    socket?.send(
      JSON.stringify({
        type: "submitBtnStatus",
        value,
        isLoading: loading,
        roomId: user.roomId,
      })
    );
  };

  const handleSubmit = async () => {
    handleButtonStatus("Submitting...", true);
    setOutput([]);

    try {
      const res = await fetch(`http://${IP_ADDRESS}:3000/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          input,
          roomId: user.roomId,
        }),
      });

      if (!res.ok) {
        setOutput(["❌ Execution failed"]);
        handleButtonStatus("Run Code", false);
        return;
      }

      const contentType = res.headers.get("content-type");
      let outputText = "";

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        outputText = data.success ? (data.output || "✅ Code executed successfully") : (data.error || "❌ Execution failed");
      } else {
        outputText = await res.text();
      }
      
      // Remove "Submission received and stored" message
      outputText = outputText.replace(/Submission received and stored\s*/gi, "").trim();
      
     
    } catch (error) {
      setOutput([`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`]);
      handleButtonStatus("Run Code", false);
    }
  };

  const handleEditorMount = (editor: any) => {
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);

      socket?.send(
        JSON.stringify({
          type: "code",
          code: value,
          roomId: user.roomId,
        })
      );
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900"
      } p-2 sm:p-4`}
    >
      <div className="max-w-[1700px] mx-auto w-full space-y-4 flex flex-col flex-1">

        {/* ===== TOP COMMAND BAR ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl
  bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-xl 
  border border-white/20 shadow-lg">
  
  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
    <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide flex items-center gap-2">
      ⚡ <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">G-Collab Editor</span>
    </h1>
    {user.isAdmin && (
      <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
        👑 ADMIN
      </span>
    )}
  </div>

  <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 
        text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all"
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>

    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-lg bg-slate-700 text-white border border-slate-500 
        focus:ring-2 focus:ring-blue-400 transition-all"
    >
      <option>javascript</option>
      <option>python</option>
      
    </select>

    {user.isAdmin && (
      <button
        onClick={() => {
          const link = `${window.location.origin}/${user.roomId}`;
          setInviteLink(link);
          setShowInviteModal(true);
        }}
        className="px-2 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 
          text-white font-semibold hover:scale-105 hover:shadow-lg transition-all"
      >
        ➕ Invite
      </button>
    )}

    <button
      onClick={handleSubmit}
      disabled={isLoading}
      className="px-2 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 
        text-white font-semibold flex items-center gap-1 sm:gap-2 
        hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50"
    >
      {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
      {currentButtonState}
    </button>
  </div>
</div>


        {/* ===== MAIN PANEL ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 flex-1 min-h-0">

          {/* CODE EDITOR */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border 
  shadow-2xl ring-2 ring-blue-500/40 hover:ring-blue-400 transition-all">
  <MonacoEditor
    value={code}
    language={language}
    theme={isDark ? "vs-dark" : "vs-light"}
    className="h-[50vh] sm:h-[60vh] lg:h-[75vh]"
    onMount={handleEditorMount}
  />
</div>

          {/* SIDE PANEL */}
          <div className="flex flex-col gap-3 sm:gap-4 min-h-0">

            {/* USERS */}
            <div className="p-3 sm:p-4 rounded-xl bg-white/10 border max-h-32 sm:max-h-40 lg:max-h-48 overflow-y-auto">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">👥 Collaborators</h3>
              {connectedUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm mb-2 sm:mb-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                    u.isAdmin ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-blue-500'
                  }`}>
                    {u.name[0]}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium truncate">{u.name}</span>
                    {u.isAdmin && (
                      <span className="ml-auto px-1.5 sm:px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-xs font-bold text-white shadow-lg shadow-orange-500/20 whitespace-nowrap text-xs">
                        👑
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>

{/* Output */}
<div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-900/40 to-emerald-900/40 
  border border-green-500/30 shadow-lg flex-1 overflow-y-auto min-h-0">
  <h3 className="font-semibold mb-2 text-sm sm:text-base text-green-300">📤 Output</h3>
  {output.length ? (
    output.map((o, i) => (
      <pre key={i} className="bg-slate-900/60 p-2 rounded-lg text-green-200 text-xs sm:text-sm mb-2">{o}</pre>
    ))
  ) : (
    <p className="opacity-60 italic text-xs sm:text-sm">No output yet</p>
  )}
</div>

          </div>
        </div>
      </div>

      {/* ===== INVITE MODAL ===== */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">🎯 Invite Team</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <MdClose size={24} />
              </button>
            </div>

            <p className="text-sm sm:text-base text-gray-300 mb-4">Share this link with your team to invite them to the workspace:</p>

            <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-3 sm:p-4 mb-4">
              <p className="text-xs text-gray-400 break-all font-mono">{inviteLink}</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              }}
              className={`w-full py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all ${
                copySuccess
                  ? "bg-green-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 hover:shadow-lg"
              }`}
            >
              <MdContentCopy size={20} />
              {copySuccess ? "✓ Copied!" : "Copy Invite Link"}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Room ID: <span className="font-bold text-gray-300">{user.roomId}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
