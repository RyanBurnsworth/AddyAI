import { useState } from "react";
import { EMAIL, CUSTOMER_ID, NAME, LAST_SYNCED, USERID } from "../utils/constants";

export function useStoredUser() {
  const [storedEmail] = useState(() => localStorage.getItem(EMAIL) || "");
  const [storedCustomerId] = useState(() => localStorage.getItem(CUSTOMER_ID) || "");
  const [storedName] = useState(() => localStorage.getItem(NAME) || "");
  const [storedLastSynced] = useState(() => localStorage.getItem(LAST_SYNCED) || "");
  const [storedUserId] = useState(() => localStorage.getItem(USERID) || "");

  return {
    storedUserId,
    storedEmail,
    storedCustomerId,
    storedName,
    storedLastSynced,
  };
}