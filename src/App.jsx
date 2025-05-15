import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AuthUI from "./AuthUI";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "./firebaseConfig";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";

export default function App() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "",
    location: "",
    notes: "",
    rating: 0,
    tags: ""
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      const eventsRef = collection(db, "users", user.uid, "events");
      const q = query(eventsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        setEvents(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (value) => {
    setForm({ ...form, rating: value });
  };

  const addEvent = async () => {
    if (!user || !form.title || !form.date || !form.type) return;
    const eventsRef = collection(db, "users", user.uid, "events");
    await addDoc(eventsRef, form);
    setForm({ title: "", date: new Date().toISOString().split("T")[0], type: "", location: "", notes: "", rating: 0, tags: "" });
  };

  const typeOptions = ["Opera", "Theatre", "Music", "Art/Gallery"];

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().split("T")[0];
    const match = events.find(e => e.date === iso);
    return match ? "bg-gradient-to-tr from-pink-300 to-purple-200 rounded-full text-white font-bold" : null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-200 min-h-screen p-6 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto shadow-2xl rounded-xl bg-white overflow-hidden">
        <div className="p-6 bg-gradient-to-tr from-indigo-800 to-fuchsia-600 text-white">
          <h1 className="text-4xl font-bold mb-2">🎭 Event Attendance Tracker</h1>
          <AuthUI />
        </div>
        {user && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange}
                className="border px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              <input name="date" type="date" value={form.date} onChange={handleChange}
                className="border px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              <input name="location" placeholder="Location" value={form.location} onChange={handleChange}
                className="border px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              <input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange}
                className="border px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <div>
              <h3 className="font-semibold mb-2">Type</h3>
              <div className="flex gap-3 flex-wrap">
                {typeOptions.map((option) => (
                  <button key={option}
                    onClick={() => setForm({ ...form, type: option })}
                    className={`px-4 py-2 rounded-full font-medium border transition ${form.type === option
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-indigo-100"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rating</h3>
              <div className="flex gap-1 text-2xl">
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => handleRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer"
                    style={{ color: (hoverRating || form.rating) >= val ? "#facc15" : "#e5e7eb" }}
                  >
                    {val % 1 === 0 ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={addEvent}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md shadow"
            >
              Add Event
            </button>
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-3">Events Attended This Month</h2>
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                tileClassName={tileClassName}
                className="rounded shadow"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
