import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AuthUI from "./AuthUI";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

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
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortAsc, setSortAsc] = useState(true);
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

  const handleRating = (rating) => {
    setForm({ ...form, rating });
  };

  const addEvent = async () => {
    if (!user || !form.title || !form.date || !form.type) return;
    const eventsRef = collection(db, "users", user.uid, "events");
    await addDoc(eventsRef, form);
    setForm({
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "",
      location: "",
      notes: "",
      rating: 0,
      tags: ""
    });
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.location.toLowerCase().includes(filter.toLowerCase()) ||
      event.tags.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  const calendarEvents = events.filter(event => event.date === calendarDate.toISOString().split("T")[0]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = date.toISOString().split('T')[0];
      const match = events.find(e => e.date === d);
      if (match) {
        return `bg-opacity-50 rounded-full ${match.type === 'Theater' ? 'bg-red-300' : match.type === 'Opera' ? 'bg-blue-300' : 'bg-green-300'}`;
      }
    }
    return null;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans bg-gray-50 min-h-screen">
      <AuthUI />
      <h1 className="text-3xl font-bold mb-4 text-red-700">🎭 Event Attendance Tracker</h1>
      {user ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm" />
            <input name="date" type="date" value={form.date} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm" />
            <input name="type" placeholder="Type (e.g., Theater)" value={form.type} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm" />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm" />
            <input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm" />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="border px-3 py-2 rounded shadow-sm col-span-2" />
            <div className="col-span-2">Rating:
              {[1,2,3,4,5].map(r => (
                <span key={r} onClick={() => handleRating(r)} style={{ cursor: "pointer", color: form.rating >= r ? "gold" : "lightgray", fontSize: "20px" }}>★</span>
              ))}
            </div>
            <button onClick={addEvent} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow">Add Event</button>
          </div>
          <div className="flex justify-between items-center mb-3">
            <input placeholder="Filter..." value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-2 w-full max-w-xs rounded shadow-sm" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left sticky top-0">
                <tr>
                  {["Title", "Date", "Type", "Location", "Notes", "Rating", "Tags"].map(key => (
                    <th key={key} className="px-4 py-2 cursor-pointer text-sm font-semibold text-gray-700" onClick={() => handleSort(key.toLowerCase())}>
                      {key} {sortKey === key.toLowerCase() ? (sortAsc ? "▲" : "▼") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{event.title}</td>
                    <td className="px-4 py-2">{event.date}</td>
                    <td className="px-4 py-2">{event.type}</td>
                    <td className="px-4 py-2">{event.location}</td>
                    <td className="px-4 py-2">{event.notes}</td>
                    <td className="px-4 py-2">{event.rating}/5</td>
                    <td className="px-4 py-2">{event.tags}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Events Attended This Month:</h2>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              className="rounded border max-w-md"
              tileClassName={tileClassName}
              maxDetail="month"
              showFixedNumberOfWeeks
              showNeighboringMonth
            />
            <div className="pt-3">
              <h3 className="text-md font-medium text-gray-800 mb-1">On {calendarDate.toISOString().split("T")[0]}</h3>
              {calendarEvents.length ? (
                <ul className="list-disc pl-5">
                  {calendarEvents.map((event, index) => (
                    <li key={index}>{event.title} – {event.type} @ {event.location}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500">No events on this day.</p>}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-8">Please log in to use the tracker.</p>
      )}
    </div>
  );
}
