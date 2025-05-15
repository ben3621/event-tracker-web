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
    document.querySelector("form").reset();
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

  const selectedDate = calendarDate.toISOString().split("T")[0];
  const calendarEvents = events.filter(event => event.date === selectedDate);

  const getMonthKey = (date) => date.slice(0, 7); // "YYYY-MM"
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthCount = events.filter(e => getMonthKey(e.date) === currentMonth).length;

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = date.toISOString().split('T')[0];
      const match = events.find(e => e.date === d);
      if (match) {
        return `highlight-${match.type.toLowerCase()}`;
      }
    }
    return null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans bg-white min-h-screen text-gray-800">
      <AuthUI />
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">🎭 Event Attendance Tracker</h1>
      {user ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {["title", "date", "type", "location", "tags"].map(field => (
              <input
                key={field}
                name={field}
                type={field === "date" ? "date" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            ))}
            <div className="col-span-2">
              <label className="block font-medium mb-1">Type:</label>
              <div className="flex flex-wrap gap-4">
                {["Opera", "Theatre", "Music", "Art/Gallery"].map((option) => (
                  <label key={option} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={option}
                      checked={form.type === option}
                      onChange={handleChange}
                      className="accent-black"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
<textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="col-span-2 border rounded-md px-3 py-2 shadow-sm"
            />
            <div className="col-span-2 text-sm">Rating:
              {[1,2,3,4,5].map(r => (
                <span
                  key={r}
                  onClick={() => handleRating(r)}
                  className="cursor-pointer text-xl"
                  style={{ color: form.rating >= r ? "gold" : "#ddd" }}
                >★</span>
              ))}
            </div>
            <button
              onClick={addEvent}
              className="col-span-2 bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
            >
              Add Event
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded-md w-full max-w-sm shadow-sm"
            />
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {["Title", "Date", "Type", "Location", "Notes", "Rating", "Tags"].map(key => (
                    <th key={key} className="px-4 py-2 text-left text-sm font-semibold cursor-pointer" onClick={() => handleSort(key.toLowerCase())}>
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

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Events Attended This Month: {currentMonthCount}</h2>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              className="rounded border shadow max-w-md"
              tileClassName={tileClassName}
              maxDetail="month"
              showFixedNumberOfWeeks
              showNeighboringMonth
            />
            <div className="pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-1">On {selectedDate}</h3>
              {calendarEvents.length ? (
                <ul className="list-disc pl-5 text-sm">
                  {calendarEvents.map((event, index) => (
                    <li key={index}>{event.title} – {event.type} @ {event.location}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No events on this day.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-12">Please log in to use the tracker.</p>
      )}
    </div>
  );
}
