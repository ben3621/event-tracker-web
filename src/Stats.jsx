import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StatsPage() {
  const { uid } = useParams();
  const [events, setEvents] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setEvents(data);
      if (data.length > 0) {
        setUserEmail(data[0].userEmail || "This user");
      }
    };
    fetchEvents();
  }, [uid]);

  const countByType = events.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{userEmail}'s Attendance Stats</h2>
      <p>Total Events: {events.length}</p>
      <ul className="list-disc pl-6 mt-2">
        {Object.entries(countByType).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>
    </div>
  );
}
