
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AttendanceTracker() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "",
    location: "",
    notes: "",
    rating: 0,
    tags: ""
  });
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const metaTags = [
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" }
    ];
    metaTags.forEach(tag => {
      const meta = document.createElement("meta");
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEvent = (e) => {
    e.preventDefault();
    if (form.title && form.date && form.type) {
      setEvents([...events, form]);
      setForm({ title: "", date: "", type: "", location: "", notes: "", rating: 0, tags: "" });
    }
  };

  const calendarEvents = events.filter(event => event.date === calendarDate.toISOString().split("T")[0]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = date.toISOString().split('T')[0];
      const match = events.find(e => e.date === d);
      if (match) {
        return `bg-opacity-50 rounded-full ${match.type === 'Theater' ? 'bg-red-200' : match.type === 'Opera' ? 'bg-blue-200' : 'bg-green-200'}`;
      }
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-white to-slate-100 dark:from-black dark:to-gray-900 min-h-screen text-black dark:text-white">
      <Card className="shadow-xl border border-slate-200 dark:border-slate-700">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Events Attended This Month:</h2>
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            className="rounded border text-sm w-full max-w-lg dark:bg-gray-900 dark:text-white dark:border-gray-700"
            tileClassName={tileClassName}
            tileContent={({ date }) => (<div className='text-xs text-center'>{date.getDate()}</div>)}
            maxDetail="month"
            showFixedNumberOfWeeks={true}
            showNeighboringMonth={true}
          />
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Events on {calendarDate.toISOString().split("T")[0]}
            </h3>
            {calendarEvents.length > 0 ? (
              <ul className="list-disc pl-6">
                {calendarEvents.map((event, index) => (
                  <li key={index}>{event.title} – {event.type} @ {event.location}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No events on this day.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Enter Event Details</h3>
          <form onSubmit={addEvent} className="grid gap-4 sm:grid-cols-2">
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <Input name="date" type="date" value={form.date} onChange={handleChange} />
            <Input name="type" placeholder="Type (Opera, Theater...)" value={form.type} onChange={handleChange} />
            <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <Input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange} />
            <Button type="submit" className="col-span-2 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              Add Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
