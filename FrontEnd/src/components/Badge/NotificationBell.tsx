import { Bell } from "lucide-react";
import "./NotificationBell.css";

interface Props {
  count: number;
}

const NotificationBell: React.FC<Props> = ({ count }) => {
  return (
    <div className="notification-bell">
      <Bell size={24} />

      {count > 0 && (
        <span className="notification-badge">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
