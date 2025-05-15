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
  const selectedDate = calendarDate.toISOString().split("T")[0];
  const calendarEvents = events.filter(event => event.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🎭 Event Attendance Tracker
        </h1>
        <AuthUI />
        {user && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
              <input name="date" type="date" value={form.date} onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
              <input name="location" placeholder="Location" value={form.location} onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
              <input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
            </div>
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange}
              className="w-full mt-4 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Type</h3>
              <div className="flex flex-wrap gap-3">
                {typeOptions.map((option) => (
                  <button key={option}
                    onClick={() => setForm({ ...form, type: option })}
                    className={`px-4 py-2 rounded-full font-medium border transition ${
                      form.type === option
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-purple-200"
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Rating</h3>
              <div className="flex gap-1 text-2xl">
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
                  <span
                    key={val}
                    onClick={() => handleRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer"
                    style={{ color: (hoverRating || form.rating) >= val ? "#facc15" : "#4b5563" }}
                  >
                    {val % 1 === 0 ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={addEvent}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              Add Event
            </button>

            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-3">Events Attended This Month</h2>
              <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow">
                <Calendar
                  onChange={setCalendarDate}
                  value={calendarDate}
                  className="rounded"
                  tileClassName={({ date }) => {
                    const iso = date.toISOString().split("T")[0];
                    const match = events.find(e => e.date === iso);
                    return match ? "bg-purple-300 text-white font-bold rounded-full" : null;
                  }}
                />
                <div className="mt-4">
                  <h4 className="text-md font-medium">Events on {selectedDate}</h4>
                  {calendarEvents.length ? (
                    <ul className="list-disc ml-5 text-sm mt-1">
                      {calendarEvents.map((event, index) => (
                        <li key={index}>{event.title} – {event.type} @ {event.location}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No events on this day.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
